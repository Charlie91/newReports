import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import moment from 'moment';
import {ajaxRequest} from './../../utils/utils';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import { YMaps, Map, Placemark, Circle } from 'react-yandex-maps';
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';
import DataChart from './DataChart';
import DataChartSmall from './DataChartSmall';
import Loading from './../Loading/Small';
import {customLabel2} from "./customLabelDataChart";
import {digitCount, formatNumericValue,formatNumberBySimpleSpaces,
    formatNumberBySpaces,average,decodeHalfPunycodeLink} from './../../utils/utils';
import xlsExport from './xls-export';
import Datepickers from './Datepickers';
import ShopList from './ShopList';
import ShopListAccordeon from './ShopListAccordeon';

function formatMonths(index){
    return ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][index];
}

export default class ObjectPage extends Component {
    constructor(props) {
        super(props);

        moment.updateLocale('ru', {
            monthsShort : [
                "янв", "фев", "мар", "апр", "май", "июн", "июл",
                "авг", "сен", "окт", "ноя", "дек"
            ],
            months : [
                "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
                "августа", "сентября", "октября", "ноября", "декабря"
            ]
        });
        moment.defineLocale('ru-new', { //фикс бага с невосприятием дейтпикером ручного ввода
            parentLocale: 'en',
            monthsShort : [
                "янв", "фев", "мар", "апр", "май", "июн", "июл",
                "авг", "сен", "окт", "ноя", "дек"
            ],
            months : [
                "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
                "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
            ],
            weekdaysMin : [
                "вс", "пн", "вт", "ср", "чт", "пт", "сб"
            ],
            week : {
                dow : 1, // Начало недели - с понедельника
            }
        });


        this.state = {
            viewportWidth:window.innerWidth,
            requestIsInProcess:false,
            object:'',
            images:[],
            type:'',
            currency:'',
            shortestUnit:'D',
            totalSum:0,
            startDate: moment().add(-7,'days'),
            endDate: moment(),
            timeSegment: 'D',
            tableData:[],
            shops:[],
            chart :{
                labels: [],
                datasets: [
                    {
                        data: []
                    }
                ]
            }
        };
    }

    fillInitialObjectData(obj){ //записываем данные с пропсов, если они есть и парсим с сервера срезы
        let typeArr = obj.data_type.split(', ');//разбиваем строку с типом данных на массив
        this.getNewStyleForChart(typeArr);
        this.setState({
                object:obj,
                images:obj.picture_set,
                type:typeArr[0],
                currency:(typeArr[1] === 'чел.') ? 'человек' : typeArr[1]
            },
            () => {
                this.getFloors();
                this.props.upState('title','Карточка объекта');
                this.props.upState('address',this.state.object.address);
            });
    }

    getNewObjectsData(){ // получение новых данных об объекте, если они не были переданы через props
        let options = {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            },
            params = this.props.match.params;
        let [concept,city,id] = [params.concept,params.city,params.id];
        let url = API.objects + '?conceptId=' + concept + '&cityId=' + city;
        ajaxRequest(url, options)
            .then(data => {
                let obj;
                data.forEach( object => {
                    if(+id === object.id){
                        obj = object;
                    }
                });
                let typeArr = obj.data_type.split(', ');//разбиваем строку с типом данных на массив
                this.getNewStyleForChart(typeArr);
                this.setState({
                    object:obj,
                    images:obj.picture_set,
                    type:typeArr[0],
                    currency: (typeArr[1] === 'чел.') ? 'человек' : typeArr[1]
                }, () => {
                    this.props.upState('title','Карточка объекта');
                    this.props.upState('address',this.state.object.address);
                })
            })
            .then(() => this.getFloors())
            .catch(err => console.log(err))
    }

    getFloors(){    //получение срезов данных об объекте
        let id = this.state.object.id;
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let url = API.floors + id;
        ajaxRequest(url, options)
            .then(data => {
                this.setState({floors:data, floorIndex:0}, () => {
                    this.getFloorsData();
                    this.getMonthlyDataPerYear();
                });
            })
            .catch(err => console.log(err))
    }

    getFloorsData(){    //ajax запрос на конечные данные
        if(!this.state.floors)return null;
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let [startDate, endDate] = [this.state.startDate.format("YYYYMMDD"),this.state.endDate.format("YYYYMMDD")];
        let unit = this.state.timeSegment;
        let floorID;
        this.state.floors.forEach((item,i) => {
            if(this.state.floorIndex === i)floorID = item.id
        });
        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
        ajaxRequest(url,options)
            .then(data => {
                let chartObj = this.state.chart;
                let [values,dates] = [ [], [] ] ;
                data.floorData.forEach(item => {
                    values.push(item.VALUE);
                    dates.push(item.THEDATE);
                });
                if(!dates.length){
                    this.setState({emptyData:true});
                    this.requestIsEnded();
                }
                else{
                    let diff = moment(dates[0]).diff(moment(dates[1]));
                    let first_date = moment(moment(dates[0]) + diff).format(),
                        last_date = moment(moment(dates[dates.length - 1]) - diff).format(),
                        avg = parseInt(average(values));

                    values = [avg, ...values, avg];
                    dates = [first_date, ...dates, last_date];

                    let values2 = [NaN,...values.slice(1, values.length-1 ),NaN];
                    [ chartObj.datasets[0].data, chartObj.datasets[1].data, chartObj.labels ] = [values,values2,dates];

                    this.setState({
                        data:data,
                        chart:chartObj,
                        totalSum:data.totalSum,
                        emptyData:false,
                        shortestUnit:data.shortestUnit
                    });
                }
            })
            .catch(err => console.log(err))
    }

    getMonthlyDataPerYear(){
        if(!this.state.floors)return null;
        let options = {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            },
            floorID = '';

        let [startDate, endDate] = [ moment().add(-11,'months').format("YYYYMMDD"), moment().format("YYYYMMDD") ];

        this.state.floors.forEach((item,i) => {
            if(this.state.floorIndex === i)floorID = item.id
        });

        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=M`;
        ajaxRequest(url,options)
            .then(data => {
                let newArr = data.floorData.map(item => {
                    let obj = {};
                    obj.value = Math.round(item.VALUE);
                    [obj.month, obj.year] = [moment(item.THEDATE).month(), moment(item.THEDATE).year()];
                    return obj
                }).reverse();
                this.setState({monthlyData:newArr})
            })
            .catch(err => console.log(err))
    }

    getInnerObjects(){  //получаем список внутренних объектов(кафе и магазинов) в ТРЦ
        let url = `${API.innerObjects}${this.props.match.params.id}`;
        let options = {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
        };

        ajaxRequest(url,options)
            .then(data => {
                console.log(data);
                let titles = [];
                for(let i = 0; i < data.inners.length;i++){
                    if(!(~titles.indexOf(data.inners[i].type))){
                        titles.push(data.inners[i].type);
                    }
                }
                let hierarchiedObjects = titles.map(item => {
                    return {
                        title : item,
                        objects:[]
                    }
                });
                data.inners.forEach(item => {
                    hierarchiedObjects.forEach(object => {
                        if(item.type === object.title)
                            object.objects.push(item)
                    })
                });
                this.setState({shops:hierarchiedObjects});
            })
            .catch(err => console.log(err))

    }

    getNewStyleForChart(typeArr){
        let chart = this.state.chart;
        chart.datasets = [
            {
                label: (typeArr[0] === 'Выручка') ? 'Выручка' : 'Количество чел-к',
                fill: true,
                lineTension: 0,
                backgroundColor: (typeArr[0] === 'Выручка') ? 'rgba(246, 170, 37, 0.1)' : 'rgba(163, 136, 227, 0.1)',// #f6aa2524
                borderColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',// #886ce6
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffsent: 0.0,
                borderJoinStyle: 'miter',
                borderWidth: 0,
                pointBorderColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',// #886ce6
                pointBackgroundColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBackgroundColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
                pointHoverBorderColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                pointHitRadius: 0,
                data: []
            },
            {
                xAxisID: 'main-x-axis',
                label: '',
                fill: false,
                lineTension: 0,
                borderDash: [],
                borderWidth: 0,
                pointBorderColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
                pointBackgroundColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
                pointBorderWidth: 6,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
                pointHoverBorderColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
                pointHoverBorderWidth: 2,
                pointRadius: 2.4,
                pointHitRadius: 10,
                data: []
            }
        ];
        return chart;
    }


    changeFloor(e){
        this.requestIsStarted();
        this.setState({floorIndex:+e.target.dataset.id},() => this.getFloorsData())
    }

    changeTimeSegment(e){
        this.requestIsStarted();
        this.setState({timeSegment:e.target.dataset.val},() => this.getFloorsData())
    }

    renderMap(){
        const mapState = { center: [this.state.object.lattitude, this.state.object.longitude], zoom: 16, controls: [], behaviors:[], options:[] };
        return (
            <div>
                <a href={`https://yandex.ru/maps/213/moscow/?ll=${this.state.object.longitude}%2C${this.state.object.lattitude}&z=16&mode=poi&poi%5Bpoint%5D=${this.state.object.longitude}%2C${this.state.object.lattitude}`} target="blank" >
                    <YMaps>
                        <Map state={mapState}
                             width={(this.state.viewportWidth < 1199) ? '100px' : '360px'}
                             height={(this.state.viewportWidth < 1199) ? '100px' : '420px'}
                        >
                        </Map>
                    </YMaps>
                </a>
            </div>
        );
    };

    renderFloorObjectsButtons(){//функция рендера срезов
        if(!this.state.floors || this.state.floors.length < 2)return null;
        return(
            <div style={{overflow:'hidden',marginTop:'-10px'}}>
                <div className="floor_btn-wrp">
                    {this.state.floors.map((item,i) =>
                        <button type="button"
                                key={i}
                                data-id={i}
                                disabled={this.state.requestIsInProcess}
                                className={'btn ' + ((this.state.floorIndex === i) ? 'active' : '')}
                                onClick={this.changeFloor.bind(this)}
                        >
                            {item.name}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    renderSegmentationButtons(){//функция рендера фильтров временной сегментации
        let state = this.state;
        const xls = state.data && new xlsExport((state.data.floorData), 'Reports');//данные для выгрузки в таблицу
        let arr = [
            {val:'Y',text:'По годам',render:(state.startDate.year() !== state.endDate.year())},
            {val:'M',text:'По месяцам',render:(state.startDate.format('YYYY-MM') !== state.endDate.format('YYYY-MM'))},
            {val:'D',text:'По дням',render:(state.startDate.format('YYYY-MM-DD') !== state.endDate.format('YYYY-MM-DD'))},
            {val:'H',text:'По часам',render:( (moment(state.startDate).diff(moment(state.endDate), 'days') > -14) && state.shortestUnit === 'H' )},
        ];
        return (
            <Col md='12' style={{minWidth:'100%'}} className='segmentation_btn-wrp order-1 order-md-12'>
                <Row>
                    <Col md='12' xl={{size:6,offset:3}}>
                        <div className="btn-group" role="group">
                            {arr.map( (item,i) =>
                                (item.render) ?
                                    <button type="button"
                                            key={i}
                                            data-val={item.val}
                                            disabled={this.state.requestIsInProcess}
                                            className={'btn ' + ((this.state.timeSegment === item.val) ? 'active' : '')}
                                            onClick={this.changeTimeSegment.bind(this)}
                                    >
                                        {item.text}
                                    </button>

                                    :

                                    ''
                            )}
                        </div>
                    </Col>
                    <Col md="0" xl={{size:3,offset:0}}>
                        <div className="excellLinkWrapper">
                            <a className="excellLink" onClick={xls ? () => {xls.exportToCSV('export.csv')} : ''}>Скачать в Excel</a>
                        </div>
                    </Col>
                </Row>
            </Col>
        )
    }

    renderCurrency(){
        let state = this.state;

        if(state.currency.length <= 4)
            return state.currency;
        else if((digitCount(state.totalSum) > 6) || ( state.viewportWidth > 768 && state.viewportWidth < 1525))
            return state.currency.substring(0,3) + '.';
        else
            return state.currency
    }

    countAverageOfMoths(){
        let arr = this.state.monthlyData;
        if(!arr)return 0;

        let sum = arr.reduce((sum, current, index) => {
            if(!index)return 0; //текущий месяц не участвует в расчете средних значений
            return sum + current.value
        },0);

        return Math.round(sum/11);
    }

    trackActualSegments(startDate, endDate){    // меняем значения сегментации(по часам,дням,месяцам) если текущий - неактуален
        let value = this.state.timeSegment;    //  начальное значение
        if(startDate.format('YYYY') !== endDate.format('YYYY') && value === 'H')
            value = 'M';
        else if(startDate.format('YYYY') === endDate.format('YYYY'))
            value = 'M';
        if(startDate.format('YYYY-MM') === endDate.format('YYYY-MM'))
            value = 'D';
        if(startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD'))
            value = 'H';
        return value
    }

    handleChangeStart(date) { //функции-обработчики смены дат в datepickers
        if(this.state.endDate - date < 0)return false;
        this.requestIsStarted();
        let newSegment = this.trackActualSegments(date,this.state.endDate);
        this.setState(
            {startDate: date,timeSegment:newSegment},
            () => this.getFloorsData()
        );
    }

    handleChangeEnd(date) {
        if(date - this.state.startDate < 0)return false;
        if(date > moment())return false;
        this.requestIsStarted();
        let newSegment = this.trackActualSegments(this.state.startDate,date);
        this.setState(
            {endDate: date,timeSegment:newSegment},
            () => this.getFloorsData()
        );
    }

    handleMobileChangeStart(e){
        this.requestIsStarted();
        let newSegment = this.trackActualSegments(moment(e.target.value),this.state.endDate);
        this.setState(
            {startDate: moment(e.target.value),timeSegment:newSegment},
            () => this.getFloorsData())
        ;
    }

    handleMobileChangeEnd(e){
        this.requestIsStarted();
        let newSegment = this.trackActualSegments(this.state.startDate,moment(e.target.value));
        this.setState(
            {endDate: moment(e.target.value),timeSegment:newSegment},
            () => this.getFloorsData()
        );
    }

    addOpacityToChart(){    //задаем прозрачность графику во время смены состояний
        document.querySelector('.line-chart-wrapper').classList.add('half-opacity');
    }

    removeOpacityFromChart(){
        document.querySelector('.line-chart-wrapper').classList.remove('half-opacity');//удаляем прозрачность с графика
    }

    addSpecificStyles(){
        document.querySelector('.main').classList.add('main__additional-padding');//кастомизация хтмл элементов под страницу - добавление
        document.querySelector('.app-body').classList.add('app-body__reduce-margin');
        document.querySelector('.navbar').classList.add('changeHeaderPadding');
        document.querySelector('.navbar >div:first-of-type').classList.add('additional_position');
        document.querySelector('.navbar-toggler').classList.add('new_position_for_ham');
    }

    removeSpecificStyles(){
        document.querySelector('.main').classList.remove('main__additional-padding');//кастомизация хтмл элементов под страницу - удаление
        document.querySelector('.app-body').classList.remove('app-body__reduce-margin');
        document.querySelector('.navbar').classList.remove('changeHeaderPadding');
        document.querySelector('.navbar >div:first-of-type').classList.remove('additional_position');
        document.querySelector('.navbar-toggler').classList.remove('new_position_for_ham');
    }

    requestIsStarted(){
        this.addOpacityToChart();
        this.setState({requestIsInProcess:true})
    }

    requestIsEnded(){
        this.removeOpacityFromChart();
        this.setState({requestIsInProcess:false})
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.data !== this.state.data)
            this.requestIsEnded();
    }


    componentDidMount(){
        if(this.props.location.params){ //если начальные данные переданы с пропсов - идем 1м путем
            let obj = this.props.location.params.obj;
            this.fillInitialObjectData(obj);
        }
        else{   //если данных в пропсах не обнаружено - парсим их с API
            this.getNewObjectsData()
        }

        window.onresize = () => this.setState({viewportWidth:window.innerWidth});//при изменении размера экрана - перезаписываем ширину вьюпорта в стейт
        this.addSpecificStyles();
        this.getInnerObjects()
    }

    componentWillUnmount(){
        this.removeSpecificStyles();
        window.onresize = () => {};
    }



    render(){
        let state = this.state,
            pixelRatio = window.devicePixelRatio;//ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device

        return (
            <div className={((state.type === 'Выручка') ? "revenue" : "trafic") + ' object_cont'}>
                <Row className="announce">
                    <Col className="data_wrapper order-12 order-md-1" md="6" xs="12">
                        <Card>
                            <CardBody>
                                <div className="obj_title">
                                    <Row>
                                        <Col md="12" xs="9">
                                            <h4>{state.object.obj_name}</h4>
                                        </Col>
                                        <Col md="0" xs="3">
                                            <a className="link_mobile" target="_blank" href={state.object.website}>cайт</a>
                                        </Col>
                                    </Row>
                                    <a className="link_desktop" href={state.object.website} target="_blank">{decodeHalfPunycodeLink(state.object.website) || ''}</a>
                                    <p className="muted address_mobile" dangerouslySetInnerHTML={{__html: state.object.address}} />
                                </div>
                                <hr className={(state.object.floors_count &&
                                                state.object.gb_area &&
                                                state.object.gl_area &&
                                                state.object.since ) ? 'divider' : 'none'}/>
                                <Row>
                                    <Col md="7" className="features">
                                        <div className={state.object.floors_count ? '' : 'none'}>
                                            <strong>Этажей:</strong>
                                            <span className="muted">{state.object.floors_count || '?'}</span>
                                        </div>

                                        <div className={(state.object.gb_area && state.object.gl_area) ? '' : 'none'}>
                                            <strong>Площадь:</strong>
                                            <span className="muted">  GBA</span>
                                            <span className="muted-bold" dangerouslySetInnerHTML={{__html: formatNumberBySimpleSpaces(state.object.gb_area) + " м<sup>2</sup>"}} />
                                            <span className="muted">, GLA </span>
                                            <span className="muted-bold" dangerouslySetInnerHTML={{__html: formatNumberBySimpleSpaces(state.object.gl_area) + " м<sup>2</sup>"}} />
                                        </div>

                                        <div className={state.object.since ? 'opening_day' : 'none'}>
                                            <strong>Дата открытия:</strong>
                                            <span className="muted">  {moment(state.object.since).locale('ru').format('DD MMMM YYYY') || ''} </span>
                                        </div>

                                        {/*<div className="floor_plans">
                                         <strong>Поэтажные планы</strong>
                                         </div>*/}

                                         <div className="social_links">
                                             <a href={state.object.vkontakte} target="blank" className={state.object.vkontakte ? 'vk' : 'vk none'}></a>
                                             <a href={state.object.facebook}  target="blank" className={state.object.facebook ? 'fb' : 'fb none'}></a>
                                             <a href={state.object.instagram}  target="blank" className={state.object.instagram ? 'ig' : 'ig none'}></a>
                                         </div>

                                    </Col>
                                    <Col md="5" className="geolocation">
                                        <div className="map_wrapper">
                                            {this.renderMap()}
                                        </div>
                                        <div className="address" dangerouslySetInnerHTML={{__html: state.object.city_name + ',<br/>' + String(state.object.address).replace(state.object.city_name + ',', '' ) }} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col style={{overflow:'hidden', backgroundImage: (state.images.length ? `url(${API.imgPath}/${state.object.id}/${state.images[0]})` : `url(${API.imgPath}/mall_default.jpg)`) }}
                         className={((state.images.length) ? "img_wrapper_full" : "img_wrapper_def") + ' img_wrapper order-1 order-md-12'} md="6" xs="12">
                    </Col>
                </Row>

                {(state.viewportWidth > 1467) ?
                    <BarChart
                        render={!(state.type === 'Выручка')}
                        data={state.data}
                    />
                    :
                    <HorizontalBarChart
                        render={!(state.type === 'Выручка')}
                        data={state.data}
                    />
                }


                <Card className="data_per_month">
                    <Row className="header">
                        <Col md='6' xl="6" lg="7">
                            <h4>{(state.type === 'Выручка') ? 'Выручка' : 'Посещаемость'} по месяцам</h4>
                            <div className="muted">Указана суммарная {(state.type === 'Выручка') ? 'выручка' : 'посещаемость'} в месяц</div>
                        </Col>

                        <Col className={(state.viewportWidth < 768) ? 'none' : ''}
                             lg={{size:5,offset:0}}
                             xl={{size:3,offset:3}}
                             md={{size:3,offset:3}}
                        >

                               <span className="data"
                                     dangerouslySetInnerHTML=
                                         {{
                                             __html:`${formatNumberBySpaces(this.countAverageOfMoths())} ${this.renderCurrency()}`
                                         }}
                               ></span>
                            <div className="muted">Средняя {(state.type === 'Выручка') ? 'выручка' : 'посещаемость'} в месяц</div>
                        </Col>
                    </Row>
                    <div className="scrollHider">
                        <CardBody>
                            {
                                (state.monthlyData) ?
                                    <ul>
                                        <li className={(state.viewportWidth > 768) ? 'none average' : 'average'}>
                                            <div>
                                                <strong
                                                    dangerouslySetInnerHTML={{__html:`${formatNumberBySpaces(formatNumericValue(this.countAverageOfMoths()))} ${((state.type === 'Выручка') ? '' : 'чел.')}`}}
                                                >
                                                </strong>
                                            </div>
                                            <div className="muted">
                                                средняя в мес.
                                            </div>
                                        </li>
                                        {
                                            state.monthlyData.map( (item,i) => {
                                                return(
                                                    <li key={i}>
                                                        <div>
                                                            <strong
                                                                dangerouslySetInnerHTML={{__html:`${formatNumberBySpaces(formatNumericValue(item.value))} ${((state.type === 'Выручка') ? '' : 'чел.')}`}}
                                                            >
                                                            </strong>
                                                        </div>
                                                        <div className="muted">
                                                            {`${formatMonths(item.month)} ${ ((item.year === (new Date()).getFullYear()) ? '' : ''/*item.year*/) }` }
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    :
                                    <Loading/>
                            }
                        </CardBody>
                    </div>
                </Card>

                <Card className="all_data">
                    <CardBody className="card-body">
                        <h5 className="measure">{(state.type === 'Выручка') ? 'Выручка' : 'Посещаемость'} за период</h5>
                        <Row>
                            <Datepickers
                                startDate={state.startDate}
                                endDate={state.endDate}
                                requestIsInProcess={state.requestIsInProcess}
                                handleChangeStart={this.handleChangeStart.bind(this)}
                                handleChangeEnd={this.handleChangeEnd.bind(this)}
                                handleMobileChangeStart={this.handleMobileChangeStart.bind(this)}
                                handleMobileChangeEnd={this.handleMobileChangeEnd.bind(this)}
                            />
                            <Col xs="12" md="4" lg="4" xl="5">
                                {this.renderFloorObjectsButtons()}
                            </Col>
                            <Col xs="12" md="3" className="totalSum">
                                <span className="data"
                                      dangerouslySetInnerHTML=
                                          {{
                                              __html:`${formatNumberBySpaces(Math.round(state.totalSum))} ${this.renderCurrency()}`
                                          }}
                                >
                                </span>
                                <span className="muted">{(state.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                            </Col>
                        </Row>
                        <div className="scrollHider">
                            <Row>
                                {(state.viewportWidth > 720) ?
                                    <DataChart
                                        render={!(state.type === 'Выручка')}
                                        data={state.chart}
                                        startDate={state.startDate}
                                        endDate={state.endDate}
                                        currency={state.currency}
                                        timeSegment={state.timeSegment}
                                        emptyData={state.emptyData}
                                    />
                                    :
                                    <DataChartSmall
                                        render={!(state.type === 'Выручка')}
                                        data={state.chart}
                                        startDate={state.startDate}
                                        endDate={state.endDate}
                                        currency={state.currency}
                                        timeSegment={state.timeSegment}
                                        emptyData={state.emptyData}
                                    />
                                }
                                {this.renderSegmentationButtons()}
                            </Row>
                        </div>
                    </CardBody>
                </Card>
                {(state.viewportWidth > 500) ?
                    <ShopList shops={this.state.shops}/>
                    :
                    <ShopListAccordeon shops={this.state.shops}/>
                }


            </div>
        )
    }
};

import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import moment from 'moment';
import {ajaxRequest} from './../../utils/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import {Line} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import { YMaps, Map, Placemark, Circle } from 'react-yandex-maps';
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';
import Loading from './../Loading/Small';
import {customLabel2} from "./customtooltip2";
import {formatNumericValue,formatNumberBySimpleSpaces, formatNumericValueWithMnl, formatNumberBySpaces,average,getStepSize,getStepTick,getStepName} from './../../utils/utils';
import parser from 'ua-parser-js';

function formatMonths(index){
    return ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][index];
}

export default class ObjectPage extends Component {
    constructor(props) {
        super(props);

        moment.locale('ru'); // локализуем библиотеку
        moment.updateLocale('ru', {
            monthsShort : [
                "янв", "фев", "мар", "апр", "май", "июн", "июл",
                "авг", "сен", "окт", "ноя", "дек"
            ]
        });

        this.state = {
            viewportWidth:window.innerWidth,
            requestIsInProcess:false,
            object:'',
            images:[],
            type:'',
            currency:'',
            startDate: moment().add(-7,'days'),
            endDate: moment(),
            timeSegment: 'D',
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
                console.log(data);
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
        //console.log(url);
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
                    let first_date = moment(moment(dates[0]) + diff).format();
                    let last_date = moment(moment(dates[dates.length - 1]) - diff).format();
                    let avg = parseInt(average(values));
                    values.unshift(avg);
                    dates.unshift(first_date);
                    values.push(avg);
                    dates.push(last_date);
                    chartObj.datasets[0].data = values;
                    let values2 = values.slice(1, values.length-1 );
                    values2.push(NaN);
                    values2.unshift(NaN);
                    chartObj.labels = dates;
                    chartObj.datasets[1].data = values2;
                    this.setState({data:data,chart:chartObj,totalSum:data.totalSum,emptyData:false});
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
                <YMaps>
                    <Map state={mapState}
                         width={(this.state.viewportWidth < 1199) ? '100px' : '360px'}
                         height={(this.state.viewportWidth < 1199) ? '100px' : '420px'}
                    >
                    </Map>
                </YMaps>

            </div>
        );
    };

    renderFloorObjectsButtons(){//функция рендера срезов
        if(!this.state.floors || this.state.floors.length < 2)return null;
        return(
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
        )
    }

    renderSegmentationButtons(){//функция рендера фильтров временной сегментации
        let arr = [
            {val:'Y',text:'По годам',render:(this.state.startDate.year() !== this.state.endDate.year())},
            {val:'M',text:'По месяцам',render:(this.state.startDate.format('YYYY-MM') !== this.state.endDate.format('YYYY-MM'))},
            {val:'D',text:'По дням',render:(this.state.startDate.format('YYYY-MM-DD') !== this.state.endDate.format('YYYY-MM-DD'))},
            {val:'H',text:'По часам',render:( moment(this.state.startDate).diff(moment(this.state.endDate), 'days') > -14 )},
        ];
        return (
            <Col md='12' className='segmentation_btn-wrp order-1 order-md-12'>
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
        )
    }

    trackActualSegments(startDate, endDate){    // меняем значения сегментации(по часам,дням,месяцам) если текущий - неактуален
        let value = this.state.timeSegment;    //  начальное значение
        if(startDate.format('YYYY') === endDate.format('YYYY'))
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
        this.setState(
            {startDate: moment(e.target.value)},
            () => this.getFloorsData())
        ;
    }

    handleMobileChangeEnd(e){
        this.requestIsStarted();
        this.setState(
            {endDate: moment(e.target.value)},
            () => this.getFloorsData()
        );
    }

    handleChartScrolling(){ //декорируем Y ось графика во время горизонтального скролла
        let chart = document.querySelector('.line-chart-wrapper'),
            Yaxis = document.getElementById('scrollYAxis');
        chart.onscroll = () => {
            if(chart.scrollLeft)
                Yaxis.style.cssText = 'border-right-color:rgba(208, 208, 208, 0.5);';
            else
                Yaxis.style.cssText = '';
        }
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
    }

    removeSpecificStyles(){
        document.querySelector('.main').classList.remove('main__additional-padding');//кастомизация хтмл элементов под страницу - удаление
        document.querySelector('.app-body').classList.remove('app-body__reduce-margin');
        document.querySelector('.navbar').classList.remove('changeHeaderPadding');
        document.querySelector('.navbar >div:first-of-type').classList.remove('additional_position');
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
        this.handleChartScrolling();//декорируем Y ось графика во время горизонтального скролла
    }

    componentWillUnmount(){
        this.removeSpecificStyles();
        window.onresize = () => {};
    }



    render(){
        let state = this.state,
            pixelRatio = window.devicePixelRatio;//ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device
        return (
            <div className={((this.state.type === 'Выручка') ? "revenue" : "trafic") + ' object_cont'}>
                <Row className="announce">
                    <Col className="data_wrapper order-12 order-md-1" md="6" xs="12">
                        <Card>
                            <CardBody>
                                <div className="obj_title">
                                    <Row>
                                        <Col md="12" xs="9">
                                            <h4>{this.state.object.obj_name}</h4>
                                        </Col>
                                        <Col md="0" xs="3">
                                            <a className="link_mobile" href="#">cайт</a>
                                        </Col>
                                    </Row>
                                    <a className="link_desktop" href="#">рио.москва/дмитровка</a>
                                    <p className="muted address_mobile" dangerouslySetInnerHTML={{__html: this.state.object.address}} />
                                </div>
                                <hr className="divider"/>
                                <Row>
                                    <Col md="7" className="features">
                                        <div>
                                            <strong>Этажей:</strong>
                                            <span className="muted"> 4</span>
                                        </div>

                                        <div>
                                            <strong>Площадь:</strong>
                                            <span className="muted">  GBA</span>
                                            <span className="muted-bold" dangerouslySetInnerHTML={{__html: formatNumberBySimpleSpaces(this.state.object.area) + " м<sup>2</sup>"}} />
                                            { (this.state.object.gl_area === -1) ? '' : <span className="muted">, GLA <b>{this.state.object.gl_area} м<sup>2</sup></b></span>}
                                        </div>

                                        <div>
                                            <strong>Дата открытия:</strong>
                                            <span className="muted">  12 января 2008 г.</span>
                                        </div>

                                        <div className="floor_plans">
                                            <strong>Поэтажные планы</strong>
                                        </div>

                                    </Col>
                                    <Col md="5" className="geolocation">
                                        <div className="map_wrapper">
                                            {this.renderMap()}
                                        </div>
                                        <div className="address" dangerouslySetInnerHTML={{__html: this.state.object.city_name + ',<br/>' + String(this.state.object.address).replace(this.state.object.city_name + ',', '' ) }} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col style={{overflow:'hidden', backgroundImage: (state.images.length ? `url(${API.imgPath}/${state.object.id}/${state.images[0]})` : `url(${API.imgPath}/mall_default.jpg)`) }}
                         className="img_wrapper order-1 order-md-12" md="6" xs="12">
                    </Col>
                </Row>

                {(this.state.viewportWidth > 1467) ?
                    <BarChart
                        render={!(this.state.type === 'Выручка')}
                        data={this.state.data}
                    />
                    :
                    <HorizontalBarChart
                        render={!(this.state.type === 'Выручка')}
                        data={this.state.data}
                    />
                }


                <Card className="data_per_month">
                    <div className="header">
                        <h4>{(this.state.type === 'Выручка') ? 'Выручка' : 'Посещаемость'} по месяцам</h4>
                        <div className="muted">Указана суммарная {(this.state.type === 'Выручка') ? 'выручка' : 'посещаемость'} в месяц</div>
                    </div>
                    <CardBody>
                        {
                            (this.state.monthlyData) ?
                                <ul>
                                    { this.state.monthlyData.map( (item,i) => {
                                        return(
                                            <li key={i}>
                                                <div>
                                                    <strong>{formatNumericValue(item.value) +
                                                    ((this.state.type === 'Выручка') ? '' : 'чел.') }
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
                </Card>

                <Card className="all_data">
                    <CardBody className="card-body">
                        <h5 className="measure">{this.state.type}</h5>
                        <Row>
                            <Col className="datepickers" xs="12" md="5" lg="5" xl="4">
                                <span className="muted">{(this.state.type === 'Выручка') ? 'Кол-во выручки' : 'Кол-во людей'} с </span>
                                <div className="datepicker_wrp">
                                    {
                                        (parser().device.type !== 'mobile' && parser().device.type !== 'tablet' ) ?
                                            <DatePicker
                                                className="datepicker"
                                                selected={this.state.startDate}
                                                disabled={this.state.requestIsInProcess}
                                                selectsStart
                                                startDate={this.state.startDate}
                                                endDate={this.state.endDate}
                                                maxDate={moment()}
                                                dateFormat="DD MMM YYYY"
                                                onChange={this.handleChangeStart.bind(this)}
                                            />
                                            :
                                            <input className="datepicker"
                                                   value={this.state.startDate.format('YYYY-MM-DD')}
                                                   onChange = {this.handleMobileChangeStart.bind(this)}
                                                   type="date"
                                            />
                                    }
                                </div>
                                <div className="datepicker_wrp">
                                    {
                                        (parser().device.type !== 'mobile' && parser().device.type !== 'tablet' ) ?
                                            <DatePicker
                                                className="datepicker"
                                                selected={this.state.endDate}
                                                disabled={this.state.requestIsInProcess}
                                                selectsEnd
                                                startDate={this.state.startDate}
                                                endDate={this.state.endDate}
                                                maxDate={moment()}
                                                dateFormat="DD MMM YYYY"
                                                onChange={this.handleChangeEnd.bind(this)}
                                            />
                                            :
                                            <input
                                                className="datepicker"
                                                value={this.state.endDate.format('YYYY-MM-DD')}
                                                onChange = {this.handleMobileChangeEnd.bind(this)}
                                                type="date"
                                            />
                                    }
                                </div>
                            </Col>
                            <Col xs="12" md="4" lg="4" xl="5">
                                {this.renderFloorObjectsButtons()}
                            </Col>
                            <Col xs="12" md="3" className="totalSum">
                                <span className="data"
                                      dangerouslySetInnerHTML=
                                          {{
                                              __html:
                                                  this.state.totalSum ?
                                                      (formatNumericValueWithMnl(this.state.totalSum) + ' ' + this.state.currency) : ''
                                          }}
                                >
                                </span>
                                <span className="muted">{(this.state.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md='12' style={{padding:'0px'}} className="order-12 order-md-1">
                                {this.state.emptyData ? <p className="error-message">Отсутствуют данные</p> : ''}
                                <div style={this.state.emptyData ? {display:'none'} : {}} className="line-chart-wrapper">
                                    {(!this.state.chart.datasets[0].data.length) ?
                                        <Loading/>
                                        :
                                        <div className="linechart_area_wrapper">
                                            <Line data={this.state.chart}
                                                  options={{
                                                      maintainAspectRatio: false,
                                                      animation: {
                                                          duration: 700,
                                                          onComplete: function () {
                                                              var sourceCanvas = this.chart.ctx.canvas;
                                                              var targetCtx = document.getElementById("scrollYAxis").getContext("2d");
                                                              targetCtx.canvas.width = 65;
                                                              targetCtx.canvas.height = 165;
                                                              targetCtx.drawImage(sourceCanvas, 0, 0, 65 * pixelRatio, 200 * pixelRatio, 0, 0, 65, 200);
                                                          }},
                                                      legend: {
                                                          display: false
                                                      },
                                                      tooltips: {
                                                          custom: customLabel2,
                                                          enabled:false,
                                                          callbacks:{
                                                              label: (tooltipItem, data ) => {
                                                                  return `${formatNumberBySpaces(Math.round(tooltipItem.yLabel))} ${this.state.currency.substring(0,3)}.`
                                                              }
                                                          }
                                                      },
                                                      scales: {
                                                          xAxes: [
                                                              {
                                                                  id: 'main-x-axis',
                                                                  afterFit: function (scale) {
                                                                      scale.height = 29;
                                                                  },
                                                                  type: 'time',
                                                                  time: {
                                                                      unit: getStepTick(this.state.timeSegment),
                                                                      unitStepSize: getStepSize(this.state.chart.labels.length, this.state.timeSegment),
                                                                      displayFormats: {
                                                                          day: getStepName(this.state.timeSegment),
                                                                      }
                                                                  },
                                                                  display: true,
                                                                  ticks: {
                                                                      beginAtZero:false,
                                                                      padding: 12,
                                                                      fontColor:'#7f8fa4',
                                                                      fontSize: 14,
                                                                      fontFamily: 'ProximaNova',
                                                                      callback: (value, index, values) => {
                                                                          if (!moment(value).isValid()){
                                                                              return '';
                                                                          }

                                                                          let side = ( (index === 0) || (index === (values.length -1)) );
                                                                          let step = getStepSize(this.state.chart.labels.length, this.state.timeSegment);
                                                                          let len = Math.ceil(this.state.chart.labels.length / step);
                                                                          // if end
                                                                          if(index === 0){
                                                                              return ( side && (len - values.length) < 1 ) ? '' :
                                                                                  moment(value).format( getStepName(this.state.timeSegment) );
                                                                          }
                                                                          // if end
                                                                          if(index === (values.length -1)){
                                                                              return ( side && (len - values.length) < 2 ) ? '' :
                                                                                  moment(value).format( getStepName(this.state.timeSegment) );
                                                                          }

                                                                          return moment(value).format( getStepName(this.state.timeSegment) );
                                                                      }
                                                                  },
                                                                  gridLines: {
                                                                      color: "rgba(0, 0, 0, 0.1)",
                                                                      borderDash: [4, 4],
                                                                      zeroLineColor:'#dfe2e5',
                                                                      drawBorder: false,
                                                                      drawOnChartArea: true,
                                                                      drawTicks:false
                                                                  }
                                                              },
                                                              {
                                                                  id: "main-x-axis2",
                                                                  gridLines: {
                                                                      display: false,
                                                                      drawBorder: false,
                                                                      tickMarkLength:1
                                                                  },
                                                                  type: "time",
                                                                  time: {
                                                                      unit: getStepTick(this.state.timeSegment),
                                                                      unitStepSize: getStepSize(this.state.chart.labels.length, this.state.timeSegment),
                                                                      displayFormats: {
                                                                          day: "YYYY"
                                                                      }
                                                                  },
                                                                  display: ( (this.state.startDate.format('YYYY') !== this.state.endDate.format('YYYY')) &&
                                                                      ((this.state.timeSegment === 'D') || (this.state.timeSegment === 'M'))
                                                                  ),
                                                                  ticks: {
                                                                      beginAtZero:false,
                                                                      padding: 0,
                                                                      fontColor:'#7f8fa4',
                                                                      fontSize: 14,
                                                                      fontFamily: 'ProximaNova',
                                                                      callback: (value, index, values) => {
                                                                          let side = ( (index === 0) || (index === (values.length -1)) );
                                                                          let step = getStepSize(this.state.chart.labels.length, this.state.timeSegment);
                                                                          let len = Math.ceil(this.state.chart.labels.length / step);

                                                                          // if end
                                                                          if(index === 0){
                                                                              return ( side && (len - values.length) < 1 ) ? '' :
                                                                                  moment(value).format('YYYY');
                                                                          }
                                                                          // if end
                                                                          if(index === (values.length -1)){
                                                                              return ( side && (len - values.length) < 2 ) ? '' :
                                                                                  moment(value).format('YYYY');
                                                                          }

                                                                          return moment(value).format('YYYY');
                                                                      }
                                                                  }
                                                              }
                                                          ],
                                                          yAxes: [{
                                                              afterFit: function (scale) {
                                                                  scale.width = 66;
                                                              },
                                                              ticks: {
                                                                  beginAtZero: true,
                                                                  fontColor:'#7f8fa4',
                                                                  fontSize: 11,
                                                                  fontFamily: 'ProximaNova',
                                                                  padding: 10,
                                                                  callback: function(value, index, values) {
                                                                      return formatNumericValueWithMnl(value);
                                                                  }
                                                              },
                                                              gridLines: {
                                                                  color: "rgba(0, 0, 0, 0.1)",
                                                                  borderDash: [4, 4],
                                                                  zeroLineColor:'#dfe2e5',
                                                                  drawBorder: true,
                                                                  drawOnChartArea: true,
                                                                  drawTicks:false
                                                              },
                                                          }]
                                                      }
                                                  }}
                                            />
                                        </div>
                                    }
                                    <canvas id="scrollYAxis" className={this.state.viewportWidth < 992 ? 'scrolled' : ''} height="200" width="0"></canvas>
                                </div>
                            </Col>
                            {this.renderSegmentationButtons()}
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}


import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import moment from 'moment';
import {ajaxRequest} from './../../utils/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import './images.scss';
import {Line} from "react-chartjs-2";
import {formatNumericValue} from './../../utils/utils';
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import { YMaps, Map, Placemark, Circle } from 'react-yandex-maps';
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';
import Loading from './../Loading/Small';
import {customLabel2} from "./customtooltip2";
import {formatNumberBySimpleSpaces} from './../../utils/utils';
import {formatNumberBySpaces} from './../../utils/utils';

import {average} from './../../utils/utils';
import {getStepSize} from './../../utils/utils';
import {getStepTick} from './../../utils/utils';
import {getStepName} from './../../utils/utils';



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
                    currency: typeArr[1]
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
        //console.log(url);


        ajaxRequest(url,options)
            .then(data => {
                let chartObj = this.state.chart;
                let [values,dates] = [ [], [] ] ;
                data.floorData.forEach(item => {
                    values.push(item.VALUE);
                    dates.push(item.THEDATE);
                });

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

                this.setState({data:data,chart:chartObj,totalSum:data.totalSum});
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
                lineTension: 0.1,
                backgroundColor: (typeArr[0] === 'Выручка') ? 'rgba(246, 170, 37, 0.1)' : 'rgba(163, 136, 227, 0.1)',// #f6aa2524
                borderColor: (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',// #886ce6
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
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
        this.setState({floorIndex:+e.target.dataset.id},() => this.getFloorsData())
    }

    changeTimeSegment(e){
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


    trackActualSegments(startDate, endDate){ //меняем значения сегментации(по часам,дням,месяцам) если текущий - неактуален
        let value = this.state.timeSegment;    // начальное значение
        if(startDate.format('YYYY') === endDate.format('YYYY'))
            value = 'M';
        if(startDate.format('YYYY-MM') === endDate.format('YYYY-MM'))
            value = 'D';
        if(startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD'))
            value = 'H';
        return value
    }

    handleChangeStart(date) {
        if(this.state.endDate - date < 0)return false;
        let newSegment = this.trackActualSegments(date,this.state.endDate);
        this.setState({startDate: date,timeSegment:newSegment}, () => this.getFloorsData());
    }

    handleChangeEnd(date) {
        if(date - this.state.startDate < 0)return false;
        if(date > moment())return false;
        let newSegment = this.trackActualSegments(this.state.startDate,date);
        this.setState({endDate: date,timeSegment:newSegment}, () => this.getFloorsData());
    }

    handleMobileChangeStart(e){
        this.setState({startDate: moment(e.target.value)}, () => this.getFloorsData());
    }

    handleMobileChangeEnd(e){
        this.setState({endDate: moment(e.target.value)}, () => this.getFloorsData());
    }

    handleChartScrolling(){ //декорируем Y ось графика во время горизонтального скролла
        let chart = document.querySelector('.line-chart-wrapper'),
            Yaxis = document.getElementById('scrollYAxis');
        chart.onscroll = () => {
            if(chart.scrollLeft)
                Yaxis.classList.add('scrolled');
            else
                Yaxis.classList.remove('scrolled');
        }
    }

    removeDotFromDatepicker(){  //преобразуем формат даты "08 янв. 17" в "08 янв 17" под требования дизайнера
        let datepickers = document.querySelectorAll('.datepicker');

        for(let i = 0;i < datepickers.length; i++){
            let val = datepickers[i].value;
            datepickers[i].setAttribute('value', 1);
        }
    }

    componentDidUpdate(){
        if( this.state.endDate.diff(this.state.startDate,'days') > 14 && this.state.timeSegment === 'H'){
            this.setState({timeSegment:'D'});
            //alert('Детализация по часам недоступна если временной промежуток больше 60ти дней.');
        }
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

        document.querySelector('.main').classList.add('main__additional-padding');//кастомизация хтмл элементов под страницу - добавление
        document.querySelector('.app-body').classList.add('app-body__reduce-margin');
        document.querySelector('.navbar').classList.add('changeHeaderPadding');


        this.removeDotFromDatepicker();

        this.handleChartScrolling();//декорируем Y ось графика во время горизонтального скролла


    }

    componentWillUnmount(){
        document.querySelector('.main').classList.remove('main__additional-padding');//кастомизация хтмл элементов под страницу - удаление
        document.querySelector('.app-body').classList.remove('app-body__reduce-margin');
        document.querySelector('.navbar').classList.remove('changeHeaderPadding');
        window.onresize = () => {};
    }



    render(){
        let state = this.state;
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
                                    <p className="muted address_mobile">{this.state.object.address}</p>
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
                                            <span className="muted-bold">{this.state.object.area} м<sup>2</sup></span>
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
                                        <div className="address">
                                            {this.state.object.city_name},
                                            <br/>
                                            {String(this.state.object.address).replace(this.state.object.city_name + ',', '' )}
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col style={{overflow:'hidden'}} className="img_wrapper order-1 order-md-12" md="6" xs="12">
                        <img className="fullIMG" src={state.images.length ? `${API.imgPath}/${state.object.id}/${state.images[0]}` : "img/rio_full.jpg"}/>
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
                        <h4>{(this.state.type === 'Выручка') ? 'Выручка' : 'Посещаемость'} за последние 12 месяцев</h4>
                        <div className="muted">Поясняющий текст о том, что тут показано</div>
                    </div>
                    <CardBody>
                        <ul>
                            {
                                (this.state.monthlyData) ?
                                    this.state.monthlyData.map( (item,i) => {
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
                                    }
                                )
                                :
                                <Loading/>
                            }
                        </ul>
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
                                <span className="data" dangerouslySetInnerHTML={{__html: formatNumberBySpaces(this.state.totalSum) + ' ' + this.state.currency}} ></span>
                                <span className="muted">{(this.state.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md='12' style={{padding:'0px'}} className="order-12 order-md-1">
                            <div  className="line-chart-wrapper">
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
                                                          targetCtx.canvas.width = 28;
                                                          targetCtx.canvas.height = 160;
                                                          targetCtx.drawImage(sourceCanvas, 0, 0, 44, 400, 0, 0, 22, 200);
                                                      }},
                                                  legend: {
                                                      display: false
                                                  },
                                                  tooltips: {
                                                      custom: customLabel2,
                                                      enabled:false,
                                                      callbacks:{
                                                          label:function(tooltipItem, data ){
                                                              return `${formatNumberBySpaces(tooltipItem.yLabel)} чел.`
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
                                                                      let side = ( (index === 0) || (index === (values.length -1)) );
                                                                      let len = Math.ceil(this.state.chart.labels.length / getStepSize(this.state.chart.labels.length, this.state.timeSegment));
                                                                      return ( side && values.length == len ) ? '' :
                                                                          moment(value).format( getStepName(this.state.timeSegment) );
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
                                                                  unit: 'day',
                                                                  unitStepSize: getStepSize(this.state.chart.labels.length, this.state.timeSegment),
                                                                  displayFormats: {
                                                                      day: "YYYY"
                                                                  }
                                                              },
                                                              display: ( (this.state.startDate.format('YYYY') !== this.state.endDate.format('YYYY')) && (this.state.timeSegment === 'D')),
                                                              ticks: {
                                                                  beginAtZero:false,
                                                                  padding: 0,
                                                                  fontColor:'#7f8fa4',
                                                                  fontSize: 14,
                                                                  fontFamily: 'ProximaNova',
                                                                  callback: function(value, index, values) {
                                                                      return (index === 0 || index === values.length -1) ?
                                                                         '' : value;
                                                                  }
                                                              }
                                                          }
                                                      ],
                                                  yAxes: [{
                                                      afterFit: function (scale) {
                                                          scale.width = 46;
                                                      },
                                                      ticks: {
                                                          beginAtZero: true,
                                                          fontColor:'#7f8fa4',
                                                          fontSize: 11,
                                                          fontFamily: 'ProximaNova',
                                                          padding: 10,
                                                          callback: function(value, index, values) {
                                                              return formatNumberBySimpleSpaces(value);
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
                                <canvas id="scrollYAxis" height="200" width="0"></canvas>
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


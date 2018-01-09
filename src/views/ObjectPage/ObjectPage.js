import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import {ajaxRequest} from './../../utils/utils';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Table from './Table.js';
import './style.scss';
import {Line} from "react-chartjs-2";
import {formatNumericValue} from './../../utils/utils';
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import { YMaps, Map, Placemark, Circle } from 'react-yandex-maps';
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';


function formatNumberBySpaces(num){
    if(num === undefined)return '';
    let str = String(num);
    return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}

function formatMonths(index){
    let months = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    return months[index - 1];
}

export default class ObjectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewportWidth:window.innerWidth,
            object:'',
            type:'',
            currency:'',
            startDate: moment().add(-7,'days'),
            endDate: moment(),
            timeSegment: 'D',
            chart :{
                labels: [],
                datasets: [
                    {
                        label: 'Количество чел-к',
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: '#f6aa2524',// rgba(163, 136, 227, 0.1)
                        borderColor: '#f6aa25',// #886ce6
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#f6aa25',// #886ce6
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 5,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#f6aa25',
                        pointHoverBorderColor: '#f6aa25',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: []
                    }
                ]
            }
        };
        moment.locale('ru'); // локализуем библиотеку
    }

    setSpecificCSSforPage(){
        document.querySelector('.app-body').classList.add('app-body_new_margin');
    }

    fillInitialObjectData(obj){ //записываем данные с пропсов, если они есть и парсим с сервера срезы
        let typeArr = obj.data_type.split(', ');//разбиваем строку с типом данных на массив
        let chart = this.getNewStyleForChart(typeArr);
        this.setState({object:obj,
                type:typeArr[0],
                currency:(typeArr[1] === 'чел.') ? 'человек' : typeArr[1]
            },
            () => {
                this.getFloors();
                //this.props.upState('title',this.state.object.obj_name);
                this.props.upState('title','Карточка объекта');
                this.props.upState('address',this.state.object.address);
            });
    }

    getNewObjectsData(){       // получение новых данных об объекте, если они не были переданы через props
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
                return obj;
            })
            .then(object =>  {
                ajaxRequest(API.objectsData + '?objId=' + object.id, options)
                    .then(data => {
                        object.data = data;
                        let typeArr = object.data_type.split(', ');//разбиваем строку с типом данных на массив
                        let chart = this.getNewStyleForChart(typeArr);
                        this.setState({
                            object:object,
                            type:typeArr[0],
                            currency:(typeArr[1] === 'чел.') ? 'человек' : typeArr[1]
                        }, () => {
                            //this.props.upState('title',this.state.object.obj_name);
                            this.props.upState('title','Карточка объекта');
                            this.props.upState('address',this.state.object.address);
                        })
                    })
                    .then(data => this.getFloors())
                    .catch(err => console.log(err))
            })
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
                this.setState({floors:data, floorIndex:0}, () => this.getFloorsData());
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
        console.log(url);
        ajaxRequest(url,options)
            .then(data => {
                console.log(data);
                let chartObj = this.state.chart;
                let [values,dates] = [ [], [] ] ;
                data.floorData.forEach(item => {
                    values.push(item.VALUE);
                    dates.push(item.THEDATE);
                    // if(+item.THEDATE.substr(0,4) === moment().year()){  //если год выводимой даты совпадает с текущей - показывать только число и месяц
                    //     dates.push(moment(item.THEDATE).format('D MMM'));
                    // }
                    // else{
                    //     dates.push(moment(item.THEDATE).format('D MMM \'YY'));//иначе - показывать также и год
                    // }
                });
                chartObj.labels = dates;
                chartObj.datasets[0].data = values;
                this.setState({data:data,chart:chartObj,totalSum:data.totalSum});
            })
            .catch(err => console.log(err))
    }

    getNewStyleForChart(typeArr){
        let chart = this.state.chart;
        if(typeArr[0] === 'Выручка')
            chart.datasets = [
                {
                    label: 'Количество чел-к',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(246, 170, 37, 0.1)',// #f6aa2524
                    borderColor: '#f6aa25',// #886ce6
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#f6aa25',// #886ce6
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#f6aa25',
                    pointHoverBorderColor: '#f6aa25',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                }
            ];
        else
            chart.datasets = [
                {
                    label: 'Количество чел-к',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(163, 136, 227, 0.1)',//
                    borderColor: '#886ce6',//
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#886ce6',//
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#886ce6',
                    pointHoverBorderColor: '#886ce6',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
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
                     width={(this.state.viewportWidth < 1199) ? '100px' : '180px'}
                     height={(this.state.viewportWidth < 1199) ? '100px' : '180px'}
                >
                </Map>
            </YMaps>

            </div>
        );
    };

    renderFloorObjectsButtons(){//функция рендера срезов
        if(!this.state.floors)return null;
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
            {val:'Y',text:'По годам'},
            {val:'M',text:'По месяцам'},
            {val:'D',text:'По дням'},
            {val:'H',text:'По часам'}
        ];
        return (
            <Col md='12' className='segmentation_btn-wrp order-1 order-md-12'>
                <div className="btn-group" role="group">
                    {arr.map( (item,i) =>
                        <button type="button"
                                key={i}
                                data-val={item.val}
                                className={'btn ' + ((this.state.timeSegment === item.val) ? 'active' : '')}
                                onClick={this.changeTimeSegment.bind(this)}
                        >
                            {item.text}
                        </button>
                    )}
                </div>
            </Col>
        )
    }

    renderTable(){  //функция рендера таблицы
        if(!this.state.data)return null;
        return (
            <Table data={this.state.data}/>
        )
    }

    handleChangeStart(date) {
        this.setState({startDate: date}, () => this.getFloorsData());
    }

    handleChangeEnd(date) {
        this.setState({endDate: date}, () => this.getFloorsData());
    }

    handleMobileChangeStart(e){
        this.setState({startDate: moment(e.target.value)}, () => this.getFloorsData());
    }

    handleMobileChangeEnd(e){
        this.setState({endDate: moment(e.target.value)}, () => this.getFloorsData());
    }

    componentDidUpdate(){
        if( this.state.endDate.diff(this.state.startDate,'days') > 60 && this.state.timeSegment === 'H'){
            this.setState({timeSegment:'D'});
            alert('Детализация по часам недоступна если временной промежуток больше 60ти дней.');
        }
    }

    componentDidMount(){
        window.onresize = () => this.setState({viewportWidth:window.innerWidth});//при изменении размера экрана - перезаписываем ширину вьюпорта в стейт

        if(this.props.location.params){ //если начальные данные переданы с пропсов - идем 1м путем
            let obj = this.props.location.params.obj;
            this.fillInitialObjectData(obj);
        }
        else{   //если данных в пропсах не обнаружено - парсим их с сервера
            this.getNewObjectsData()
        }

        document.querySelector('.main').classList.add('main__additional-padding');//кастомизация хтмл элементов под страницу - добавление
        document.querySelector('.app-body').classList.add('app-body__reduce-margin');
    }

    componentWillUnmount(){
        document.querySelector('.main').classList.remove('main__additional-padding');//кастомизация хтмл элементов под страницу - удаление
        document.querySelector('.app-body').classList.remove('app-body__reduce-margin');
        window.onresize = () => {};
    }



    render(){
        console.log(this.state.startDate, this.state.endDate);
        return (
            <div className={((this.state.type === 'Выручка') ? "revenue" : "trafic") + ' object_cont'}>
                <Row className="announce">
                    <Col className="order-12 order-md-1" md="6" xs="12">
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
                                        <div><strong>Этажей:</strong>  <span className="muted">4</span> </div>
                                        <div><strong>Площадь:</strong>   <span className="muted">{this.state.object.area}м<sup>2</sup></span></div>
                                        <div><strong>Дата открытия:</strong>  <span className="muted">12 января 2008 г.</span> </div>
                                    </Col>
                                    <Col md="5" className="geolocation">
                                        <div className="map_wrapper">
                                            {this.renderMap()}
                                        </div>
                                        <div className="address">
                                            {this.state.object.address}
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col style={{overflow:'hidden'}} className="img_wrapper order-1 order-md-12" md="6" xs="12">
                        <img className="fullIMG" src="img/rio_full.jpg"/>
                    </Col>
                </Row>

                {(this.state.viewportWidth > 991) ?

                    <BarChart data={this.state.data}/>
                    :
                    <HorizontalBarChart data={this.state.data}/>
                }



                <Card className="data_per_month">
                    <div className="header">
                        <h4>{(this.state.type === 'Выручка') ? 'Выручка' : 'Посещаемость'} за последние 12 месяцев</h4>
                    </div>
                    <CardBody>
                        <ul>
                            {   (this.state.object) ?
                                this.state.object.data.month.map( (item,i) => {
                                    if( i < 12 ){
                                        return(
                                            <li key={i}>
                                                <div>
                                                    <strong>{formatNumericValue(item.v)}</strong>
                                                </div>
                                                <div className="muted">
                                                    {`${formatMonths(item.m)} ${item.y}`}
                                                </div>
                                            </li>
                                        )
                                    }
                                })
                                :
                                ''
                            }
                        </ul>
                    </CardBody>
                </Card>

                <Card className="all_data">
                    <CardBody className="card-body">
                        <h5 className="measure">{this.state.type}</h5>
                        <Row>
                            <Col xs="12" md="4" lg="4" xl="4">
                                <span className="muted">{(this.state.type === 'Выручка') ? 'Количество выручки' : 'Количество людей'} с </span>
                                    <div className="datepicker_wrp">
                                        {
                                            (this.state.viewportWidth > 767) ?
                                                <DatePicker
                                                    className="datepicker"
                                                    selected={this.state.startDate}
                                                    selectsStart
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    dateFormat="DD MMM YY"
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
                                            (this.state.viewportWidth > 767) ?
                                                <DatePicker
                                                    className="datepicker"
                                                    selected={this.state.endDate}
                                                    selectsEnd
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    dateFormat="DD MMM YY"
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
                            <Col xs="12" md="5" lg="5" xl="5">
                                {this.renderFloorObjectsButtons()}
                            </Col>
                            <Col xs="12" md="3" className="totalSum">
                                <span className="data">{`${formatNumberBySpaces(this.state.totalSum)} ${this.state.currency}`} </span>
                                <span className="muted">{(this.state.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                            </Col>
                        </Row>
                        <Row >
                            <Col md='12' style={{padding:'0px'}} className="line-chart-wrapper order-12 order-md-1">
                                <Line data={this.state.chart}
                                      options={{
                                          maintainAspectRatio: false,
                                          legend:{
                                              display:false
                                          },
                                          scales: {
                                              xAxes: [{
                                                  gridLines: {
                                                      color: "rgba(0, 0, 0, 0)",
                                                      display:false
                                                  },
                                              }],
                                              yAxes: [{
                                                  display: false,
                                                  gridLines: {
                                                      color: "rgba(0, 0, 0, 0)",
                                                  },
                                              }]
                                          }
                                      }}
                                />
                            </Col>
                            {this.renderSegmentationButtons()}
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}


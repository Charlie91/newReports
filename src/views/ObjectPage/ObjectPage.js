import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import moment from 'moment';
import {ajaxRequest} from './../../utils/utils';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import { YMaps, Map, Placemark, Circle } from 'react-yandex-maps';
import Announce from './Announce';
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
import DataPerMonth from './DataPerMonth';
import ShopList from './ShopList';
import ShopListAccordeon from './ShopListAccordeon';
import YearSelector from './YearSelector';

function formatMonths(index){
    return ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][index];
}


function chartStylingByYear(year){
    return (year === 2018) ? '#74c2e8' :
           (year === 2017) ? '#9fd473' :
           (year === 2016) ? '#8570CE' :
           (year === 2015) ? '#ed8455' :
           (year === 2014) ? '#e06c89' :
                             '#f6aa25';
}

function checkLeapYear(data){
    data.floorData.forEach((item,i) => {
         if(moment(item.THEDATE).format('DDMM') === '2902'){
             data.floorData.splice(i,1);
         }
    });
    return data;

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

        this.initialChart = {  //изначальное состояние графика, для удобного сброса состояния
            labels: [],
            datasets: [
                {
                    data: []
                }
            ]
        };


        this.state = {
            viewportWidth:window.innerWidth,
            requestIsInProcess:false,
            comparison_mode:false,
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
            chart : Object.assign({},this.initialChart)  //клонируем объект изначального состояния графика
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
        if(this.state.comparison_mode){     //если режим сравнения включен - переводим на др функцию
            this.getPlurableFloorsData();
            return;
        }
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

    getPlurableFloorsData(){
        if(!this.state.floors)return null;
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let [unit, chart,labelsLength] = [this.state.timeSegment, this.state.chart, 0];
        let floorID;
        this.state.floors.forEach((item,i) => {
            if(this.state.floorIndex === i)floorID = item.id
        });
        chart.datasets.forEach( (item,i) => {
            if( i % 2 )return; //делаем запросы только по четным индексам, так как на один график у нас 2 элемента в массиве
            let year = item.year;
            let [startDate, endDate] = [year + this.state.startDate.format("MMDD"),year +  this.state.endDate.format("MMDD")];
            let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
            ajaxRequest(url,options)
                .then(data => {
                    console.log(data);
                    data = checkLeapYear(data); //если високосный год - удаляем 29 февраля из выдачи, чтобы не мешать сравнению
                    let [values,dates] = [ [], [] ] ;
                    data.floorData.forEach(item => {
                        values.push(item.VALUE);
                        dates.push(item.THEDATE);
                    });
                    if(!dates.length){
                        [ chart.datasets[i].data, chart.datasets[i + 1].data ] = [values,values];
                    }
                    else{
                        let diff = moment(dates[0]).diff(moment(dates[1]));
                        let first_date = moment(moment(dates[0]) + diff).format(),
                            last_date = moment(moment(dates[dates.length - 1]) - diff).format(),
                            avg = parseInt(average(values));
                        let values2;


                        if(this.checkForTail(data)){
                            values = [avg, ...values, avg];
                            values2 = [NaN,...values.slice(1, values.length-1 ),NaN];
                        }
                        else{
                            values = [avg, ...values];
                            values2 = [NaN,...values.slice(1)];
                        }
                        dates = [first_date, ...dates, last_date];


                        [ chart.datasets[i].data, chart.datasets[i + 1].data ] = [values,values2];

                        if(dates.length >= labelsLength){
                            labelsLength = dates.length;
                            chart.labels = dates;
                        }

                    }

                    this.setState({
                        chart:chart,
                        emptyData:false,
                        requestIsInProcess:false
                    }, () => {
                        this.requestIsEnded();
                    });

                });

        });
    }

    checkForTail(data){
        let [timeSegment,arr,lastMonth] = [this.state.timeSegment,data.floorData,this.state.endDate];

        if(timeSegment === 'M'){
            return moment(arr[arr.length - 1].THEDATE).month() === lastMonth.month()
        }
        else if(timeSegment === 'D'){
            //console.log(moment(arr[arr.length - 1].THEDATE).format('DD MM'),lastMonth.format('DD MM'));
            return moment(arr[arr.length - 1].THEDATE).format('DD MM') === lastMonth.format('DD MM')
        }

    }

    comparisonGraphHandler(){
        if(this.state.comparison_mode){
            this.changeStyleOfFirstGraph();
            this.addComparisonGraph(2017);
        }
        else
            this.dropAllGraphs();
    }

    addComparisonGraph(year){
        if(!this.state.floors)return null;
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let [startDate, endDate] = [year + this.state.startDate.format("MMDD"),year +  this.state.endDate.format("MMDD")];
        let unit = this.state.timeSegment;
        let floorID;
        this.state.floors.forEach((item,i) => {
            if(this.state.floorIndex === i)floorID = item.id
        });
        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
        ajaxRequest(url,options)
            .then(data => {
                data = checkLeapYear(data); //если високосный год - удаляем 29 февраля из выдачи, чтобы не мешать сравнению
                let chartObj = Object.assign({},this.state.chart);
                let values = [];
                data.floorData.forEach(item => {
                    values.push(item.VALUE);
                });
                if(!values.length)return;
                let avg = parseInt(average(values));

                let values2;

                if(this.checkForTail(data)){
                    values = [avg, ...values, avg];
                    values2 = [NaN,...values.slice(1, values.length-1 ),NaN];
                }
                else{
                    values = [avg, ...values];
                    values2 = [NaN,...values.slice(1)];
                }

                let newDataset = [
                    {
                        label:String(year),
                        year:String(year),
                        fill: false,
                        lineTension: 0,
                        backgroundColor: chartStylingByYear(year),
                        borderColor: chartStylingByYear(year) ,// #886ce6
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffsent: 0.0,
                        borderJoinStyle: 'miter',
                        borderWidth: 0,
                        pointBorderColor: chartStylingByYear(year) ,// #886ce6
                        pointBackgroundColor: chartStylingByYear(year),
                        pointBorderWidth: 0,
                        pointHoverRadius: 0,
                        pointHoverBackgroundColor:chartStylingByYear(year),
                        pointHoverBorderColor:chartStylingByYear(year),
                        pointHoverBorderWidth: 0,
                        pointRadius: 0,
                        pointHitRadius: 0,
                        data: []
                    },
                    {
                        label:String(year) + '_2',
                        year:String(year),
                        fill: false,
                        lineTension: 0,
                        borderDash: [],
                        borderWidth: 0,
                        pointBorderColor:  chartStylingByYear(year),
                        pointBackgroundColor: chartStylingByYear(year),
                        pointBorderWidth: 6,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: chartStylingByYear(year),
                        pointHoverBorderColor:chartStylingByYear(year),
                        pointHoverBorderWidth: 2,
                        pointRadius: 2.4,
                        pointHitRadius: 10,
                        data: []
                    }
                ];

               [newDataset[0].data, newDataset[1].data] = [values,values2];

                chartObj.datasets.push(newDataset[0]);
                chartObj.datasets.push(newDataset[1]);

                this.setState({
                    chart:chartObj,
                    emptyData:false,
                });

            })
            .catch(err => console.log(err))
    }

    removeComparisonGraph(year){
        let chart = this.state.chart;
        let graphArr = chart.datasets;

        let removalIndexes = graphArr.reduce( (filteredIndexes, currentItem, index) => {
            if(~currentItem.label.indexOf(String(year)))    //Если в названии лейбла содержит номер года, подлежащего удалению - поставить в очередь на удаление
                filteredIndexes.push(index);
            return filteredIndexes;
        },[]);

        chart.datasets = graphArr.filter((item,index) => {      //фильтруем массив
            for(let i = 0; i < removalIndexes.length; i ++){
                if(index === removalIndexes[i])
                    return false;
            }
            return true;
        });

        if(!chart.datasets.length)
            this.setState({emptyData:true});
        else
            this.setState({chart:chart});
    }

    dropAllGraphs(){
        let initialChart = Object.assign({},this.initialChart);
        let obj = this.state.object;
        initialChart = this.getNewStyleForChart( obj.data_type.split(', '), initialChart);
        this.setState({
            chart:initialChart,
            startDate:moment().add(-7,'days'),
            endDate:moment(),
            timeSegment: 'D'},
            () => this.getFloorsData()
        )
    }

    changeStyleOfFirstGraph(){
        let chart = this.state.chart;
        let newDataset = [
            {
                label:'2018',
                year:'2018',
                fill: false,
                lineTension: 0,
                backgroundColor: '#74c2e8',
                borderColor: '#74c2e8',// #886ce6
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffsent: 0.0,
                borderJoinStyle: 'miter',
                borderWidth: 0,
                pointBorderColor: '#74c2e8',// #886ce6
                pointBackgroundColor: '#74c2e8',
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBackgroundColor:'#74c2e8',
                pointHoverBorderColor:'#74c2e8',
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                pointHitRadius: 0,
                data: chart.datasets[0].data
            },
            {
                label:'2018' + '_2',
                year:'2018',
                fill: false,
                lineTension: 0,
                borderDash: [],
                borderWidth: 0,
                pointBorderColor:  '#74c2e8',
                pointBackgroundColor: '#74c2e8',
                pointBorderWidth: 6,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#74c2e8',
                pointHoverBorderColor:'#74c2e8',
                pointHoverBorderWidth: 2,
                pointRadius: 2.4,
                pointHitRadius: 10,
                data: chart.datasets[1].data
            }
        ];
        chart.datasets[0] = newDataset[0];
        chart.datasets[1] = newDataset[1];

        this.setState({chart:chart});
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

    getInnerObjects(){  //получаем список внутренних объектов(кафе и магазинов) в ТРЦ и преобразуем в нужную структуру
        let url = `${API.innerObjects}${this.props.match.params.id}`;
        let options = {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
        };
        ajaxRequest(url,options)
            .then(data => {
                let hierarchiedObjects = data.inners.reduce( (result,item) => { //преобразование получаемых данных в нужную нам структуру
                    let check = result.some(obj => {
                        if(obj.title === item.type)
                            return obj.objects.push(item); // читай как "return true" с побочным присвоением
                        else
                            return false
                    });
                    if(!check)
                        result.push({
                            title:item.type,
                            objects:[item]
                        });
                    return result;
                },[]);
                this.setState({shops:hierarchiedObjects});
            })
            .catch(err => console.log(err))
    }

    getNewStyleForChart(typeArr,chartObj){
        let chart = chartObj || this.state.chart;
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
                //xAxisID: 'main-x-axis',
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
            <div style={{overflow:'hidden',marginTop:'-30px'}}>
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

    checkYear(year,e){
        let checkboxes = document.querySelectorAll('.year_selector_list .year > .checkbox');

        for(let i = 0; i < checkboxes.length; i++){
            if(~checkboxes[i].classList.value.indexOf(String(year))){
                if(checkboxes[i].classList.contains('checked'))
                    this.removeComparisonGraph(year);
                else
                    this.addComparisonGraph(year);

                checkboxes[i].classList.toggle('checked');

            }
        }

    }

    countAverageOfMonths(){
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
        if(!this.state.comparison_mode && (date > moment()) )return false;
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

    changeComparisonMode(){
        this.setState({comparison_mode:!this.state.comparison_mode});
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

        if(prevState.comparison_mode !== this.state.comparison_mode)
            this.comparisonGraphHandler();
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

                <Announce
                    object={state.object}
                    renderMap={this.renderMap.bind(this)}
                    images={state.images}
                />

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

                <DataPerMonth
                    type={state.type}
                    viewportWidth={state.viewportWidth}
                    monthlyData={state.monthlyData}
                    countAverageOfMonths={this.countAverageOfMonths.bind(this)}
                    renderCurrency={this.renderCurrency.bind(this)}
                />


                <Card className="all_data">
                    <CardBody className="card-body">


                        <Row>
                            <Col md="3">
                                <h5 className="measure">{(state.type === 'Выручка') ? 'Выручка' : 'Трафик'}</h5>
                                <div className={"comparison_mode-wrp " + (this.state.comparison_mode ? 'active' : '' )  }>
                                    <div className="outer_circle">
                                        <div className="inner_circle"></div>
                                    </div>
                                    <button className="btn" onClick={this.changeComparisonMode.bind(this)}>
                                        { (this.state.comparison_mode ? 'Выключить' : 'Включить') + ' режим сравнения' }
                                    </button>
                                </div>
                            </Col>

                        </Row>
                        <Row>
                            <Col className="datepickers" xs="12" md="5" lg="5" xl="4">
                                <Datepickers
                                    startDate={state.startDate}
                                    endDate={state.endDate}
                                    requestIsInProcess={state.requestIsInProcess}
                                    handleChangeStart={this.handleChangeStart.bind(this)}
                                    handleChangeEnd={this.handleChangeEnd.bind(this)}
                                    handleMobileChangeStart={this.handleMobileChangeStart.bind(this)}
                                    handleMobileChangeEnd={this.handleMobileChangeEnd.bind(this)}
                                    comparison_mode={state.comparison_mode}
                                />
                                <YearSelector
                                    comparison_mode={state.comparison_mode}
                                    checkYear={this.checkYear.bind(this)}
                                />
                            </Col>
                            <Col xs="12" md="4" lg="4" xl="5">
                                {this.renderFloorObjectsButtons()}
                            </Col>
                            <Col xs="12" md="3" className={"totalSum " + (this.state.comparison_mode ? 'none' : '')}>
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
                                        comparison_mode={state.comparison_mode}
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
                                        comparison_mode={state.comparison_mode}
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

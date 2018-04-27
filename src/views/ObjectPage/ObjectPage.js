import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import moment from 'moment';
import {ajaxRequest} from './../../utils/utils';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import {Row,Col, Card, CardBody} from "reactstrap";
import { YMaps, Map} from 'react-yandex-maps';
import Announce from './Announce';
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';
import DataChart from './DataChart';
import DataChartSmall from './DataChartSmall';
import {customLabel2} from "./customLabelDataChart";
import {digitCount, formatNumberBySpaces,average} from './../../utils/utils';
import {checkLeapYear,formatDatesForChart,createNewDataset,addOpacityToChart,
        removeOpacityFromChart,addSpecificStyles,removeSpecificStyles, localizeMoment } from './obj_utils';
import xlsExport from './xls-export';
import Datepickers from './Datepickers';
import DataPerMonth from './DataPerMonth';
import ShopList from './ShopList';
import ShopListAccordeon from './ShopListAccordeon';
import YearSelector from './YearSelector';




export default class ObjectPage extends Component {
    constructor(props) {
        super(props);


        localizeMoment();//локализация библиотеки moment

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
            shops:[],
            chart : Object.assign({},this.initialChart)  //клонируем объект изначального состояния графика
        };
        this.initialState = Object.assign({},this.state);//для удобного сброса стейта;

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
                this.formatInnerObjects(obj.inners);
            });
    }

    getNewObjectsData(){ // получение новых данных об объекте, если они не были переданы через props
        let  params = this.props.match.params;
        let [concept,city,id] = [params.concept,params.city,params.id];
        let url = API.objects + '?conceptId=' + concept + '&cityId=' + city;
        ajaxRequest(url)
            .then(data => {
                let obj = data.find( object => {
                    return +id === object.id
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
                    this.formatInnerObjects(obj.inners);
                })
            })
            .then(() => this.getFloors())
            .catch(err => console.log(err))
    }

    getFloors(){    //получение срезов данных об объекте
        let url = API.floors + this.state.object.id;
        ajaxRequest(url)
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
        let [startDate, endDate] = [this.state.startDate.format("YYYYMMDD"),this.state.endDate.format("YYYYMMDD")],
             unit = this.state.timeSegment,
             floorID = this.returnFloorID();
        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
        ajaxRequest(url)
            .then(data => {
                let [chartObj,values,dates] = [ this.state.chart, [], [] ] ;
                data.floorData.forEach(item => {
                    values.push(item.VALUE);
                    dates.push(item.THEDATE);
                });
                if(!dates.length){
                    this.setState({emptyData:true});
                    this.requestIsEnded();
                    return;
                }
                let avg = parseInt(average(values));
                values = [avg, ...values, avg];
                dates = formatDatesForChart(dates);
                let styleValues = [NaN,...values.slice(1, values.length-1 ),NaN];

                [ chartObj.datasets[0].data, chartObj.datasets[1].data, chartObj.labels ] = [values,styleValues,dates];

                this.setState({
                    data:data,
                    chart:chartObj,
                    totalSum:data.totalSum,
                    emptyData:false,
                    shortestUnit:data.shortestUnit
                });

            })
            .catch(err => console.log(err))
    }


    getPlurableFloorsData(){    //ajax запрос на данные в режиме сравнения
        if(!this.state.floors)return null;
        let [unit, chart,labelsLength,floorID] = [this.state.timeSegment, this.state.chart, 0, this.returnFloorID()];

        let newData = Promise.all(chart.datasets.map( (item,i) => {
            if( i % 2 )return null; //делаем запросы только по четным индексам, так как на один график у нас 2 элемента в массиве
            let year = item.year;
            let [startDate, endDate] = [year + this.state.startDate.format("MMDD"), year + this.state.endDate.format("MMDD")];
            let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
            return ajaxRequest(url)
                .then( data => data)
                .catch( err => console.log(err))
        }))
            .then(arr => arr.filter(item => item !== null))//фильтруем массив от null значений
            .then(data => {
                let newChart = data.reduce( (chart,item,i) => {
                    let formattedData = checkLeapYear(item); //если високосный год - удаляем 29 февраля из выдачи, чтобы не мешать сравнению
                    let [values,dates, styleValues] = [ [], [], [] ] ;

                    formattedData.floorData.forEach(item => {
                        values.push(item.VALUE);
                        dates.push(item.THEDATE);
                    });

                    if(!dates.length){
                        [ chart.datasets[i * 2].data, chart.datasets[i * 2 + 1].data ] = [[],[]];
                        return chart;
                    }
                    let avg = parseInt(average(values));
                    dates = formatDatesForChart(dates);
                    values = (this.checkForTail(formattedData)) ? [avg, ...values, avg] : [avg, ...values];
                    styleValues= (this.checkForTail(formattedData)) ? [NaN,...values.slice(1, values.length-1 ),NaN]
                        :
                        [NaN,...values.slice(1)];

                    [ chart.datasets[i * 2].data, chart.datasets[i * 2 + 1].data ] = [values,styleValues];

                    if(dates.length >= labelsLength){
                        labelsLength = dates.length;
                        chart.labels = dates;
                    }
                    return chart;
                },chart);

                this.setState({
                    chart:newChart,
                    emptyData:false,
                    requestIsInProcess:false
                }, () => {
                    this.requestIsEnded();
                });
            })
    }


    checkForTail(data){//проверка нужен ли "хвостик"
        let [timeSegment,arr,lastMonth] = [this.state.timeSegment,data.floorData,this.state.endDate];

        if(timeSegment === 'M'){
            return moment(arr[arr.length - 1].THEDATE).month() === lastMonth.month()
        }
        else if(timeSegment === 'D'){
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

    addComparisonGraph(year){   //добавление нового графика в диаграмму
        if(!this.state.floors)return null;
        let [startDate, endDate] = [year + this.state.startDate.format("MMDD"),year +  this.state.endDate.format("MMDD")],
            unit = this.state.timeSegment,
            floorID = this.returnFloorID();
        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
        ajaxRequest(url)
            .then(data => {
                data = checkLeapYear(data); //если високосный год - удаляем 29 февраля из выдачи, чтобы не мешать сравнению
                let chartObj = Object.assign({},this.state.chart),
                    values = data.floorData.map(item => {
                        return item.VALUE;
                    });
                if(!values.length)return;//если данных нет - ничего не делаем


                let avg = parseInt(average(values));
                values = (this.checkForTail(data)) ? [avg, ...values, avg] : [avg, ...values];
                let styleValues= (this.checkForTail(data)) ? [NaN,...values.slice(1, values.length-1 ),NaN]
                                                                        :
                                                             [NaN,...values.slice(1)];

                let newDataset = createNewDataset(year);    //создание нового графика
                [newDataset[0].data, newDataset[1].data] = [values,styleValues];//присвоение данных новому графику

                chartObj.datasets.push(...newDataset);

                this.setState({
                    chart:chartObj,
                    emptyData:false,
                });
            })
            .catch(err => console.log(err))
    }


    removeComparisonGraph(year){ //удаление графика из диаграммы
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

    dropAllGraphs(){    //выход из режима сравнения
        let initialChart = Object.assign({},this.initialChart);
        let obj = this.state.object;
        if(!obj)return;
        initialChart = this.getNewStyleForChart( obj.data_type.split(', '), initialChart);
        this.setState({
            chart:initialChart,
            startDate:moment().add(-7,'days'),
            endDate:moment(),
            timeSegment: 'D'},
            () => this.getFloorsData()
        )
    }

    changeStyleOfFirstGraph(){  ////смена стиля первого графика при входе в режим сравнения
        let chart = this.state.chart;
        let [firstGraphData, secondGraphData] = [ [...chart.datasets[0].data],  [...chart.datasets[1].data] ];//сохранение данных текущего графика
        let newDataset = createNewDataset(2018);//создание массива новых стилизованных графиков

        [newDataset[0].data,newDataset[1].data] = [firstGraphData,secondGraphData];//присвоение данных в новый массив
        [chart.datasets[0],chart.datasets[1]] = [newDataset[0],newDataset[1]];
        this.setState({chart:chart});
    }

    getMonthlyDataPerYear(){
        if(!this.state.floors)return null;
        let floorID = this.returnFloorID();
        let [startDate, endDate] = [ moment().add(-11,'months').format("YYYYMMDD"), moment().format("YYYYMMDD") ];

        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=M`;
        ajaxRequest(url)
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

    formatInnerObjects(objects){  //получаем список внутренних объектов(кафе и магазинов) в ТРЦ и преобразуем в нужную структуру
        if(!objects){
            this.setState({shops:[]});
            return;
        }
        let hierarchiedObjects = objects.reduce( (result,item) => { //преобразование получаемых данных в нужную нам структуру
            let check = result.some(obj => {
                if(obj.title === item.obj_type)
                    return obj.objects.push(item); // читай как "return true" с побочным присвоением
                else
                    return false
            });
            if(!check)
                result.push({
                    title:item.obj_type,
                    objects:[item]
                });
            return result;
        },[]);
        this.setState({shops:hierarchiedObjects});
    }

    getNewStyleForChart(typeArr,chartObj){
        let chart = chartObj || this.state.chart,
            color = (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
            backgroundColor = (typeArr[0] === 'Выручка') ? 'rgba(246, 170, 37, 0.1)' : 'rgba(163, 136, 227, 0.1)',
            label = (typeArr[0] === 'Выручка') ? 'Выручка' : 'Количество чел-к';

        chart.datasets = createNewDataset(null, label, backgroundColor, color);
        return chart;
    }

    returnFloorID(){
       let selectedFloor = this.state.floors.find((item,i) => {
            return this.state.floorIndex === i
        });
       return selectedFloor.id
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
            <div className="floor_btn-layer" style={{overflow:'hidden'}}>
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
        
        if((digitCount(state.totalSum) > 6) || ( state.viewportWidth > 768 && state.viewportWidth < 1525))
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

    requestIsStarted(){
        addOpacityToChart();
        this.setState({requestIsInProcess:true})
    }

    requestIsEnded(){
        removeOpacityFromChart();
        this.setState({requestIsInProcess:false})
    }

    dropComponent(){  //вызывается когда компонент вызывается с новым объектом
        window.scrollTo(0,0);
        this.setState(this.initialState);
        this.getNewObjectsData();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.match.url !== this.props.match.url)//вызывается когда компонент вызывается с новым объектом
            this.dropComponent();

        if(prevState.data !== this.state.data)
            this.requestIsEnded();

        if(prevState.comparison_mode !== this.state.comparison_mode)
            this.comparisonGraphHandler();
    }


    componentDidMount(){
        if(this.props.location.params && this.props.location.params.obj){ //если начальные данные переданы с пропсов - идем 1м путем
            let obj = this.props.location.params.obj;
            this.fillInitialObjectData(obj);
        }
        else{   //если данных в пропсах не обнаружено - парсим их с API
            this.getNewObjectsData()
        }

        window.onresize = () => this.setState({viewportWidth:window.innerWidth});//при изменении размера экрана - перезаписываем ширину вьюпорта в стейт
        addSpecificStyles();
    }

    componentWillUnmount(){
        removeSpecificStyles();
        window.onresize = () => {};
    }

    render(){
        let state = this.state;
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
                    <ShopList
                        shops={this.state.shops}
                        city={this.state.object.city_id}
                    />
                    :
                    <ShopListAccordeon
                        shops={this.state.shops}
                        city={this.state.object.city_id}
                    />
                }
            </div>
        )
    }
};

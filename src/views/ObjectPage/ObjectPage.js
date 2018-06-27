import React, { Component } from 'react';
import {API} from 'Src/utils/api_paths';
import moment from 'moment';
import {ajaxRequest,average} from 'Src/utils/utils';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import Announce from './Announce';
import BarChart from './BarChart';
import HorizontalBarChart from './HorizontalBarChart';
import utils from './obj_utils';
import DataPerMonth from './DataPerMonth';
import ShopList from './ShopList';
import ShopListAccordeon from './ShopListAccordeon';
import MainData from './MainData';
import CameraViewer from './CameraViewer';
import SalesAnalysis from './SalesAnalysis';


export default class ObjectPage extends Component {
    constructor(props) {
        super(props);

        utils.localizeMoment();//локализация библиотеки moment

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
        utils.getNewStyleForChart(typeArr,this.state.chart);
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
                let obj = data.find( object => +id === object.id);  //поиск объекта по id
                let typeArr = obj.data_type.split(', ');//разбиваем строку с типом данных на массив
                utils.getNewStyleForChart(typeArr,this.state.chart);
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
             floorID = utils.returnFloorID(this.state);
        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
        this.requestIsStarted();
        ajaxRequest(url)
            .then(data => {
                let [chartObj,values,dates] = [ Object.assign({},this.state.chart), [], [] ] ;
                data.floorData.forEach(item => {
                    values.push(item.VALUE);
                    dates.push(item.THEDATE);
                });
                if(!dates.length){
                    this.setState({emptyData:true});
                    this.requestIsEnded();
                    return;
                }
                values = [parseInt(average(values)) , ...values, parseInt(average(values))];
                dates = utils.formatDatesForChart(dates);
                let styleValues = [NaN,...values.slice(1, values.length-1 ),NaN];

                [ chartObj.datasets[0].data, chartObj.datasets[1].data, chartObj.labels ] = [values,styleValues,dates];

                this.setState({
                    averageHoursData:data,
                    excelData:data.floorData,
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
        let [unit,chart,floorID] = [this.state.timeSegment, this.state.chart, utils.returnFloorID(this.state)];

        this.requestIsStarted();
        Promise.all(chart.datasets.map( (item,i) => {
            if( i % 2 )return null; //делаем запросы только по четным индексам, так как на один график у нас 2 элемента в массиве
            let year = item.year || 2018;

            let [startDate, endDate] = [year + this.state.startDate.format("MMDD"), year + this.state.endDate.format("MMDD")];
            let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;

            return ajaxRequest(url)
                .then( data => data)
                .catch( err => console.log(err))
        }))
            .then(arr => arr.filter(item => item !== null))//фильтруем массив от null значений
            .then(data => {

                let newChart = utils.returnFormattedChart(data,this.state);

                this.setState({
                    chart:newChart,
                    emptyData:false,
                    excelData:utils.formatDataForExcelInCMode(data)
                }, () => {
                    this.requestIsEnded();
                });
            })
    }


    comparisonGraphHandler(){
        if(this.state.comparison_mode){
            if( this.state.startDate.year() === moment().year() ){  //если диапозон дат в пределах текущего года
                this.enableComparisonMode()
            }
            else{
                this.setState({ //если нет, возвращаем диапозон в дефолтное значение и потом включаем режим сравнения
                    startDate: moment().add(-7,'days'),
                    endDate: moment()
                }, () => {
                    this.getFloorsData();
                    this.enableComparisonMode();
                })
            }
        }
        else
            this.disableComparisonMode();
    }
    
    addComparisonGraph(year){   //добавление нового графика в диаграмму
        if(!this.state.floors)return null;
        let [startDate, endDate] = [year + this.state.startDate.format("MMDD"),year +  this.state.endDate.format("MMDD")],
            unit = this.state.timeSegment,
            floorID = utils.returnFloorID(this.state),
            newExcel;

        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
        ajaxRequest(url)
            .then(data => {
                if(!this.state.comparison_mode)return null;//если данные придут в момент когда РС уже выключен
                data = utils.replaceOmissionsWithNulls(data,this.state,year);//заменяем пропуски данных нулями чтобы не разрушать структуру графика
                data = utils.checkLeapYear(data); //если високосный год - удаляем 29 февраля из выдачи, чтобы не мешать сравнению

                let chartObj = Object.assign({},this.state.chart),
                    values = data.floorData.map(item => item.VALUE),
                    dates = data.floorData.map(item => item.THEDATE),
                    styleValues = [];

                if(values.length){
                    dates = utils.formatDatesForChart(dates);
                    values = utils.returnValuesWithAverageInCMode(values,data,this.state);
                    styleValues= utils.returnStyleValuesInCMode(values,data,this.state)
                }

                if(!this.state.chart.datasets.length)chartObj.labels = dates;// если график пуст - обновить шкалу с датами

                let newDataset = utils.createNewDataset(year);    //создание нового графика
                [newDataset[0].data, newDataset[1].data] = [values,styleValues];//присвоение данных новому графику
                chartObj.datasets.push(...newDataset);//добавление графика

                newExcel = utils.changeExcelData(this.state.excelData, data);//форматируем данные для выгрузки в Excel

                this.setState({
                    chart:chartObj,
                    emptyData:false,
                    excelData: newExcel
                });
            })
            .catch(err => console.log(err))
    }

    removeComparisonGraph(year){ //удаление графика из диаграммы
        let chart = this.state.chart,
            excel = this.state.excelData;

        let removalIndexes = utils.findRemovalIndexes(chart,year);//присвоение индексов на удаление
        chart.datasets = chart.datasets.filter((item,index) => !removalIndexes.some(i => index === i));//фильтрация массива по индексам
        excel = excel.filter(item => item[0] && moment(item[0].THEDATE).year() !== year);//также фильтруем данные выгрузки Excel

        if(!chart.datasets.length)
            this.setState({emptyData:true,excelData:[]});
        else
            this.setState({chart:chart, excelData:excel});
    }

    enableComparisonMode(){
        this.changeStyleOfFirstGraph();
        this.addComparisonGraph(2017);
    }

    disableComparisonMode(){    //выход из режима сравнения
        let initialChart = Object.assign({},this.initialChart);
        let obj = this.state.object;
        if(!obj)return;
        initialChart = utils.getNewStyleForChart( obj.data_type.split(', '), initialChart);
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
        let newDataset = utils.createNewDataset(2018);//создание массива новых стилизованных графиков

        [newDataset[0].data,newDataset[1].data] = [firstGraphData,secondGraphData];//присвоение данных в новый массив
        [chart.datasets[0],chart.datasets[1]] = [newDataset[0],newDataset[1]];
        this.setState({chart:chart});
    }

    getMonthlyDataPerYear(){
        if(!this.state.floors)return null;
        let floorID = utils.returnFloorID(this.state);
        let [startDate, endDate] = [ moment().add(-11,'months').format("YYYYMMDD"), moment().format("YYYYMMDD") ];

        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=M`;
        ajaxRequest(url)
            .then(data => {
                let newArr = data.floorData.map(item => {
                    let obj = {};
                    obj.value = Math.round(item.VALUE);
                    [obj.month, obj.year] = [moment(item.THEDATE).month(), moment(item.THEDATE).year()];
                    return obj
                })
                    .reverse();
                this.setState({monthlyData:newArr})
            })
            .catch(err => console.log(err))
    }

    getDataForABCAnalysis(){
        let [startDate, endDate] = [ this.state.startDate.format("YYYYMMDD"), this.state.endDate.format("YYYYMMDD") ];
        let url = `${API.abcAnalysis}?trcId=${this.props.match.params.id}&sDate=${startDate}&eDate=${endDate}`;
        ajaxRequest(url)
            .then(data => this.setState({analyseData:data}))
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

    changeFloor(e){
        this.requestIsStarted();
        this.setState({floorIndex:+e.target.dataset.id},() => this.getFloorsData())
    }

    changeTimeSegment(e){
        this.requestIsStarted();
        this.setState({timeSegment:e.target.dataset.val},() => this.getFloorsData())
    }

    checkYear(year,e){
        if(this.state.requestIsInProcess)return;
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

    handleChangeStart(date) { //функции-обработчики смены дат в datepickers
        if(this.state.endDate - date < 0)return false;
        let newSegment = utils.trackActualSegments(date,this.state.endDate,this.state.timeSegment);
        this.setState(
            {startDate: date,timeSegment:newSegment},
            () => this.getFloorsData()
        );
    }

    handleChangeEnd(date) {
        if(date - this.state.startDate < 0)return false;
        if(!this.state.comparison_mode && (date > moment()) )return false;
        let newSegment = utils.trackActualSegments(this.state.startDate,date,this.state.timeSegment);
        this.setState(
            {endDate: date,timeSegment:newSegment},
            () => this.getFloorsData()
        );
    }

    handleMobileChangeStart(e){
        let newSegment = utils.trackActualSegments(moment(e.target.value),this.state.endDate,this.state.timeSegment);
        this.setState(
            {startDate: moment(e.target.value),timeSegment:newSegment},
            () => this.getFloorsData()
        );
    }

    handleMobileChangeEnd(e){
        let newSegment = utils.trackActualSegments(this.state.startDate,moment(e.target.value),this.state.timeSegment);
        this.setState(
            {endDate: moment(e.target.value),timeSegment:newSegment},
            () => this.getFloorsData()
        );
    }

    changeComparisonMode(){
        this.setState({comparison_mode:!this.state.comparison_mode});
    }

    requestIsStarted(){
        utils.addOpacityToChart();
        this.setState({requestIsInProcess:true})
    }

    requestIsEnded(){
        utils.removeOpacityFromChart();
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

        if(prevState.chart !== this.state.chart)
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
        utils.addSpecificStyles();
        utils.editDrawFunction();//добавляем в Chart.js возможность использования эллипса как формы
        this.getDataForABCAnalysis();
    }

    componentWillUnmount(){
        utils.removeSpecificStyles();
        window.onresize = () => {};
    }

    render(){
        let state = this.state;
        return (
            <div className={((state.type === 'Выручка') ? "revenue" : "trafic") + ' object_cont'}>
                <Announce
                    object={state.object}
                    images={state.images}
                    state={state}
                />
                {(state.viewportWidth > 1467) ?
                    <BarChart
                        render={!(state.type === 'Выручка')}
                        data={state.averageHoursData}
                    />
                    :
                    <HorizontalBarChart
                        render={!(state.type === 'Выручка')}
                        data={state.averageHoursData}
                    />
                }
                <DataPerMonth
                    type={state.type}
                    viewportWidth={state.viewportWidth}
                    monthlyData={state.monthlyData}
                    countAverageOfMonths={utils.countAverageOfMonths.bind(null,state.monthlyData)}
                    renderCurrency={utils.renderCurrency.bind(null,state)}
                />

                <MainData
                    changeComparisonMode={this.changeComparisonMode.bind(this)}
                    handleChangeStart={this.handleChangeStart.bind(this)}
                    handleChangeEnd={this.handleChangeEnd.bind(this)}
                    handleMobileChangeStart={this.handleMobileChangeStart.bind(this)}
                    handleMobileChangeEnd={this.handleMobileChangeEnd.bind(this)}
                    checkYear={this.checkYear.bind(this)}
                    changeFloor={this.changeFloor.bind(this)}
                    changeTimeSegment={this.changeTimeSegment.bind(this)}
                    {...state}
                />

                {(state.viewportWidth >= 1200) &&
                    <SalesAnalysis
                        data={state.analyseData}
                    />
                }

                {(state.viewportWidth > 500) ?
                    <ShopList
                        shops={state.shops}
                        city={state.object.city_id}
                    />
                    :
                    <ShopListAccordeon
                        shops={state.shops}
                        city={state.object.city_id}
                    />
                }

            </div>
        )
    }
};

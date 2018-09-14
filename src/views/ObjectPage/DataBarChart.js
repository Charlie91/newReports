import React, { Component } from 'react';
import {Bar,Chart} from "react-chartjs-2";
import ChartComponent from 'react-chartjs-2';
import { Row, Col, Card, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {customLabel} from './customtooltip';
import {formatNumberBySpaces} from './../../utils/utils';
import DatePicker from 'react-datepicker';
import ReactPicker from './custom_datepickers/ReactPicker';
import Select from 'react-select';
import YearSelector from './YearSelector';
import utils from './obj_utils';
import DataChart from './DataChart';
import moment from 'moment';
import {customLabelDataChart} from "./customLabelDataChart";
import customComparisonLabelDataChart from "./customComparisonLabelDataChart";
import {formatNumericValueWithMnl, getStepName, getStepSize, getStepTick,formatNumericValue} from "../../utils/utils";
import YearTable from './YearTable';
import xlsExport from './xls-export';
import addCustomTypeWithBorderRadiuses from './addCustomTypeWithBorderRadiuses';


function getFormat(timeSegment){
    let format;
    switch(timeSegment){
        case 'Y':
            format = 'YYYY';
            break;
        case 'M':
            format = 'YYYY-MM';
            break;
        case 'D':
            format = 'YYYY-MM-DD';
            break;
        case 'H':
            format = 'HH:mm T DD.MM.YYYY';
    }
    return format
}

function getNumberOfYears(width){
    let number;

    if(width < 1200 && width > 767)number = 2;
    else if(width < 768) number = 1;
    else number = 3;

    return number
}

function addEmptyBars(data, timeSegment) {
    let modificator = '';
    let values = data.datasets[0].data;

    switch(timeSegment){
        case 'Y':
            modificator = 'years';
            break;
        case 'M':
            modificator = 'months';
            break;
        case 'D':
            modificator = 'days';
            break;
        case 'H':
            modificator = 'hours';
            break;
        default:
            console.log('wtf with your timeSegment');
    }

    let averageValue = values.reduce((sum,current) => {//среднее значение в массиве
            return sum + current
        },0) / values.length;

    let limit = 31 - values.length;
    for(let i = 0; i < limit ; i++){
        values.push(averageValue);
        data.labels.push(
            moment(data.labels[data.labels.length - 1]).add(1,modificator).format(getFormat(timeSegment))
        )
    }
}

function getBarsColors(dataLength,labels,timeSegment){
    const defaultColorArray = [...'#74c2e8,'.repeat(dataLength).split(',').slice(0,-1)];
    let weekendIndexes = labels.reduce((indexes,item,index) => {
        if(moment(item).day() === 0 || moment(item).day() === 6){
            indexes.push(index)
        }
        return indexes
    },[]);

    if(timeSegment === 'D')
        defaultColorArray.forEach( (color,colorIndex) => {
            weekendIndexes.forEach( index => {
                if(colorIndex === index){
                    defaultColorArray[colorIndex] = '#9fd473'
                }
            })
        });

    return [...defaultColorArray,...'transparent,'.repeat(31 - dataLength).split(',').slice(0,-1)];
}

function getBordersColors(dataLength,labels,timeSegment){
    const defaultColorArray = [...'transparent,'.repeat(dataLength).split(',').slice(0,-1)];
    let weekendIndexes = labels.reduce((indexes,item,index) => {
        if(moment(item).day() === 0 || moment(item).day() === 6){
            indexes.push(index)
        }
        return indexes
    },[]);

    if(timeSegment === 'D')
        defaultColorArray.forEach( (color,colorIndex) => {
            weekendIndexes.forEach( index => {
                if(colorIndex === index){
                    defaultColorArray[colorIndex] = 'transparent'
                }
            })
        });

    return [...defaultColorArray,...'#979797ab,'.repeat(31 - dataLength).split(',').slice(0,-1)];
}

function addDashesToBorders(chart){
    if(chart){
        chart.chart_instance.chart.ctx.setLineDash([10, 10]);
    }
}


export default class DataBarChart extends Component{
    constructor(props){
        super(props);
        addCustomTypeWithBorderRadiuses();
    }

    componentDidUpdate(){
        addDashesToBorders(this.chart);
    }


    render(){

        const props = this.props;
        const xls = props.excelData && new xlsExport((props.excelData), 'Reports');//данные для выгрузки в таблицу

        const times = [
            { value:'H',label:'По часам',render:( (moment(props.startDate).diff(moment(props.endDate), 'days') > -14) && props.shortestUnit === 'H' )},
            { value:'D',label:'По дням',render:(props.startDate.format('YYYY-MM-DD') !== props.endDate.format('YYYY-MM-DD')) },
            { value:'M',label:'По месяцам',render:(props.startDate.format('YYYY-MM') !== props.endDate.format('YYYY-MM')) },
            { value:'Y',label:'По годам',render:(props.startDate.year() !== props.endDate.year()) }
        ].filter(item => item.render);

        if(props.floors){
            var arr = props.floors.map((item,i) => {
                return {
                    value:i,
                    label:item.name
                }
            })
        }
        let filteredData, max;
        filteredData = {
            datasets:props.data.datasets.filter((items,i) => i % 2 === 0).map(item => {
                let length = item.data.length - 2;
                if(length < 0 || length > 31) length = 0;
                return {
                    data:item.data.filter((value,i) => i && i !== item.data.length - 1 ),//удаляем мусорные элементы массива
                    label:item.label,
                    backgroundColor:getBarsColors(length,props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1),props.timeSegment),
                    borderColor:getBordersColors(length,props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1),props.timeSegment),
                    borderWidth: 1,
                    borderDash:[3,2]
                }
            }),
            labels:props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1 )//удаляем мусорные элементы массива
        };
        if(!props.comparison_mode){
            max = filteredData.datasets[0].data.reduce( (max,item) => {
                if(item > max)max = item;
                return max;
            },0);

            addEmptyBars(filteredData, props.timeSegment);//добавляем "пустые" графики
        }

        return (
            <Card className={"new-chart" + (props.likeForLikeDisplay ? ' comparisonOn' : '')}>
                <CardBody>
                    <div>
                        <h5>Трафик</h5>
                        <Row>
                            <Col md="9" className="datepickers">
                                <div className="wrapper">
                                  <ReactPicker {...props} />
                                </div>
                                {props.likeForLikeDisplay ?
                                    <div className="likeForLike" onClick={props.checkLike}>
                                        <div className={'checkbox' + (props.likeForLike ? ' checked' : '')}></div>
                                        <div className="text">like for like</div>
                                        <div className="question_icon">
                                            ?
                                            <div className="tip">
                                                Сравнение с аналогичным периодом в прошлом
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <YearSelector
                                        render={true}
                                        checkYear={props.checkYear}
                                        numberOfYearsAtList={getNumberOfYears(props.viewportWidth)}
                                        {...props}
                                    />
                                }
                            </Col>
                            {(props.viewportWidth > 767 && !props.comparison_mode && !props.likeForLike) ?
                                <Col md="3" className="totalSum">
                                <span className="data"
                                      dangerouslySetInnerHTML=
                                          {{
                                              __html:`${formatNumberBySpaces(formatNumericValue(Math.round(props.totalSum)))} ${utils.renderCurrency(props)}`
                                          }}
                                >
                                </span>
                                    <span className="muted">{(props.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                                </Col>
                                :
                                ''
                            }
                        </Row>
                        <Row>
                            <Col md="12">
                                <Select
                                    closeOnSelect={false}
                                    removeSelected={false}
                                    onChange={props.changeTimeSegment}
                                    options={times}
                                    placeholder="Выберите категории"
                                    simpleValue
                                    value={props.timeSegment}
                                    inputProps={{readOnly:true}}
                                />
                                <Select
                                    closeOnSelect={false}
                                    removeSelected={false}
                                    onChange={props.changeFloor}
                                    options={arr}
                                    placeholder="Выберите категории"
                                    simpleValue
                                    value={props.floorIndex}
                                    inputProps={{readOnly:true}}
                                />
                            </Col>
                            {props.viewportWidth < 768 ?
                                <Col xs="12" className="totalSum">
                                <span className="data"
                                      dangerouslySetInnerHTML=
                                          {{
                                              __html:`${formatNumberBySpaces(formatNumericValue(Math.round(props.totalSum)))} ${utils.renderCurrency(props)}`
                                          }}
                                >
                                </span>
                                    <span className="muted">{(props.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                                </Col>
                                :
                                ''
                            }
                        </Row>
                        <Row style={{overflow:'hidden'}}>
                            <Col className="scroll_wrapper">
                                {(props.comparison_mode || props.likeForLike || filteredData.datasets[0].data.length > 31) ?
                                    <div className="data-line-chart_wrapper">
                                        {
                                            props.requestIsInProcess ?
                                                <Loading/>
                                                :
                                                <div>
                                                    <YearTable
                                                        filteredData={filteredData}
                                                        {...props}
                                                    />
                                                    <DataChart
                                                        render={!(props.type === 'Выручка')}
                                                        comparison_mode={props.comparison_mode}
                                                        data={props.chart}
                                                        startDate={props.startDate}
                                                        endDate={props.endDate}
                                                        currency={props.currency}
                                                        timeSegment={props.timeSegment}
                                                        emptyData={props.emptyData}
                                                        {...props}
                                                    />
                                                </div>
                                        }
                                    </div>
                                    :
                                    <div className="data-bar-chart_wrapper">
                                        {props.requestIsInProcess ?
                                            <Loading/>
                                            :
                                            <ChartComponent
                                                data={filteredData}
                                                type='roundedBar'
                                                ref={(chart) => { this.chart = chart; }}
                                                options= {{
                                                    maintainAspectRatio: false,
                                                    legend: { display: false },
                                                    barRoundness: 0.8,
                                                    tooltips: {
                                                        custom:  props.comparison_mode ? customComparisonLabelDataChart : customLabelDataChart,//
                                                        enabled:false,
                                                        callbacks:{
                                                            title: (tooltipItem, data ) => {
                                                                let step = getStepSize(props.data.labels.length, props.timeSegment);
                                                                let title = '';

                                                                if (step !== 1){
                                                                    if (props.timeSegment === 'M')
                                                                        title = moment(tooltipItem[0].xLabel).format('MMM')
                                                                    if (props.timeSegment === 'D')
                                                                        title = moment(tooltipItem[0].xLabel).format('DD MMM')
                                                                    if (props.timeSegment === 'Y')
                                                                        title = moment(tooltipItem[0].xLabel).format('YYYY')
                                                                }

                                                                if (props.timeSegment === 'H')
                                                                    title = moment(tooltipItem[0].xLabel).format("HH:mm, DD MMM")

                                                                return title;
                                                            },
                                                            label: (tooltipItem, data ) => {
                                                                if(data.datasets[0].backgroundColor[tooltipItem.index] === 'transparent'){
                                                                    return null;
                                                                };

                                                                if(props.comparison_mode){
                                                                    return utils.comparisonLabel(tooltipItem,data)
                                                                }
                                                                else{
                                                                    return `
                                                      ${formatNumberBySpaces(Math.round(tooltipItem.yLabel))}
                                                      ${(props.currency.length > 4) ?
                                                                        (props.currency.substring(0,3) + '.') : props.currency}
                                                  `
                                                                }
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        xAxes: [{
                                                            barThickness : 20,
                                                            gridLines: {
                                                                color: "rgba(0, 0, 0, 0)",
                                                                borderDash: [4, 4],
                                                                zeroLineColor: 'rgba(0, 0, 0, 0)'
                                                            },
                                                            ticks: {
                                                                fontColor:'#7f8fa4',
                                                                fontSize: 14,
                                                                fontFamily: 'ProximaNova',
                                                                stepSize:123123,
                                                                maxRotation: 0,
                                                                callback: (value, index, values) => {
                                                                    let format = '';
                                                                    switch(props.timeSegment){
                                                                        case 'Y':
                                                                            format = 'YYYY';
                                                                            break;
                                                                        case 'M':
                                                                            format = 'MMM';
                                                                            break;
                                                                        case 'D':
                                                                            format = 'DD MMM';
                                                                            break;
                                                                        case 'H':
                                                                            format = 'DD.MM T HH:mm';
                                                                    }
                                                                    if(index % 2 === 0)
                                                                        return moment(value).format(format);
                                                                },
                                                            }
                                                        }],
                                                        yAxes: [{
                                                            ticks:{
                                                                min:0,
                                                                stepSize:max/2
                                                            },
                                                            gridLines: {
                                                                color: "rgba(0, 0, 0, 0)",
                                                                zeroLineColor: 'rgba(0, 0, 0, 0)',
                                                                borderDash: [4, 4]
                                                            },
                                                        }],
                                                    }

                                                }}
                                            />
                                        }
                                    </div>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='0' md="0" xl={{size:3,offset:9}}>
                                <div className="excellLinkWrapper">
                                    <a className="excellLink"
                                       onClick={xls ? () => {
                                           xls.exportToXLS(`Отчет по ${props.object.obj_name}-${moment().format('DD.MM.YY')}.xls`,props)
                                       } : ''}
                                    >
                                        Скачать в Excel
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

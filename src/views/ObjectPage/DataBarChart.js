import React, { Component } from 'react';
import {Bar,Chart} from "react-chartjs-2";
import { Row, Col, Card, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {customLabel} from './customtooltip';
import {formatNumberBySpaces} from './../../utils/utils';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import YearSelector from './YearSelector';
import utils from './obj_utils';
import DataChart from './DataChart';
import moment from 'moment';

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

let counter = 0;//счетчик выборов дат, нечетное - выбор начала даты, четное - конец
const DataBarChart = (props) => {
    if(props.floors){
        var arr = props.floors.map((item,i) => {
            return {
                value:i,
                label:item.name
            }
        })
    }
    let filteredData, max;
    if(!props.comparison_mode){
        filteredData = {
            datasets:props.data.datasets.filter((items,i) => i % 2 === 0).map(item => {
                let length = item.data.length - 2;
                if(length < 0 || length > 31) length = 0;
                    return {
                    data:item.data.filter((value,i) => i && i !== item.data.length - 1 ),//удаляем мусорные элементы массива
                    label:item.label,
                    backgroundColor:[...'#74c2e8,'.repeat(length).split(',').slice(0,-1),...'transparent,'.repeat(31 - length).split(',').slice(0,-1)],
                    borderColor:'#74c2e8',
                    borderWidth: 1,
                }
            }),
            labels:props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1 )//удаляем мусорные элементы массива
        };

        max = filteredData.datasets[0].data.reduce( (max,item) => {
            if(item > max)max = item;
            return max;
        },0);

        addEmptyBars(filteredData, props.timeSegment);//добавляем "пустые" графики
    }

    return (
        <Card className={"new-chart" + (props.comparison_mode ? ' comparisonOn' : '')}>
            <CardBody>
                <div>
                    <h5>Трафик</h5>
                    <Row>
                        <Col md="9" className="datepickers">
                            <div className="wrapper">
                                <div className="icon"></div>
                                <DatePicker
                                    className="datepicker"
                                    selected={props.startDate}
                                    startDate={props.startDate}
                                    endDate={props.endDate}
                                    shouldCloseOnSelect={false}
                                    selectsEnd={counter % 2 !== 0}//закрашивает диапазон только при выборе конечной даты
                                    dateFormat={
                                        props.comparison_mode ? "DD MMM YYYY" :
                                             (props.startDate.month() === props.endDate.month()) ?
                                                 'DD —' : "DD MMM"
                                    }
                                    onChange={(date) => {props.change(date,++counter)}}
                                    monthsShown={2}
                                />
                                <DatePicker
                                    className="datepicker"
                                    selected={(counter % 2 === 0) ? props.endDate : ''}
                                    startDate={props.startDate}
                                    endDate={props.endDate}
                                    shouldCloseOnSelect={false}
                                    selectsEnd={counter % 2 !== 0}//закрашивает диапазон только при выборе конечной даты
                                    dateFormat={ props.comparison_mode ? "— DD MMM YYYY" :
                                        (props.startDate.month() === props.endDate.month()) ?
                                            "DD MMM" : "— DD MMM" }
                                    onChange={(date) => {props.change(date,++counter)}}
                                    monthsShown={2}
                                />
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
                                    additional="г."
                                    {...props}
                                />
                            }
                        </Col>
                        <Col className="totalSum">
                            <span className="data"
                                  dangerouslySetInnerHTML=
                                      {{
                                          __html:`${formatNumberBySpaces(Math.round(props.totalSum))} ${utils.renderCurrency(props)}`
                                      }}
                            >
                            </span>
                            <span className="muted">{(props.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4">
                            <Select
                                closeOnSelect={false}
                                removeSelected={false}
                                onChange={props.changeTimeSegment}
                                options={[
                                    { value:'H',label:'По часам' },
                                    { value:'D',label:'По дням' },
                                    { value:'M',label:'По месяцам' },
                                    { value:'Y',label:'По годам' }
                                ]}
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
                    </Row>
                    <div className="data-bar-chart_wrapper">
                        {(props.comparison_mode || props.likeForLike || filteredData.datasets[0].data.length > 31) ?
                            <div>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td></td>
                                        <td>янв</td>
                                        <td>фев</td>
                                        <td>март</td>
                                        <td>апр</td>
                                        <td>май</td>
                                        <td>июнь</td>
                                        <td>июль</td>
                                        <td>авг</td>
                                        <td>сент</td>
                                        <td>окт</td>
                                        <td>ноя</td>
                                        <td>дек</td>
                                        <td className="total">Итого</td>
                                        <td className="forecast">Прогноз</td>
                                    </tr>
                                    <tr>
                                        <td>2017</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td className="total">149 932</td>
                                        <td className="forecast">149 932</td>
                                    </tr>
                                    <tr>
                                        <td>2018</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td>149 932</td>
                                        <td className="total">149 932</td>
                                        <td className="forecast">149 932</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <DataChart
                                    render={!(props.type === 'Выручка')}
                                    comparison_mode={props.comparison_mode}
                                    data={props.chart}
                                    startDate={props.startDate}
                                    endDate={props.endDate}
                                    currency={props.currency}
                                    timeSegment={props.timeSegment}
                                    emptyData={props.emptyData}
                                />
                            </div>
                            :
                            <Bar
                                data={filteredData}
                                options= {{
                                    maintainAspectRatio: false,
                                    legend: { display: false },
                                    scales: {
                                        xAxes: [{
                                            barThickness : 20,
                                            gridLines: {
                                                color: "rgba(0, 0, 0, 0)",
                                                borderDash: [4, 4],
                                                zeroLineColor: 'rgba(0, 0, 0, 0)'
                                            },

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
                </div>
            </CardBody>
        </Card>
    )
};

export default DataBarChart;

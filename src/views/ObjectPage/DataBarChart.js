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

    let filteredData = {
        datasets:props.data.datasets.filter((item,i) => i % 2 === 0).map(item => {
            return {
                data:item.data.filter((value,i) => i && i !== item.data.length - 1 ),//удаляем мусорные элементы массива
                label:item.label,
                backgroundColor:'#74c2e8'
            }
        }),
        labels:props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1 )//удаляем мусорные элементы массива
    };

    let max = filteredData.datasets[0].data.reduce( (max,item) => {
                 if(item > max)max = item;
                 return max;
    },0);

    return (
        <Card className="new-chart">
            <CardBody>
                <div>
                    <h5>Трафик</h5>
                    <Row>
                        <Col md="9" className="datepickers">
                            <div className="wrapper">
                                <DatePicker
                                    className="datepicker"
                                    selected={props.startDate}
                                    startDate={props.startDate}
                                    endDate={props.endDate}
                                    shouldCloseOnSelect={false}
                                    dateFormat={ props.comparison_mode ? "DD MMM YYYY —" : "DD MMM —" }
                                    onChange={(date) => {props.change(date,++counter)}}
                                />
                                <DatePicker
                                    className="datepicker"
                                    selected={props.endDate}
                                    startDate={props.startDate}
                                    endDate={props.endDate}
                                    shouldCloseOnSelect={false}
                                    dateFormat={ props.comparison_mode ? "DD MMM YYYY" : "DD MMM" }
                                    onChange={(date) => {props.change(date,++counter)}}
                                />
                            </div>
                            <YearSelector
                                render={true}
                                checkYear={props.checkYear}
                                additional="г."
                                {...props}
                            />

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
                    </div>
                </div>
            </CardBody>
        </Card>
    )
};

export default DataBarChart;

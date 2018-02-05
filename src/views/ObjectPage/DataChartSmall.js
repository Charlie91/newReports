import React, { Component } from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {customLabel} from './customtooltip';
import {formatNumberBySpaces} from './../../utils/utils';
import {customLabel3} from "./customtooltip3";
import {formatNumericValueWithMnl, getStepName, getStepSize, getStepTick} from "../../utils/utils";
import moment from "moment/moment";



function addAdditionalStylesToChart(chart) {
    if(chart.datasets.length > 1){
        chart.datasets[1].pointBorderWidth = 2.3;
        chart.datasets[1].pointHoverRadius = 3;
        chart.datasets[1].pointRadius = 2;
        chart.datasets[0].borderWidth = 2;
        chart.datasets[1].borderWidth = 2;
    }
    return chart;
}


const DataChartSmall = (props) => {
    let newChart = addAdditionalStylesToChart(props.data);
    return (
        <Col  md='12' style={{padding:'0px'}} className="order-12 order-md-1">
            {props.emptyData ? <p className="error-message">Отсутствуют данные</p> : ''}
            <div style={props.emptyData ? {display:'none'} : {}} className="line-chart-wrapper line-chart-wrapper_small">
                {(!newChart.datasets[0].data.length) ?
                    <Loading/>
                    :
                    <div className="linechart_area_wrapper_small">
                        <Line data={newChart}
                              options={{
                                  maintainAspectRatio: false,
                                  animation: {
                                      duration: 700,
                                  },
                                  legend: {
                                      display: false
                                  },
                                  tooltips: {
                                      custom: customLabel3,
                                      enabled:false,
                                      callbacks:{
                                          label: (tooltipItem, data ) => {
                                              return `${formatNumberBySpaces(Math.round(tooltipItem.yLabel))} ${props.currency.substring(0,3)}.`
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
                                                  unit: getStepTick(props.timeSegment),
                                                  unitStepSize: getStepSize(newChart.labels.length, props.timeSegment),
                                                  displayFormats: {
                                                      day: getStepName(props.timeSegment),
                                                  }
                                              },
                                              display: true,
                                              ticks: {
                                                  beginAtZero:false,
                                                  padding: 12,
                                                  fontColor:'#7f8fa4',
                                                  fontSize: 12,
                                                  fontFamily: 'ProximaNova',
                                                  callback: (value, index, values) => {
                                                      if (!moment(value).isValid()){
                                                          return '';
                                                      }

                                                      let side = ( (index === 0) || (index === (values.length -1)) );
                                                      let step = getStepSize(newChart.labels.length, props.timeSegment);
                                                      let len = Math.ceil(newChart.labels.length / step);
                                                      // if end
                                                      if(index === 0){
                                                          return ( side && (len - values.length) < 1 ) ? '' :
                                                              moment(value).format( getStepName(props.timeSegment) );
                                                      }
                                                      // if end
                                                      if(index === (values.length -1)){
                                                          return ( side && (len - values.length) < 2 ) ? '' :
                                                              moment(value).format( getStepName(props.timeSegment) );
                                                      }

                                                      return moment(value).format( getStepName(props.timeSegment) );
                                                  }
                                              },
                                              gridLines: {
                                                  drawBorder: true,
                                                  drawOnChartArea: false,
                                                  drawTicks:false
                                              }
                                          },
                                          {
                                              id: "main-x-axis2",
                                              gridLines: {
                                                  drawBorder: false,
                                                  drawOnChartArea: false,
                                                  drawTicks:false
                                              },
                                              type: "time",
                                              time: {
                                                  unit: getStepTick(props.timeSegment),
                                                  unitStepSize: getStepSize(newChart.labels.length, props.timeSegment),
                                                  displayFormats: {
                                                      day: "YYYY"
                                                  }
                                              },
                                              display: ( (props.startDate.format('YYYY') !== props.endDate.format('YYYY')) &&
                                                  ((props.timeSegment === 'D') || (props.timeSegment === 'M'))
                                              ),
                                              ticks: {
                                                  beginAtZero:false,
                                                  padding: 0,
                                                  fontColor:'#7f8fa4',
                                                  fontSize: 12,
                                                  fontFamily: 'ProximaNova',
                                                  callback: (value, index, values) => {
                                                      let side = ( (index === 0) || (index === (values.length -1)) );
                                                      let step = getStepSize(newChart.labels.length, props.timeSegment);
                                                      let len = Math.ceil(newChart.labels.length / step);

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
                                          ticks: {
                                              display: false,
                                              beginAtZero: true,
                                              padding: 0,

                                          },
                                          gridLines: {
                                              drawBorder: false,
                                              drawOnChartArea: false,
                                              drawTicks:false
                                          },
                                      }]
                                  }
                              }}
                        />
                    </div>
                }
            </div>
        </Col>
    );
};

export default DataChartSmall;
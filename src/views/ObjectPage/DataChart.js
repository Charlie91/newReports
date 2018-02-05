import React from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {formatNumberBySpaces} from './../../utils/utils';
import {customLabel2} from "./customtooltip2";
import {formatNumericValueWithMnl, getStepName, getStepSize, getStepTick} from "../../utils/utils";
import moment from "moment/moment";

const DataChart = (props) => (
    <Col  md='12' style={{padding:'0px'}} className="order-12 order-md-1">
        {props.emptyData ? <p className="error-message">Отсутствуют данные</p> : ''}
        <div style={props.emptyData ? {display:'none'} : {}} className="line-chart-wrapper">
            {(!props.data.datasets[0].data.length) ?
                <Loading/>
                :
                <div className="linechart_area_wrapper">
                    <Line data={props.data}
                          options={{
                              maintainAspectRatio: false,
                              animation: {
                                  duration: 700
                              },
                              legend: {
                                  display: false
                              },
                              tooltips: {
                                  custom: customLabel2,
                                  enabled:false,
                                  callbacks:{
                                      label: (tooltipItem, data ) => {
                                          let step = getStepSize(props.data.labels.length, props.timeSegment);
                                          if (step === 1){
                                              return `${formatNumberBySpaces(Math.round(tooltipItem.yLabel))} ${props.currency.substring(0,3)}.`
                                          } else {
                                              return `${formatNumberBySpaces(Math.round(tooltipItem.yLabel))} ${props.currency.substring(0,3)}. ` +
                                                  moment(tooltipItem.xLabel).format(' D MMM')
                                          }
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
                                              unitStepSize: getStepSize(props.data.labels.length, props.timeSegment),
                                              displayFormats: {
                                                  day: getStepName(props.timeSegment),
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
                                                  let step = getStepSize(props.data.labels.length, props.timeSegment);
                                                  let len = Math.ceil(props.data.labels.length / step);
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
                                              unit: getStepTick(props.timeSegment),
                                              unitStepSize: getStepSize(props.data.labels.length, props.timeSegment),
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
                                              fontSize: 14,
                                              fontFamily: 'ProximaNova',
                                              callback: (value, index, values) => {
                                                  let side = ( (index === 0) || (index === (values.length -1)) );
                                                  let step = getStepSize(props.data.labels.length, props.timeSegment);
                                                  let len = Math.ceil(props.data.labels.length / step);

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
        </div>
    </Col>
);

export default DataChart;
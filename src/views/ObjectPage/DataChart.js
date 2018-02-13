import React from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {formatNumberBySpaces} from './../../utils/utils';
import {customLabelDataChart} from "./customLabelDataChart";
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
                                  custom: customLabelDataChart,
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
                                          return `
                                              ${formatNumberBySpaces(Math.round(tooltipItem.yLabel))}
                                              ${(props.currency.length > 4) ?
                                              (props.currency.substring(0,3) + '.') : props.currency}
                                          `
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
                                                  month: getStepName(props.timeSegment)
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


                                                  let month_en = value.replace(/[^a-z]/gi, '');
                                                  if(month_en.length > 2){
                                                      let month_ru =  moment().locale('en').month(month_en).locale('ru').format('MMM');
                                                      value = value.replace(month_en, month_ru).replace(/^(\S+) (\d+)(.*)$/, '$2 $1$3');
                                                  }


                                                  let side = ( (index === 0) || (index === (values.length -1)) );
                                                  let step = getStepSize(props.data.labels.length, props.timeSegment);
                                                  let len = Math.ceil(props.data.labels.length / step);


                                                  // first
                                                  if(index === 0)
                                                      return ( side && (len - values.length) < 1 ) ? '' : value;
                                                  // last
                                                  if(index === (values.length -1))
                                                      return ( side && (len - values.length) < 2 ) ? '' : value;

                                                  return value;
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

                                                  value = value.replace(/[^0-9]/gi, '');


                                                  if(index === 0){
                                                      return ( side && (len - values.length) < 1 ) ? '' : value;
                                                  }

                                                  if(index === (values.length -1)){
                                                      return ( side && (len - values.length) < 2 ) ? '' : value;
                                                  }

                                                  return value;
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
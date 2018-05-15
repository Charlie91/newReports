import React, { Component } from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {customLabelDataChartSmall} from './customLabelDataChartSmall';
import customComparisonLabelDataChart from "./customComparisonLabelDataChart";
import {formatNumberBySpaces} from './../../utils/utils';
import {customLabel3} from "./customLabelDataChartSmall";
import {formatNumericValueWithMnl, getStepName, getStepSize, getStepSizeSmall, getStepTick} from "../../utils/utils";
import moment from "moment/moment";
import utils from './obj_utils';



function addAdditionalStylesToChart(chart){ //изменение стилей в зависимости от кол-ва знач-й выводящихся графиком
    let maxLength = Math.max.apply(null,chart.datasets.map(item => item.data.length));
    if(chart.datasets.length > 1){
        if(maxLength > 200){
            for(let i = 0; i < chart.datasets.length; i++){
                if( i % 2 !== 0 ){
                    chart.datasets[i].pointBorderWidth = 1;
                    chart.datasets[i].pointHoverRadius = 3;
                    chart.datasets[i].pointRadius = 1;
                }
            }
        }
        else{
            for(let i = 0; i < chart.datasets.length; i++){
                if( i % 2 !== 0 ){
                    chart.datasets[i].pointBorderWidth = 2.3;
                    chart.datasets[i].pointHoverRadius = 4;
                    chart.datasets[i].pointRadius = 3;
                    chart.datasets[i].borderWidth = 2;
                }
            }
        }
    }
    return chart;
}



const DataChartSmall = (props) => {
    let newChart = addAdditionalStylesToChart(props.data);//изменение стилей в зависимости от кол-ва знач-й выводящихся графиком
    return (
        <Col  md='12' style={{padding:'0px',minWidth:'100%'}} className="order-12 order-md-1">
            {props.emptyData ? <p className="error-message">Отсутствуют данные</p> : ''}
            <div style={props.emptyData ? {display:'none'} : {}} className="line-chart-wrapper line-chart-wrapper_small">
                {( !props.data.datasets.length || !newChart.datasets[0].data.length) ?
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
                                      custom: props.comparison_mode ? customComparisonLabelDataChart : customLabelDataChartSmall,
                                      enabled:false,
                                      callbacks:{
                                          title: (tooltipItem, data ) => {
                                              let step = getStepSizeSmall(props.data.labels.length, props.timeSegment);
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
                                              if(props.comparison_mode){
                                                  return utils.comparisonLabel(tooltipItem,data)
                                              }
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
                                                  unitStepSize: getStepSizeSmall(newChart.labels.length, props.timeSegment),
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
                                                  fontSize: 12,
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
                                                  unitStepSize: getStepSizeSmall(newChart.labels.length, props.timeSegment),
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
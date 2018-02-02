import React, { Component } from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {customLabel} from './customtooltip';
import {formatNumberBySpaces} from './../../utils/utils';
import {customLabel2} from "./customtooltip2";
import {formatNumericValueWithMnl, getStepName, getStepSize, getStepTick} from "../../utils/utils";
import moment from "moment/moment";

export default class DataChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            chart :{
                labels: [],
                datasets: [{
                    data: []
                }]
            },
            startDate: null,
            endDate: null,
            currency: null,
            timeSegment: null,
            emptyData: null

        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data)
            this.setState({chart: nextProps.data});

        if (nextProps.startDate)
            this.setState({startDate: nextProps.startDate});

        if (nextProps.endDate)
            this.setState({endDate: nextProps.endDate});

        if (nextProps.currency)
            this.setState({currency: nextProps.currency});

        if (nextProps.timeSegment)
            this.setState({timeSegment: nextProps.timeSegment});

        if (nextProps.emptyData)
            this.setState({emptyData: nextProps.emptyData});

    }

    render(){
        return (
            <Col  md='12' style={{padding:'0px'}} className="order-12 order-md-1">
        {this.state.emptyData ? <p className="error-message">Отсутствуют данные</p> : ''}
        <div style={this.state.emptyData ? {display:'none'} : {}} className="line-chart-wrapper">
            {(!this.state.chart.datasets[0].data.length) ?
                <Loading/>
                :
                <div className="linechart_area_wrapper">
                    <Line data={this.state.chart}
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
                                          let step = getStepSize(this.state.chart.labels.length, this.state.timeSegment);
                                          if (step === 1){
                                              return `${formatNumberBySpaces(Math.round(tooltipItem.yLabel))} ${this.state.currency.substring(0,3)}.`
                                          } else {
                                              return `${formatNumberBySpaces(Math.round(tooltipItem.yLabel))} ${this.state.currency.substring(0,3)}. ` +
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
                                              unit: getStepTick(this.state.timeSegment),
                                              unitStepSize: getStepSize(this.state.chart.labels.length, this.state.timeSegment),
                                              displayFormats: {
                                                  day: getStepName(this.state.timeSegment),
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
                                                  let step = getStepSize(this.state.chart.labels.length, this.state.timeSegment);
                                                  let len = Math.ceil(this.state.chart.labels.length / step);
                                                  // if end
                                                  if(index === 0){
                                                      return ( side && (len - values.length) < 1 ) ? '' :
                                                          moment(value).format( getStepName(this.state.timeSegment) );
                                                  }
                                                  // if end
                                                  if(index === (values.length -1)){
                                                      return ( side && (len - values.length) < 2 ) ? '' :
                                                          moment(value).format( getStepName(this.state.timeSegment) );
                                                  }

                                                  return moment(value).format( getStepName(this.state.timeSegment) );
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
                                              unit: getStepTick(this.state.timeSegment),
                                              unitStepSize: getStepSize(this.state.chart.labels.length, this.state.timeSegment),
                                              displayFormats: {
                                                  day: "YYYY"
                                              }
                                          },
                                          display: ( (this.state.startDate.format('YYYY') !== this.state.endDate.format('YYYY')) &&
                                              ((this.state.timeSegment === 'D') || (this.state.timeSegment === 'M'))
                                          ),
                                          ticks: {
                                              beginAtZero:false,
                                              padding: 0,
                                              fontColor:'#7f8fa4',
                                              fontSize: 14,
                                              fontFamily: 'ProximaNova',
                                              callback: (value, index, values) => {
                                                  let side = ( (index === 0) || (index === (values.length -1)) );
                                                  let step = getStepSize(this.state.chart.labels.length, this.state.timeSegment);
                                                  let len = Math.ceil(this.state.chart.labels.length / step);

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
        )
    }

}
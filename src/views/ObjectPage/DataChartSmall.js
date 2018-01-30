import React, { Component } from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {customLabel} from './customtooltip';
import {formatNumberBySpaces} from './../../utils/utils';
import {customLabel2} from "./customtooltip2";
import {formatNumericValueWithMnl, getStepName, getStepSize, getStepTick} from "../../utils/utils";
import moment from "moment/moment";

export default class DataChartSmall extends Component {
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
            this.setChartWithDataSet(nextProps.data);

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


    setChartWithDataSet(chart){
        chart.datasets[1].pointBorderWidth = 2.3;
        chart.datasets[1].pointHoverRadius = 3;
        chart.datasets[1].pointRadius = 2;
        chart.datasets[0].borderWidth = 2;
        chart.datasets[1].borderWidth = 2;
        this.setState({chart: chart});
    }

    render(){
        return (

            <Col  md='12' style={{padding:'0px'}} className="order-12 order-md-1">
        {this.state.emptyData ? <p className="error-message">Отсутствуют данные</p> : ''}
        <div style={this.state.emptyData ? {display:'none'} : {}} className="line-chart-wrapper line-chart-wrapper_small">
            {(!this.state.chart.datasets[0].data.length) ?
                <Loading/>
                :
                <div className="linechart_area_wrapper_small">
                    <Line data={this.state.chart}
                          options={{
                              maintainAspectRatio: false,
                              animation: {
                                  duration: 700,
                              },
                              legend: {
                                  display: false
                              },
                              tooltips: {
                                  custom: customLabel2,
                                  enabled:false,
                                  callbacks:{
                                      label: (tooltipItem, data ) => {
                                          return `${formatNumberBySpaces(Math.round(tooltipItem.yLabel))} ${this.state.currency.substring(0,3)}.`
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
                                              fontSize: 12,
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
                                              fontSize: 12,
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
        )
    }

}
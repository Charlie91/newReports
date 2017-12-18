import React, { Component } from 'react';
import {Bar, Line} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";

export default class BarChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            bars : [
                {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderWidth: 10,
                            radius:14,
                            barBorderRadius: 10,
                            hoverBorderWidth: 13,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }
                    ]
                },
                {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: 'transparent',
                            borderWidth: 1,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }
                    ]
                },
                {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: 'transparent',
                            borderWidth: 1,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }
                    ]
                },
                {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: 'transparent',
                            borderWidth: 1,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }
                    ]
                },
                {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: 'transparent',
                            borderWidth: 1,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }
                    ]
                },
                {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: 'transparent',
                            borderWidth: 1,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }
                    ]
                },
                {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: 'transparent',
                            borderWidth: 1,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }
                    ]
                }]
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.data) {
            let bars = this.state.bars;
            nextProps.data.weekAvg.forEach((item, i) => {
                if (i < 8) {
                    bars[0].labels.push(item.ld + '-' + item.td);
                    bars[0].datasets[0].data.push(item.avg);
                }
                else if (i < 16) {
                    bars[1].labels.push(item.ld + '-' + item.td);
                    bars[1].datasets[0].data.push(item.avg);
                }
                else if (i < 24) {
                    bars[2].labels.push(item.ld + '-' + item.td);
                    bars[2].datasets[0].data.push(item.avg);
                }
                else if (i < 32) {
                    bars[3].labels.push(item.ld + '-' + item.td);
                    bars[3].datasets[0].data.push(item.avg);
                }
                else if (i < 40) {
                    bars[4].labels.push(item.ld + '-' + item.td);
                    bars[4].datasets[0].data.push(item.avg);
                }
                else if (i < 48) {
                    bars[5].labels.push(item.ld + '-' + item.td);
                    bars[5].datasets[0].data.push(item.avg);
                }
                else {
                    bars[6].labels.push(item.ld + '-' + item.td);
                    bars[6].datasets[0].data.push(item.avg);
                }
            });
            this.setState({bars: bars,test:1});
            console.log(bars);
        }
    }

    render(){
        return (
            <Card className="average_hours">
                <CardBody>
                    <h4>Средняя посещаемость по часам</h4>
                    {
                        this.state.bars.map((item,i) =>{
                                if(i === 0)
                                    return (
                                        <div key={i} className="chart-wrapper" style={{display:'inline-block',maxWidth:'14.2%',height:'212px',position:'relative',top:'6px',padding:'0px 15px'}}>
                                            <Bar data={item}
                                                 options={{
                                                     maintainAspectRatio: false,
                                                     legend:{
                                                         display:false,
                                                     },
                                                     scales: {
                                                         display:false,
                                                         xAxes: [{
                                                             display:false,
                                                             gridLines: {
                                                                 color: "rgba(0, 0, 0, 0)",
                                                                 display:false
                                                             }
                                                         }],
                                                         yAxes: [{
                                                             ticks: {

                                                                 beginAtZero: true,
                                                                 steps: 10,
                                                                 stepValue: 5,
                                                             },
                                                             gridLines: {
                                                                 color: "rgba(0, 0, 0, 0.05)",
                                                             },
                                                         }]
                                                     }
                                                 }}
                                            />
                                        </div>
                                    );
                                else
                                    return(
                                        <div key={i} className="chart-wrapper" style={{display:'inline-block',maxWidth:'14.2%',height:'200px',padding:'0px 15px'}}>
                                            <Bar data={item}
                                                 options={{
                                                     maintainAspectRatio: false,
                                                     legend:{
                                                         display:false,
                                                     },
                                                     scales: {
                                                         display:false,
                                                         xAxes: [{
                                                             display:false,
                                                             gridLines: {
                                                                 color: "rgba(0, 0, 0, 0)",
                                                                 display:false
                                                             }
                                                         }],
                                                         yAxes: [{
                                                             ticks: {
                                                                 display: false,
                                                                 beginAtZero: true,
                                                                 steps: 10,
                                                                 stepValue: 5,
                                                             },
                                                             gridLines: {
                                                                 color: "rgba(0, 0, 0, 0.05)",
                                                             },
                                                         }]
                                                     }
                                                 }}
                                            />
                                        </div>
                                    );
                            }
                        )}
                </CardBody>
            </Card>
        )
    }

}
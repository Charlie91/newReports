import React, { Component } from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import {addBorderRadiuses} from './draws.js';



export default class BarChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            bars:[],
            maxValue : 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            console.log(nextProps.data);
            let bars = [];
            let maxVal = 0;
            for(let i = 0;i < 7;i++){
                if(!i){
                    let firstChartPrototype = {
                        labels:[],
                        datasets:[{
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderWidth: 10,
                            radius:14,
                            barBorderRadius: 10,
                            hoverBorderWidth: 13,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }]
                    };
                    bars.push(firstChartPrototype);
                }
                else{
                    let otherChartsPrototype = {
                        labels:[],
                        datasets:[{
                            backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            borderColor: 'transparent',
                            borderWidth: 1,
                            hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                            data: []
                        }]
                    };
                    bars.push(otherChartsPrototype);
                }
            };

            nextProps.data.weekAvg.forEach((item, i) => {
                bars[Math.floor(i/8)].labels.push(item.ld + '-' + item.td);
                bars[Math.floor(i/8)].datasets[0].data.push(Math.round(item.avg));
                if(item.avg > maxVal)maxVal = Math.round(item.avg);
            });
            this.setState({bars: bars,maxVal:(Math.ceil(maxVal/10) * 10)});
        }
    }



    componentDidUpdate(){       //добавляем border-radius'ы в график
        addBorderRadiuses();
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
                                                     ref={(chart) => { this.chart = chart; }}
                                                     options={{
                                                         maintainAspectRatio: false,
                                                         legend:{
                                                             display:false,
                                                         },
                                                         title:{
                                                             display:false,
                                                             text:'Понедельник',
                                                             position:'bottom'
                                                         },
                                                         tooltips: {
                                                             enabled:true,
                                                             backgroundColor:'#eff3f6',
                                                             bodyFontColor:'#354052',
                                                             titleFontColor:'#354052',
                                                             titleFontStyle:'normal',
                                                             displayColors:false,
                                                             callbacks:{
                                                                 label:function(tooltipItem, data	){
                                                                     return `${tooltipItem.yLabel} чел.`
                                                                 }
                                                             }
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
                                                                     max: this.state.maxVal,
                                                                     beginAtZero: true,
                                                                     steps: 10,
                                                                     stepValue: 5,
                                                                 },
                                                                 gridLines: {
                                                                     color: "rgba(0, 0, 0, 0.05)",
                                                                     drawBorder: false
                                                                 },
                                                             }]
                                                         }
                                                     }}
                                                />
                                                <div className="title">Понедельник</div>
                                            </div>
                                    );
                                else
                                    return(
                                            <div key={i} className="chart-wrapper" style={{display:'inline-block',maxWidth:'14.2%',height:'200px',padding:'0px 15px'}}>
                                                <Bar data={item}
                                                     ref={(chart) => { this.chart = chart; }}
                                                     options={{
                                                         maintainAspectRatio: false,
                                                         legend:{
                                                             display:false,
                                                         },
                                                         title:{
                                                             display:false,
                                                             text:'Понедельник',
                                                             position:'bottom'
                                                         },
                                                         tooltips: {
                                                             backgroundColor:'#eff3f6',
                                                             bodyFontColor:'#354052',
                                                             titleFontColor:'#354052',
                                                             titleFontStyle:'normal',
                                                             displayColors:false,
                                                             callbacks:{
                                                                 label:function(tooltipItem, data	){
                                                                     return `${tooltipItem.yLabel} чел.`
                                                                 }
                                                             }
                                                         },
                                                         scales: {
                                                             display:false,
                                                             xAxes: [{
                                                                 display:false,
                                                                 gridLines: {
                                                                     color: "rgba(0, 0, 0, 0)",
                                                                     display:false,
                                                                     drawBorder: true
                                                                 }
                                                             }],
                                                             yAxes: [{
                                                                 ticks: {
                                                                     max: this.state.maxVal,
                                                                     display: false,
                                                                     beginAtZero: true,
                                                                     steps: 10,
                                                                     stepValue: 5,
                                                                 },
                                                                 gridLines: {
                                                                     color: "rgba(0, 0, 0, 0.05)",
                                                                     drawBorder: false
                                                                 },
                                                             }]
                                                         }
                                                     }}
                                                />
                                                <div className="title">{['Понедельник','Вторник',"Среда","Четверг","Пятница","Суббота","Воскресенье"][i]}</div>
                                            </div>
                                    );
                            }
                        )}
                </CardBody>
            </Card>
        )
    }

}
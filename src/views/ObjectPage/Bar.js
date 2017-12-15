import React from 'react';
import {Bar, Line} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";

export default function BarChart(props){


    let bar = [{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    }];

    if(props.data){
        bar = [
            {
                labels: [],
                datasets: [
                    {
                        label: 'Понедельник',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            },
            {
                labels: [],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            },
            {
                labels: [],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            },
            {
                labels: [],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            },
            {
                labels: [],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            },
            {
                labels: [],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            },
            {
                labels: [],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            }];

        props.data.weekAvg.forEach( (item,i) => {
            if(i < 8){
                bar[0].labels.push(item.ld + '-' + item.td);
                bar[0].datasets[0].data.push(item.avg);
            }
            else if(i < 16){
                bar[1].labels.push(item.ld + '-' + item.td);
                bar[1].datasets[0].data.push(item.avg);
            }
            else if(i < 24){
                bar[2].labels.push(item.ld + '-' + item.td);
                bar[2].datasets[0].data.push(item.avg);
            }
            else if(i < 32){
                bar[3].labels.push(item.ld + '-' + item.td);
                bar[3].datasets[0].data.push(item.avg);
            }
            else if(i < 40){
                bar[4].labels.push(item.ld + '-' + item.td);
                bar[4].datasets[0].data.push(item.avg);
            }
            else if(i < 48){
                bar[5].labels.push(item.ld + '-' + item.td);
                bar[5].datasets[0].data.push(item.avg);
            }
            else{
                bar[6].labels.push(item.ld + '-' + item.td);
                bar[6].datasets[0].data.push(item.avg);
            }
        });
        console.log(bar)
    }



    return (
        <Card className="average_hours">
            <CardBody>
                <h4>Средняя посещаемость по часам</h4>
                {bar.map((item,i) =>{
                    if(i === 0)
                        return (
                            <div key={i} className="chart-wrapper" style={{display:'inline-block',maxWidth:'14.2%',height:'212px',position:'relative',top:'6px'}}>
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
                                                     max: 100
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
                            <div key={i} className="chart-wrapper" style={{display:'inline-block',maxWidth:'14.2%',height:'200px'}}>
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
                                                     max: 100
                                                 },
                                                 gridLines: {
                                                     color: "rgba(0, 0, 0, 0.05)",
                                                 },
                                             }]
                                         }
                                     }}
                                />
                            </div>
                        )
                }

                )}


            </CardBody>
        </Card>
    )
}
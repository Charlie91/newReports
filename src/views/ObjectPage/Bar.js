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
        
    }



    return (
        <Card className="average_hours">
            <CardBody>
                <h4>Средняя посещаемость по часам</h4>
                <div className="chart-wrapper" style={{display:'inline-block',maxWidth:'400px'}}>
                    <Bar data={bar[0]}
                         options={{
                             maintainAspectRatio: false
                         }}
                    />
                </div>
            </CardBody>
        </Card>
    )
}
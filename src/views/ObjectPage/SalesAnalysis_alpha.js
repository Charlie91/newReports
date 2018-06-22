import React from 'react';
import utils from './obj_utils';
import {Scatter,Chart} from "react-chartjs-2";
import {Card, CardBody, Row, Col} from "reactstrap";
import {customLabelDataChart} from './customLabelDataChart';

let pointBackgroundColors = [];

const data = {
    labels: ['Scatter'],
    datasets: [
        {
            label: 'My First dataset',
            fill: true,
            pointBackgroundColor: [],  //['#e07c94','#f6aa26',"#9fd572"],
            pointRadius: 6,
            pointHoverRadius: 6,
            data: []
        }
    ]
};

function replaceOnXY(data){
    data.forEach(item => {
        if(!item.k && !item.share)
            item.x = 0.01;//фикс нулевых значений, которые не отображаются на графике
        else item.x = item.k;

        item.y = item.share;
    });
    return data;
}

function getMaxValueOfScale(data,scale){
    return Math.max.apply(null,data.datasets[0].data.map(item => item[scale]))
}

function getMinValueOfScale(data,scale){
    return Math.min.apply(null,data.datasets[0].data.map(item => item[scale]))
}

function getStepSizeOnScale(data,scale){
    let [max,min] = [ getMaxValueOfScale(data,scale), getMinValueOfScale(data,scale) ];
    let range = max - min;
    return range/3;
}

function fillColorsArray(data){
    data.datasets[0].pointBackgroundColor = [];//сбрасываем значение массива
    let [maxX,minX] = [ getMaxValueOfScale(data, 'x'), getMinValueOfScale(data, 'x') ];
    let [maxY,minY] = [ getMaxValueOfScale(data, 'y'), getMinValueOfScale(data, 'y') ];

    data.datasets[0].data.forEach(item => {
        let color = '';

        let xSegment = Math.ceil((item.x - minX) / (maxX - minX) * 3) || 1;
        let ySegment = Math.ceil((item.y - minY) / (maxY - minY) * 3) || 1;
        let thirdCoordinate = `${xSegment},${ySegment}`;
        //console.log(item.name, thirdCoordinate );

        switch(thirdCoordinate){
            case '1,2':
            case '1,3':
            case '2,3':
                color = '#9fd572';
                break;
            case '1,1':
            case '2,2':
            case '3,3':
                color = '#f6aa26';
                break;
            case '2,1':
            case '3,1':
            case '3,2':
                color = '#e07c94';
                break;
        }
        data.datasets[0].pointBackgroundColor.push(color);



    })
}
//                            <button className="filter_btn">Магазины</button>

const SalesAnalysis = (props) => {
    if(!props.data || props.data.length < 2)return null;
    data.datasets[0].data = replaceOnXY(props.data);
    fillColorsArray(data);  //определение цветов точек графика
    //console.log(data.datasets[0].pointBackgroundColor);
    return (
        <div className="abcAnalysis">
            <Card>
                <CardBody>
                    <h5>ABC-XYZ анализ продаж</h5>
                    <span className="muted">помогает определить надежных и ненадежных арендаторов</span>
                    <Row>
                        <Col md="3">
                        </Col>
                    </Row>
                    <div className="abcAnalysis_chart_wrapper">
                        <Scatter
                            data={data}
                            options={{
                                maintainAspectRatio: false,
                                legend: {
                                    display: false
                                },
                                layout:{
                                  padding:150
                                },
                                tooltips: {
                                    custom:  customLabelDataChart,//
                                    enabled:false,
                                    callbacks:{
                                        label: (tooltipItem, data ) => {
                                            let index = tooltipItem.index;
                                            return data.datasets[0].data[index].name;
                                        }
                                    }
                                },
                                scales: {
                                    xAxes: [{
                                        position:'bottom',
                                        ticks:{
                                            beginAtZero:false,
                                            display:false,
                                            min: getMinValueOfScale(data,'x'),
                                            max: getMaxValueOfScale(data,'x'),
                                            stepSize:getStepSizeOnScale(data,'x')
                                        },
                                        gridLines: {
                                            color: ["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0)"],
                                            borderDash: [4, 4],
                                            zeroLineColor:'#dfe2e5',
                                            drawBorder: true,
                                            drawOnChartArea: true,
                                        },
                                    }],
                                    yAxes: [{
                                        ticks:{
                                            beginAtZero:false,
                                            display:false,
                                            min: getMinValueOfScale(data,'y'),
                                            max: getMaxValueOfScale(data,'y'),
                                            stepSize:getStepSizeOnScale(data,'y')
                                        },
                                        gridLines: {
                                            color: ["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0)"],
                                            borderDash: [4, 4],
                                        },
                                    }],
                                }

                            }}
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};


export default SalesAnalysis;

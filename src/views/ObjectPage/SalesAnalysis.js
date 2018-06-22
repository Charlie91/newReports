import React, { Component } from 'react';
import utils from './obj_utils';
import {Scatter,Chart} from "react-chartjs-2";
import {Card, CardBody, Row, Col} from "reactstrap";
import {customLabelDataChart} from './customLabelDataChart';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';




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

function getMinValueOfScale(data,scale) {
    return Math.min.apply(null, data.datasets[0].data.map(item => item[scale]))
}

function getSegment(data,scale){
    let [max, min] = [getMaxValueOfScale(data,scale),getMinValueOfScale(data,scale)];
    let range = max - min;
    let segment = range / 3;
    return segment
}

function getStepSizeOnScale(data,scale){
    let segment = getSegment(data,scale),
        max = getMaxValueOfScale(data,scale),
        min = getMinValueOfScale(data,scale);
    let range = (max + segment) - (min - segment);
    return range / 5;
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


class SalesAnalysis extends Component {
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);

        this.state = {
            dropdownOpen: false,
            data : {
                labels: ['Scatter'],
                datasets: [
                    {
                        label: 'My First dataset',
                        fill: true,
                        pointBackgroundColor: [],
                        pointRadius: 6,
                        pointHoverRadius: 6,
                        data: []
                    }
                ]
            }
        }
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }


    render(){
        let props = this.props,
            data = this.state.data;

        if(!props.data || props.data.length < 2)return null;

        data.datasets[0].data = replaceOnXY(props.data);
        fillColorsArray(data);
        return (
            <div className="abcAnalysis">
                <Card>
                    <CardBody>
                        <h5>ABC-XYZ анализ продаж</h5>
                        <span className="muted">помогает определить надежных и ненадежных арендаторов</span>
                        <Row>
                            <Col md="3">
                                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle caret>
                                        Категории
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>Header</DropdownItem>
                                        <DropdownItem disabled>Action</DropdownItem>
                                        <DropdownItem>Another Action</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>Another Action</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <div className="abcAnalysis_chart_wrapper">
                            <div className="notation top left">
                                <div className="header">AB</div>
                                <div className="bold">Надежные арендаторы:</div>
                                <div>высокий уровень дохода</div>
                            </div>
                            <div className="notation top right">
                                <div className="header">BC</div>
                            </div>
                            <div className="notation bottom left">
                                <div className="header">XY</div>
                            </div>
                            <div className="notation bottom right">
                                <div className="header">YZ</div>
                                <div className="bold">Ненадежные арендаторы:</div>
                                <div>маленькие продажи и высокая волатильность</div>

                                <div className="bold" style={{marginTop:'13px'}}>Риски:</div>
                                <div>могут в будущем стать неплательщиками</div>
                                <div>или съехать из ТЦ</div>
                            </div>

                            <Scatter
                                data={data}
                                options={{
                                    maintainAspectRatio: false,
                                    legend: {
                                        display: false
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
                                            ticks:{
                                                beginAtZero:false,
                                                display:false,
                                                min: getMinValueOfScale(data,'x') - getSegment(data,'x'),
                                                max: getMaxValueOfScale(data,'x') + getSegment(data,'x'),
                                                stepSize:getStepSizeOnScale(data,'x')
                                            },
                                            gridLines: {
                                                color: ["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)"],
                                                borderDash: [4, 4],
                                            }
                                        }],
                                        yAxes: [{
                                            ticks:{
                                                beginAtZero:false,
                                                display:false,
                                                min: getMinValueOfScale(data,'y') - getSegment(data,'y'),
                                                max: getMaxValueOfScale(data,'y') + getSegment(data,'y'),
                                                stepSize:getStepSizeOnScale(data,'y')
                                            },
                                            gridLines: {
                                                color: ["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)"],
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
    }
}



export default SalesAnalysis;
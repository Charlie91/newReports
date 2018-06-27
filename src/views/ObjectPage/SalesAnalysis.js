import React, { Component } from 'react';
import utils from './obj_utils';
import {Scatter,Chart} from "react-chartjs-2";
import {Card, CardBody, Row, Col} from "reactstrap";
import {customLabelDataChart} from './customLabelDataChart';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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

function addFalsePlaceholder(parent){
    let id = 'false-placeholder';
    if(document.getElementById('false-placeholder'))return;//если элемент уже есть - ничего не делать

    let div = document.createElement('div');
    div.id = id;
    div.classList.add('Select-placeholder');
    div.innerHTML = 'Выберите категории';
    parent.appendChild(div);
}

function deleteFalsePlaceholder(parent){
    let id = 'false-placeholder';
    let elem = document.getElementById(id);
    if(!elem)return; //если элемента нет ничего не делать

    parent.removeChild(elem);
}

class SalesAnalysis extends Component {
    constructor(props){
        super(props);

        this.state = {
            checkedTypes: '',
            categories: [],
            chart : {
                labels: ['Scatter'],
                datasets: [
                    {
                        label: 'My First dataset',
                        fill: true,
                        pointBackgroundColor: [],
                        pointRadius: 7,
                        pointHoverRadius: 7,
                        data: []
                    }
                ]
            }
        }
    }

    handleSelectChange (checkedTypes){
        if(checkedTypes)
            addFalsePlaceholder(document.querySelector('.Select-multi-value-wrapper'));
        else
            deleteFalsePlaceholder(document.querySelector('.Select-multi-value-wrapper'));
        this.setState({ checkedTypes });
    }

    replaceOnXY(data){
        let chart = this.state.chart;
        data.forEach(item => {
            if(!item.k && !item.share)
                item.x = 0.01;//фикс нулевых значений, которые не отображаются на графике
            else item.x = item.k;

            item.y = item.share;
        });
        chart.datasets[0].data = data;
        this.setState({chart:chart,data});
    }

    fillColorsArray(){
        let chart = this.state.chart;
        chart.datasets[0].pointBackgroundColor = [];//сбрасываем значение массива
        let [maxX,minX] = [ getMaxValueOfScale(chart, 'x'), getMinValueOfScale(chart, 'x') ];
        let [maxY,minY] = [ getMaxValueOfScale(chart, 'y'), getMinValueOfScale(chart, 'y') ];
        let colors = [];

        chart.datasets[0].data.forEach(item => {
            let color = '';

            let xSegment = Math.ceil((item.x - minX) / (maxX - minX) * 3) || 1;
            let ySegment = Math.ceil((item.y - minY) / (maxY - minY) * 3) || 1;
            let thirdCoordinate = `${xSegment},${ySegment}`;

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
            chart.datasets[0].pointBackgroundColor.push(color);
            colors.push(color);             //colors нужен
        });                                 // чтобы сохранить начальный список цветов из-за тупого условия
        this.setState({chart:chart,colors})// сохранять цвета у точек при фильтрации
    }

    parseTypes(data){
        let types = data.reduce( (results,item) => {
            let type = item.type;
            if(!results.includes(type))
                results.push(type);
            return results;
        },[]);
        let formattedTypes = types.map( item => {
            return{
                value:item,
                label:item
            }
        });
        let checkedTypes = types.join(',');
        this.setState(
            {
                categories:formattedTypes,
                checkedTypes //по умолчанию выбраны все опции
            },
            () => this.handleSelectChange(checkedTypes)//сразу показать плейсхолдер
        );
    }

    filterChartData(){
        let checkedTypesInArray = this.state.checkedTypes.split(','),
            chart = this.state.chart,
            chartData = this.state.data;

        let newData = chartData.filter(item => checkedTypesInArray.includes(item.type));
        chart.datasets[0].data = newData;
        chart.datasets[0].pointBackgroundColor = this.getSavedColors();

        this.setState({chart}, /*() => this.fillColorsArray()*/) //переопределение цвета точек после изменения,
    }                                                             //разкомментить чтобы заработало

    getSavedColors(){//возвращает новый массив цветов чтобы сохранить цвета у точек при фильтрации
        let checkedTypesInArray = this.state.checkedTypes.split(','),
            chartData = this.state.data,
            colors = this.state.colors;//изначальный список цветов
        return colors.filter( (item,i) => checkedTypesInArray.includes(chartData[i].type));
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.data && nextProps.data.length > 1){
            this.replaceOnXY(nextProps.data);
            this.fillColorsArray();
            this.parseTypes(nextProps.data);
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.checkedTypes !== this.state.checkedTypes)
            this.filterChartData();
    }

    render(){
        let props = this.props,
            chart = this.state.chart;
        if(!props.data || props.data.length < 2)return null;
        return (
            <div className="abcAnalysis">
                <Card>
                    <CardBody>
                        <h5>ABC-XYZ анализ продаж</h5>
                        <span className="muted">помогает определить надежных и ненадежных арендаторов</span>
                        <Row>
                            <Col md="3">
                                <Select
                                    closeOnSelect={false}
                                    removeSelected={false}
                                    multi
                                    onChange={this.handleSelectChange.bind(this)}
                                    options={this.state.categories}
                                    placeholder="Выберите категории"
                                    simpleValue
                                    value={this.state.checkedTypes}
                                    inputProps={{readOnly:true}}
                                />
                            </Col>
                        </Row>
                        <div className="abcAnalysis_chart_wrapper">
                            <div className="notation top left">
                                <div className="header">AX</div>
                                <div className="bold">Надежные арендаторы:</div>
                                <div>высокий уровень дохода</div>
                            </div>
                            <div className="notation top right">
                                <div className="header">CX</div>
                            </div>
                            <div className="notation middleY left">
                                <div className="header">AY</div>
                            </div>
                            <div className="notation middleY right">
                                <div className="header">CY</div>
                            </div>
                            <div className="notation bottom left">
                                <div className="header">AZ</div>
                            </div>
                            <div className="notation bottom right">
                                <div className="header">CZ</div>
                                <div className="bold">Ненадежные арендаторы:</div>
                                <div>низкие продажи </div>
                                <div>и высокая волатильность</div>

                                <div className="bold" style={{marginTop:'18px'}}>Риски:</div>
                                <div>могут стать неплательщиками</div>
                                <div>или съехать из ТЦ</div>
                            </div>

                            <Scatter
                                data={chart}
                                options={{
                                    animation: {
                                        duration: 0
                                    },
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
                                                min: getMinValueOfScale(chart,'x') - getSegment(chart,'x'),
                                                max: getMaxValueOfScale(chart,'x') + getSegment(chart,'x'),
                                                stepSize:getStepSizeOnScale(chart,'x')
                                            },
                                            gridLines: {
                                                color: ["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)"],
                                                borderDash: [4, 4],
                                                zeroLineColor: 'rgba(0, 0, 0, 0)'
                                            }
                                        }],
                                        yAxes: [{
                                            ticks:{
                                                beginAtZero:false,
                                                display:false,
                                                min: getMinValueOfScale(chart,'y') - getSegment(chart,'y'),
                                                max: getMaxValueOfScale(chart,'y') + getSegment(chart,'y'),
                                                stepSize:getStepSizeOnScale(chart,'y')
                                            },
                                            gridLines: {
                                                color: ["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)"],
                                                borderDash: [4, 4],
                                                zeroLineColor: 'rgba(0, 0, 0, 0)'
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
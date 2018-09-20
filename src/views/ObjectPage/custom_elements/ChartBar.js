import React from 'react';
import {customLabelDataChart} from "Src/views/ObjectPage/customLabelDataChart";
import customComparisonLabelDataChart from "Src/views/ObjectPage/customComparisonLabelDataChart";
import utils from "Src/views/ObjectPage/obj_utils";
import {formatNumberBySpaces, getStepSize} from "Src/utils/utils";
import moment from "moment/moment";
import Loading from '../../Loading/Small';
import ChartComponent from 'react-chartjs-2';

class ChartBar extends React.Component {

    constructor(props) {
        super(props);
    }

    _addDashesToBorders(chart){
        if(chart && chart.chart_instance){
            chart.chart_instance.chart.ctx.setLineDash([10, 10]);
        }
    }

    componentDidUpdate(){
        this._addDashesToBorders(this.chart);
    }


    _getFormat(timeSegment) {
        let format;
        switch(timeSegment){
            case 'Y':
                format = 'YYYY';
                break;
            case 'M':
                format = 'YYYY-MM';
                break;
            case 'D':
                format = 'YYYY-MM-DD';
                break;
            case 'H':
                format = 'HH:mm T DD.MM.YYYY';
        }
        return format
    }

    _addEmptyBars(data, timeSegment) {
        let modificator = '';
        let values = data.datasets[0].data;

        switch(timeSegment){
            case 'Y':
                modificator = 'years';
                break;
            case 'M':
                modificator = 'months';
                break;
            case 'D':
                modificator = 'days';
                break;
            case 'H':
                modificator = 'hours';
                break;
            default:
                console.log('wtf with your timeSegment');
        }

        let averageValue = values.reduce((sum,current) => {//среднее значение в массиве
            return sum + current
        },0) / values.length;

        let limit = 31 - values.length;
        for(let i = 0; i < limit ; i++){
            values.push(averageValue);
            data.labels.push(
                moment(data.labels[data.labels.length - 1]).add(1,modificator).format(this._getFormat(timeSegment))
            )
        }
    }


    render() {
        if (this.props.loading) return <Loading/>;

        let max = this.props.max;
        max = this.props.filteredData.datasets[0].data.reduce( (max,item) => {
            if(item > max)max = item;
            return max;
        },0);
        console.log(this.props.filteredData);
        this._addEmptyBars(this.props.filteredData, this.props.timeSegment);//добавляем "пустые" графики
        console.log(this.props.filteredData);

        return <ChartComponent
            ref={(chart) => { this.chart = chart; }}
            data={this.props.filteredData}
            type='roundedBar'
            options={{
                maintainAspectRatio: false,
                legend: {display: false},
                barRoundness: 0.8,
                tooltips: {
                    custom: this.props.comparison_mode ? customComparisonLabelDataChart : customLabelDataChart,//
                    enabled: false,
                    callbacks: {
                        title: (tooltipItem, data) => {
                            let step = getStepSize(this.props.data.labels.length, this.props.timeSegment);
                            let title = '';

                            if (step !== 1) {
                                if (this.props.timeSegment === 'M')
                                    title = moment(tooltipItem[0].xLabel).format('MMM')
                                if (this.props.timeSegment === 'D')
                                    title = moment(tooltipItem[0].xLabel).format('DD MMM')
                                if (this.props.timeSegment === 'Y')
                                    title = moment(tooltipItem[0].xLabel).format('YYYY')
                            }

                            if (this.props.timeSegment === 'H')
                                title = moment(tooltipItem[0].xLabel).format("HH:mm, DD MMM")

                            return title;
                        },
                        label: (tooltipItem, data) => {
                            if (data.datasets[0].backgroundColor[tooltipItem.index] === 'transparent') {
                                return null;
                            }
                            ;

                            if (this.props.comparison_mode) {
                                return utils.comparisonLabel(tooltipItem, data)
                            }
                            else {
                                return `
                                                          ${formatNumberBySpaces(Math.round(tooltipItem.yLabel))}
                                                          ${(this.props.currency.length > 4) ?
                                    (this.props.currency.substring(0, 3) + '.') : this.props.currency}
                                                      `
                            }
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        barThickness: 20,
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                            borderDash: [4, 4],
                            zeroLineColor: 'rgba(0, 0, 0, 0)'
                        },
                        ticks: {
                            fontColor: '#7f8fa4',
                            fontSize: 14,
                            fontFamily: 'ProximaNova',
                            stepSize: 123123,
                            maxRotation: 0,
                            callback: (value, index, values) => {
                                let format = '';
                                switch (this.props.timeSegment) {
                                    case 'Y':
                                        format = 'YYYY';
                                        break;
                                    case 'M':
                                        format = 'MMM';
                                        break;
                                    case 'D':
                                        format = 'DD MMM';
                                        break;
                                    case 'H':
                                        format = 'DD.MM T HH:mm';
                                }
                                if (index % 2 === 0)
                                    return moment(value).format(format);
                            },
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: max / 2
                        },
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                            zeroLineColor: 'rgba(0, 0, 0, 0)',
                            borderDash: [4, 4]
                        },
                    }],
                }

            }}
        />
    }
}

export default ChartBar;
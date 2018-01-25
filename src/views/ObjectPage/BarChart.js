import React, { Component } from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";
import Loading from './../Loading/Small';
import {customLabel} from './customtooltip';
import {formatNumberBySpaces} from './../../utils/utils';


function addBorderRadiuses(){     //добавляем border-radius'ы в график
    Chart.elements.Rectangle.prototype.draw = function() {
        var ctx = this._chart.ctx;
        var vm = this._view;
        var left, right, top, bottom, signX, signY, borderSkipped, radius;
        var borderWidth = vm.borderWidth;
        // Set Radius Here
        // If radius is large enough to cause drawing errors a max radius is imposed
        var cornerRadius = 20;

        if (!vm.horizontal) {
            // bar
            left = vm.x - vm.width / 2;
            right = vm.x + vm.width / 2;
            top = vm.y;
            bottom = vm.base;
            signX = 1;
            signY = bottom > top? 1: -1;
            borderSkipped = vm.borderSkipped || 'bottom';
        } else {
            // horizontal bar
            left = vm.base;
            right = vm.x;
            top = vm.y - vm.height / 2;
            bottom = vm.y + vm.height / 2;
            signX = right > left? 1: -1;
            signY = 1;
            borderSkipped = vm.borderSkipped || 'left';
        }
        // Canvas doesn't allow us to stroke inside the width so we can
        // adjust the sizes to fit if we're setting a stroke on the line
        if (borderWidth) {
            // borderWidth shold be less than bar width and bar height.
            var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
            borderWidth = borderWidth > barSize? barSize: borderWidth;
            var halfStroke = borderWidth / 2;
            // Adjust borderWidth when bar top position is near vm.base(zero).
            var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
            var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
            var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
            var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
            // not become a vertical line?
            if (borderLeft !== borderRight) {
                top = borderTop;
                bottom = borderBottom;
            }
            // not become a horizontal line?
            if (borderTop !== borderBottom) {
                left = borderLeft;
                right = borderRight;
            }
        }

        ctx.beginPath();
        ctx.fillStyle = vm.backgroundColor;
        ctx.strokeStyle = vm.borderColor;
        ctx.lineWidth = borderWidth;

        // Corner points, from bottom-left to bottom-right clockwise
        // | 1 2 |
        // | 0 3 |
        var corners = [
            [left, bottom],
            [left, top],
            [right, top],
            [right, bottom]
        ];

        // Find first (starting) corner with fallback to 'bottom'
        var borders = ['bottom', 'left', 'top', 'right'];
        var startCorner = borders.indexOf(borderSkipped, 0);
        if (startCorner === -1) {
            startCorner = 0;
        }

        function cornerAt(index) {
            return corners[(startCorner + index) % 4];
        }

        // Draw rectangle from 'startCorner'
        var corner = cornerAt(0);
        ctx.moveTo(corner[0], corner[1]);

        for (var i = 1; i < 4; i++) {
            corner = cornerAt(i);
            var nextCornerId = i+1;
            if(nextCornerId == 4){
                nextCornerId = 0
            }

            var nextCorner = cornerAt(nextCornerId);

            var width = corners[2][0] - corners[1][0];
            var height = corners[0][1] - corners[1][1];
            var x = corners[1][0];
            var y = corners[1][1];

            var radius = cornerRadius;

            // Fix radius being too large
            if(radius > height/2){
                radius = height/2;
            }if(radius > width/2){
                radius = width/2;
            }

            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height/* - radius */);
            ctx.quadraticCurveTo(x + width, y + height, x + width /*- radius */, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height /* - radius */);
            ctx.lineTo(x, y + radius );
            ctx.quadraticCurveTo(x, y, x + radius, y);

        }

        ctx.fill();
        if (borderWidth) {
            ctx.stroke();
        }
    };
}


export default class BarChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            bars:[],
            maxValue : 0,
            step : 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data)
            this.fillBarsData(nextProps.data);
    }

    fillBarsData(data){
        let bars = [];
        let maxVal = 0;
        for(let i = 0;i < 7;i++){
            if(!i){
                let firstChartPrototype = {
                    labels:[],
                    datasets:[{
                        backgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                        borderColor: 'transparent',
                        borderWidth: 0,
                        hoverBorderWidth: 1,
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
                        borderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                        borderWidth: 0,
                        hoverBorderWidth: 5,
                        hoverBackgroundColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                        hoverBorderColor: ["#8570ce", '#688bda', "#74c2e8", "#73d2ca", "#9fd473", '#f0e238','#ea9772','#e07c95'],
                        data: []
                    }]
                };
                bars.push(otherChartsPrototype);
            }
        };

        data.weekAvg.forEach((item, i) => {
            bars[Math.floor(i/8)].labels.push(item.ld + '-' + item.td); //распихиваем по 8 значений на 1 график
            bars[Math.floor(i/8)].datasets[0].data.push(Math.round(item.avg));
            if(item.avg > maxVal)maxVal = Math.round(item.avg);
        });

        maxVal = Math.ceil(maxVal/20)*20;
        let step =  maxVal/5;
        this.setState({bars: bars,maxVal: maxVal, step: step  });
    }

    countBars(dataArr){
        let count = 0;
        dataArr.forEach(item => {
            item.datasets[0].data.forEach(dataitem => {
                if(dataitem)count +=1;
            });
        });
        return(count > 7);
    }



    componentDidUpdate(){       //добавляем border-radius'ы в график
        addBorderRadiuses();
    }


    render(){
        if(!this.props.render || !this.countBars(this.state.bars))return null;
        if(!this.props.data){
            return (
                <Card className="average_hours vertical-bars">
                    <CardBody>
                        <h4>Средняя посещаемость по часам</h4>
                        <Loading/>
                    </CardBody>
                </Card>
            )
        }
        else return (
            <Card className="average_hours vertical-bars">
                <CardBody>
                    <h4>Средняя посещаемость по часам по дням недели</h4>
                    <p className="muted">Указано среднее кол-во человек проходящее с 0 до 24 часов по дням недели </p>
                    <div className="bars_wrapper">
                    {
                        this.state.bars.map((item,i) =>{
                                if(i === 0)
                                    return (
                                        <div key={i} className="chart-wrapper" >
                                            <div style={{height:'88%',marginLeft: '-30px'}}>
                                                <Bar data={item}
                                                     ref={(chart) => { this.chart = chart; }}
                                                     options={{
                                                         maintainAspectRatio: false,
                                                         legend:{
                                                             display:false,
                                                         },
                                                         layout: {
                                                             padding: {
                                                                 right: 7,
                                                             }
                                                         },
                                                         title:{
                                                             display:false,
                                                             text:'Понедельник',
                                                             fontFamily:'ProximaNova',
                                                             fontColor:'#7f8fa4',
                                                             fontStyle:'normal',
                                                             fontSize:14,
                                                             position:'bottom'
                                                         },
                                                         tooltips: {
                                                             custom: customLabel,
                                                             enabled:false,
                                                             backgroundColor:'#eff3f6',
                                                             bodyFontColor:'#354052',
                                                             titleFontColor:'#354052',
                                                             titleFontStyle:'normal',
                                                             displayColors:false,
                                                             callbacks:{
                                                                 label:function(tooltipItem, data	){
                                                                     return `${formatNumberBySpaces(tooltipItem.yLabel)} чел.`
                                                                 }
                                                             }
                                                         },
                                                         scales: {
                                                             display:false,
                                                             xAxes: [{
                                                                 barPercentage: 0.845,
                                                                 categoryPercentage:0.72,
                                                                 display:false,
                                                                 gridLines: {
                                                                     color: "rgba(0, 0, 0, 0)",
                                                                     display:true,
                                                                     drawBorder:false,
                                                                 },
                                                                 ticks:{
                                                                     beginAtZero: false

                                                                 }
                                                             }],
                                                             yAxes: [{
                                                                 afterFit: function (scale) {
                                                                     scale.width = 56;
                                                                 },
                                                                 ticks: {
                                                                     padding: 26,
                                                                     max: this.state.maxVal,
                                                                     beginAtZero: false,
                                                                     stepSize: this.state.step,
                                                                     fontColor:'#7f8fa4',
                                                                     fontSize: 11,
                                                                     fontFamily: 'ProximaNova'
                                                                 },
                                                                 gridLines: {
                                                                     color: "rgba(0, 0, 0, 0.05)",
                                                                     drawBorder: false,
                                                                     zeroLineColor:"rgba(0, 0, 0, 0.0)",
                                                                     borderDash: [4, 4],
                                                                 },
                                                             }]
                                                         }
                                                     }}
                                                />
                                            </div>
                                            <div className="title">Понедельник</div>
                                        </div>
                                    );
                                else
                                    return(
                                            <div key={i} className="chart-wrapper">
                                                <div style={{height:'88%',marginLeft: '-30px'}}>
                                                <Bar data={item}
                                                     ref={(chart) => { this.chart = chart; }}
                                                     options={{
                                                         maintainAspectRatio: false,
                                                         legend:{
                                                             display:false,
                                                         },
                                                         layout: {
                                                             padding: {
                                                                 right: 7,
                                                             }
                                                         },
                                                         title:{
                                                             display:false,
                                                             text:['Понедельник','Вторник',"Среда","Четверг","Пятница","Суббота","Воскресенье"][i],
                                                             fontFamily:'ProximaNova',
                                                             fontColor:'#7f8fa4',
                                                             fontStyle:'normal',
                                                             fontSize:14,
                                                             position:'bottom'
                                                         },
                                                         tooltips: {
                                                             custom: customLabel,
                                                             enabled:false,
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
                                                                 barPercentage: 0.845,
                                                                 categoryPercentage:0.72,
                                                                 display:false,
                                                                 gridLines: {
                                                                     color: "rgba(0, 0, 0, 0)",
                                                                     display:false,
                                                                     drawBorder: true,

                                                                 }
                                                             }],
                                                             yAxes: [{
                                                                 afterFit: function (scale) {
                                                                     scale.width = 56;
                                                                 },
                                                                 ticks: {
                                                                     padding: 26,
                                                                     max: this.state.maxVal,
                                                                     min: 0,
                                                                     stepSize: this.state.step,
                                                                     display: true,
                                                                     beginAtZero: true,
                                                                     fontColor: "rgba(0, 0, 0, 0)",
                                                                     fontSize: 11,
                                                                     fontFamily: 'ProximaNova'
                                                                 },
                                                                 gridLines: {
                                                                     color: "rgba(0, 0, 0, 0.05)",
                                                                     drawBorder: false,
                                                                     borderDash: [4, 4],
                                                                     zeroLineColor:"rgba(0, 0, 0, 0.0)",

                                                                 },
                                                             }]
                                                         }
                                                     }}
                                                />
                                            </div>
                                            <div className="title">{['Понедельник','Вторник',"Среда","Четверг","Пятница","Суббота","Воскресенье"][i]}</div>
                                        </div>
                                    );
                            }
                        )}
                    </div>
                </CardBody>
            </Card>
        )
    }

}
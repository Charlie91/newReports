import React, { Component } from 'react';
import {Bar, Line,Chart} from "react-chartjs-2";
import {Row,Col,CardColumns, Card, CardHeader, CardBody} from "reactstrap";



const customLabel = function(tooltipModel) {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = "<div></div>";
        document.body.appendChild(tooltipEl);
        //////////////////////////////
        tooltipEl.style.position='absolute';
        tooltipEl.style.textAlign='center';
        tooltipEl.style.color=tooltipModel.bodyFontColor;
        tooltipEl.style.backgroundColor=tooltipModel.backgroundColor;
        tooltipEl.style.borderRadius='4px';
        tooltipEl.style.fontFamily='ProximaNova';

        ///////////////////////////////
    }
    console.log(tooltipModel);

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        var titleLines = tooltipModel.title || [];
        var bodyLines = tooltipModel.body.map(getBody);

        var innerHtml = '<div>';

        titleLines.forEach(function(title) {
            innerHtml += '<span class="tooltip_title">' + title + '</span>';
        });
        innerHtml += '</div><div>';

        bodyLines.forEach(function(body, i) {
            var colors = tooltipModel.labelColors[i];
            var style = 'background:' + colors.backgroundColor;
            style += '; border-color:' + colors.borderColor;
            style += '; border-width: 2px';
            innerHtml += '<span class="tooltip_body">'  + body + '</span>';
        });
        innerHtml += '</div>';

        var tableRoot = tooltipEl.querySelector('div:first-of-type');
        tableRoot.innerHTML = innerHtml;
    }

    tooltipEl.querySelector('.tooltip_title').style.fontSize=tooltipModel.titleFontSize + 'px';
    tooltipEl.querySelector('.tooltip_body').style.fontSize=tooltipModel.bodyFontSize + 'px';
    tooltipEl.querySelector('.tooltip_body').style.fontWeight='500';


    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
    tooltipEl.style.fontFamily = tooltipModel._fontFamily;
    tooltipEl.style.fontSize = tooltipModel.fontSize;
    tooltipEl.style.fontStyle = tooltipModel._fontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
};

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
            let bars = [
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
                }];
            let maxVal = 0;
            nextProps.data.weekAvg.forEach((item, i) => {
                if (i < 8) {
                    bars[0].labels.push(item.ld + '-' + item.td);
                    bars[0].datasets[0].data.push(Math.round(item.avg));
                    if(item.avg > maxVal)maxVal = Math.round(item.avg);
                }
                else if (i < 16) {
                    bars[1].labels.push(item.ld + '-' + item.td);
                    bars[1].datasets[0].data.push(Math.round(item.avg));
                    if(item.avg > maxVal)maxVal = Math.round(item.avg);
                }
                else if (i < 24) {
                    bars[2].labels.push(item.ld + '-' + item.td);
                    bars[2].datasets[0].data.push(Math.round(item.avg));
                    if(item.avg > maxVal)maxVal = Math.round(item.avg);
                }
                else if (i < 32) {
                    bars[3].labels.push(item.ld + '-' + item.td);
                    bars[3].datasets[0].data.push(Math.round(item.avg));
                    if(item.avg > maxVal)maxVal = Math.round(item.avg);
                }
                else if (i < 40) {
                    bars[4].labels.push(item.ld + '-' + item.td);
                    bars[4].datasets[0].data.push(Math.round(item.avg));
                    if(item.avg > maxVal)maxVal = Math.round(item.avg);
                }
                else if (i < 48) {
                    bars[5].labels.push(item.ld + '-' + item.td);
                    bars[5].datasets[0].data.push(Math.round(item.avg));
                    if(item.avg > maxVal)maxVal = Math.round(item.avg);
                }
                else {
                    bars[6].labels.push(item.ld + '-' + item.td);
                    bars[6].datasets[0].data.push(Math.round(item.avg));
                    if(item.avg > maxVal)maxVal = Math.round(item.avg);
                }
            });
            this.setState({bars: bars,maxVal:(Math.ceil(maxVal/10) * 10)});
            console.log(bars);
        }
    }

    addBorderRadiuses(){     //добавляем border-radius'ы в график
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

    componentDidUpdate(){           //добавляем border-radius'ы в график
        this.addBorderRadiuses();
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
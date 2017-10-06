import React, { Component } from 'react';
import {Bar, Line} from "react-chartjs-2";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './style.css';

import {
  Badge,
  Row,
  Col,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBlock,
  CardFooter,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Input,
  Table
} from "reactstrap";



const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandWarning = '#f8cb00';
const brandDanger = '#f86c6b';

// Card Chart 1
const cardChartData1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40]
    }
  ],
};

const cardChartOpts1 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: 'transparent',
        zeroLineColor: 'transparent'
      },
      ticks: {
        fontSize: 2,
        fontColor: 'transparent',
      }

    }],
    yAxes: [{
      display: false,
      ticks: {
        display: false,
        min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
      }
    }],
  },
  elements: {
    line: {
      borderWidth: 1
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 2
const cardChartData2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [1, 18, 9, 17, 34, 22, 11]
    }
  ],
};

const cardChartOpts2 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: 'transparent',
        zeroLineColor: 'transparent'
      },
      ticks: {
        fontSize: 2,
        fontColor: 'transparent',
      }

    }],
    yAxes: [{
      display: false,
      ticks: {
        display: false,
        min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
        max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
      }
    }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 3
const cardChartData3 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40]
    }
  ],
};

const cardChartOpts3 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: false
    }],
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}

// Card Chart 4
const cardChartData4 = {
  labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.3)',
      borderColor: 'transparent',
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
    }
  ],
};

const cardChartOpts4 = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false,
      barPercentage: 0.6,
    }],
    yAxes: [{
      display: false,
    }]
  }
}

// Social Box Chart
const socialBoxData = [
  {data: [65, 59, 84, 84, 51, 55, 40], label: 'facebook'},
  {data: [1, 13, 9, 17, 34, 41, 38], label: 'twitter'},
  {data: [78, 81, 80, 45, 34, 12, 40], label: 'linkedin'},
  {data: [35, 23, 56, 22, 97, 23, 64], label: 'google'}
];

const makeSocialBoxData = (dataSetNo) => {
  const dataset = socialBoxData[dataSetNo];
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        backgroundColor: 'rgba(255,255,255,.1)',
        borderColor: 'rgba(255,255,255,.55)',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: dataset.data,
        label: dataset.label,
      }
    ]

  };
  return () => data;
};

const socialChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: false
    }]
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3
    }
  }
};

// sparkline charts
const sparkLineChartData = [
  {
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'New Clients'
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Recurring Clients'
  },
  {
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'Pageviews'
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Organic'
  },
  {
    data: [78, 81, 80, 45, 34, 12, 40],
    label: 'CTR'
  },
  {
    data: [1, 13, 9, 17, 34, 41, 38],
    label: 'Bounce Rate'
  }
];

const makeSparkLineData = (dataSetNo, variant) => {
  const dataset = sparkLineChartData[dataSetNo];
  const data = {
    labels: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: variant ? variant : '#c2cfd6',
        data: dataset.data,
        label: dataset.label
      }
    ],
  };
  return () => data;
};

const sparklineChartOpts = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [{
      display: false,
    }],
    yAxes: [{
      display: false,
    }]
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    }
  },
  legend: {
    display: false
  }
};

// Main Chart

// convert Hex to RGBA
function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 29;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

const mainChart = {
  labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
  datasets: [
    {
      label: 'Кол-во посетителей',
      backgroundColor: convertHex(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1
    }
  ]
}

const mainChartOpts = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        drawOnChartArea: false,
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 2,
        stepSize: Math.ceil(250 / 5),
        max: 250
      }
    }]
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    }
  }
}


class Dashboard extends Component {
  constructor(props) {
    super(props);
    //this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  render() {
    return (
      <div className="animated fadeIn">
          <Row style={{ marginBottom: '20px'}}>
            <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
              <Card>
                <CardHeader style={{ paddingBottom: '0'}}>
                  <Row>
                    <Col md="6">
                      <h5>Рио Реутов</h5>
                      <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                    </Col>
                    <Col md="6">
                      <img className="title-image" src="img/TradeCenters/rio_dmitrovka.png"/>
                      <img className="title-image_hidden" src="img/TradeCenters/rio_dmitrovka_color.png"/>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBlock>
                  <Row>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">Сегодня</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">Сентябрь</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">2017</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                </Row>
              </CardBlock>
            </Card>
           </Col>
           <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
             <Card>
                 <CardHeader style={{ paddingBottom: '0'}}>
                   <Row>
                     <Col md="6">
                       <h5>Рио Академ</h5>
                       <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                     </Col>
                     <Col md="6">
                       <img className="title-image" src="img/TradeCenters/rio_tambov.png"/>
                       <img className="title-image_hidden" src="img/TradeCenters/rio_tambov_color.png"/>
                     </Col>
                   </Row>
                 </CardHeader>
                 <CardBlock>
                   <Row>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сегодня</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сентябрь</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">2017</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                 </Row>

               </CardBlock>
            </Card>
          </Col>

          <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
            <Card>
                <CardHeader style={{ paddingBottom: '0'}}>
                  <Row>
                    <Col md="6">
                      <h5>Руспетрол</h5>
                      <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                    </Col>
                    <Col md="6">
                      <img className="title-image" src="img/TradeCenters/rio_leninskiy.png"/>
                      <img className="title-image_hidden" src="img/TradeCenters/rio_leninskiy_color.png"/>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBlock>
                 <Row>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">Сегодня</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">Сентябрь</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">2017</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                </Row>

              </CardBlock>
          </Card>
          </Col>

            <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
              <Card>
                <CardHeader style={{ paddingBottom: '0'}}>
                  <Row>
                    <Col md="6">
                      <h5>Рио Реутов</h5>
                      <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                    </Col>
                    <Col md="6">
                      <img className="title-image" src="img/TradeCenters/sochi.png"/>
                      <img className="title-image_hidden" src="img/TradeCenters/sochi_color.png"/>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBlock>
                  <Row>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">Сегодня</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">Сентябрь</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">2017</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                </Row>
              </CardBlock>
            </Card>
           </Col>
           <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
             <Card>
                 <CardHeader style={{ paddingBottom: '0'}}>
                   <Row>
                     <Col md="6">
                       <h5>Рио Академ</h5>
                       <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                     </Col>
                     <Col md="6">
                       <img className="title-image" src="img/TradeCenters/ereven_plaza.png"/>
                       <img className="title-image_hidden" src="img/TradeCenters/ereven_plaza_color.png"/>
                     </Col>
                   </Row>
                 </CardHeader>
                 <CardBlock>
                   <Row>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сегодня</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сентябрь</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">2017</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                 </Row>

               </CardBlock>
            </Card>
          </Col>

          <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
            <Card>
                <CardHeader style={{ paddingBottom: '0'}}>
                  <Row>
                    <Col md="6">
                      <h5>Руспетрол</h5>
                      <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                    </Col>
                    <Col md="6">
                      <img className="title-image" src="img/TradeCenters/rio_leninskiy.png"/>
                      <img className="title-image_hidden" src="img/TradeCenters/rio_leninskiy_color.png"/>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBlock>
                 <Row>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">Сегодня</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">Сентябрь</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">2017</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                </Row>

              </CardBlock>
          </Card>
          </Col>

            <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
              <Card>
                <CardHeader style={{ paddingBottom: '0'}}>
                  <Row>
                    <Col md="6">
                      <h5>Рио Реутов</h5>
                      <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                    </Col>
                    <Col md="6">
                      <img className="title-image" src="img/TradeCenters/rio_tambov.png"/>
                      <img className="title-image_hidden" src="img/TradeCenters/rio_tambov_color.png"/>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBlock>
                  <Row>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">Сегодня</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">Сентябрь</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" xl="4">
                        <small className="text-muted">2017</small>
                        <br/>
                        <strong className="h4 indicator">9,1 т.чел</strong>
                    </Col>
                </Row>

              </CardBlock>
            </Card>
           </Col>
           <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
             <Card>
                 <CardHeader style={{ paddingBottom: '0'}}>
                   <Row>
                     <Col md="6">
                       <h5>Рио Академ</h5>
                       <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                     </Col>
                     <Col md="6">
                       <img className="title-image" src="img/TradeCenters/sochi.png"/>
                       <img className="title-image_hidden" src="img/TradeCenters/sochi_color.png"/>
                     </Col>
                   </Row>
                 </CardHeader>
                 <CardBlock>
                   <Row>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сегодня</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сентябрь</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">2017</small>
                         <br/>
                         <strong className="h4 indicator">9,1 т.чел</strong>
                     </Col>
                 </Row>

               </CardBlock>
            </Card>
          </Col>

          <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
            <Card>
                <CardHeader style={{ paddingBottom: '0'}}>
                  <Row>
                    <Col md="6">
                      <h5>Руспетрол</h5>
                      <p className="contacts">г.Реутов, пр.Гагарина,д.8</p>
                    </Col>
                    <Col md="6">
                      <img className="title-image" src="img/TradeCenters/rio_leninskiy.png"/>
                      <img className="title-image_hidden" src="img/TradeCenters/rio_leninskiy_color.png"/>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBlock>
                 <Row>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">Сегодня</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">Сентябрь</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                  <Col xs="4" sm="4" md="4" lg="4" xl="4">
                      <small className="text-muted">2017</small>
                      <br/>
                      <strong className="h4 indicator">9,1 т.чел</strong>
                  </Col>
                </Row>

              </CardBlock>
          </Card>
          </Col>
          </Row>

      </div>
    )
  }
}

export default Dashboard;

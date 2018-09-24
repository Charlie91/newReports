import React, { Component } from 'react';
import { Row, Col, Card, CardBody} from "reactstrap";

import ReactPicker from './custom_elements/ReactPicker';
import CheckButton from './custom_elements/CheckButton';
import SelectList from './custom_elements/SelectList';
import YearSelector from './custom_elements/YearSelector';
import DataBarChartTotal from './DataBarChartTotal';
import ChartBar from './custom_elements/ChartBar';
import ChartLine from './custom_elements/ChartLine';
import XlsButton from './custom_elements/XlsButton';

import moment from 'moment';
import YearTable from './custom_elements/YearTable';
import addCustomTypeWithBorderRadiuses from './addCustomTypeWithBorderRadiuses';


function getBarsColors(labels, type){
    return labels.map(i => (( [0,6].includes( moment(i).day() ) && (type == 'D') ) ? '#9fd473' : '#74c2e8')).concat(Array(Math.abs(31-labels.length)).fill('transparent') );
}

function getBordersColors(dataLength){
    return Array(dataLength).fill('transparent').concat(Array(Math.abs(31 - dataLength)).fill('#979797ab') );
}


export default class DataBarChart extends Component{
    constructor(props){
        super(props);
        addCustomTypeWithBorderRadiuses();

        this.state = {
            name_of_data: (props.type === 'Выручка') ? 'Выручка' : 'Трафик'
        }
    }

    render(){

        const props = this.props;
        const options_times = [
            { value:'H',label:'По часам',render:( (moment(props.startDate).diff(moment(props.endDate), 'days') > -14) && props.shortestUnit === 'H' )},
            { value:'D',label:'По дням',render:(props.startDate.format('YYYY-MM-DD') !== props.endDate.format('YYYY-MM-DD')) },
            { value:'M',label:'По месяцам',render:(props.startDate.format('YYYY-MM') !== props.endDate.format('YYYY-MM')) },
            { value:'Y',label:'По годам',render:(props.startDate.year() !== props.endDate.year()) }
        ].filter(item => item.render);

        if(props.floors){
            var options_floors = props.floors.map((item,i) => {
                return {
                    value:i,
                    label:item.name
                }
            })
        }

        let filteredData, max;
        let labels = props.data.labels.slice(1, -1);
        let data_sets = props.data.datasets.filter((items,i) => i % 2 === 0); //TODO get even?
        filteredData = {
            datasets: data_sets.map(item => {
                let  item_data = item.data.slice(1, -1);
                return {
                    data: item_data,
                    label: item.label,
                    backgroundColor: getBarsColors( labels , props.timeSegment ),
                    borderColor: getBordersColors( item_data.length ),
                    borderWidth: 1,
                    borderDash:[3,2]
                }
            }),
            labels: labels
        };

        return (
            <Card className={"new-chart" + (props.likeForLikeDisplay ? ' likeforLikeOn' : '')}>
                <CardBody>
                    <div>
                        <h5>{this.state.name_of_data}</h5>
                        <Row>
                            <Col md="9" className="datepickers">
                                <div className="wrapper">
                                  <ReactPicker {...props} />
                                </div>
                                {props.likeForLikeDisplay ?
                                    <CheckButton title={"like for like"}
                                                 onPress={props.checkLike}
                                                 tooltip_on={true}
                                                 tooptip_text={'Сравнение с аналогичным периодом в прошлом'}
                                                 color={'#9fd573'}
                                    />
                                    :
                                    <YearSelector render={true} onCheck={props.checkYear} {...props} />
                                }
                            </Col>
                            {(props.viewportWidth > 767 && !props.comparison_mode && !props.likeForLike) ?
                                <Col md="3" className="totalSum">
                                    <DataBarChartTotal NameOfData={this.state.name_of_data} TotalSum={props.totalSum}
                                                       Currency={props.currency} CurrentWidth={props.viewportWidth}/>
                                </Col>
                                :
                                ''
                            }
                        </Row>
                        <Row>
                            <Col md="12">
                                <SelectList onSelect={props.changeTimeSegment} options={options_times}
                                            default_value={props.timeSegment} />
                                <SelectList onSelect={props.changeFloor} options={options_floors}
                                            default_value={props.floorIndex} />
                            </Col>
                            {props.viewportWidth < 768 ?
                                <Col xs="12" className="totalSum">
                                    <DataBarChartTotal NameOfData={this.state.name_of_data} TotalSum={props.totalSum}
                                                       Currency={props.currency} CurrentWidth={props.viewportWidth}/>
                                </Col>
                                :
                                ''
                            }
                        </Row>
                        <Row style={{overflow:'hidden'}}>
                            <Col className="scroll_wrapper">
                                {(props.comparison_mode || props.likeForLike || filteredData.datasets[0].data.length > 31) ?
                                    <div className="data-line-chart_wrapper">
                                       <div>
                                          <YearTable loading={props.requestIsInProcess}
                                                     filteredData={filteredData} {...props} />
                                          <ChartLine loading={props.requestIsInProcess}
                                                     render={!(props.type === 'Выручка')}
                                                     comparison_mode={props.comparison_mode}
                                                     data={props.chart}
                                                     startDate={props.startDate}
                                                     endDate={props.endDate}
                                                     currency={props.currency}
                                                     timeSegment={props.timeSegment}
                                                     emptyData={props.emptyData}
                                                     {...props}
                                          />
                                       </div>
                                    </div>
                                    :
                                    <div className="data-bar-chart_wrapper">
                                        <ChartBar loading={props.requestIsInProcess}
                                                  filteredData={filteredData} max={max}
                                                  {...props}  />
                                    </div>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='0' md="0" xl={{size:3,offset:9}}>
                                <XlsButton title="Скачать в Excel" filename={props.object.obj_name} {...props} />
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

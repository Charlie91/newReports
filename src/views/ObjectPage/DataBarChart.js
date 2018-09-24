import React, { Component } from 'react';
import { Row, Col, Card, CardBody} from "reactstrap";
import {formatNumberBySpaces} from './../../utils/utils';

import ReactPicker from './custom_elements/ReactPicker';
import CheckButton from './custom_elements/CheckButton';
import SelectList from './custom_elements/SelectList';
import YearSelector from './custom_elements/YearSelector';
import ChartBar from './custom_elements/ChartBar';
import ChartLine from './custom_elements/ChartLine';
import XlsButton from './custom_elements/XlsButton';

import utils from './obj_utils';
import moment from 'moment';
import {formatNumericValue} from "../../utils/utils";
import YearTable from './custom_elements/YearTable';
import addCustomTypeWithBorderRadiuses from './addCustomTypeWithBorderRadiuses';

function getBarsColors(dataLength,labels,timeSegment){
    const defaultColorArray = [...'#74c2e8,'.repeat(dataLength).split(',').slice(0,-1)];
    let weekendIndexes = labels.reduce((indexes,item,index) => {
        if(moment(item).day() === 0 || moment(item).day() === 6){
            indexes.push(index)
        }
        return indexes
    },[]);

    if(timeSegment === 'D')
        defaultColorArray.forEach( (color,colorIndex) => {
            weekendIndexes.forEach( index => {
                if(colorIndex === index){
                    defaultColorArray[colorIndex] = '#9fd473'
                }
            })
        });

    return [...defaultColorArray,...'transparent,'.repeat(31 - dataLength).split(',').slice(0,-1)];
}

function getBordersColors(dataLength,labels,timeSegment){
    const defaultColorArray = [...'transparent,'.repeat(dataLength).split(',').slice(0,-1)];

    let weekendIndexes = labels.reduce((indexes,item,index) => {
        if(moment(item).day() === 0 || moment(item).day() === 6){
            indexes.push(index)
        }
        return indexes
    },[]);

    if(timeSegment === 'D')
        defaultColorArray.forEach( (color,colorIndex) => {
            weekendIndexes.forEach( index => {
                if(colorIndex === index){
                    defaultColorArray[colorIndex] = 'transparent'
                }
            })
        });

    return [...defaultColorArray,...'#979797ab,'.repeat(31 - dataLength).split(',').slice(0,-1)];
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
        filteredData = {
            datasets:props.data.datasets.filter((items,i) => i % 2 === 0).map(item => {
                let length = item.data.length - 2;
                if(length < 0 || length > 31) length = 0;
                return {
                    data:item.data.filter((value,i) => i && i !== item.data.length - 1 ),//удаляем мусорные элементы массива
                    label:item.label,
                    backgroundColor:getBarsColors(length,props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1),props.timeSegment),
                    borderColor:getBordersColors(length,props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1),props.timeSegment),
                    borderWidth: 1,
                    borderDash:[3,2]
                }
            }),
            labels:props.data.labels.filter((item,i) => i && i !== props.data.labels.length - 1 )//удаляем мусорные элементы массива
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
                                <span className="data"
                                      dangerouslySetInnerHTML=
                                          {{
                                              __html:`${formatNumberBySpaces(formatNumericValue(Math.round(props.totalSum)))} ${utils.renderCurrency(props)}`
                                          }}
                                >
                                </span>
                                    <span className="muted">{this.state.name_of_data} за выбранный период</span>
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
                                <span className="data"
                                      dangerouslySetInnerHTML=
                                          {{
                                              __html:`${formatNumberBySpaces(formatNumericValue(Math.round(props.totalSum)))} ${utils.renderCurrency(props)}`
                                          }}
                                >
                                </span>
                                    <span className="muted">{this.state.name_of_data} за выбранный период</span>
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

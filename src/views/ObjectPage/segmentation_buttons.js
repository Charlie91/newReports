import React from 'react';
import moment from 'moment';
import xlsExport from './xls-export';
import {Row,Col} from "reactstrap";

const SegmentationButtons = (props) => {
    const xls = props.excelData && new xlsExport((props.excelData), 'Reports');//данные для выгрузки в таблицу
    let bossDemands = props.comparison_mode &&
        (
            props.startDate.month() === props.endDate.month() &&
            props.startDate.date() === 1 &&                                     //мудное пожелание начальства
            props.endDate.date() === props.endDate.daysInMonth()
        );
    let buttons = [
        {val:'Y',text:'По годам',render:(props.startDate.year() !== props.endDate.year())},
        {val:'M',text:'По месяцам',render:(props.startDate.format('YYYY-MM') !== props.endDate.format('YYYY-MM') || bossDemands)},
        {val:'D',text:'По дням',render:(props.startDate.format('YYYY-MM-DD') !== props.endDate.format('YYYY-MM-DD'))},
        {val:'H',text:'По часам',render:( (moment(props.startDate).diff(moment(props.endDate), 'days') > -14) && props.shortestUnit === 'H' )},
    ];
    return (
        <Col md='12' style={{minWidth:'100%'}} className='segmentation_btn-wrp order-1 order-md-12'>
            <Row>
                <Col xs='12' md='12' xl={{size:6,offset:3}}>
                    <div className="btn-group" role="group">
                        {buttons.map( (item,i) =>
                            (item.render) ?
                                <button type="button"
                                        key={i}
                                        data-val={item.val}
                                        disabled={props.requestIsInProcess}
                                        className={'btn ' + ((props.timeSegment === item.val) ? 'active' : '')}
                                        onClick={props.changeTimeSegment}
                                >
                                    {item.text}
                                </button>

                                :

                                ''
                        )}
                    </div>
                </Col>
                <Col xs='0' md="0" xl={{size:3,offset:0}}>
                    <div className="excellLinkWrapper">
                        <a className="excellLink"
                           onClick={xls ? () => {
                               xls.exportToCSV(`Отчет по ${props.object.obj_name}-${moment().format('DD.MM.YY')}.csv`,props)
                           } : ''}
                        >
                            Скачать в Excel
                        </a>
                    </div>
                </Col>
            </Row>
        </Col>
    )
};


export default SegmentationButtons;


import React from 'react';
import {formatNumericValue} from './../../utils/utils';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody
} from "reactstrap";

const date = new Date();
const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

 function toCountLastYear(obj){ // подсчет данных за последний год
     let days = obj.data.day,
         months = obj.data.month;
     let currentMonth = days.reduce((sum, current) => sum + current.v, 0);
     let currentYear = months.reduce((sum, current) => {
         if(current.y !== 2017)return sum + 0;
         else return sum + current.v
     }, currentMonth);
   return formatNumericValue(currentYear)
 }

 function decorator(val){
     return (val === 0) ? '-' : val  //если значение 0 - меняем на "-"
 }

 const DataCard = (props) => (
     <Col style={{ marginBottom: '20px'}} xs="12" sm="6" md="6" lg="6" xl="4">
         <Card>
             <CardHeader style={{ paddingBottom: '0'}}>
                 <Row>
                     <Col md="6">
                         <h5>{props.obj.obj_name}</h5>
                         <p className="contacts">{props.obj.address}</p>
                     </Col>
                     <Col md="6">
                         <img className="title-image" src="img/TradeCenters/rio_leninskiy.png"/>
                         <img className="title-image_hidden" src="img/TradeCenters/rio_leninskiy_color.png"/>
                     </Col>
                 </Row>
             </CardHeader>
             <CardBody>
                 <Row>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сегодня</small>
                         <br/>
                         <strong className="h4 indicator">{(props.obj.data) ? decorator(formatNumericValue(props.obj.data.day[0].v)) : '-' }</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">{months[date.getMonth()]}</small>
                         <br/>
                         <strong className="h4 indicator">{(props.obj.data) ? formatNumericValue(props.obj.data.day.reduce((sum, current) => sum + current.v, 0)) : '' }</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">2017</small>
                         <br/>
                         <strong className="h4 indicator">{(props.obj.data) ? toCountLastYear(props.obj) : '' }</strong>
                     </Col>
                 </Row>
             </CardBody>
         </Card>
     </Col>
)

export default DataCard;
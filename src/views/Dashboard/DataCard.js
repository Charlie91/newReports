import React from 'react';
import {formatNumericValue} from './../../utils/utils';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody
} from "reactstrap";


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
                         <strong className="h4 indicator">{(props.obj.data) ? formatNumericValue(props.obj.data.day[0].v) : '' }</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">Сентябрь</small>
                         <br/>
                         <strong className="h4 indicator">{(props.obj.data) ? formatNumericValue(props.obj.data.month[0].v) : '' }</strong>
                     </Col>
                     <Col xs="4" sm="4" md="4" lg="4" xl="4">
                         <small className="text-muted">2017</small>
                         <br/>
                         <strong className="h4 indicator">{(props.obj.data) ? formatNumericValue(props.obj.data.year[0].v) : '' }</strong>
                     </Col>
                 </Row>
             </CardBody>
         </Card>
     </Col>
)

export default DataCard;
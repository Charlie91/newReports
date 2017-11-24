import React from 'react';
import {
    Row,
    Col
} from "reactstrap";

function Buttons(props){
    return (
        <Row className="select_buttons">
            <Col md={{ size: 5, offset: 1 }}>
                <a href="#" onClick={props.checkAll}>Выбрать все</a>
            </Col>
            <Col md={{ size: 6 }}>
                <a href="#" onClick={props.clearAll}>Очистить выбор</a>
            </Col>
        </Row>
    )
}
export default Buttons;



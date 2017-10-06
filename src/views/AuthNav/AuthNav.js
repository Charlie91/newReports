import React, { Component } from 'react';
import './style.scss';
import {NavLink} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import {
    Row,
    Col,
    Container
} from "reactstrap";

const AuthNav = (props) => {
    return (
            <Row className="auth-nav">
                <Col xs="1" sm="1" md="1"></Col>
                <Col xs="5" sm="5" md="5">
                    <NavLink to={'/authorization'} activeClassName="active">Войти в аккаунт</NavLink>
                </Col>
                <Col xs="5" sm="5" md="5">
                    <NavLink to={'/registration'}  activeClassName="active">Регистрация</NavLink>
                </Col>
                <Col xs="1" sm="1" md="1"></Col>
            </Row>
    )
}

export default AuthNav;
import React, { Component } from 'react';
import {Card, CardBody, Row, Col} from "reactstrap";
import UserDataForm from './userDataForm';
import PasswordChangeForm from './PasswordChangeForm';

import './style.scss';


export default class ProfilePage extends Component{
    constructor(props){
        super(props);
    }

    handleFacebook(status,e){
        e.preventDefault();
        console.log(status,e);
        if(status === 'off')
            fetch('https://repo.re-ports.ru/app_test/FacebookUnregister', {
                credentials: 'include',
                method: 'POST'
            }).then(resp => resp.json()).then(resp => {
                if (resp.success) {
                    console.log('Отвязали успешно');
                } else {
                    console.log('Не отвязались =((' + JSON.stringify(resp));
                }
            });
        else
            fetch('https://repo.re-ports.ru/app_test/FacebookRegisterById?oauthUserId=' + "106473306946196", {
                credentials: 'include',
                method: 'POST'
            }).then(resp => resp.json()).then(resp => {
                if (resp.success) {
                    console.log('Привязали успешно');
                } else {
                    console.log('Не привязались =((' + JSON.stringify(resp));
                }
            });
    }

    addSpecificStyles(){
        document.querySelector('h5.page-title').style.fontSize = '30px';
    }

    removeSpecificStyles(){
        document.querySelector('h5.page-title').style.cssText = '';
    }

    componentDidMount(){
        this.props.upState('title','Учетная запись');//установка заголовка в header
        this.addSpecificStyles();
    }

    componentWillUnmount(){
        this.removeSpecificStyles();
    }

    render(){
        const props = this.props;
        return (
            <div className="profile_page">
                <Card>
                    <CardBody>
                        <Row>
                            <Col>
                                <h4 className="block_title">Личная информация</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="2">
                                <div className="avatar_wrapper">
                                    <div className="avatar_picture">
                                        <img src="/img/avatars/default.png"/>
                                    </div>
                                    <div className="buttons">
                                        <div>изменить</div>
                                        <div>удалить</div>
                                    </div>
                                </div>
                            </Col>
                            <Col md="10">
                                <UserDataForm userData = {props.userData}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button onClick={this.handleFacebook.bind(this, 'on')}>Привязать Facebook аккаунт</button>
                                <button onClick={this.handleFacebook.bind(this,'off')}>Отвязать Facebook аккаунт</button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h4 className="block_title">Пароль</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <PasswordChangeForm/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
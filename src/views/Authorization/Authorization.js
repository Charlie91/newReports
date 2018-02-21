import React, { Component } from 'react';
import './style.scss';
import AuthNav from './../AuthNav/AuthNav';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Redirect} from 'react-router-dom';
import {API} from './../../utils/api_paths';
import {ajaxRequest, deleteRegistrationCookies} from './../../utils/utils';


import {
    Row, Col
} from "reactstrap";

export function showDynamicLabel(nameProperty,text){    //динамический показ лейбла у форм
    if(nameProperty){
        return (
            <span className="label-hint"> {text} </span>
        )
    }
}

export function animateDynamicLabel(nameProperty, text){
    return(
        <ReactCSSTransitionGroup
            transitionName="label"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
        >
            {showDynamicLabel(nameProperty,text)}
        </ReactCSSTransitionGroup>
    )
}

export default class Authorization extends Component {


    constructor(props){
        super(props);
        this.state={
            isLoggedIn:null,
            login:'',
            password:''
        }
    }

    setLogin(e){
        this.setState({login:e.target.value})
    }

    setPassword(e){
        this.setState({password:e.target.value})
    }

    validation(){   //валидация полей
        if(!this.state.login || !this.state.password){
            this.setState({hasErrors:true});
            return false;
        }
        else{
            this.setState({hasErrors:false});
            return true;
        }
    }

    getUserData(){  // парсинг данных пользователя после авторизации
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        ajaxRequest(API.main,options)
            .then(data => {
                this.setState({
                    userName:data.login
                })
            })
            .catch(error => console.log(error));
    }


    checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        ajaxRequest(API.auth ,options)
            .then(data => {
                if (data.authorized === true) {
                    this.setState({isLoggedIn: true});
                    if (("standalone" in window.navigator) && !window.navigator.standalone) {
                        if (this.state.login) localStorage.setItem('login', this.state.login);
                        if (this.state.password) localStorage.setItem('password', this.state.password);
                    }
                }
                else {
                    this.setState({isLoggedIn: false, password: ''});
                    if (("standalone" in window.navigator) && !window.navigator.standalone) {
                        if (localStorage.getItem('login')) this.setState({login: localStorage.getItem('login')});
                        if (localStorage.getItem('password')) this.setState({password: localStorage.getItem('password')});
                    }

                }
            })
            .catch(error => console.log(error));
    }


    logIn(e) {      // запрос на вход\авторизацию пользователя
        if(typeof(e) != "undefined") e.preventDefault();
        if (!this.validation())return;
            let obj = {
                pwd: this.state.password,
                login: this.state.login
            };
            let options = {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-type": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(obj),
                mode: 'cors'
            };
            this.sendDataForLogInAndOut(options);
    }

    logOff(e){  // запрос на выход пользователя\логаут
        e.preventDefault();
        let options = {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors'
        };
        this.sendDataForLogInAndOut(options);
    }

    sendDataForLogInAndOut(options){    //обработка ответов на запросы логина\логаута
        fetch(API.auth,options)
            .then(function (response) {
                return response.json();
            })
            .then(data => {
                if(data.error) {
                    if (data.error.message === 'Неверный логин или пароль') {
                        this.setState({loginIsIncorrect: true})
                    }
                }
                else
                    this.setState({loginIsIncorrect: false,connectionIsFailed:false});
                this.checkEitherLoggedInOrNot()
            })
            .catch(error => this.setState({connectionIsFailed:true}));
    }


    showError(){        //показ ошибок
        if(this.state.hasErrors)
            return(
                <div className="hintMessage alert alert-danger">введите логин и пароль</div>
            );
        if(this.state.loginIsIncorrect)
            return(
                <div className="hintMessage alert alert-danger">логин и пароль неверны</div>
            );
        if(this.state.connectionIsFailed)
            return(
                <div className="hintMessage alert alert-danger">Соединение потеряно</div>
            )
    }
//                                    autoComplete="new-password"                                     size="5"


    showForm(){
            return(
                <div>
                    <div>{(("standalone" in window.navigator) && !window.navigator.standalone) ? 'standalone' : 'nope' }</div>
                    <form action="#" autoComplete="off" method="POST">
                        <div className="form-group">
                            <label>
                                {animateDynamicLabel(this.state.login, 'Логин')}
                                <input
                                    type="text"
                                    value={this.state.login}
                                    onChange={this.setLogin.bind(this)}
                                    autoComplete="on"
                                    className="form-control"
                                    placeholder="Логин"
                                />
                            </label>
                            <label>
                                {animateDynamicLabel(this.state.password, 'Пароль')}
                                <input
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.setPassword.bind(this)}
                                    autoComplete="on"
                                    className="form-control"
                                    placeholder="Пароль"
                                />
                            </label>
                            {this.showError()}
                        </div>
                        <Row>
                            <Col xs={{size: 8, offset:2}} md={{ size: 4, offset:4 }}>
                                <button
                                    type="submit"
                                    className="btn auth-btn"
                                    onClick={this.logIn.bind(this)}
                                    disabled={!(this.state.login && this.state.password)}
                                >
                                    Войти
                                </button>
                            </Col>
                        </Row>
                    </form>
                </div>
            )
    }

    componentDidMount(){
        this.checkEitherLoggedInOrNot();//при заходе на стр сразу проверяем авторизован ли юзер
    }

    render() {
        return (
            <div className="auth-window animated fadeIn">
                <AuthNav/>
                {
                    (this.state.isLoggedIn) ?
                        <Redirect to="/dashboard"/>
                        :
                        this.showForm()
                }
                <div className="blur_layout"> </div>
            </div>
        )
    }
}



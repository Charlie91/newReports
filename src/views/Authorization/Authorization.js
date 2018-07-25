import React, { Component } from 'react';
import './style.scss';
import AuthNav from './../AuthNav/AuthNav';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Redirect} from 'react-router-dom';
import {API} from './../../utils/api_paths';
import {ajaxRequest} from './../../utils/utils';
import {Row, Col} from "reactstrap";




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

function test(){
    console.log('test passed')
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

    checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
        ajaxRequest(API.auth)
            .then(data => {
                if (data.authorized === true){
                    this.setState({isLoggedIn: true});
                    if (("standalone" in window.navigator) && window.navigator.standalone) {
                        if (this.state.login) localStorage.setItem('login', this.state.login);
                        if (this.state.password) localStorage.setItem('password', this.state.password);
                    }
                }
                else {
                    this.setState({isLoggedIn: false, password: ''});
                    if (("standalone" in window.navigator) && window.navigator.standalone) {
                        if (localStorage.getItem('login')) this.setState({login: localStorage.getItem('login')});
                        if (localStorage.getItem('password')) this.setState({password: localStorage.getItem('password')});
                    }
                }
            })
            .catch(error => console.log(error));
    }

    logIn(e) {      // запрос на вход\авторизацию пользователя
        if(typeof(e) !== undefined) e.preventDefault();
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

    checkFB(){
        window.FB.getLoginStatus(resp => {
            console.dir(resp);
            if (resp.status === 'connected') {
                const fbUid = resp.authResponse.userID;
                fetch('https://repo.re-ports.ru/app_test/FbLogin?fbUserId=' + fbUid,{
                    credentials: 'include',
                    method: 'POST'
                }).then(resp => resp.json()).then(resp => {
                    console.log(JSON.stringify(resp));
                    if(resp.success)
                        this.checkEitherLoggedInOrNot();
                    else{
                        FB.api('/me', {
                            locale: 'ru_RU',
                            fields: 'name, email'
                        }, resp => {
                            fetch('https://repo.re-ports.ru/app_test/FbRegisterByEmail?fbUserId=' + fbUid + '&email=' + resp.email, {
                                credentials: 'include',
                                method: 'POST'
                            }).then(resp => resp.json()).then(resp => {
                                console.log('привязка');
                                console.log(resp);
                                this.checkEitherLoggedInOrNot();
                            });
                        });
                    }

                });
            } else {
                console.log('не авторизован')
            }
        });
    };

    handleClickOnFacebookLink(e) {
        e.preventDefault();
        FB.login(this.checkFB.bind(this));
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


    showError(){    //показ ошибок
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

    checkIfChromeAutofilled(){  //Обработка автозаполнения полей в хроме
        let inputs = document.querySelectorAll('.auth-form div input');

        for(let i = 0; i < inputs.length;i++){
            if(getComputedStyle(inputs[i]).boxShadow !== "rgb(250, 251, 252) 0px 0px 0px 1000px inset")
                return false;
        }
        return true;
    }

    showForm(){
        const checkFB = this.checkFB;
            return(
                <div>
                    <form action="#" className="auth-form" autoComplete="on" method="POST">
                        <div className="form-group">
                            <label>
                                {animateDynamicLabel(this.state.login || this.state.chromeAutofill, 'Логин')}
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
                                {animateDynamicLabel(this.state.password || this.state.chromeAutofill, 'Пароль')}
                                <input
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.setPassword.bind(this)}
                                    autoComplete="on"
                                    className="form-control pass"
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
                                    disabled={!(this.state.login && this.state.password) && !this.state.chromeAutofill}
                                >
                                    Войти
                                </button>
                                <a href="#" onClick={this.handleClickOnFacebookLink.bind(this)}>Login with Facebook</a>
                            </Col>
                        </Row>
                    </form>
                </div>
            )
    }

    componentDidMount(){
        this.checkEitherLoggedInOrNot();//при заходе на стр сразу проверяем авторизован ли юзер

        setTimeout(() => {
            if(this.checkIfChromeAutofilled()) //если хром автозаполнил поля - обрабатываем их как заполненные пользователем
                this.setState({chromeAutofill:true});
            else
                this.setState({chromeAutofill:false});
        },500);


        const self = this;//сохранение контекста
        window.fbAsyncInit = function() {
            FB.init({
                appId: '1701579333271892',
                cookie: true,
                xfbml: true,
                version: 'v3.0'
            });
            FB.AppEvents.logPageView();
            self.checkFB();
            console.log('Готов к работе');
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/ru_RU/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }

    componentDidUpdate(prevProps,prevState){
        setTimeout(() => {
            if(!this.checkIfChromeAutofilled() && prevState.chromeAutofill) //если хром автозаполнил поля - обрабатываем их как заполненные пользователем
                this.setState({chromeAutofill:false});
        },500)
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



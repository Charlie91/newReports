import React, { Component } from 'react';
import LoginInput from './inputs/LoginInput.js';
import PasswordInput from './inputs/PasswordInput.js';
import NameInput from './inputs/NameInput.js';
import SurnameInput from './inputs/SurnameInput.js';
import PhoneInput from './inputs/PhoneInput.js';
import EmailInput from './inputs/EmailInput.js';
import PositionInput from './inputs/PositionInput.js';
import OrganizationInput from './inputs/OrganizationInput.js';
import AuthNav from './../AuthNav/AuthNav';
import './registration.scss';
import {ajaxRequest,checkEitherLoggedInOrNot, getCookie, deleteRegistrationCookies} from './../../utils/utils';
import {API} from './../../utils/api_paths';
import { Link, Redirect} from 'react-router-dom';
import frozenGlass from './../../containers/Empty/main';
import {
    Row, Col
} from "reactstrap";



class Registration extends Component {
    constructor(props){
        super(props);
        this.state = {    //состояние null у состояний значит что это поле еще не изменялось, т.е. начальное состояние//false - то, что поле невалидное
            password: getCookie('password') || null,  // любое трушное значение - что все ок
            passwordsAreConfirm:getCookie('password') || null,
            firstName:null,
            lastName:null,
            position:null,
            organization:null,
            email: getCookie('email') || null,
            phone: getCookie('phone') || null,
            registrationIsSuccess:false,
            registrationStep:getCookie('registrationStep') || 1
        }
    }

    fieldIsValid(field,boolean){
        this.setState({[field]:boolean})
        console.log({[field]:boolean});
    }

    firstValidation(){  //валидация на первом шаге
        let state = this.state;
        let obj = {
            password: state.password,
            passwordsAreConfirm:state.passwordsAreConfirm,
            email: state.email,
            phone: state.phone,
        };

        for( let key in obj){        //если поле не изменялось пользователем - переводим его в false(невалидным)
            if(state[key] === null) {
                this.setState({[key]:false})
            }
        }

        for( let key in obj){
            if(!obj[key]) {
                return false;     //если есть невалидные поля - останавливаем выполнение функции
            }
        }
        return true;
    }

    finalValidation(e){ //валидация на втором шаге
        e.preventDefault();

        let state = this.state;
        let obj = {
            password: state.password,
            passwordsAreConfirm:state.passwordsAreConfirm,
            email: state.email,
            login:state.email,
            firstName: state.firstName,
            lastName: state.lastName,
            phone: state.phone,
            position:state.position,
            organization: state.organization,
            job: state.position
        };

        for( let key in obj){        //если поле не изменялось пользователем - переводим его в false(невалидным)
            if(state[key] === null) {
                this.setState({[key]:false})
            }
        }

        for( let key in obj){
            if(!obj[key]) {
                return;     //если есть невалидные поля - останавливаем выполнение функции
            }
        }

        delete obj.passwordsAreConfirm; //готовим объект к отправке и удаляем ненужное св-во
        this.registrationProcess(obj)
    }

    registrationProcess(obj){
        let options = {
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(obj),
            mode: 'cors'
        };
        ajaxRequest(API.register,options)
            .then(data =>{
                if(!data.error)
                    this.setState({registrationIsSuccess:true})
                else
                    this.setState({registrationError: data.error});
            })
            .catch(error => console.log(error));
    }

    showSuccessMessage(){
        return (
            <div className="text-white bg-success text-center card">
                <div className="card-body card-block">
                    Поздравляем с успешной регистрацией, <strong>{this.state.firstName}</strong>!
                    Чтобы <Link to={'/authorization'} className="registr-link">Войти в аккаунт</Link>, предварительно
                    нужно попросить у офис-менеджера произвести активацию.
                </div>
            </div>
        )
    }

    showRegistrationErrors(){
        if(this.state.registrationError){
            return (
                <div className="text-white bg-danger text-center card">
                    <div className="card-body card-block">
                        {this.state.registrationError}
                    </div>
                </div>
            )
        }
    }

    setRegistrationCookies(){
        let date = new Date;
        date.setHours(date.getHours() + 1);
        document.cookie = `email=${this.state.email};password=${this.state.password};phone=${this.state.phone};expires=${date.toUTCString()}`;
        document.cookie = `password=${this.state.password};expires=${date.toUTCString()}`;
        document.cookie = `phone=${this.state.phone};expires=${date.toUTCString()}`;
        document.cookie = `registrationStep=${this.state.registrationStep};expires=${date.toUTCString()}`;
    }

    componentWillMount(){
        checkEitherLoggedInOrNot()
            .then(data => this.setState({isLoggedIn:data.authorized})) //если пользователь залогинен - редиректим на главную
    }

    goToSecondStep(e){  //функция перехода на следующий шаг
        e.preventDefault();
        console.log(e.currentTarget);
        if(this.firstValidation()){
            this.setState({registrationStep:2})
        }
        else{
            console.log('not valid')
        }
    }

    goToFirstStep(e){
        e.preventDefault();
        this.setState({registrationStep:1})
    }

    showRegistrationByStep(){   //рендер-функция выводящая шаги регистрации
        if(this.state.registrationStep === 1)
            return(
                <form action="#" method="POST">
                    <label><h4 className="reg_title">Шаг 1</h4></label>
                    <EmailInput  value={this.state.email} isValid={this.state.email} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <PasswordInput value={this.state.password} isValid={this.state.password} isConfirm={this.state.passwordsAreConfirm} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <PhoneInput  value={this.state.phone} isValid={this.state.phone} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    {this.showRegistrationErrors()}
                        <Row>
                            <Col className="nextStep" md={{ size: 6, offset:3}} xs={{ size: 7, offset: 5 }}>
                                <button
                                    onClick={this.goToSecondStep.bind(this)}
                                    type="submit"
                                    className={
                                        (this.state.email && this.state.password && this.state.passwordsAreConfirm && this.state.phone)

                                        ?
                                            "btn auth-btn"
                                            :
                                            "dsbl btn auth-btn"
                                    }
                                    disabled={!(this.state.email || this.state.password || this.state.passwordsAreConfirm || this.state.phone )}
                                >
                                    Дальше
                                </button>
                            </Col>
                        </Row>
                </form>
            );
        else {
            this.setRegistrationCookies();
            return(
                <form action="#" method="POST">
                    <label><h4 className="reg_title">Шаг 2</h4></label>
                    <Row className="name_group_wrapper">
                        <NameInput  value={this.state.name} isValid={this.state.firstName} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <SurnameInput  value={this.state.surname} isValid={this.state.lastName} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    </Row>
                    <OrganizationInput value={this.state.organization} isValid={this.state.organization} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <PositionInput  value={this.state.position} isValid={this.state.position} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    {this.showRegistrationErrors()}
                    <label>
                        <Row>
                            <Col md={{ size: 4}} xs={{ size: 4}}>
                                <button
                                    onClick={this.goToFirstStep.bind(this)}
                                    type="submit"
                                    className="btn back-btn"
                                >
                                    Назад
                                </button>
                            </Col>
                            <Col md={{ size: 8}} xs={{ size: 8 }}>
                                <button
                                    onClick={this.finalValidation.bind(this)}
                                    type="submit"
                                    className={
                                        (this.state.name && this.state.surname && this.state.position && this.state.organization)

                                            ?
                                            "btn auth-btn finish-btn"
                                            :
                                            "dsbl btn auth-btn finish-btn"
                                    }
                                    disabled={!(this.state.name || this.state.surname || this.state.position || this.state.organization)}
                                >
                                    Зарегистрироваться
                                </button>
                            </Col>
                        </Row>
                    </label>
                </form>
            )
        }
    }

    componentDidUpdate(prevProps,prevState){
        if(this.state.registrationIsSuccess)
            frozenGlass();
        else if(this.state.registrationStep !== prevState.registrationStep)
            frozenGlass();
    }


    render() {
        if(this.state.isLoggedIn)
            return (
                <Redirect to="/dashboard"/>
            );

        else if(this.state.registrationIsSuccess)
            return (
                <div style={{paddingBottom:'35px'}} className="registration-form auth-window animated fadeIn">
                    <AuthNav/>
                    {deleteRegistrationCookies()}
                    {this.showSuccessMessage()}
                </div>
            );

        else
            return (
                <div className="registration-form auth-window animated fadeIn">
                    <AuthNav/>
                    {this.showRegistrationByStep()}
                </div>
            )
    }
}

export default Registration;
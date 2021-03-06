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
import {ajaxRequest,checkEitherLoggedInOrNot} from './../../utils/utils';
import {API} from './../../utils/api_paths';
import { Link, Redirect} from 'react-router-dom';



class Registration extends Component {
    constructor(props){
        super(props);
        this.state = {    //состояние null у состояний значит что это поле еще не изменялось, т.е. начальное состояние
            login:null,     //false - то, что поле невалидное
            password:null,  // любое трушное значение - что все ок
            passwordsAreConfirm:null,
            name:null,
            surname:null,
            position:null,
            organization:null,
            email:null,
            phone:null,
            registrationIsSuccess:false
        }
    }

    fieldIsValid(field,boolean){
        this.setState({[field]:boolean})
    }

    finalValidation(e){
        e.preventDefault();

        for( let key in this.state){        //если поле не изменялось пользователем - переводим его в false(невалидным)
            if(this.state[key] === null) {
                this.setState({[key]:false})
            }
        }

        let state = this.state;
        let obj = {
            login: state.login,
            password: state.password,
            passwordsAreConfirm:state.passwordsAreConfirm,
            email: state.email,
            firstName: state.name,
            lastName: state.surname,
            phone: state.phone,
            organization: state.organization,
            job: state.position
        };

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
                    Поздравляем с успешной регистрацией, <strong>{this.state.login}</strong>!
                Теперь вы можете <Link to={'/authorization'} className="registr-link">Войти в аккаунт</Link>
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


    componentWillMount(){
        checkEitherLoggedInOrNot()
            .then(data => this.setState({isLoggedIn:data.authorized})) //если пользователь залогинен - редиректим на главную
    }

    render() {
        if(this.state.isLoggedIn)
            return (
                <Redirect to="/dashboard"/>
            );
        else if(this.state.registrationIsSuccess)
            return (
                <div className="registration-form auth-window animated fadeIn">
                        <AuthNav/>
                     {this.showSuccessMessage()}
                </div>
            );
        else
            return (
                <div className="registration-form auth-window animated fadeIn">
                    <AuthNav/>
                    <form action="#" method="POST">
                        <LoginInput  isValid={this.state.login} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <PasswordInput isValid={this.state.password} isConfirm={this.state.passwordsAreConfirm} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <NameInput  isValid={this.state.name} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <SurnameInput  isValid={this.state.surname} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <OrganizationInput  isValid={this.state.organization} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <PositionInput  isValid={this.state.position} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <EmailInput  isValid={this.state.email} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        <PhoneInput  isValid={this.state.phone} fieldIsValid={this.fieldIsValid.bind(this)}/>
                        {this.showRegistrationErrors()}
                        <button
                            onClick={this.finalValidation.bind(this)}
                            type="submit"
                            className="btn auth-btn finish-btn"
                        >
                            Зарегистрироваться
                        </button>
                    </form>
                </div>
            )
    }
}

export default Registration;
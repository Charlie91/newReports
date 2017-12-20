import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';
import {getCookie} from './../../../utils/utils';
import ClearField from './ClearField';
import ParentInput from './ParentInput';

class PasswordInput extends ParentInput { //Внимание! Наследует от родительского компонента
    constructor(props){
        super(props);
        this.state = {
            //password:(props.value) ? props.value : '',
            password: props.value || getCookie('password') || '',
            //confirmPassword:(props.value) ? props.value : '',
            confirmPassword:props.value || getCookie('password') || '',
            focus:null,
            isValid:props.isValid,
            isConfirm:props.isConfirm
        }
    }

    setConfirmHint(){
        this.setState({focus_confirm:true});
    }

    hideConfirmHint(){
        this.setState({focus_confirm:false});
    }

    showMessage(){
        if(this.state.focus && !(this.state.isValid === false)&& !(this.state.isConfirm === false) ){
            return(
                <div className="hintMessage">a-z0-9 не более 16 символов</div>
            )
        }
    }
    showError(){            //функция рендера сообщения об ошибке
        if(this.state.isValid === false){
            return(
                <div className="errorMessage">не меньше 6 символов</div>
            )
        }
        if(this.state.isConfirm === false){
            return(
                <div className="confirmError errorMessage">пароли не совпадают</div>
            )
        }
    }
    //^[a-zA-Z0-9-_\.]{1,20}$
    validateField(e){//функция-валидация
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        let value = this.state.password;//e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        if(value === ''){
            this.props.fieldIsValid('password',null);
            return;
        }
       // let regExp = new RegExp('^[a-zA-Z0-9-_\.]{6,20}$');
        if(value.length < 6){   //проверка на соответствие регэкспу  if(!regExp.test(value))
            this.setState({isValid:false});
            this.props.fieldIsValid('password',false);
        }
        else{
            this.setState({isValid:true});
            this.confirmationPasswords();
            this.props.fieldIsValid('password',value);
        }
    }

    onBlurConfirmation(e){
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        this.confirmationPasswords();
        this.hideConfirmHint();
    }

    confirmationPasswords(){
        if(this.state.confirmPassword === this.state.password){
            this.props.fieldIsValid('passwordsAreConfirm',true);
        }
        else{
            this.props.fieldIsValid('passwordsAreConfirm',false);
        }
    }

    setPassword(e){
        this.setState(
            {password:e.target.value},
            () => this.validateField()
        );
    }

    setConfirmPassword(e){
        this.setState(
            {confirmPassword:e.target.value},
            () => this.confirmationPasswords()
        );
    }

    clearField(e){
        e.preventDefault();
        this.input.focus();
        this.setState({password:''},() =>  {
            this.validateField();
            this.setHint();
        });
    }

    clearConfirmField(e){
        e.preventDefault();
        this.confirmInput.focus();
        this.setState({confirmPassword:''},() =>  this.confirmationPasswords());
    }

    componentWillReceiveProps(nextProps){
        this.setState({isValid:nextProps.isValid, isConfirm:nextProps.isConfirm})
    }

    render() {
        return (
            <div className="form-group password-inputs">
                <label>
                    <div className="field">
                        {animateDynamicLabel(this.state.password, 'Пароль')}
                        <input onFocus={this.setHint.bind(this)}
                               onBlur={this.validateField.bind(this)}
                               onChange={this.setPassword.bind(this)}
                               onKeyPress={this.preventEnter.bind(this)}
                               ref={(input) => { this.input = input; }}
                               value={this.state.password}
                               className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                               type="password"
                               placeholder="Пароль"
                        />
                        <ClearField render={this.state.password && this.state.focus} clearField={this.clearField.bind(this)}/>
                    </div>
                    <div className="field">
                        {animateDynamicLabel(this.state.confirmPassword, 'Еще раз')}
                        <input
                            onFocus={this.setConfirmHint.bind(this)}
                            onBlur={this.onBlurConfirmation.bind(this)}
                            onChange={this.setConfirmPassword.bind(this)}
                            onKeyPress={this.preventEnter.bind(this)}
                            ref={(input) => { this.confirmInput = input; }}
                            value={this.state.confirmPassword}
                            className={"form-control " + ( (this.state.isValid === false || this.state.isConfirm === false) ? 'hasErrors' : '') }
                            type="password"
                            placeholder="Еще раз"
                        />
                        <ClearField render={this.state.confirmPassword && this.state.focus_confirm} clearField={this.clearConfirmField.bind(this)}/>
                    </div>
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default PasswordInput;
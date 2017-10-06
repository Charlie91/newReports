import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';

class PasswordInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            focus:null,
            isValid:props.isValid,
            isConfirm:props.isConfirm
        }
    }

    setHint(){
        this.setState({focus:true});
    }
    hideHint(){
        this.setState({focus:false});
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
                <div className="errorMessage">Пароль должен быть не менее 6 символов,состоять только из латинских символов, кириллицы и цифр</div>
            )
        }
        if(this.state.isConfirm === false){
            return(
                <div className="errorMessage">Пароли не совпадают</div>
            )
        }
    }
    //^[a-zA-Z0-9-_\.]{1,20}$
    validateField(e){//функция-валидация
        let value = e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        let regExp = new RegExp('^[a-zA-Z0-9-_\.]{6,20}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('password',false);
        }
        else{
            this.setState({isValid:true});
            this.confirmationPasswords();
            this.props.fieldIsValid('password',value);
        }
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
        this.setState({password:e.target.value})
    }

    setConfirmPassword(e){
        this.setState(
            {confirmPassword:e.target.value},
            () => this.confirmationPasswords()
        );
    }

    componentWillReceiveProps(nextProps){
        this.setState({isValid:nextProps.isValid, isConfirm:nextProps.isConfirm})
    }

    render() {
        return (
            <div className="form-group password-inputs">
                <label>
                    {animateDynamicLabel(this.state.password, 'Пароль')}
                    <input onFocus={this.setHint.bind(this)}
                           onBlur={this.validateField.bind(this)}
                           onChange={this.setPassword.bind(this)}
                           className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                           type="password"
                           placeholder="Пароль"
                    />
                    <input
                        onBlur={this.confirmationPasswords.bind(this)}
                        onChange={this.setConfirmPassword.bind(this)}
                        className={"form-control " + ( (this.state.isValid === false || this.state.isConfirm === false) ? 'hasErrors' : '') }
                        type="password"
                        placeholder="Подтверждение пароля"
                    />
                    {this.showMessage()}
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default PasswordInput;
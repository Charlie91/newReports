import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';
import {API} from './../../../utils/api_paths';
import {ajaxRequest,checkEitherLoggedInOrNot,getCookie} from './../../../utils/utils';
import ClearField from './ClearField';
import ParentInput from './ParentInput';

class EmailInput extends ParentInput { //Внимание! Наследует от родительского компонента
    constructor(props){
        super(props);
        this.state = {
            //value:(props.value) ? props.value : '',
            value: props.value || getCookie('email') || '',
            focus:null,
            isValid:props.isValid
        }
    }


    showHint(){  //функция рендера сообщения подсказки
        if(this.state.focus && !(this.state.isValid === false) && !this.state.isNotAvailable ){
            return(
                <div className="hintMessage">a-z0-9 не более 16 символов</div>
            )
        }
    }

    showError(){            //функция рендера сообщения об ошибке
        if(this.state.isValid === false){
            return(
                <div className="errorMessage">проверьте правильность адреса</div>
            )
        }
        else if(this.state.isNotAvailable){
            return(
                <div className="errorMessage">e-mail {this.state.isNotAvailable} занят</div>
            )
        }
    }

    checkAvailability(){
        let url = API.register + '?email=' + this.state.value;
        let options = {
            method:'GET',
            mode: 'cors'
        };
        ajaxRequest(url,options)
            .then(data => {
                if(data.present)
                    this.setState({isNotAvailable:this.state.value})
                else
                    this.setState({isNotAvailable:false})
            })
            .catch(error => console.log(error));
    }

    validateField(e){//функция-валидация
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        this.hideHint(); //прячем окно с подсказкой
        let value = this.state.value;//e.target.value;
        if(value === ''){
            this.props.fieldIsValid('email',null);
            return;
        }
        let regExp = new RegExp('^[a-zA-Zа-яА-Я0-9-_\.@]{3,30}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('email',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('email',value);
        }
        this.checkAvailability();
    }

    render() {
        return (
            <div className="form-group">
                <label>
                    {animateDynamicLabel(this.state.value, 'E-mail')}
                    <input
                           onChange={this.setValue.bind(this)}
                           onFocus={this.setHint.bind(this)}
                           onBlur={this.validateField.bind(this)}
                           onKeyPress={this.preventEnter.bind(this)}
                           value={this.state.value}
                           className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                           type="text"
                           placeholder="Адрес E-mail"
                    />
                    <ClearField render={this.state.value && this.state.focus} clearField={this.clearField.bind(this)}/>
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default EmailInput;
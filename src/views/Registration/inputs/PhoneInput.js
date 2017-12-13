import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';
import {getCookie} from './../../../utils/utils';
import ClearField from './ClearField';
import ParentInput from './ParentInput';
import InputMask from 'react-input-mask';

class PhoneInput extends ParentInput { //Внимание! Наследует от родительского компонента
    constructor(props){
        super(props);
        this.state = {
            //value:(props.value) ? props.value : '',
            value: props.value || getCookie('phone') || '',
            focus:null,
            isValid:props.isValid
        }
    }


    showHint(){  //функция рендера сообщения подсказки
        if(this.state.focus && !(this.state.isValid === false)){
            return(
                <div className="hintMessage">a-z0-9 не более 16 символов</div>
            )
        }
    }

    showError(){            //функция рендера сообщения об ошибке
        if(this.state.isValid === false){
            return(
                <div className="errorMessage">Номер телефона невалиден</div>
            )
        }
    }

    validateField(e){//функция-валидация
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        let value = this.state.value;//e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        if(value === ''){
            this.props.fieldIsValid('phone',null);
            return;
        }
        let regExp = new RegExp('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('phone',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('phone',value);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label>
                    {animateDynamicLabel(this.state.value, 'Телефон')}
                    <InputMask
                           onFocus={this.setHint.bind(this)}
                           onBlur={this.validateField.bind(this)}
                           onChange={this.setValue.bind(this)}
                           onKeyPress={this.preventEnter.bind(this)}
                           value={this.state.value}
                           className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                           type="text"
                           placeholder="Номер телефона"
                           mask="+7 (999) 999-99-99"
                    />
                    <ClearField render={this.state.value && this.state.focus} clearField={this.clearField.bind(this)}/>
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default PhoneInput;
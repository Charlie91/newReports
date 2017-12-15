import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';
import ClearField from './ClearField';
import ParentInput from './ParentInput';

export default class OrganizationInput extends ParentInput { //Внимание! Наследует от родительского компонента
    constructor(props){
        super(props);
        this.state = {
            value:(props.value) ? props.value : '',
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
                <div className="errorMessage">Должность может быть не менее 3 символов,состоять только из латинских символов или кириллицы</div>
            )
        }
    }

    validateField(e){//функция-валидация
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        let value = this.state.value;
        this.hideHint(); //прячем окно с подсказкой
        if(value === ''){
            this.props.fieldIsValid('organization',null);
            return;
        }
        let regExp = new RegExp('^[a-zA-Zа-яА-Я-_\.]{1,250}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('organization',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('organization',value);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label>
                    {animateDynamicLabel(this.state.value, 'Место работы')}
                    <input onFocus={this.setHint.bind(this)}
                           onBlur={this.validateField.bind(this)}
                           onChange={this.setValue.bind(this)}
                           onKeyPress={this.preventEnter.bind(this)}
                           value={this.state.value}
                           className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                           type="text"
                           placeholder="Место работы"
                    />
                    <ClearField render={this.state.value && this.state.focus} clearField={this.clearField.bind(this)}/>
                </label>
            </div>
        )
    }
}

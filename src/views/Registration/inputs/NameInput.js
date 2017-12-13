import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';
import ClearField from './ClearField';
import ParentInput from './ParentInput';
import {
     Col
} from "reactstrap";

class NameInput extends ParentInput { //Внимание! Наследует от родительского компонента
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
                <div className="errorMessage">Имя может быть не менее 2 символов,состоять только из латинских символов или кириллицы</div>
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
            this.props.fieldIsValid('name',null);
            return;
        }
        let regExp = new RegExp('^[a-zA-Zа-яА-Я-.]{1,256}$');
        if(value.length < 1){   //проверка на соответствие регэкспу !regExp.test(value)
            this.setState({isValid:false});
            this.props.fieldIsValid('name',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('name',value);
        }
    }

    render() {
        return (
            <Col xs='12' lg="6">
                <div className="form-group name-group">
                    <label>
                        {animateDynamicLabel(this.state.value, 'Имя')}
                        <input onFocus={this.setHint.bind(this)}
                               onBlur={this.validateField.bind(this)}
                               onChange={this.setValue.bind(this)}
                               onKeyPress={this.preventEnter.bind(this)}
                               value={this.state.value}
                               className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                               type="text"
                               placeholder="Ваше Имя"
                        />
                        <ClearField render={this.state.value && this.state.focus} clearField={this.clearField.bind(this)}/>
                        {this.showError()}
                    </label>
                </div>
            </Col>
        )
    }
}

export default NameInput;
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

    setName(e){
        this.setState(
            {value:e.target.value},
           () => this.validateField()
        );
        this.setState({value:e.target.value})
    }

    validateField(e){//функция-валидация
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        let value = this.state.value;//e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        if(value === ''){
            this.props.fieldIsValid('firstName',null);
            return;
        }
        let regExp = new RegExp('^[a-zA-Zа-яА-Я-.]{0,256}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу !regExp.test(value)
            this.setState({isValid:false});
            this.props.fieldIsValid('firstName',false);
        } else {
            this.setState({isValid:true});
            this.props.fieldIsValid('firstName',value);
        }
    }

    validateFieldStrict(e){//функция-валидация
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        let value = this.state.value;//e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        if(value === ''){
            this.props.fieldIsValid('firstName',null);
            return;
        }
        let regExp = new RegExp('^[a-zA-Zа-яА-Я-.]{2,256}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу !regExp.test(value)
            this.setState({isValid:false});
            this.props.fieldIsValid('firstName',false);
        } else {
            this.setState({isValid:true});
            this.props.fieldIsValid('firstName',value);
        }
    }

    render() {
        return (
            <Col xs='12' lg="6">
                <div className="form-group name-group">
                    <label>
                        {animateDynamicLabel(this.state.value, 'Имя')}
                        <input onFocus={this.setHint.bind(this)}
                               onBlur={this.validateFieldStrict.bind(this)}
                               onChange={this.setName.bind(this)}
                               onKeyPress={this.preventEnter.bind(this)}
                               ref={(input) => { this.input = input; }}
                               value={this.state.value}
                               className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                               type="text"
                               placeholder="Имя"
                        />
                        <ClearField render={this.state.value && this.state.focus} clearField={this.clearField.bind(this)}/>
                    </label>
                </div>
            </Col>
        )
    }
}

export default NameInput;
import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';
import ClearField from './ClearField';
import ParentInput from './ParentInput';
import {
    Col
} from "reactstrap";

class SurnameInput extends ParentInput { //Внимание! Наследует от родительского компонента
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
                <div className="errorMessage">Фамилия может быть не менее 2 символов,состоять только из латинских символов или кириллицы</div>
            )
        }
    }

    setSurname(e){
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
            this.props.fieldIsValid('lastName',null);
            return;
        }
        let regExp = new RegExp('^[a-zA-Zа-яА-Я-.]{0,256}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('lastName',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('lastName',value);
        }
    }

    validateFieldStrict(e){//функция-валидация
        if(e && e.relatedTarget){ //фикс бага
            if(e.relatedTarget.classList.contains("clear-field"))return; //если фокус ушел на кнопку очистки поля - не валидировать
        }
        let value = this.state.value;//e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        if(value === ''){
            this.props.fieldIsValid('lastName',null);
            return;
        }
        let regExp = new RegExp('^[a-zA-Zа-яА-Я-.]{2,256}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('lastName',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('lastName',value);
        }
    }


    render() {
        return (
            <Col lg='6' xs='12'>
                <div className="form-group name-group">
                    <label>
                        {animateDynamicLabel(this.state.value, 'Фамилия')}
                        <input onFocus={this.setHint.bind(this)}
                               onBlur={this.validateFieldStrict.bind(this)}
                               onChange={this.setSurname.bind(this)}
                               onKeyPress={this.preventEnter.bind(this)}
                               ref={(input) => { this.input = input; }}
                               value={this.state.value}
                               className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                               type="text"
                               placeholder="Фамилия"
                        />
                        <ClearField render={this.state.value && this.state.focus} clearField={this.clearField.bind(this)}/>
                    </label>
                </div>
            </Col>
        )
    }
}

export default SurnameInput;
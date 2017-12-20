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
            value: props.value || getCookie('phone') || '',
            focus:null,
            isValid:props.isValid,
            mask:"+9 (999) 999-99-99"
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
                <div className="errorMessage">Не менее 11 цифр</div>
            )
        }
    }

    setPhonethroughMask(e){//играем маской телефона
        let value = (!e) ? this.state.value : e.target.value;

        if(value[1] === '8'){
            let newStr = '';
            for(let i = 0; i < value.length;i++){
                if(i === 1 && value[i] === '8'){
                    newStr += '7';
                }
                else
                    newStr += value[i];
            }
            value = newStr;
        }
        else if(value[1] === '3'){
            this.setState({mask:'+999 (99) 99-99-99'})
        }
        else{
            this.setState({mask:'+9 (999) 999-99-99'})
        }
        //
        if (typeof e !== 'undefined') {
            this.setState({value: e.target.value},
                () => this.validateField()
            );
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
        let regExp = new RegExp('^(\\s*)?(\\+)?([- _():=+]?\\d[- _():=+]?){10,14}(\\s*)?$');

        if(!regExp.test(value) || ( value.replace(/[^0-9]/gim,'').length < 11) ){   //проверка на соответствие регэкспу and length
            this.setState({isValid:false});
            this.props.fieldIsValid('phone',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('phone',value);
        }

    }

    clearField(e){
        e.preventDefault();
        this.focusOnInput();
        this.setState({value:''},() =>  {
            this.validateField();
            this.setHint();
        });
    }

    focusOnInput(){
        let input = document.querySelector('div.phone input');
        console.log(input);
        this.setState({value:''},() => {
            input.focus();
        });
    }

    componentDidMount(){
        this.setPhonethroughMask();
    }

    render() {
        return (
            <div className="form-group phone">
                <label>
                    {animateDynamicLabel(this.state.value, 'Телефон')}
                    <InputMask
                        onFocus={this.setHint.bind(this)}
                        onBlur={this.validateField.bind(this)}
                        onChange={this.setPhonethroughMask.bind(this)}
                        onKeyPress={this.preventEnter.bind(this)}
                        value={this.state.value}
                        className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                        type="text"
                        placeholder="Номер телефона"
                        mask={this.state.mask}
                    />
                    <ClearField render={this.state.value && this.state.focus && (this.state.value !== "+_ (___) ___-__-__")} clearField={this.clearField.bind(this)}/>
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default PhoneInput;
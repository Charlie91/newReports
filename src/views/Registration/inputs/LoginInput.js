import React, { Component } from 'react';
import {animateDynamicLabel} from '../../Authorization/Authorization';
import {API} from './../../../utils/api_paths';
import {ajaxRequest,checkEitherLoggedInOrNot} from './../../../utils/utils';

class LoginInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            value:null,
            focus:null,
            isValid:props.isValid
        }
    }

    setHint(){
        this.setState({focus:true});
    }

    hideHint(){
        this.setState({focus:false});
    }

    showHint(){  //функция рендера сообщения подсказки
        if(this.state.focus && !(this.state.isValid === false) && !this.state.isNotAvailable){
            return(
                <div className="hintMessage">a-z0-9 не более 16 символов</div>
            )
        }
    }

    showError(){    //функция рендера сообщения об ошибке
        if(this.state.isValid === false){
            return(
                <div className="errorMessage">Логин должен быть не менее 6 символов, не начинаться с цифры, состоять только из латинских символов и цифр;</div>
            )
        }
        else if(this.state.isNotAvailable){
            return(
                <div className="errorMessage">Логин {this.state.isNotAvailable} занят</div>
            )
        }
    }

    componentWillReceiveProps(nextProps){
            this.setState({isValid:nextProps.isValid})
    }

    checkAvailability(){
       let url = API.register + '?login=' + this.state.value;
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
        let value = e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        let regExp = new RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{5,20}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('login',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('login',value);
        }
        this.checkAvailability();
    }

    setValue(e){
        this.setState({value:e.target.value})
    }

    render() {
        return (
            <div className="form-group">
                <label>
                    {animateDynamicLabel(this.state.value, 'Логин')}
                    <input onFocus={this.setHint.bind(this)}
                           onBlur={this.validateField.bind(this)}
                           onChange={this.setValue.bind(this)}
                           className={"form-control " + ( (this.state.isValid === false) ? 'hasErrors' : '') }
                           type="text"
                           placeholder="Логин"
                    />
                    {this.showHint()}
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default LoginInput;
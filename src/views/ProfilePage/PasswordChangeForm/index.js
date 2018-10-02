import React, { Component } from 'react';
import {ajaxRequest} from 'Src/utils/utils';
import {API} from 'Src/utils/api_paths';
import ErrorMessage from 'Src/utils/assistantComponents/ErrorMessage';
import SuccessMessage from 'Src/utils/assistantComponents/SuccessMessage';



export default class PasswordChangeForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            old_password:'',
            new_password:'',
            repeat_new_password:'',
            passwordsAreNotEqual:false,
            newPasswordIsInvalid:false,
        };
        this.initialState = Object.assign({},this.state);//для удобного сброса стейта;
    }

    setValue(e){
        this.setState({[e.target.name]:e.target.value})
    }

    sendNewPassword(e){
        e.preventDefault();

        if(!this.validatePasswords()){
            this.setState(this.getClearedStateWithNewProps({
                newPasswordIsInvalid:true
            }));
            return;
        }
        if(!this.confirmPasswords()){
            this.setState(this.getClearedStateWithNewProps({
                passwordsAreNotEqual:true
            }));
            return;
        }

        const passwords = {
            oldPass:this.state.old_password,
            newPass:this.state.new_password
        };
        let options = {
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
            credentials: 'include',
            body:JSON.stringify(passwords),
            mode: 'cors'
        };
        ajaxRequest(API.changePassword,options)
            .then(data => {
                console.log(data);
                if(data.success)
                    this.setState(this.getClearedStateWithNewProps({
                        passwordHasBeenChanged:true
                    }));
                else
                    this.setState(this.getClearedStateWithNewProps({
                        passwordHasBeenChanged:false,
                        errorWasOccured:true
                    }));
            })
            .catch(err => console.log(err))
    }

    getClearedStateWithNewProps(obj){   //возвращает сброшенный state и добавляет новые переданные св-ва
       return Object.assign(this.initialState,obj);
    }

    validatePasswords(){
        return this.state.new_password.length >= 6;
    }

    confirmPasswords(){
        return this.state.new_password === this.state.repeat_new_password;
    }

    render(){
        const [props,state] = [this.props, this.state];
        return(
            <div>
                <form action="#" method="POST" className="password_change_form">
                    <div className="form-group">
                        <label>
                            <span>Текущий пароль</span>
                            <input
                                value={state.old_password || ''}
                                type="text"
                                name="old_password"
                                onChange={this.setValue.bind(this)}
                                className="form-control"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <span>Новый пароль</span>
                            <input
                                value={state.new_password || ''}
                                type="text"
                                name="new_password"
                                onChange={this.setValue.bind(this)}
                                className="form-control"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <span className="repeat-password">Повторите пароль</span>
                            <input
                                value={state.repeat_new_password || ''}
                                type="text"
                                name="repeat_new_password"
                                onChange={this.setValue.bind(this)}
                                className="form-control"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <button
                            className="btn auth-btn"
                            onClick={this.sendNewPassword.bind(this)}
                            type="submit"
                            disabled={!(state.old_password && state.new_password && state.repeat_new_password)}
                        >
                            Сохранить изменения
                        </button>
                    </div>
                </form>
                {state.passwordHasBeenChanged ?
                    <SuccessMessage text="Ваш пароль успешно сменен"/>
                    :
                    ''
                }
                {state.errorWasOccured ?
                    <ErrorMessage text="Неверно указан старый пароль"/>
                    :
                    ''
                }
                {state.passwordsAreNotEqual ?
                    <ErrorMessage text="Пароли не совпадают"/>
                    :
                    ''
                }
                {state.newPasswordIsInvalid ?
                    <ErrorMessage text="Новый пароль должен быть не менее 6 символов"/>
                    :
                    ''
                }


            </div>
        )
    }
}
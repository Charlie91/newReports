import React from 'react';
import Authorization from './Authorization.js';
import {ajaxRequest} from './../../utils/utils';
import {Redirect} from 'react-router-dom';
import {API} from './../../utils/api_paths';

export default class LogOut extends Authorization { // Внимание! Этот класс наследует от класса авторизации
    constructor(props){
        super(props);
        this.state={
            isLoggedIn:this.props.isLoggedIn
        }
    }


    logOff(e){  // запрос на выход пользователя\логаут
        e.preventDefault();
        let options = {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors'
        };
        this.sendDataForLogInAndOut(options);
    }

    componentWillReceiveProps(nextProps){
                this.setState({isLoggedIn:nextProps.isLoggedIn})
    }

    sendDataForLogInAndOut(options){    //обработка ответов на запросы логина\логаута
        ajaxRequest(API.auth,options)
            .then(data => {
                if(data.success){
                    this.setState({isLoggedIn:false})
                }
            })
            .catch(error => console.log(error));
    }
//<button className="btn btn-link" onClick={this.logOff.bind(this)}><i className="fa fa-user-times fa-lg mt-1"></i></button>
    render(){
        return (
            <div>
                { (this.state.isLoggedIn === false) ? <Redirect to="/authorization"/> : ''}
                <button className="settings-btn" onClick={this.logOff.bind(this)}><img src="img/settings.png"/></button>
            </div>
        )
    }

}
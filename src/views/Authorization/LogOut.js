import React, { Component } from 'react';
import Authorization from './Authorization.js';
import {ajaxRequest} from './../../utils/utils';
import {Redirect} from 'react-router-dom';
import {API} from './../../utils/api_paths';

export default class LogOut extends Authorization {
    constructor(props){
        super(props);
        this.state={
            isLoggedIn:null
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

    sendDataForLogInAndOut(options){    //обработка ответов на запросы логина\логаута
        ajaxRequest(API.auth,options)
            .then(data => {
                if(data.success){
                    this.setState({isLoggedIn:false})
                }
            })
            .catch(error => console.log(error));
    }

    render(){
        return (
            <div>
                { (this.state.isLoggedIn === false) ? <Redirect to="/authorization"/> : ''}
                <button className="btn btn-link" onClick={this.logOff.bind(this)}><i className="fa fa-user-times fa-lg mt-1"></i></button>
            </div>
        )
    }

}
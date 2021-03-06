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

    componentDidMount(){
        //метод необходим, чтобы не применялся метод родителя
    }

    componentDidUpdate(){
        //метод необходим, чтобы не применялся метод родителя
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
                <div className="exit-btn--full" onClick={this.logOff.bind(this)}>выход</div>
                <div className="exit-btn--minimize" onClick={this.logOff.bind(this)}></div>
            </div>
        )
    }
}
import React, { Component } from 'react';
import EmailInput from './../../Registration/inputs/EmailInput.js';


export default class UserDataForm extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps){
        this.setState({...nextProps.userData});
    }


    setValue(e){
        this.setState({[e.target.name]:e.target.value})
    }

    render(){
        const [props,state] = [this.props, this.state];
        return(
            <div>
                <form action="#" method="POST" className="userdata_form">
                    <div className="form-group">
                        <label>
                            <span>Имя</span>
                            <input
                                value={state.first_name || ''}
                                type="text"
                                placeholder="Введите имя"
                                name="first_name"
                                onChange={this.setValue.bind(this)}
                                className="form-control"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <span>Фамилия</span>
                            <input
                                value={state.last_name || ''}
                                placeholder="Введите фамилию"
                                type="text"
                                name="last_name"
                                onChange={this.setValue.bind(this)}
                                className="form-control"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="with-note">
                            <span>Адрес e-mail</span>
                            <input
                                value={state.email || ''}
                                placeholder="Введите адрес e-mail"
                                type="text"
                                name="email"
                                onChange={this.setValue.bind(this)}
                                className="form-control"
                            />
                            <small>для уведомлений и авторизации</small>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <span>Должность</span>
                            <input
                                value={state.job_position || ''}
                                placeholder="Введите должность"
                                type="text"
                                name="job_position"
                                onChange={this.setValue.bind(this)}
                                className="form-control"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <button
                            className="btn auth-btn"
                            type="submit"
                            disabled={true}
                        >
                            Сохранить изменения
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}
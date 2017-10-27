import React, { Component } from 'react';
import TreeSelectComp from './../TreeSelect/TreeSelect.js';

import {
    Col,
    NavbarToggler,
} from 'reactstrap';




class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: null,
            title:''
        };
    }

    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
    }

    sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden');
    }

    setTitle(arr){  //установка заголовка страницы
        let url = window.location.href;
        let idPosition = url.lastIndexOf('#');
        let conceptionURL = url.slice(idPosition+1);
        arr.forEach( item => {
            if(item.url === conceptionURL)this.setState({title:item.full_name}); //если адрес текущей ссылки в браузере совпадает с любой ссылкой из концепций - устанавливаем концепцию как заголовок
            else{
                if(item.children){
                    item.children.forEach( child => {
                        if(child.url === conceptionURL)this.setState({title:child.full_name})//если нет совпадений смотрим в дочерних концепциях
                    })
                }
            }
        })
    }

    sendDataUpward(name,value){ //отправка данных из дочернего компонента в родительский
        this.props.upState(name,value)
    }

    componentWillReceiveProps(nextProps){
        //if(nextProps.conceptions.length > 1)this.setTitle(this.props.conceptions);
    }


    render() {
        return (
            <header className="app-header navbar">
                <Col>
                    <NavbarToggler style={{fontSize: '3em',zIndex: '100'}} className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
                    <h5 className="page-title" style={{ paddingLeft: '15px'}}>{this.props.title}</h5>
                    {(~this.props.location.pathname.indexOf('object')) ?
                        <p className="address">{this.props.address}</p>
                            :
                    < TreeSelectComp
                        upState={this.sendDataUpward.bind(this)}
                        availableCities={this.props.availableCities}
                        />
                    }

                </Col>
            </header>
        )
    }
}

export default Header;

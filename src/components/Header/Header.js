import React, { Component } from 'react';
import TreeSelectComp from '../../views/TreeSelect/TreeSelect.js';
import moment from 'moment';

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

    sendDataUpward(name,value){ //отправка данных из дочернего компонента в родительский
        this.props.upState(name,value)
    }

    render() {
        return (
            <header className="app-header navbar">
                <Col md="12" lg="6">
                    <NavbarToggler style={{fontSize: '3em',zIndex: '100'}} className="d-lg-none" onClick={this.mobileSidebarToggle}>
                    </NavbarToggler>
                    <h5 className="page-title" >{this.props.title}</h5>
                    {(~this.props.location.pathname.indexOf('dashboard') || ~this.props.location.pathname.indexOf('conceptions') ) ?
                        <TreeSelectComp
                            upState={this.sendDataUpward.bind(this)}
                            availableCities={this.props.availableCities}
                        />
                        :
                        ''
                    }
                </Col>
                <Col md="0" lg="1" xl="1" className="dateBlock">
                    <div className="date">{moment().date()}</div>
                    <div className="month">
                        {['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'][moment().month()]}
                    </div>
                </Col>
            </header>
        )
    }
}

export default Header;

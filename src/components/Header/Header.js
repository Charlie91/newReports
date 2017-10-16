import React, { Component } from 'react';
import 'react-select-plus/dist/react-select-plus.css';
import TreeSelectComp from './../TreeSelect/TreeSelect.js';

import {
    Col,
    NavbarToggler,
} from 'reactstrap';




class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: null
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
                <Col>
                    <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
                    <TreeSelectComp
                        upState={this.sendDataUpward.bind(this)}
                        availableCities={this.props.availableCities}
                    />
                </Col>
            </header>
        )
    }
}

export default Header;

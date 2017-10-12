import React, { Component } from 'react';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import TreeSelectComp from './../TreeSelect/TreeSelect.js';
import LogOut from './../../views/Authorization/LogOut';

import {
    Col,
    Row,
    FormGroup,
    Badge,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Nav,
    NavItem,
    NavLink,
    NavbarToggler,
    NavbarBrand,
    DropdownToggle,
    Button,
    ButtonDropdown,
    Form,
    FormText,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButton
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

    sendDataUpward(name,value){
        this.props.upState(name,value)
    }


    logChange(val) {
        console.log("Selected: " + val);
        this.setState({inputValue:val})
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

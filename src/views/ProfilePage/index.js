import React, { Component } from 'react';
import {Card, CardBody, Row, Col} from "reactstrap";
import './style.scss';


export default class ProfilePage extends Component{
    constructor(props){
        super(props);
    }

    addSpecificStyles(){
        document.querySelector('h5.page-title').style.fontSize = '30px';
    }

    removeSpecificStyles(){
        document.querySelector('h5.page-title').style.cssText = '';
    }

    componentDidMount(){
        this.props.upState('title','Учетная запись');//установка заголовка в header
        this.addSpecificStyles();
    }

    componentWillUnmount(){
        this.removeSpecificStyles();
    }

    render(){
        return (
            <div className="profile_page">
                <Card>
                    <CardBody>
                        <Row>
                            <Col>
                                <h4 className="block_title">Личная информация</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="avatar"></div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
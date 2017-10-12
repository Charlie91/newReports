import React, { Component } from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {API} from './../../utils/api_paths';
import {ajaxRequest} from './../../utils/utils';

import {
    Row,
    Col,
    Container
} from "reactstrap";


class Conception extends Component {

    constructor(props){
        super(props);
    }

    getCities(){    //получаем города в которых доступны объекты
        let id = this.props.match.params.child || this.props.match.params.id;
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        return ajaxRequest(API.cities+id,options)
            .then( data => data)
            .catch( error => console.log(error))
    }

    getObjects(){

    }

    renderParent(){
        return (
            <span>hello {this.props.match.params.id}</span>
        )
    }

    renderChild(){
        return (
            <span>hello {this.props.match.params.id} {this.props.match.params.child}</span>
        )
    }

    componentWillReceiveProps(nextProps){
        this.getCities()
            .then( data => {this.setState({cities:data});console.log(this.state.cities)} ) // устанавливаем города в state
    }


    render(){
        console.log(this.props);
        if(this.props.match.params.child)
            return (
                <div>
                    {this.renderChild()}
                </div>
            )
        else
            return(
                <div>
                    {this.renderParent()}
                </div>
            )
    }

}

export default Conception;
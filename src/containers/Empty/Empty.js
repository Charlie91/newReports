import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Registration from '../../views/Registration/Registration.js';
import Authorization from '../../views/Authorization/Authorization.js';
import './style.scss';

class Empty extends Component {
    componentDidMount(){
        document.body.classList.remove('sidebar-fixed'); //убираем класс с body чтобы выровнять контентный блок
    }

    render() {
        return (
            <div className="app auth-layer">
                <div className="app-body">
                    <main className="main">
                        <Container fluid>
                            <Switch>
                                <Route path="/registration" name="registr" component={Registration}/>
                                <Route path="/authorization" name="authoriz" component={Authorization}/>
                            </Switch>
                        </Container>
                    </main>
                </div>
            </div>
        );
    }
}

export default Empty;

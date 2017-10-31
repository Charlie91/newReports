import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Container} from 'reactstrap';
import Registration from '../../views/Registration/Registration.js';
import Authorization from '../../views/Authorization/Authorization.js';
import './style.scss';

class Empty extends Component {
    componentDidMount(){
        document.body.classList.remove('sidebar-fixed'); //убираем класс с body чтобы выровнять контентный блок
        document.addEventListener("touchstart", function(){}, true);    //обработчик корректного отображения ontap подсветок на моб-х устройствах
    }

    render() {
        return (
            <div className="app auth-layer">
                <div className="empty-tmpl-app">
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

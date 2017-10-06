import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';
import {ajaxRequest} from './../../utils/utils';
import {API} from './../../utils/api_paths';

class Full extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : null
        }
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.remove('sidebar-mobile-show');
    }

    checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        ajaxRequest(API.auth,options)
            .then(data => {
                if(data.authorized)
                    this.setState({isLoggedIn:true})
                else
                    this.setState({isLoggedIn:false})
            })
            .catch(error => console.log(error));
    }

    componentDidMount(){
        this.checkEitherLoggedInOrNot()
    }

    render() {
        return (
            <div className="app">
                <Header isLogged={this.state.isLoggedIn}/>
                <div className="app-body">
                    <Sidebar {...this.props}/>
                    <main className="main" onClick={this.mobileSidebarToggle}>
                        <Container fluid>
                            <Switch>
                                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                                <Redirect from="/" to="/dashboard"/>
                            </Switch>
                        </Container>
                    </main>
                    <Aside />
                </div>
                <Footer />
            </div>
        );
    }
}

export default Full;

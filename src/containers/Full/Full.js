import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';
import {ajaxRequest} from './../../utils/utils';
import {API} from './../../utils/api_paths';
import Conception from './../../views/Conception/Conception';

class Full extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : null,
            availableCities:[],
            conceptions : [
                {
                    name: 'Главная',
                    full_name:'ТРЦ Трафик',
                    url: '/dashboard',
                    icon: 'icon-home',
                    badge: {
                        variant: 'info'
                    }
                }
            ]
        }
    }

    mobileSidebarToggle(e){
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

    receiveConceptionLists(){   //получаем список концепций для заполнения меню
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        }
        ajaxRequest(API.nav,options)
            .then( data => {
                let arr = this.state.conceptions;
                if(Array.isArray(data)){
                    data.forEach( item => {
                        item.url = '/conceptions/' + item.id;
                        item.icon = 'icon-chart';
                        if(item.children){
                            item.children.forEach( child => {
                                child.url = item.url + '/' + child.id;
                            })
                        }
                        arr.push(item)
                    });
                    this.setState({conceptions:arr})
                }
            })
            .catch( error => console.log(error))
    }

    upState(name,value){
        this.setState({[name]:value})//обновляем стейт данными из дочерних компонентов
    }

    componentDidMount(){
        this.checkEitherLoggedInOrNot();
        this.receiveConceptionLists();
    }

    render() {
        return (
            <div className="app">
                <Header
                    isLogged={this.state.isLoggedIn}
                    availableCities={this.state.availableCities}
                    conceptions={this.state.conceptions}
                    upState={this.upState.bind(this)}
                />
                <div className="app-body">
                    <Sidebar conceptions={this.state.conceptions} {...this.props}/>
                    <main className="main" onClick={this.mobileSidebarToggle}>
                        <Container fluid>
                            <Switch>
                                <Route path="/dashboard" name="Dashboard" render={(props) =>
                                    <Dashboard cities={this.state.availableCities} upState={this.upState.bind(this)} {...props}/>}
                                />
                                <Route exact path="/conceptions/:id"  name="Conception"
                                       render={(props) =>
                                           <Conception cities={this.state.availableCities}  upState={this.upState.bind(this)} {...props} />
                                       }
                                />
                                <Route exact path="/conceptions/:id/:child"  name="Conception"
                                       render={(props) =>
                                           <Conception cities={this.state.availableCities}  upState={this.upState.bind(this)} {...props} />
                                       }
                                />
                                <Redirect from="/" to="/dashboard"/>
                            </Switch>
                        </Container>
                    </main>
                    <Aside/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Full;

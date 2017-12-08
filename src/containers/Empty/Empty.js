import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Container} from 'reactstrap';
import Registration from '../../views/Registration/Registration.js';
import Authorization from '../../views/Authorization/Authorization.js';
import './style.scss';
import './style-blur.css';
import frozenGlass from './main';

class Empty extends Component {
    componentDidMount(){
        document.body.classList.remove('sidebar-fixed'); //убираем класс с body чтобы выровнять контентный блок
        document.addEventListener("touchstart", function(){}, true);    //обработчик корректного отображения ontap подсветок на моб-х устройствах
        frozenGlass(); //эмулируем blur
        window.onresize = () => frozenGlass(); //эмулируем blur
    }
    componentDidUpdate(){
        frozenGlass(); //эмулируем blur
    }

    deleteFrozenGlass(){
        let frame = document.getElementById('blurredContentFrame');
        document.body.removeChild(frame);
    }

    componentWillUnmount(){
        this.deleteFrozenGlass();//удаляем эмуляцию блюра при переходе на др. стр
        window.onresize = () => {}; //снимаем эмуляцию blur'a
    }

    render() {
        return (
            <div className="app auth-layer">
                <div id="content" className="empty-tmpl-app" style={{zIndex:'100'}}>
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

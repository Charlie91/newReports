import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,HashRouter, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import 'bootstrap/dist/css/bootstrap.css';
import Promise from 'promise-polyfill';

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'

// Containers
import Full from './containers/Full/'
import Empty from './containers/Empty/'

const history = createBrowserHistory();


// To add to window
if (!window.Promise) {  //полифилл для промисов
    window.Promise = Promise;
}

ReactDOM.render((
    <HashRouter history={history}>
        <Switch>
            <Route path="/registration" name="registr" component={Empty}/>
            <Route path="/authorization" name="authoriz" component={Empty}/>
            <Route path="/conceptions" name="concept" component={Full}/>
            <Route path="/object" name="object" component={Full}/>
            <Route path="/city" name="object" component={Full}/>
            <Route path="/" name="Home" component={Full}/>
        </Switch>
    </HashRouter>
), document.getElementById('root'));

import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Badge, Nav, NavItem} from 'reactstrap';
import classNames from 'classnames';
import nav from './_nav';
import LogOut from './../../views/Authorization/LogOut';
import {API} from './../../utils/api_paths';
import {ajaxRequest, getCoords} from './../../utils/utils';
import {
    NavbarToggler,
    NavbarBrand,
    Row,
    Col
} from 'reactstrap';

class Sidebar extends Component {
    constructor(props){
        super(props);
    }

    handleClick(e) {
        e.preventDefault();
        e.target.parentElement.classList.toggle('open');
        this.scrollTopToElement(e.target.parentElement);
    }

    scrollTopToElement(elem){   //скролл к раскрывшемуся элементу для удобства пользования
        let nav = document.querySelector('nav.sidebar-nav');
        if(elem.classList.contains('open')) //обертка с анимацией
            setTimeout(() => {
                let start = Date.now(); // сохранить время начала

                if(elem.offsetTop > nav.scrollTop){
                    let timer = setInterval(() => {
                        nav.scrollTop += 20;
                        if(nav.scrollTop >= elem.offsetTop)clearTimeout(timer);
                        else if(Date.now() - start > 500)clearTimeout(timer)//после 500мс останавливаем анимацию
                    },10)
                }
                else{
                    let timer = setInterval(() => {
                        nav.scrollTop -= 20;
                        if(nav.scrollTop <= elem.offsetTop)clearTimeout(timer);
                        else if(Date.now() - start > 500)clearTimeout(timer)//после 500мс останавливаем анимацию
                    },10)
                }
            },10);
    }

    activeRoute(routeName, props) {
        // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
        return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    }

    sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    // todo Sidebar nav secondLevel
    // secondLevelActive(routeName) {
    //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
    // }


    render() {
        const props = this.props;
        const activeRoute = this.activeRoute;
        const handleClick = this.handleClick;

        // badge addon to NavItem
        const badge = (badge) => {
            if (badge) {
                const classes = classNames( badge.class );
                return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>)
            }
        };

        // simple wrapper for nav-title item
        const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)): item.name ) };

        // nav list section title
        const title =  (title, key) => {
            const classes = classNames( "nav-title", title.class);
            return (<li key={key} className={ classes }>{wrapper(title)} </li>);
        };

        // nav list divider
        const divider = (divider, key) => (<li key={key} className="divider"></li>);

        // nav item with nav link
        const navItem = (item, key) => {
            const classes = classNames( "nav-link", item.class);
            return (
                <NavItem key={key}>
                    <NavLink to={item.url} name={item.name} className={ classes } activeClassName="active">
                        <i className={item.icon}></i>{item.name}{badge(item.badge)}
                    </NavLink>
                </NavItem>
            )
        };

        // nav dropdown
        const navDropdown = (item, key) => {
            return (
                <li key={key} className={activeRoute(item.url, props)}>
                    <a className="nav-link nav-dropdown-toggle" href="#" onClick={handleClick.bind(this)}><i className={item.icon}></i> {item.name}</a>
                    <ul className="nav-dropdown-items">
                        {navList(item.children)}
                    </ul>
                </li>
            )
        };

        // nav link
        const navLink = (item, idx) =>
            item.title ? title(item, idx) :
                item.divider ? divider(item, idx) :
                    item.children ? navDropdown(item, idx)
                        : navItem(item, idx) ;


        // nav list
        const navList = (items) => {
            return items.map( (item, index) => navLink(item, index) );
        };
        //    &#9776;

        return (
            <div className="sidebar">
                <Row className="sidebar-title">
                    <Col xs={{ size: 6, offset: 3 }}>
                        <p className="main-title">Reports</p>
                    </Col>
                    <Col className="hamburger" xs="3">
                        <NavbarToggler  className="d-lg-none" onClick={this.mobileSidebarToggle}></NavbarToggler>
                        <NavbarToggler  className="d-md-down-none mr-auto" onClick={this.sidebarMinimize}></NavbarToggler>
                    </Col>
                </Row>
                <div className="sidebar-header">
                    <img src={(props.userData && props.userData.photo) ? `https://re-ports.ru${props.userData.photo}` : 'img/avatars/default.png'} className="img-avatar" alt="Avatar"/>
                    <div className="full-name">
                        <strong>{(props.userData) ? `${props.userData.first_name} ${props.userData.last_name}` : ''}</strong>
                    </div>
                    <div className="text-muted">
                        <small>{(props.userData) ? props.userData.job_position : ''}</small>
                    </div>
                    <div>
                        <LogOut isLoggedIn={this.props.isLoggedIn}/>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <Nav>
                        { (this.props.conceptions.length ) ? navList(this.props.conceptions) : '' }
                    </Nav>
                </nav>
            </div>
        )
    }
}

export default Sidebar;

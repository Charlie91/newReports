import React, { Component, PureComponent } from 'react';
import './style.css';
import {API} from './../../utils/api_paths';
import {ajaxRequest, mobileSidebarHidden} from './../../utils/utils';
import Loading from './../Loading/Loading';
import DataCard from './DataCard';

import {
    Row
} from "reactstrap";



class Dashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            objects:[]
        };
    }

    getAvailableCities(){    //получаем города в которых доступны объекты
        let id = 1;
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        return ajaxRequest(API.cities+id,options)
            .then( data => {
                let formattedData = data.map( item => {
                    item.checked = true;
                    item.value = item.label = item.city_name;
                    item.ID = item.id;
                    delete item.city_name;
                    delete item.id;
                    delete item.priority;
                    return item
                });
                this.props.upState('availableCities',formattedData) //передаем данные в родительский компонент
            })
            .catch( error => console.log(error))
    }

    getObjects() {  //получаем список объектов из списка городов
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let conceptID = 1;
        if (!this.state.cities.length || this.state.objects.length)return;
        let [cities,arr] = [this.state.cities, [] ];
        let objects = Promise.all(cities.map(item => {
            return ajaxRequest(API.objects + '?conceptId=' + conceptID + '&cityId=' + item.ID, options)
                .then(data => data)
                .catch(err => console.log(err))
        }));
        objects = objects.then(data => {        //трансформируем массив массивов значений в массив значений
            data.forEach(item => arr = arr.concat(item));
            return arr
        });
        objects = objects.then(objects => {
           return Promise.all(objects.map(object => {
                return ajaxRequest(API.objectsData + '?objId=' + object.id, options)
                    .then(payData => {
                        object.data = payData;
                        return object
                    })
                    .catch(error => console.log(error))
            }))
        });
        objects.then(data => this.setState({objects:data}))
    }



    renderObjects(){    // рендер карточек объектов
        if(this.state.objects.length){
            let objectsForRender = this.state.objects.filter( object => {
                let cityId = object.city_id;
                return this.state.cities.some( city => {
                    if(city.ID === cityId && city.checked)return true
                })
            });
            return(
                <Row>
                    {objectsForRender.map( (item,i) => {
                            return <DataCard key={i} obj={item} />
                        }
                    )}
                </Row>
            )
        }
        else{
            return(
                <Loading/>
            )
        }
    }

    componentDidMount(){
        mobileSidebarHidden();
        this.getAvailableCities(); //получение списка городов
    }


    componentWillReceiveProps(nextprops){
        if(nextprops.cities.length) {
            this.setState({cities: nextprops.cities}, () => this.getObjects()); // записываем города в стейт и после получаем список объектов
        }
    }

    render() {
        return (
            <div style={{marginTop:'15px'}} className="animated fadeIn">
                {this.renderObjects()}
            </div>
        )
    }
}

export default Dashboard;

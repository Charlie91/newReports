import React, { Component, PureComponent } from 'react';
import './style.css';
import {API} from './../../utils/api_paths';
import {ajaxRequest, mobileSidebarHidden} from './../../utils/utils';
import DataCard from './DataCard';
import Loading from './../Loading/Small';

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
                //console.log(data);
                let formattedCities = data.cities.map( item => {
                        item.checked = true;
                        item.value = item.label = item.city_name;
                        item.ID = item.id;
                        item.className = 'bold';
                        delete item.city_name;      //сделать что-нибудь с множественными delete
                        delete item.id;
                        delete item.priority;
                        return item
                });
                let formattedAreas = data.areas.map( item => {
                    item.checked = true;
                    item.value = item.label = item.name;
                    item.ID = item.id;
                    item.expanded = true;
                    if(item.value === 'Армения')item.className = 'armenia';
                    if(item.cities)
                        item.children = item.cities.map( city => {
                            city.checked = true;
                            city.value = city.label = city.city_name;
                            city.ID = city.id;
                            delete city.city_name;
                            delete city.id;
                            delete city.priority;
                            return city
                        });
                    delete item.cities;
                    delete item.city_name;
                    delete item.id;
                    delete item.name;
                    delete item.priority;
                    return item
                });
                let formattedData = formattedCities.concat(formattedAreas);
                this.props.upState('availableCities',formattedData) //передаем данные в родительский компонент
            })
            .catch( error => console.log(error))
    }

    // getObjects() {  //получаем список объектов из списка городов
    //     let options = {
    //         method: 'GET',
    //         credentials: 'include',
    //         mode: 'cors'
    //     };
    //     let conceptID = 1;
    //     if (!this.state.cities.length || this.state.objects.length)return;
    //     let [cities,arr] = [[], [] ];
    //
    //
    //     this.state.cities.forEach(item => {
    //         if(item.children){
    //             item.children.forEach(child => cities.push(child))
    //         }
    //         else cities.push(item)
    //     });
    //
    //     let objects = Promise.all(cities.map(item => {
    //         return ajaxRequest(API.objects + '?conceptId=' + conceptID + '&cityId=' + item.ID, options)
    //             .then(data => data)
    //             .catch(err => console.log(err))
    //     }));
    //     objects = objects.then(data => {        //трансформируем массив массивов значений в массив значений
    //         data.forEach(item => arr = arr.concat(item));
    //         return arr
    //     });
    //     objects = objects.then(objects => {
    //        return Promise.all(objects.map(object => {
    //             return ajaxRequest(API.objectsData + '?objId=' + object.id, options)
    //                 .then(payData => {
    //                     object.data = payData;
    //                     return object
    //                 })
    //                 .catch(error => console.log(error))
    //         }))
    //     });
    //     objects.then(data => this.setState({objects:data}))
    // }

    getObjects() {  //получаем список объектов из списка городов
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let conceptID = 1;
        let arr = [];
        if (this.state.objects.length)return;
        ajaxRequest(API.objects + '?conceptId=' + conceptID, options)
            .then(data => {
                return Promise.all(data.map(object => {
                    return ajaxRequest(API.objectsData + '?objId=' + object.id, options)
                        .then(payData => {
                            object.data = payData;
                            return object
                        })
                        .catch(error => console.log(error))
                }))
            })
            .then(data => this.setState({objects:data}));
    }


    renderObjects(){    // рендер карточек объектов
        if(this.state.objects.length){
            let objectsForRender = this.state.objects.filter( object => {
                let cityId = object.city_id;
                return this.state.cities.some( city => {
                    if(city.children){
                        return city.children.some( child => {
                            if(child.ID === cityId && child.checked)return true
                        })
                    }
                    if(city.ID === cityId && city.checked)return true;
                })
            });
            return(
                <Row>
                    {
                        (objectsForRender.length) ?

                            objectsForRender.map( (item,i) => {
                                    return <DataCard key={i} obj={item} />
                                }
                            )
                            :
                            <h4 className="no-data-message">Нет данных для отображения</h4>

                    }
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
            <div style={{marginTop:'15px'}} className="animated dashboard fadeIn">
                {this.renderObjects()}
            </div>
        )
    }
}

export default Dashboard;

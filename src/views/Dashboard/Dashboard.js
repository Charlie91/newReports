import React, { PureComponent } from 'react';
import './style.css';
import {API} from './../../utils/api_paths';
import {ajaxRequest, mobileSidebarHidden,deleteObjectProperties} from './../../utils/utils';
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
        return ajaxRequest(API.cities+id)
            .then( data => {
                //console.log(data);
                let formattedCities = data.cities.map( item => {
                        item.checked = true;
                        item.value = item.label = item.city_name;
                        item.ID = item.id;
                        item.className = 'bold';
                        deleteObjectProperties(item,['city_name','id','priority']);
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
                            deleteObjectProperties(city,['city_name','id','priority']);
                            return city
                        });
                    deleteObjectProperties(item,['cities','name','city_name','id','priority']);
                    return item
                });
                let formattedData = formattedCities.concat(formattedAreas);
                this.props.upState('availableCities',formattedData) //передаем данные в родительский компонент
            })
            .catch( error => console.log(error))
    }

    // getObjects() {  //получаем список объектов из списка городов
    //     let conceptID = 1;
    //     let arr = [];
    //     if (this.state.objects.length)return;
    //     ajaxRequest(API.objects + '?conceptId=' + conceptID)
    //         .then(objects => {
    //             let ids = objects.map(item => item.id);
    //             return ajaxRequest(API.objectsArrayData + '?objIds=' + ids.join(','))
    //                 .then(data => {
    //                     objects.forEach(item => {
    //                         item.data = data[item.id];
    //                     });
    //                     return objects;
    //                 })
    //         })
    //         .then(data => this.setState({objects:data}));
    // }

    getObjects() {  //получаем список объектов из списка городов
        let conceptID = 1;
        let arr = [];
        if(this.state.objects.length)return;
        ajaxRequest(API.objects + '?conceptId=' + conceptID)
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

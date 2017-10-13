import React, { Component } from 'react';
import 'react-select/dist/react-select.css';
import './style.css';
import {API} from './../../utils/api_paths';
import {ajaxRequest} from './../../utils/utils';
import DataCard from './DataCard';

import {
    Row
} from "reactstrap";



class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
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
                this.props.upState('availableCities',formattedData)
            })
            .catch( error => console.log(error))
    }

    getObjects() {
        //https://repo.re-ports.ru/app_test/Objects?conceptId=-1&cityId=-2
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let conceptID = 1;
        if (this.state.cities.length) {
            let cities = this.state.cities;
            if(!this.state.objects.length) {
                let arr = [];
                cities.forEach(item => {
                    ajaxRequest(API.objects + '?conceptId=' + conceptID + '&cityId=' + item.ID, options)
                        .then(data => {
                            data.forEach(object => {
                                ajaxRequest(API.objectsData + '?objId=' + object.id, options)
                                    .then( payData => {
                                        object.data = payData;
                                        this.setState({objects:arr})
                                    })
                                    .catch(error => console.log(error))
                            });
                            //let arr = this.state.objects;
                            data.forEach(item => arr.push(item));
                        })
                        .catch(error => console.log(error))
                })
            }
        }
    }



    renderObjects(){
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
    }

    componentDidMount(){
        this.getAvailableCities();
    }

    componentWillReceiveProps(nextprops){
        if(nextprops.cities.length) { // if(nextprops.cities.length && !this.state.cities) {  - костыль
            console.log(1);
            this.setState({cities: nextprops.cities}, () => this.getObjects());
        }
    }

    render() {
        return (
            <div className="animated fadeIn">
                {this.renderObjects()}
            </div>
        )
    }
}

export default Dashboard;

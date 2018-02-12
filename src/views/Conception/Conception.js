import React, { Component, PureComponent } from 'react';
import {API} from './../../utils/api_paths';
import {ajaxRequest, mobileSidebarHidden} from './../../utils/utils';
import TableVertical from './TableVertical.js';
import TableHorizontal from './TableHorizontal.js';
import TableVertNoStick from './TableVertNoStick.js';
import {formatNumericValue} from './../../utils/utils';
import {formatNumericValueWithSpaces} from './../../utils/utils';
//import Loading from './../Loading/Loading';
import Loading from './../Loading/Small';



class Conception extends Component {

    constructor(props){
        super(props);
        this.state = {
            objects:[]
        };
    }

    formatObjectToShowInTable(object,additionalData){   //форматирование полученных данных для возможности показа их в горизонтальной таблице
        let days = additionalData.day,
            months = additionalData.month,
            years = additionalData.year;

        object.data = additionalData;
        object.todayResults = (additionalData.day[0].v) ? formatNumericValueWithSpaces(additionalData.day[0].v) : '-';
        object.averageOfDays = (additionalData.day_avg) ? formatNumericValueWithSpaces(Math.round(additionalData.day_avg)) : '-';
        object.averageOfMonths = (additionalData.month_avg) ?  formatNumericValueWithSpaces(Math.round(additionalData.month_avg)) : '-';
        object.averageOfMonths = (additionalData.month_avg) ?  formatNumericValueWithSpaces(Math.round(additionalData.month_avg)) : '-';
        object.predictionOfMonths = (additionalData.month_pred) ?  formatNumericValueWithSpaces(Math.round(additionalData.month_pred)) : '-';

        object.currentMonth = days.reduce((sum, current) => sum + current.v, 0);

        object.currentYear = months.reduce((sum, current) => {
            if(current.y !== 2018)return sum + 0;
            else return sum + current.v
        }, object.currentMonth);
        object.currentYear = (object.currentYear) ?  formatNumericValueWithSpaces(object.currentYear) : '-';
        object.currentMonth = (object.currentMonth) ?   formatNumericValueWithSpaces(object.currentMonth) : '-';

        days.forEach( (item,i) => {                         //выводим данные по дням наверх и пригодными для вывода таблицей
            if(!i)return;
            object['day' + (days.length - i)] =  (item.v) ? formatNumericValueWithSpaces(item.v) : '-';
        });

        months.forEach( (item,i) => {
            if(item.y !== 2018)return;
            object['month' + i] = (item.v) ? formatNumericValueWithSpaces(item.v) : '-';
        });

        years.forEach( (item,i) => {
            object['year' + i] = (item.v) ? formatNumericValueWithSpaces(item.v) : '-';
        });

        return object;
    }



    getObjects() {  //получаем список объектов из списка городов
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let conceptID = this.props.match.params.child || this.props.match.params.id;
        if (!this.state.cities.length)return;
        let cities = [];
        this.state.cities.forEach(item => {
            if(item.children){
                item.children.forEach(child => cities.push(child))
            }
            else cities.push(item)
        });
        // let arr = [];
        let objects = Promise.all(cities.map(item => {
            return ajaxRequest(API.objects + '?conceptId=' + conceptID + '&cityId=' + item.ID, options)
                .then(data => data)
                .catch(err => console.log(err))
        }));
        objects = objects.then(data => {
            let arr = [];
            data.forEach(item => {
                if (Array.isArray(item)) {
                    item.forEach(child => {
                        arr.push(child)
                    })
                }
                else arr.push(item);
            });
            return arr;
        });
        objects.then(arr => {
            let newData = Promise.all(arr.map(object => {
                return ajaxRequest(API.objectsData + '?objId=' + object.id, options)
                    .then(data => {
                        object = this.formatObjectToShowInTable(object, data);
                        return object
                    })
                    .catch(err => console.log(err))
            }));
            newData.then(data => {
                this.setState({objects:data})
            })
        })
    }


    getAvailableCities(){    //получаем города в которых доступны объекты
        let id = this.props.match.params.child || this.props.match.params.id;
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        return ajaxRequest(API.cities+id,options)
            .then( data => {
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
                    item.expanded = true;
                    item.ID = item.id;
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

    componentWillReceiveProps(nextprops){
        if(nextprops.cities.length) {
            this.setState({cities: nextprops.cities}, () => this.getObjects()); // записываем города в стейт и после получаем список объектов
        }
    }


    componentDidUpdate(prevProps, prevState){
        if(this.props.match.params.child){
            if(prevProps.match.params.child !== this.props.match.params.child)
                this.getAvailableCities();    //если роуты не совпадают - получить новый список городов
        }
        else{
            if(prevProps.match.params.id !== this.props.match.params.id){
                this.getAvailableCities();
            }
        }
        mobileSidebarHidden();  //скрыть меню на моб. версии при переходе по ссылке в меню
    }


    componentDidMount(){
        mobileSidebarHidden();
        this.getAvailableCities();
    }


    renderObjects(){    // рендер таблицы объектов
        if(!this.state.objects.length)return(
            <Loading/>
        );
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
            <div>
                {
                    (objectsForRender.length) ?
                        <TableVertNoStick data={objectsForRender}/>
                        :
                        <h4 className="no-data-message">....</h4>
                }
            </div>
        )
    }

    render(){
            return (
                <div>
                    {this.renderObjects()}
                </div>
            )
    }

}

export default Conception;
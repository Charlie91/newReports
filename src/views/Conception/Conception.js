import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import {ajaxRequest, mobileSidebarHidden} from './../../utils/utils';
import Table from './Table.js';
import {formatNumericValue} from './../../utils/utils';



class Conception extends Component {

    constructor(props){
        super(props);
        this.state = {
            objects:[]
        };
    }

    toCalculateAverageValue(additionalData,timeLine){   //подсчет среднего по дням значения(за последний месяц)
        let arr = additionalData[timeLine];
        let sum = 0;
        arr.forEach( (item,i) => {
            if(i === 0 )return;
            //if(item.y && item.y !== 2017) return;
            sum += item.v ;
        });
        return formatNumericValue(Math.round(sum/(arr.length-1)));
    }


    formatObjectToShowInTable(object,additionalData){   //форматирование полученных данных для показа их в таблице
        let days = additionalData.day,
            months = additionalData.month,
            years = additionalData.year;

        object.data = additionalData;
        object.todayResults = formatNumericValue(additionalData.day[0].v);
        object.averageOfDays = this.toCalculateAverageValue(additionalData,'day');
        object.averageOfMonths = this.toCalculateAverageValue(additionalData,'month');

        object.currentMonth = days.reduce((sum, current) => sum + current.v, 0);


        object.currentYear = months.reduce((sum, current) => {
            if(current.y !== 2017)return sum + 0;
            else return sum + current.v
        }, object.currentMonth);
        object.currentYear = formatNumericValue(object.currentYear);
        object.currentMonth = formatNumericValue(object.currentMonth);

        days.forEach( (item,i) => {                         //выводим данные по дням наверх и пригодными для вывода таблицей
            if(!i)return;
           object['day' + (days.length - i)] = formatNumericValue(item.v);
        });

        months.forEach( (item,i) => {
            if(item.y !== 2017)return;
            object['month' + i] = formatNumericValue(item.v);
        });

        years.forEach( (item,i) => {
            object['year' + i] = formatNumericValue(item.v);
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
        if (this.state.cities.length) {
            let cities = this.state.cities;
                let arr = [];
                cities.forEach(item => {
                    ajaxRequest(API.objects + '?conceptId=' + conceptID + '&cityId=' + item.ID, options)
                        .then(data => {
                            data.forEach(object => {
                                ajaxRequest(API.objectsData + '?objId=' + object.id, options)
                                    .then( payData => {
                                        //object.data = payData;
                                        object = this.formatObjectToShowInTable(object,payData);
                                        this.setState({objects:arr})
                                    })
                                    .catch(error => console.log(error))
                            });
                            data.forEach(item => arr.push(item));
                        })
                        .catch(error => console.log(error))
                })
        }
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
                let formattedData = data.map( (item,i) => {
                    if(!i)item.checked = true;
                    else item.checked = false;
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

    componentWillReceiveProps(nextprops){
        if(nextprops.cities.length) {
            this.setState({cities: nextprops.cities}, () => this.getObjects()); // записываем города в стейт и после получаем список объектов
        }
    }


    componentDidUpdate(prevProps, prevState){
        if(this.props.match.params.child){
            if(prevProps.match.params.child !== this.props.match.params.child)this.getAvailableCities();    //если роуты не совпадают - получить новый список городов
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

    renderObjects(){    // рендер карточек объектов
        if(this.state.objects.length){
            let objectsForRender = this.state.objects.filter( object => {
                let cityId = object.city_id;
                return this.state.cities.some( city => {
                    if(city.ID === cityId && city.checked)return true
                })
            });
            return(
                <Table data={objectsForRender}/>
            )
        }
    }

    render(){
        if(this.props.match.params.child)
            return (
                <div>
                    {this.renderObjects()}
                </div>
            )
        else
            return(
                <div>
                    {this.renderObjects()}
                </div>
            )
    }

}

export default Conception;
import React, { Component } from 'react';
import {API} from './../../utils/api_paths';
import {ajaxRequest} from './../../utils/utils';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Table from './Table.js';

export default class ObjectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object:'',
            startDate: moment(),
            endDate: moment(),
            timeSegment: 'M'
        };
        moment.locale('ru'); // локализуем библиотеку
    }

    getNewObjectsData(){       // получение новых данных об объекте, если они не были переданы через props
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        },
            params = this.props.match.params;
        let [concept,city,id] = [params.concept,params.city,params.id];
        let url = API.objects + '?conceptId=' + concept + '&cityId=' + city;
        ajaxRequest(url, options)
            .then(data => {
                data.forEach( object => {
                    if(+id === object.id){
                        this.setState({object:object}, () => this.props.upState('title',this.state.object.obj_name))
                    }
                })
            })
            .then(data => this.getFloors())
            .catch(err => console.log(err))
    }

    getFloors(){    //получение срезов данных об объекте
        let id = this.state.object.id;
        let options = {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            };
        let url = API.floors + id;
        ajaxRequest(url, options)
            .then(data => {
                console.log(data);
                this.setState({floors:data, floorIndex:0}, () => this.getFloorsData());
            })
            .catch(err => console.log(err))
    }

    getFloorsData(){    //ajax запрос на конечные данные
        if(!this.state.floors)return null;
        let options = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };
        let [startDate, endDate] = [this.state.startDate.format("YYYYMMDD"),this.state.endDate.format("YYYYMMDD")];
        let unit = this.state.timeSegment;
        let floorID;
        this.state.floors.forEach((item,i) => {
            if(this.state.floorIndex === i)floorID = item.id
        });
        let url = `${API.floorsData}?floorId=${floorID}&startDate=${startDate}&endDate=${endDate}&unit=${unit}`;
        console.log(url);
        ajaxRequest(url,options)
            .then(data => {
                let [headers, datas] = [ [],[] ];
                this.setState({data:data})
            })
            .catch(err => console.log(err))
    }

    fillInitialObjectData(obj){ //записываем данные с пропсов и парсим с сервера срезы
        this.setState({object:obj},() => {
            this.getFloors();
            this.props.upState('title',this.state.object.obj_name)
        });
    }

    changeFloor(e){
        this.setState({floorIndex:+e.target.dataset.id},() => this.getFloorsData())
    }

    changeTimeSegment(e){
        this.setState({timeSegment:e.target.innerHTML},() => this.getFloorsData())
    }

    renderFloorObjectsButtons(){//функция рендера срезов
        if(!this.state.floors)return null;
        return(
            <div className="btn-group" role="group">
                {this.state.floors.map((item,i) =>
                    <button type="button"
                            key={i}
                            data-id={i}
                            className={'btn btn-secondary ' + ((this.state.floorIndex === i) ? 'active' : '')}
                            onClick={this.changeFloor.bind(this)}
                    >
                        {item.name}
                    </button>
                 )}
            </div>
        )
    }

    renderSegmentationButtons(){//функция рендера фильтров временной сегментации
        let arr = ['Y','M','D','H'];
        return (
            <div className="btn-group" role="group">
                {arr.map( (item,i) =>
                    <button type="button"
                            key={i}
                            className={'btn btn-secondary ' + ((this.state.timeSegment === item) ? 'active' : '')}
                            onClick={this.changeTimeSegment.bind(this)}
                    >
                        {item}
                    </button>
                )}
            </div>
        )
    }

    renderTable(){  //функция рендера таблицы
        if(!this.state.data)return null;
        return (
            <Table data={this.state.data}/>
        )
    }

    handleChangeStart(date) {
        this.setState({startDate: date}, () => this.getFloorsData());
    }

    handleChangeEnd(date) {
        this.setState({endDate: date}, () => this.getFloorsData());
    }

    componentDidMount(){
        if(this.props.location.params){ //если начальные данные переданы с пропсов - идем 1м путем
            let obj = this.props.location.params.obj;
            this.fillInitialObjectData(obj);
        }
        else{   //если данных в пропсах не обнаружено - парсим их с сервера
            this.getNewObjectsData()
        }
    }

    render(){
        return (
            <div>
                <h4>{this.state.object.obj_name}</h4>
                <p>{this.state.object.address}</p>
                <DatePicker
                    selected={this.state.startDate}
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeStart.bind(this)}
                />

                <DatePicker
                    selected={this.state.endDate}
                    selectsEnd
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeEnd.bind(this)}
                />
                {this.renderFloorObjectsButtons()}
                {this.renderSegmentationButtons()}
                {this.renderTable()}

            </div>
        )
    }
}


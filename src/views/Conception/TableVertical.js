import React, { Component } from 'react';
import {getCoords} from './../../utils/utils';
import {Link} from 'react-router-dom';
import {formatNumericValue} from './../../utils/utils';
import './react-bootstrap-table.css';
import './style.scss';
import {
    Table,
} from "reactstrap";



function getWeekDay(date) {
    let days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    return days[date.getDay()];
}

function getDateAgo(date, days) {
    let dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() - days);
    return dateCopy;
}


function fillDates(){ //создание массива с предыдущими днями текущего месяца
    const dates = [];
    let today = new Date();
    let todayDate = today.getDate();
    for(let i = 1; i < todayDate; i++){
        let newDate = getDateAgo(today, i);
        let [day , date] = [getWeekDay(newDate), newDate.getDate()];
        let result = `${day},${date}`;
        dates.push(result);
    }
    return dates;
}

function fillMonths(){//создание наименований месяцев
    const thisYearMonths = [];
    let today = new Date();
    let currentMonth = today.getMonth();
    let months = ['Январь','Февраль','Март','Апрель','Май','Июнь', "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    for(let i = 0; i < currentMonth;i++){
        thisYearMonths.push(months[i])
    };
    return thisYearMonths.reverse()
}

function fillYears(){//заполняем года
    const years = [];
    let today = new Date();
    let currentYear = today.getFullYear();
    for(let i = currentYear - 1; i >= 2011 ; i--){
        years.push(i);
    }
    return years
}



class TableVertical extends Component {
    constructor(props) {
        super(props);
    };

    componentWillMount(){
        let [dates,months,years] = [ fillDates(),fillMonths(), fillYears() ];
        this.setState({dates:dates,months:months,years:years});
    }

    fixingFirstColumn(e){//фиксируем первую колонку
        let cells = document.querySelectorAll('table tr td:first-of-type,table tr th:first-of-type'),
            sidebarWidth = document.getElementsByClassName('sidebar')[0].offsetWidth,
            sidebarMarginLeft = getComputedStyle(document.getElementsByClassName('sidebar')[0]).marginLeft;
        cells.forEach( cell => {
            cell.classList.add('fixed-td');
            if(sidebarMarginLeft === '0px')
                cell.style.left = sidebarWidth + 'px';
            else
                cell.style.left = '-10px';
        });

    }

    componentDidMount(){
        this.fixingFirstColumn();
    }


    render() {
        return (
            <div>
                <Table className="conceptions-table vertical-table">
                    <thead>
                    <tr>
                        <th> </th>
                        {this.props.data.map((item,i) =>
                            <th key={i}><Link
                                to={{ pathname: `/concept${item.conception}/city${item.city_id}/object${item.id}`, params:{obj:item} }}
                                className="link-to-object"
                            >
                                {item.obj_name}
                            </Link></th>
                        )}
                    </tr>
                    </thead>
                    <tbody style={{overflowX:'scroll'}}>
                    <tr className="average_column">
                        <td>Средний в день</td>
                        {this.props.data.map((item,i) =>
                            <td key={i}>{item.averageOfDays}</td>
                        )}
                    </tr>
                    <tr className="today">
                        <td>Сегодня</td>
                        {this.props.data.map((item,i) =>
                            <td key={i}>{item.todayResults}</td>
                        )}
                    </tr>
                    {this.state.dates.map((item,i) =>
                        <tr className={(~item.indexOf('вс') || ~item.indexOf('сб')) ? 'holidays_column days' : 'days'} key={i}>
                            <td>{item}</td>
                            {this.props.data.map((item,key) =>
                                <td key={key}>{item['day' + (this.state.dates.length - i)]}</td>
                            )}
                        </tr>

                    )}
                    <tr>
                        <td>Текущий месяц</td>
                        {this.props.data.map((item,i) =>
                            <td key={i}>{item.currentMonth}</td>
                        )}
                    </tr>
                    <tr className="average_month">
                        <td>Средний в месяц</td>
                        {this.props.data.map((item,i) =>
                            <td key={i}>{item.averageOfMonths}</td>
                        )}
                    </tr>
                    <tr>
                        <td>Прогноз на месяц</td>
                        {this.props.data.map((item,i) =>
                            <td key={i}>{formatNumericValue(Math.floor(item.data.month_pred))}</td>
                        )}
                    </tr>
                    {this.state.months.map((item,i) =>
                        <tr key={i} className="months">
                            <td>{item}</td>
                            {this.props.data.map((item,key) =>
                                <td key={key}>{item['month' + i]}</td>
                            )}
                        </tr>
                    )}
                    <tr>
                        <td>Текущий год</td>
                        {this.props.data.map((item,i) =>
                            <td key={i}>{item.currentYear}</td>
                        )}
                    </tr>
                    {this.state.years.map((item,i) =>
                        <tr key={i}>
                            <td>{item}</td>
                            {this.props.data.map((item,key) =>
                                <td key={key}>{item['year' + i]}</td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default TableVertical;
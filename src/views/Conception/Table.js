import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import React, { Component } from 'react';
import {getCoords} from './../../utils/utils';
import './react-bootstrap-table.css';
import './style.scss';



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

function fillMonths(){
    const thisYearMonths = [];
    let today = new Date();
    let currentMonth = today.getMonth();
    let months = ['Январь','Февраль','Март','Апрель','Май','Июнь', "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    for(let i = 0; i < currentMonth;i++){
        thisYearMonths.push(months[i] + ' 2017')
    };
    return thisYearMonths.reverse()
}

function fillYears(){
    const years = [];
    let today = new Date();
    let currentYear = today.getFullYear();
    for(let i = currentYear - 1; i >= 2011 ; i--){
        years.push(i);
    }
    return years
}



class Table extends Component {
    constructor(props) {
        super(props);
    };

    componentWillMount(){
        let [dates,months,years] = [ fillDates(),fillMonths(), fillYears() ];
        this.setState({dates:dates,months:months,years:years});
    }

    componentDidMount(){
        let th = document.getElementsByClassName('table-header-wrapper')[0],
            tbody = document.getElementsByClassName('react-bs-container-body')[0];
        window.onscroll = function(e){                    // определяем по событию положение скролла на странице и делаем шапку fixed
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if(scrollTop > getCoords(tbody).top){
                th.classList.add('navbar-fixed-top','container-fluid');
            }
            else{
                th.classList.remove('navbar-fixed-top','container-fluid');
                tbody.style.cssText = 'top:0px;position:static';
            }
        }
    }


    render() {
        return (
            <div>
                <BootstrapTable className="Table conceptions-table" bordered={ false } data={ this.props.data }>

                    <TableHeaderColumn
                        width={'150'}
                        dataField='obj_name'
                        tdStyle={ { fontWeight:'600' } }
                        isKey>
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        thStyle={ { whiteSpace: 'normal',textAlign:'center' } }
                        tdStyle={ { textAlign:'center' } }
                        className="average_column"
                        columnClassName='average_column'
                        width={'100'}
                        dataField='averageOfDays'>
                        Среднее по дням
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        width={'100'}
                        tdStyle={ { textAlign:'center' } }
                        dataField='todayResults'>
                        Сегодня
                    </TableHeaderColumn>

                    {this.state.dates.map((item,i) => {
                        return (~item.indexOf('вс') || ~item.indexOf('сб')) ?
                         <TableHeaderColumn
                                key={i} width={'100'}
                                thStyle={ { textAlign:'center' } }
                                tdStyle={ { textAlign:'center' } }
                                className="holidays_column"
                                columnClassName='holidays_column'
                                dataField={'day'+(this.state.dates.length - i)}>
                                {item}
                                </TableHeaderColumn>
                            :
                            <TableHeaderColumn
                                key={i} width={'100'}
                                thStyle={ { textAlign:'center' } }
                                tdStyle={ { textAlign:'center' } }
                                dataField={'day'+(this.state.dates.length - i)}>
                                {item}
                            </TableHeaderColumn>
                        }
                    )}
                    <TableHeaderColumn
                        thStyle={ { whiteSpace: 'normal',textAlign:'center' } }
                        tdStyle={ { textAlign:'center' } }
                        className="average_column"
                        columnClassName='average_column'
                        width={'100'}
                        dataField='averageOfMonths'>
                        Среднее по месяцам
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        thStyle={ { whiteSpace: 'normal',textAlign:'center' } }
                        tdStyle={ { textAlign:'center' } }
                        width={'100'}
                        dataField='currentMonth'>
                        Текущий месяц
                    </TableHeaderColumn>

                    {this.state.months.map((item,i) => {
                            return <TableHeaderColumn
                                thStyle={ { whiteSpace: 'normal',textAlign:'center' } }
                                tdStyle={ { textAlign:'center' } }
                                key={i} width={'100'}
                                dataField={'month'+ i}>
                                {item}
                                </TableHeaderColumn>
                        }
                    )}

                    <TableHeaderColumn
                        thStyle={ { whiteSpace: 'normal',textAlign:'center' } }
                        tdStyle={ { textAlign:'center' } }
                        width={'100'} dataField='currentYear'>
                        Текущий год
                    </TableHeaderColumn>

                    {this.state.years.map((item,i) => {
                            return <TableHeaderColumn
                                key={i}
                                width={'100'}
                                thStyle={ { textAlign:'center' } }
                                tdStyle={ { textAlign:'center' } }
                                dataField={'year'+ i}>
                                {item}
                                </TableHeaderColumn>
                        }
                    )}
                </BootstrapTable>
            </div>
        );
    }
}

export default Table;
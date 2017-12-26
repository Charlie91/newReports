import React, { Component } from 'react';
import {getCoords} from './../../utils/utils';
import {Link} from 'react-router-dom';
import {formatNumericValue} from './../../utils/utils';
import './react-bootstrap-table.css';
import './nostick.scss';
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
        let result = `${day}, ${date}`;
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



class TableVerticalNoStick extends Component {
    constructor(props) {
        super(props);
    };

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

    componentWillMount(){
        let [dates,months,years] = [ fillDates(),fillMonths(), fillYears() ];
        this.setState({dates:dates,months:months,years:years});
    }

    componentDidMount(){
            let fcBody = document.querySelector(".fix-column > .tbody"),
                rcBody = document.querySelector(".rest-columns > .tbody"),
                rcHead = document.querySelector(".rest-columns > .thead");
            rcBody.addEventListener("scroll", function() {
                fcBody.scrollTop = this.scrollTop;
                rcHead.scrollLeft = this.scrollLeft;
            }, { passive: true });

        this.setWrapperWidth();
        this.equalizeTableHeaderHeight()
        window.onresize = () => this.setWrapperWidth();
    }

    componentWillUnmount(){
        window.onresize = () => {};
    }

    componentDidUpdate(){
        this.setWrapperWidth();
        this.equalizeTableHeaderHeight();
    }

    setWrapperWidth(){
        let rcHead = document.querySelector(".rest-columns > .thead"),
            wrapper = document.querySelector(".total-wrapper"),
            stick = document.getElementById('no-stick'),
            sum = document.querySelector(".fix-column").offsetWidth;
        for(let i = 0; i < rcHead.children.length; i++){
            sum += rcHead.children[i].offsetWidth;
            //console.log(rcHead.children[i].offsetWidth);
        }
        if(stick.offsetWidth > sum)
            wrapper.style.width = (sum +15) + 'px';
        else
            wrapper.style.width = 'auto';
    }

    equalizeTableHeaderHeight(){
        let rcHead = document.querySelector(".rest-columns > .thead").offsetHeight,
            fixHead = document.querySelector(".fix-column > .thead");
        fixHead.style.height = rcHead + 'px';
    }

    render() {
        console.log(this.props.data);
        return (
            <div id="no-stick">
                <div className="total-wrapper conceptions-table vertical-table">
                    <div className="fix-column">
                        <div className="thead">
                            <span> </span>
                        </div>
                        <div className="tbody">
                            <div className="trow average_column">
                                <span>Средний в день</span>
                            </div>
                            <div className="trow today_trow">
                                <span>Сегодня</span>
                            </div>
                            {this.state.dates.map((item,i) =>
                                <div className={(~item.indexOf('вс') || ~item.indexOf('сб')) ? 'holidays_column days trow' : 'days trow'} key={i}>
                                    <span>{item}</span>
                                </div>
                            )}
                            <div className="trow average_month">
                                <span>Средний в месяц</span>
                            </div>
                            <div className="trow current_month">
                                <span>Текущий месяц</span>
                            </div>
                            <div className="trow forecast_month">
                                <span>Прогноз на месяц</span>
                            </div>
                            {this.state.months.map((item,i) =>
                                <div className='trow' key={i}>
                                    <span>{item}</span>
                                </div>
                            )}
                            <div className="trow current_year">
                                <span>Текущий год</span>
                            </div>
                            {this.state.years.map((item,i) =>
                                <div className='trow' key={i}>
                                    <span>{item}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="rest-columns">
                        <div className="thead">
                            {this.props.data.map((item,i) =>
                                <span key={i}><Link
                                    to={{ pathname: `/concept${item.conception}/city${item.city_id}/object${item.id}`, params:{obj:item} }}
                                    className="link-to-object"
                                >
                                    {item.obj_name}
                                </Link></span>
                            )}
                        </div>
                        <div className="tbody">
                            <div className="trow average_column">
                                {this.props.data.map((item,i) =>
                                    <span key={i}>{item.averageOfDays}</span>
                                )}
                            </div>
                            <div className="trow today_trow">
                                {this.props.data.map((item,i) =>
                                    <span key={i}>{item.todayResults}</span>
                                )}
                            </div>
                            {this.state.dates.map((item,i) =>
                                <div className={(~item.indexOf('вс') || ~item.indexOf('сб')) ? 'holidays_column days trow' : 'days trow'} key={i}>
                                    {this.props.data.map((item,key) =>
                                        <span key={key}>{item['day' + (this.state.dates.length - i)]}</span>
                                    )}
                                </div>
                            )}
                            <div className="trow average_month">
                                {this.props.data.map((item,i) =>
                                    <span key={i}>{item.averageOfMonths}</span>
                                )}
                            </div>
                            <div className="trow current_month">
                                {this.props.data.map((item,i) =>
                                    <span key={i}>{item.currentMonth}</span>
                                )}
                            </div>
                            <div className="trow forecast_month">
                                {this.props.data.map((item,i) =>
                                    <span key={i}>{formatNumericValue(Math.floor(item.data.month_pred))}</span>
                                )}
                            </div>
                            {this.state.months.map((item,i) =>
                                <div className="trow" key={i}>
                                    {this.props.data.map((item,key) =>
                                        <span key={key}>{item['month' + i]}</span>
                                    )}
                                </div>
                            )}
                            <div className="trow current_year">
                                {this.props.data.map((item,i) =>
                                    <span key={i}>{item.currentYear}</span>
                                )}
                            </div>
                            {this.state.years.map((item,i) =>
                                <div className="trow" key={i}>
                                    {this.props.data.map((item,key) =>
                                        <span key={key}>{item['year' + i]}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default TableVerticalNoStick;
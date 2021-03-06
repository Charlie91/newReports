import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './nostick.scss';
import {getCoords} from "../../utils/utils";



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

function getMonthName(i){
    return ['Январь','Февраль','Март','Апрель','Май','Июнь', "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"][i];
}

function fillMonths(){//создание наименований месяцев
    const thisYearMonths = [];
    let today = new Date();
    let currentMonth = today.getMonth();
    for(let i = 0; i < currentMonth;i++){
        thisYearMonths.push(getMonthName(i))
    };
    return thisYearMonths.reverse()
}

function fillYears(){//заполняем года
    const years = [];
    let today = new Date();
    let currentYear = today.getFullYear();
    for(let i = currentYear - 1; i >= 2012; i--){
        years.push(i);
    }
    return years
}



class TableVerticalNoStick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollTop: props.scrollTop,
            scrollLeft: props.scrollLeft,
            rowHover: props.rowHover
        };
    }

    changeShadow(e){
        let event = e.target;
        if(!(event.scrollTop & 1)) {
            if (event.scrollTop !== 0) {
                if (this.state.scrollTop === false) {
                    this.setState({scrollTop: true});
                }
            } else {
                if (this.state.scrollTop === true) {
                    this.setState({scrollTop: false});
                }
            }
        }
        if(!(event.scrollLeft & 1)) {
            if (event.scrollLeft !== 0) {
                if (this.state.scrollLeft === false) {
                    this.setState({scrollLeft: true});
                }
            } else {
                if (this.state.scrollLeft === true) {
                    this.setState({scrollLeft: false});
                }
            }
        }
    }

    changeRowHover(index){
        this.setState({rowHover: index });
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
        this.equalizeTableHeaderHeight();
        window.onresize = () => this.setWrapperWidth();
        this.setState({scrollTop: false});
        this.setState({scrollLeft: false});
        document.body.classList.add('table-show');
    }

    componentWillUnmount(){
        window.onresize = () => {};
        document.body.classList.remove('table-show');
    }

    componentDidUpdate(){
        this.setWrapperWidth();
        this.equalizeTableColumnHeight();// фикс бага с высотой таблицы
        this.equalizeTableHeaderHeight();
    }

    setWrapperWidth(){
        let rcHead = document.querySelector(".rest-columns > .thead"),
            wrapper = document.querySelector(".total-wrapper"),
            stick = document.getElementById('no-stick'),
            sum = document.querySelector(".fix-column").offsetWidth;
        for(let i = 0; i < rcHead.children.length; i++){
            sum += rcHead.children[i].offsetWidth;
        }
        if(stick.offsetWidth > 767)
            sum+=7;
        if(stick.offsetWidth > sum)
            wrapper.style.width = (sum + 5 ) + 'px';
        else
            wrapper.style.width = 'auto';
    }

    equalizeTableHeaderHeight(){
        let rcHead = document.querySelector(".rest-columns > .thead").offsetHeight,
            fixHead = document.querySelector(".fix-column > .thead");
        fixHead.style.height = rcHead + 'px';
    }

    equalizeTableColumnHeight(){    // фикс бага с высотой таблицы
        let column = document.querySelector('#no-stick .fix-column > .tbody'),
            thead = document.querySelector('#no-stick .thead'),
            cells = document.querySelectorAll('#no-stick .fix-column > .tbody > .trow'),
            cellsHeight = 0;

        for(let i = 0; i < cells.length - 1; i++){
            cellsHeight += cells[i].offsetHeight;
        }

        if((getCoords(column).top + cellsHeight) < document.body.clientHeight)
            column.style.height = cellsHeight + 'px';
        else
            column.style.height = '';
    }
// <div className="trow empty_row" style={{backgroundColor: '#eff3f6'}}>
// {this.props.data.map((item,i) =>
//     <span key={i} className={'empty_col'}></span>
// )}
// <span className={'empty_row_col_last'} style={{backgroundColor: '#eff3f6'}} ></span>
// </div>
//

    render() {
        return (
            <div id="no-stick">
                <div className="total-wrapper conceptions-table vertical-table">
                    <div className="fix-column">
                        <div className="thead">
                            <span> </span>
                        </div>

                        <div className={"tbody " + ( (this.state.scrollLeft) ? 'v_shadow' : '') }>
                            <div className="trow average_column">
                                <span>
                                    <div>Ср. в день</div>
                                </span>
                            </div>

                            <div className={"trow today_trow" + (('today_trow' === this.state.rowHover) ? ' trow_hover_d' : '')}>
                                <span>
                                    <div>Сегодня</div>
                                </span>
                            </div>

                            {this.state.dates.map((item,i) =>
                                <div className={((~item.indexOf('вс') || ~item.indexOf('сб')) ? 'holidays_column days trow' : 'days trow') +
                                    ( (i + 'd' === this.state.rowHover) ? ' trow_hover_d' : '')
                                } key={i}>
                                    <span>
                                        <div>{item}</div>
                                    </span>
                                </div>
                            )}

                            <div className={"trow current_month" + (('current_month' === this.state.rowHover) ? ' trow_hover_d' : '')}>
                                <span>
                                    <div>{getMonthName((new Date()).getMonth())}</div>
                                </span>
                            </div>

                            <div className="trow average_month">
                                <span>
                                    <div>Ср. в месяц</div>
                                </span>
                            </div>

                            <div className={"trow forecast_month" + (('forecast_month' === this.state.rowHover) ? ' trow_hover_d' : '')}>
                                <span><div>Прог. на {getMonthName((new Date()).getMonth()).substring(0,3)}</div></span>
                            </div>

                            {this.state.months.map((item,i) =>
                                <div className={'trow' + ( (i + 'm' === this.state.rowHover) ? ' trow_hover_d' : '')} key={i}>
                                    <span><div>{item}</div></span>
                                </div>
                            )}

                            <div className={"trow current_year" + (('current_year' === this.state.rowHover) ? ' trow_hover_d' : '')}>
                                <span><div>{(new Date()).getFullYear()}</div></span>
                            </div>

                            {this.state.years.map((item,i) =>
                                <div className={'trow' + ( (i + 'y' === this.state.rowHover) ? ' trow_hover_d' : '')} key={i}>
                                    <span><div>{item}</div></span>
                                </div>
                            )}

                            <div className="trow empty_row" style={{backgroundColor: '#eff3f6'}}>
                                <span className={'empty_col'} style={{backgroundColor: '#eff3f6'}}></span>
                            </div>
                            <div className="footer"></div>


                        </div>

                    </div>
                    <div className="rest-columns">
                        <div className={"thead " + ( (this.state.scrollTop) ? 'h_shadow' : '')}>
                            {this.props.data.map((item,i) => {
                                    if(!item.group){
                                        return (
                                            <span key={i}>
                                                <Link
                                                    to={{ pathname: `/concept${item.conception}/city${item.city_id}/object${item.id}`, params:{obj:item} }}
                                                    className="link-to-object "
                                                >
                                                    {item.obj_name}
                                                </Link>
                                             </span>
                                        )
                                    }
                                    else{
                                        return (
                                            <span key={i} className="group">
                                                <p className="title">{item.title}</p>
                                                {item.objects.map((item,i) =>
                                                     <span key={i}>
                                                        <Link
                                                            to={{ pathname: `/concept${item.conception}/city${item.city_id}/object${item.id}`, params:{obj:item} }}
                                                            className="link-to-object "
                                                        >
                                                            {item.obj_name}
                                                        </Link>
                                                     </span>
                                                )}
                                            </span>
                                        )
                                    }
                                }

                            )}
                            <span className={'last_span_head'}><div></div></span>
                        </div>

                        <div className="tbody" onScroll={this.changeShadow.bind(this)}>

                            <div className="trow average_column">
                                {this.props.data.map((item,i) => {
                                    if(!item.group){
                                        return(
                                            <span key={i}>
                                                 <div dangerouslySetInnerHTML={{__html: item.averageOfDays }} ></div>
                                            </span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={i} className="group">
                                                {item.objects.map((item,i) =>
                                                    <span key={i}>
                                                        <div dangerouslySetInnerHTML={{__html: item.averageOfDays }} ></div>
                                                     </span>
                                                )}
                                            </span>
                                        )
                                    }

                                 }
                                )}
                                <span className={"empty_col_last"}><div>&nbsp;</div></span>
                            </div>


                            <div className={"trow today_trow" + (('today_trow' === this.state.rowHover) ? ' trow_hover_d' : '')}
                                 onMouseEnter={this.changeRowHover.bind(this,'today_trow')}
                            >
                                {this.props.data.map((item,i) =>{
                                    if(!item.group){
                                        return(
                                            <span key={i}>
                                                <div dangerouslySetInnerHTML={{__html: item.todayResults }}></div>
                                            </span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={i} className="group">
                                                {item.objects.map((item,i) =>
                                                    <span key={i}>
                                                        <div dangerouslySetInnerHTML={{__html: item.todayResults }}></div>
                                                     </span>
                                                )}
                                            </span>
                                        )
                                    }
                                }
                                )}
                                <span className={"empty_col_last"}>
                                    <div>&nbsp;</div>
                                </span>
                            </div>


                            {this.state.dates.map((item,i) =>
                                <div className={((~item.indexOf('вс') || ~item.indexOf('сб')) ? 'holidays_column days trow' : 'days trow') +
                                ( (i + 'd' === this.state.rowHover) ? ' trow_hover_d' : '') }
                                     key={i}
                                     onMouseEnter={this.changeRowHover.bind(this,i + 'd')}
                                >
                                    {this.props.data.map((item,key) => {
                                        if(!item.group){
                                            return(
                                                <span key={key}>
                                                       <div dangerouslySetInnerHTML={{__html: item['day' + (this.state.dates.length - i)] || '-' }}></div>
                                                </span>
                                            )
                                        }
                                        else{
                                            return (
                                                <span key={key} className="group">
                                                    {item.objects.map((item,num) =>
                                                      <span key={num}>
                                                            <div dangerouslySetInnerHTML={{__html: item['day' + (this.state.dates.length - i)] || '-' }}></div>
                                                      </span>
                                                    )}
                                                </span>
                                            )
                                        }
                                      }
                                    )}
                                    <span className={"empty_col_last"}><div>&nbsp;</div></span>
                                </div>
                            )}


                            <div className={"trow current_month"  + (('current_month' === this.state.rowHover) ? ' trow_hover_d' : '')}
                                 onMouseEnter={this.changeRowHover.bind(this,'current_month')}
                            >
                                {this.props.data.map((item,i) => {
                                    if(!item.group){
                                        return(
                                            <span key={i}>
                                                 <div dangerouslySetInnerHTML={{__html: item.currentMonth }}></div>
                                            </span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={i} className="group">
                                                {item.objects.map((item,i) =>
                                                    <span key={i}>
                                                           <div dangerouslySetInnerHTML={{__html: item.currentMonth }}></div>
                                                    </span>
                                                )}
                                            </span>
                                        )
                                    }
                                 }
                                )}
                                <span className={"empty_col_last"}><div>&nbsp;</div></span>
                            </div>


                            <div className="trow average_month">
                                {this.props.data.map((item,i) => {
                                    if(!item.group){
                                        return(
                                            <span key={i}>
                                                 <div dangerouslySetInnerHTML={{__html: item.averageOfMonths }}></div>
                                            </span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={i} className="group">
                                                {item.objects.map((item,i) =>
                                                    <span key={i}>
                                                         <div dangerouslySetInnerHTML={{__html: item.averageOfMonths }}></div>
                                                    </span>
                                                )}
                                            </span>
                                        )
                                    }
                                 }
                                )}
                                <span className={"empty_col_last"}><div>&nbsp;</div></span>
                            </div>


                            <div className={"trow forecast_month" + (('forecast_month' === this.state.rowHover) ? ' trow_hover_d' : '')}
                                 onMouseEnter={this.changeRowHover.bind(this,'forecast_month')}
                            >
                                {this.props.data.map((item,i) => {
                                    if(!item.group){
                                        return(
                                            <span key={i}>
                                                 <div dangerouslySetInnerHTML={{__html: item.predictionOfMonths }}></div>
                                            </span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={i} className="group">
                                                {item.objects.map((item,i) =>
                                                    <span key={i}>
                                                         <div dangerouslySetInnerHTML={{__html: item.predictionOfMonths }}></div>
                                                    </span>
                                                )}
                                            </span>
                                        )
                                    }
                                 }
                                )}
                                <span className={"empty_col_last"}><div>&nbsp;</div></span>
                            </div>


                            {this.state.months.map((item,i) =>
                                <div className={"trow" + ( (i + 'm' === this.state.rowHover) ? ' trow_hover_d' : '') }
                                     key={i}
                                     onMouseEnter={this.changeRowHover.bind(this,i + 'm')}
                                >
                                    {this.props.data.map((item,key) => {
                                        if(!item.group){
                                            return(
                                                <span key={key}>
                                                     <div dangerouslySetInnerHTML={{__html: item[ 'month' + ( i )] ? item[ 'month' + ( i )] : '-' }}></div>
                                                </span>
                                            )
                                        }
                                        else{
                                            return(
                                                <span key={key} className="group">
                                                    {item.objects.map((item,num) =>
                                                        <span key={num}>
                                                             <div dangerouslySetInnerHTML={{__html: item[ 'month' + ( i )] ? item[ 'month' + ( i )] : '-' }}></div>
                                                        </span>
                                                    )}
                                                </span>
                                            )
                                        }
                                     }
                                    )}
                                    <span className={"empty_col_last"}><div>&nbsp;</div></span>
                                </div>
                            )}

                            <div className={"trow current_year" + (('current_year' === this.state.rowHover) ? ' trow_hover_d' : '')}
                                 onMouseEnter={this.changeRowHover.bind(this,'current_year')}
                            >
                                {this.props.data.map((item,i) => {
                                    if(!item.group){
                                        return(
                                            <span key={i}>
                                                  <div dangerouslySetInnerHTML={{__html: item.currentYear ? item.currentYear : '-' }}></div>
                                            </span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={i} className="group">
                                                    {item.objects.map((item,i) =>
                                                        <span key={i}>
                                                             <div dangerouslySetInnerHTML={{__html: item.currentYear ? item.currentYear : '-' }}></div>
                                                        </span>
                                                    )}
                                            </span>
                                        )
                                    }
                                 }
                                )}
                                <span className={"empty_col_last"}><div>&nbsp;</div></span>
                            </div>

                            {this.state.years.map((item,i) =>
                                <div className={"trow" + ( (i + 'y' === this.state.rowHover) ? ' trow_hover_d' : '') }
                                     key={i}
                                     onMouseEnter={this.changeRowHover.bind(this,i + 'y')}
                                >
                                    {this.props.data.map((item,key) => {
                                        if(!item.group){
                                            return(
                                                <span key={key}>
                                                      <div dangerouslySetInnerHTML={{__html: item['year' + i] ? item['year' + i] : '-' }}></div>
                                                </span>
                                            )
                                        }
                                        else{
                                            return(
                                                <span key={key} className="group">
                                                    {item.objects.map((item,num) =>
                                                        <span key={num}>
                                                             <div dangerouslySetInnerHTML={{__html: item['year' + i] ? item['year' + i] : '-' }}></div>
                                                        </span>
                                                    )}
                                            </span>
                                            )
                                        }
                                     }
                                    )}
                                    <span className={"empty_col_last"}><div>&nbsp;</div></span>
                                </div>
                            )}

                            <div className="footer"></div>

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default TableVerticalNoStick;


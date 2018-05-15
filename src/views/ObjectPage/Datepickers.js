import React from 'react';
import parser from 'ua-parser-js';
import DatePicker from 'react-datepicker';
import moment from 'moment';


//disabled={props.requestIsInProcess}


function handleTextInputOnDatepickers(boolean){//отключение ввода текста в инпут на дейтпикерах в режиме совместимости на моб=х
    let datepickers = document.querySelectorAll('input.datepicker');
    for(let i = 0; i < datepickers.length; i++){
        datepickers[i].disabled = boolean;
    }
}


const Datepickers = (props) => {

    if( (props.viewportWidth < 768 && props.comparison_mode) || props.requestIsInProcess)
        handleTextInputOnDatepickers(true);
    else
        handleTextInputOnDatepickers(false);

    return (
        <div>
            <span className="muted">Период с </span>
            <div className="datepicker_wrp">
                {
                    ( (parser().device.type !== 'mobile' && parser().device.type !== 'tablet') || props.comparison_mode ) ?
                        <DatePicker
                            className="datepicker"
                            selected={props.startDate}
                            dateFormatCalendar={props.comparison_mode ? "MMMM" : "MMMM YYYY"}
                            selectsStart
                            startDate={props.startDate}
                            endDate={props.endDate}
                            minDate={props.comparison_mode ? moment(moment().year() + "-01-01") : ''}
                            maxDate={props.comparison_mode ? moment(moment().year() + "-12-31") : moment()}
                            dateFormat={ props.comparison_mode ? "DD MMM" : "DD MMM YYYY" }
                            onChange={props.handleChangeStart}
                            readOnly={props.viewportWidth < 768}
                        />
                        :
                        <input className="datepicker"
                               required
                               value={props.startDate.format('YYYY-MM-DD')}
                               onChange = {props.handleMobileChangeStart}
                               type="date"
                        />
                }
            </div>
            <div className="datepicker_wrp">
                {
                    ( (parser().device.type !== 'mobile' && parser().device.type !== 'tablet') || props.comparison_mode ) ?
                        <DatePicker
                            className="datepicker"
                            selected={props.endDate}
                            dateFormatCalendar={props.comparison_mode ? "MMMM" : "MMMM YYYY"}
                            selectsEnd
                            startDate={props.startDate}
                            endDate={props.endDate}
                            minDate={props.comparison_mode ? moment(moment().year() + "-01-01") : ''}
                            maxDate={props.comparison_mode ? moment(moment().year() + "-12-31") : moment()}
                            dateFormat={ props.comparison_mode ? "DD MMM" : "DD MMM YYYY" }
                            onChange={props.handleChangeEnd}
                            readOnly={props.viewportWidth < 768}
                        />
                        :
                        <input
                            className="datepicker"
                            required
                            value={props.endDate.format('YYYY-MM-DD')}
                            onChange = {props.handleMobileChangeEnd}
                            type="date"
                        />
                }
            </div>
        </div>
    )
};

export default Datepickers;


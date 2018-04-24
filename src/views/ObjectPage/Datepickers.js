import React from 'react';
import parser from 'ua-parser-js';
import DatePicker from 'react-datepicker';
import {Col} from "reactstrap";
import moment from 'moment';

const Datepickers = (props) => {
    return (
        <div>
            <span className="muted">Период с </span>
            <div className="datepicker_wrp">
                {
                    (parser().device.type !== 'mobile' && parser().device.type !== 'tablet' ) ?
                        <DatePicker
                            className="datepicker"
                            selected={props.startDate}
                            disabled={props.requestIsInProcess}
                            dateFormatCalendar={props.comparison_mode ? "MMMM" : "MMMM YYYY"}
                            selectsStart
                            startDate={props.startDate}
                            endDate={props.endDate}
                            minDate={props.comparison_mode ? moment(moment().year() + "-01-01") : ''}
                            maxDate={props.comparison_mode ? moment(moment().year() + "-12-31") : moment()}
                            dateFormat={ props.comparison_mode ? "DD MMM" : "DD MMM YYYY" }
                            onChange={props.handleChangeStart}
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
                    (parser().device.type !== 'mobile' && parser().device.type !== 'tablet' ) ?
                        <DatePicker
                            className="datepicker"
                            selected={props.endDate}
                            disabled={props.requestIsInProcess}
                            dateFormatCalendar={props.comparison_mode ? "MMMM" : "MMMM YYYY"}
                            selectsEnd
                            startDate={props.startDate}
                            endDate={props.endDate}
                            minDate={props.comparison_mode ? moment(moment().year() + "-01-01") : ''}
                            maxDate={props.comparison_mode ? moment(moment().year() + "-12-31") : moment()}
                            dateFormat={ props.comparison_mode ? "DD MMM" : "DD MMM YYYY" }
                            onChange={props.handleChangeEnd}
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
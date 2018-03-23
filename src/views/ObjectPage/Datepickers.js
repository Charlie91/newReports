import React from 'react';
import parser from 'ua-parser-js';
import DatePicker from 'react-datepicker';
import {Col} from "reactstrap";
import moment from 'moment';

const Datepickers = (props) => {
    return (
        <Col className="datepickers" xs="12" md="5" lg="5" xl="4">
            <span className="muted">Период с </span>
            <div className="datepicker_wrp">
                {
                    (parser().device.type !== 'mobile' && parser().device.type !== 'tablet' ) ?
                        <DatePicker
                            className="datepicker"
                            selected={props.startDate}
                            disabled={props.requestIsInProcess}
                            selectsStart
                            startDate={props.startDate}
                            endDate={props.endDate}
                            maxDate={moment()}
                            dateFormat="DD MMM YYYY"
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
                            selectsEnd
                            startDate={props.startDate}
                            endDate={props.endDate}
                            maxDate={moment()}
                            dateFormat="DD MMM YYYY"
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
        </Col>
    )
};

export default Datepickers;
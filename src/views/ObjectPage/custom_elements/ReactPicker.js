import React from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker, DateRangePickerInput, DayPickerRangeController,  SingleDatePicker, SingleDatePickerInput } from 'react-dates';



class ReactPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: props.startDate,
            endDate: props.endDate,
            focusedInput: null,
        };
    }

    onFocus(){
        this.setState({isOpen:true})
    }

    componentDidUpdate(){
        if(this.state.focusedInput && this.props.viewportWidth < 768)//убираем прокрутку на мобильных устр-х
            document.body.classList.add('mobile-calendar-open');
        else document.body.classList.remove('mobile-calendar-open');
    }

    render() {
        if(this.props.viewportWidth > 767){
            return (
                <div className="react_picker">
                    <DateRangePicker
                        startDateId="startDate"
                        endDateId="endDate"
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onDatesChange={({ startDate, endDate }) => {
                            this.setState({ startDate, endDate })
                            if (startDate && endDate) {
                                this.props.change(startDate, endDate)
                            }
                        }
                        }
                        focusedInput={this.state.focusedInput}
                        onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
                        customInputIcon={<div className="icon"></div>}
                        small={true}
                        startDatePlaceholderText= "Начало"
                        endDatePlaceholderText= "Конец"
                        displayFormat="DD MMM YYYY"
                        isOutsideRange={() => false}
                    />
                </div>
            );
        }
        else return (
            <div className="react_picker">
                    <DateRangePicker
                        startDateId="startDate"
                        endDateId="endDate"
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onDatesChange={({ startDate, endDate }) => {
                            if (startDate && endDate) {
                                this.setState({ startDate, endDate });
                                this.props.change(startDate, endDate)
                            }
                        }
                        }
                        focusedInput={this.state.focusedInput}
                        onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
                        small={true}
                        withFullScreenPortal
                        readOnly={true}
                        orientation='vertical'
                        startDatePlaceholderText= "Начало"
                        endDatePlaceholderText= "Конец"
                        displayFormat={this.state.startDate.year() === this.state.endDate.year() ? 'DD MMM' : 'DD.MM.YYYY'}
                        isOutsideRange={() => false}
                    />
            </div>
        )

    }
}

export default ReactPicker;

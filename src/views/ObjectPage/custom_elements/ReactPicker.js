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
        this.scrollTop = 0;

    }

    onFocus(){
        this.setState({isOpen:true})
    }

    preventScrollOnCalendar(nextState){
        if(nextState.focusedInput){
            this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            document.body.classList.add('mobile-calendar-open');
        }
        else if(this.state.focusedInput && !nextState.focusedInput){
            document.body.classList.remove('mobile-calendar-open');
            window.scrollTo(0,this.scrollTop)
        }
    }

    componentWillUpdate(nextProps,nextState){
        if(this.props.viewportWidth < 768 && !!nextState.focusedInput !== !!this.state.focusedInput)//если лог-я значения focusedInput не равны
            this.preventScrollOnCalendar(nextState);//убираем прокрутку на мобильных устр-х
    }

    componentDidMount(){
        let inputs = document.querySelectorAll('.object_cont .new-chart .datepickers .wrapper div input');
        for (let input of inputs) {
            input.onfocus = (e) => {
                e.preventDefault();
                input.blur();
                return false;
            }
        }
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
                        onFocusChange={(focusedInput) => {this.setState({ focusedInput })}}
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

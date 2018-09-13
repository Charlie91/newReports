import React from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';


class ReactPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: props.startDate,
      endDate: props.endDate,
      focusedInput: null,
    };
  }

  render() {
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
               this.props.change2(startDate, endDate)
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
}

export default ReactPicker;

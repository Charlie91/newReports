import React, { Component } from 'react';
import {digitCount, formatNumberBySpaces, formatNumericValue} from "Src/utils/utils";
import utils from "Src/views/ObjectPage/obj_utils";


const DataBarChartTotal = (props) => {
    let total_sum = formatNumberBySpaces(formatNumericValue(Math.round(props.TotalSum)));
    let curency = '';
    if((digitCount(props.TotalSum) > 6) || ( props.CurrentWidth > 768 && props.CurrentWidth < 1525))
        curency = props.Currency.substring(0,3) + '.';
    else
        curency = props.Currency;
    let text = `${total_sum} ${curency}`;
    return <div>
        <span className="data">{text}</span>
        <span className="muted">{props.NameOfData} за выбранный период</span>
    </div>
}

export default DataBarChartTotal;
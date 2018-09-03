import React from 'react';
import {Col, Row, Card, CardBody} from "reactstrap";
import moment from 'moment';


function getDifferenceWithLastYear(datasets,index){
    if(datasets.length < 2)return;
    let [currentYear, previousYear] = [datasets.find(el => el.label === String(moment().year())),datasets.find(el => el.label === String(moment().year() - 1))];
    let [currentValue, previousYearValue] = [currentYear.data[index], previousYear.data[index]];

    let diff = ( currentValue - previousYearValue ) / ( ( currentValue + previousYearValue ) / 2 ) * 100;

    return (
        <span className={diff > 0 ? 'positive' : 'negative'}>
            {Math.round(diff) > 0 ? ` +${Math.round(diff)}%` : ` ${Math.round(diff)}%`}
        </span>
    );
}

const YearTable = (props) => {
    if(!props.filteredData.datasets.length || props.requestIsInProcess)return null;
    let lastDayInYear = (props.endDate.year() % 4 === 0) ? 366 : 365;
    props.filteredData.datasets.sort((a,b) => a.label - b.label);

    console.log(props.filteredData);
    var arr = [];

    if(props.timeSegment === 'M' && props.startDate.dayOfYear() === 1 && props.endDate.dayOfYear() === lastDayInYear){
        return (
            <table>
                <tbody>
                <tr>
                    <td></td>
                    <td>янв</td>
                    <td>фев</td>
                    <td>март</td>
                    <td>апр</td>
                    <td>май</td>
                    <td>июнь</td>
                    <td>июль</td>
                    <td>авг</td>
                    <td>сент</td>
                    <td>окт</td>
                    <td>ноя</td>
                    <td>дек</td>
                    <td className="total">Итого</td>
                    <td className="forecast">Прогноз</td>
                </tr>
                {props.filteredData.datasets.map(datasets => {
                    let total = datasets.data.reduce((sum,item) => {
                        return sum + item
                    },0);
                    return (
                        <tr key={datasets.label}>
                            <td>{datasets.label}</td>
                            {datasets.data.concat(Array(12).fill(null)).map((data, i) => {
                                    if(i < 12)
                                        return (
                                            <td key={i}>
                                                {
                                                    data ?
                                                        <span>
                                                            {data}
                                                            {
                                                                datasets.label === String(moment().year()) &&
                                                                getDifferenceWithLastYear(props.filteredData.datasets,i)
                                                            }
                                                        </span>
                                                        :
                                                        '--'
                                                }
                                            </td>
                                        );
                                    else return null;
                                }
                            )}
                            <td className="total">{total}</td>
                            <td className="forecast">
                                {
                                    (moment().year() == datasets.label) ?
                                        parseInt(total / moment().month() * 12)
                                        :
                                        '--'
                                }
                            </td>
                        </tr>
                    )
                }

                )}

                </tbody>
            </table>
        );
    }
    else
        return null;
};


export default YearTable;




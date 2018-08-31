import React from 'react';
import {Col, Row, Card, CardBody} from "reactstrap";
import moment from 'moment';


const YearTable = (props) => {
    if(!props.filteredData.datasets.length || props.requestIsInProcess)return null;
    let lastDayInYear = (props.endDate.year() % 4 === 0) ? 366 : 365;
    props.filteredData.datasets.sort((a,b) => a.label - b.label);

    console.log(props.filteredData);
    var arr = [];

    if(props.timeSegment === 'M' && props.startDate.dayOfYear() === 1 && props.endDate.dayOfYear() === lastDayInYear){/*&& props.endDate.dayOfYear() !== lastDayInYear*/    //&& props.startDate.dayOfYear() !== 1
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
                                            <td key={i}>{(data <p>1</p>) || '--'}</td>
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




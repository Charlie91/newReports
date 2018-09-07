import React from 'react';
import moment from 'moment';
import {formatNumberBySpaces} from './../../utils/utils';


function getPreviousYearData(datasets,year){
    let lastYear = datasets.find(el => el.label === String(year - 1));
    if(!lastYear && year < 2005)return;//если уж совсем непонятный пздц(чтоб браузер не вис)
    if(!lastYear)return getPreviousYearData(datasets,year - 1);//если предыдущего года в данных нету - ищем с пред-предыдущем и т.д.
    return lastYear;
}


function getDifferenceWithLastYear(datasets,index){
    if(datasets.length < 2)return;
    let [currentYearData, previousYearData] = [datasets.find(el => el.label === String(moment().year())),getPreviousYearData(datasets,moment().year())];
    let [currentValue, previousYearValue] = [currentYearData.data[index], previousYearData.data[index]];

    let diff = ( currentValue - previousYearValue ) / ( ( currentValue + previousYearValue ) / 2 ) * 100;

    return (
        <span className={diff > 0 ? 'positive' : 'negative'}>
            {Math.round(diff) > 0 ? ` +${Math.round(diff)}%` : ` ${Math.round(diff)}%`}
        </span>
    );
}

const YearTable = (props) => {
    if(props.filteredData.datasets.length < 2 || props.requestIsInProcess)return null;
    let lastDayInYear = (props.endDate.year() % 4 === 0) ? 366 : 365;
    props.filteredData.datasets.sort((a,b) => a.label - b.label);

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
                {props.filteredData.datasets.map((datasets,i) => {
                        let total = datasets.data.reduce((sum,item) => {
                            return sum + item
                        },0);


                        let previousTotal;
                        if(datasets.label === String(moment().year())){
                            previousTotal = getPreviousYearData(props.filteredData.datasets,moment().year()).data.reduce((sum,item) => {
                                return sum + item
                            },0);
                        }

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
                                                               <span dangerouslySetInnerHTML={{__html:`${formatNumberBySpaces(data)}`}}></span>
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
                                <td className="total">
                                    <span dangerouslySetInnerHTML={{__html:`${formatNumberBySpaces(total)}`}}></span>
                                    <span className={total - previousTotal > 0 ? 'positive' : 'negative'} style={{fontSize:'12px'}}>
                                    {
                                        datasets.label === String(moment().year()) &&
                                        ` ${Math.round(( total - previousTotal ) / ( ( total + previousTotal) / 2 ) * 100)}%`
                                    }
                                </span>
                                </td>
                                <td className="forecast">
                                    {
                                        (moment().year() == datasets.label) ?
                                            <span dangerouslySetInnerHTML={{__html:`${formatNumberBySpaces(parseInt(total / moment().month() * 12))}`}}></span>
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




import React from 'react';
import moment from 'moment';


function toggleDropDown(){
    let dropdown_menu = document.querySelector('.dropdown-menu');
    dropdown_menu.classList.toggle('none');
}


const YearSelector = (props) => {
    if(!props.render)return null;

    let numberOfYearsAtList = props.numberOfYearsAtList || 3;  //количество отображаемых годов вне выпадашки
    let yearOfOpening = moment(props.object.since).year();//год открытия
    let years = [2018,2017,2016,2015,2014].filter(year => year >= yearOfOpening);   //фильтруем года на доступные данному объекту

    let [listData,dropdownData] = [years.filter( (item,i) => i < numberOfYearsAtList), years.filter( (item,i) => i >= numberOfYearsAtList)];

    return (
        <div className={"year_selector"}>
            <span className={"muted" + (props.title ? '' : ' none')}>{props.title || ''}</span>
            <div className="year_selector_list">
                {years && listData.map( (item,i) =>
                    <div className="year" key={i} onClick={props.checkYear.bind(null,item)}>
                        <div className={"checkbox y" + item + (i === 0  ? ' checked' : '')}></div>
                        <span>{`${item} ${props.additional || ''}`}</span>
                    </div>
                )}

                <div className={"dropdown" + (dropdownData.length ? '' : ' none')}>
                    <button className="btn dropdown-toggle" onClick={toggleDropDown} >
                        ранее
                    </button>
                    <div className="dropdown-menu none" aria-labelledby="dropdownMenuButton">
                        {years && dropdownData.map( (item,i) =>
                            <div className="year" key={i} onClick={props.checkYear.bind(null,item)}>
                                <div className={"checkbox y" + item}></div>
                                <span>{`${item} ${props.additional || ''}`}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};



export default YearSelector;
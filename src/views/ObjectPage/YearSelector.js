import React from 'react';
import moment from 'moment';



function toggleDropDown(){
    let dropdown_menu = document.querySelector('.dropdown-menu');
    dropdown_menu.classList.toggle('none');
}


const YearSelector = (props) => {
    if(!props.comparison_mode)return null;

    let yearOfOpening = moment(props.object.since).year();//год открытия
    let years = [2018,2017,2016,2015,2014].filter(year => year >= yearOfOpening);   //фильтруем года на доступные данному объекту

    let [listData,dropdownData] = [years.filter( (item,i) => i < 3), years.filter( (item,i) => i >= 3)];

    return (
        <div className={"year_selector"}>
            <span className="muted">{props.viewportWidth > 767 ? 'Выберите годы:' : 'Годы:'}</span>
            <div className="year_selector_list">
                {years && listData.map( (item,i) =>
                    <div className="year" key={i} onClick={props.checkYear.bind(null,item)}>
                        <div className={"checkbox y" + item + (i === 0 || i == 1 ? ' checked' : '')}></div>
                        <span>{item}</span>
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
                                <span>{item}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};



export default YearSelector;
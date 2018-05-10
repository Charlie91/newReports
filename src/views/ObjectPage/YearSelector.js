import React from 'react';



function toggleDropDown(){
    let dropdown_menu = document.querySelector('.dropdown-menu');
    dropdown_menu.classList.toggle('none');
}


const YearSelector = (props) => {
    if(!props.comparison_mode)return null;
    return (
        <div className={"year_selector"}>
            <span className="muted">{props.viewportWidth > 767 ? 'Выберите годы:' : 'Годы:'}</span>
            <div className="year_selector_list">
                <div className="year" onClick={props.checkYear.bind(null,2018)}>
                    <div className="checkbox checked y2018"></div>
                    <span>2018</span>
                </div>
                <div className="year" onClick={props.checkYear.bind(null,2017)}>
                    <div className="checkbox checked y2017"></div>
                    <span>2017</span>
                </div>
                <div className="year" onClick={props.checkYear.bind(null,2016)}>
                    <div className="checkbox y2016"></div>
                    <span>2016</span>
                </div>

                <div className="dropdown">
                    <button className="btn dropdown-toggle" onClick={toggleDropDown} >
                        ранее
                    </button>
                    <div className="dropdown-menu none" aria-labelledby="dropdownMenuButton">
                        <div className="year" onClick={props.checkYear.bind(null,2015)}>
                            <div className="checkbox y2015"></div>
                            <span>2015</span>
                        </div>
                        <div className="year" onClick={props.checkYear.bind(null,2014)}>
                            <div className="checkbox y2014"></div>
                            <span>2014</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};



export default YearSelector;
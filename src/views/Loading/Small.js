import React from 'react';
import './loading.scss';

const Loading = (props) => {
    //if(!props.render)return null;
    return (
        <div>
            <div className="sk-wave">
                <div className="sk-rect sk-rect1"></div>&nbsp;
                <div className="sk-rect sk-rect2"></div>&nbsp;
                <div className="sk-rect sk-rect3"></div>&nbsp;
                <div className="sk-rect sk-rect4"></div>&nbsp;
                <div className="sk-rect sk-rect5"></div>
            </div>
        </div>
    )
};
export default Loading;
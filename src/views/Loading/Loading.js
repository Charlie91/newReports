import React from 'react';
import './loading.scss';
import Image from './Loading-circle.gif';

const Loading = (props) => {
    //if(!props.render)return null;
    return (
        <div className="loading_process">
            <h1 className="load_title"></h1>
            <div className="sk-folding-cube load_image">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
            </div>
        </div>
    )
};
//<img src={Image} className="load_image"/>
export default Loading;
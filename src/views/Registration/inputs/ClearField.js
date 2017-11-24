import React from 'react';


export default function ClearField(props){
    if(!props.render)return null;
    return(
        <button className="clear-field" onClick={props.clearField}>	X</button>
    )
}
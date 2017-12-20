import React from 'react';


export default function ClearField(props){
    if(!props.render)return null;
    return(
        <button className="clear-field" tabIndex="-1" onClick={props.clearField}>	</button>
    )
}
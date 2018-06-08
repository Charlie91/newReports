import React from 'react';


const FloorButtons = (props) => {
    if(!props.floors || props.floors.length < 2)return null;
    return(
        <div className="floor_btn-layer" style={{overflow:'hidden'}}>
            <div className="floor_btn-wrp">
                {props.floors.map((item,i) =>
                    <button type="button"
                            key={i}
                            data-id={i}
                            disabled={props.requestIsInProcess}
                            className={'btn filter_btn ' + ((props.floorIndex === i) ? 'active' : '')}
                            onClick={props.changeFloor}
                    >
                        {item.name}
                    </button>
                )}
            </div>
        </div>
    )
};


export default FloorButtons;


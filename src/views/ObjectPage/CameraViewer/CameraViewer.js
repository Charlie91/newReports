import React from 'react';
import utils from '../obj_utils';
import ReactSWF from 'react-swf';
import {Collapse} from "reactstrap";
import './style.scss';

const CameraViewer = (props) => {
    if(!props.object || !props.object.camera_floors)return null;
    let flashes = props.object.camera_floors[0].cameras;

    function handleClick(i) {
        document.querySelectorAll('.video-box li.accordeon')[i].querySelector('.collapse').classList.toggle('show');
    }


    if(utils.checkIfFlashEnabled())
                    return (
                        <div id="video-box-main" className="box-video-position video-box">
                            {
                                flashes.map( (item,i) =>
                                    <li key={i}
                                        className="accordeon"
                                        onClick={handleClick.bind(null,i)}
                                    >
                                        <span className="title">{item.name} <br/><button>Вкл/выкл</button></span>
                                        <Collapse isOpen={false}>
                                            <ReactSWF
                                                src="https://re-ports.ru/app/video-control.swf"
                                                id="block-video"
                                                width="400"
                                                height="300"
                                                allowFullScreen={true}
                                                wmode="window"
                                                flashVars={item.url}
                                                key={i}
                                            />
                                        </Collapse>
                                    </li>
                                )
                            }
                        </div>
                    );
    else{
        return(
            <div id="video-box-main" className="box-video-position video-box">
                <video height="288" width="352" controls="controls" id="block-video" src="http://213.59.206.249:8890/live/2.stream/playlist.m3u8"></video>
            </div>
        )
    }
};


export default CameraViewer;

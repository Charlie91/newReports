import React from 'react';
import utils from './obj_utils';
import ReactSWF from 'react-swf';

const CameraViewer = (props) => {
    if(!props.object || !props.object.camera_floors)return null;
    let flashURLs = props.object.camera_floors[0].cameras.map(item => item.url);

    if(utils.checkIfFlashEnabled())
                    return (
                        <div id="video-box-main" className="box-video-position video-box">
                            {
                                flashURLs.map( (url,i) =>
                                    <ReactSWF
                                        src="https://re-ports.ru/app/video-control.swf"
                                        id="block-video"
                                        width="300"
                                        height="200"
                                        allowFullScreen={true}
                                        wmode="window"
                                        flashVars={url}
                                        key={i}
                                    />
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

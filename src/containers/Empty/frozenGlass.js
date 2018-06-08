import {getCoords} from './../../utils/utils';

export default function frozenGlass(){

    let frame = document.getElementById('blurredContentFrame'),
        content = document.getElementById('blurredContent'),
        auth_window = document.querySelector('.auth-window');

    if(!frame)
        addContent();
    else{
        document.body.removeChild(frame);
        addContent();
    }

    frame.style.cssText =
        `width:${auth_window.offsetWidth}px;\
         height:${auth_window.offsetHeight}px;`;

    sizeContent();
    positionBlur();


    function addContent(){
        document.body.insertAdjacentHTML('beforeEnd', '<div id="blurredContentFrame"><div id="blurredContent"></div></div>');
        frame = document.getElementById('blurredContentFrame');
        content = document.getElementById('blurredContent');
        content.appendChild(document.querySelector('.auth-layer').cloneNode(true))
    }

    function sizeContent() {
        let layer = document.querySelector('.auth-layer');
        content.style.cssText +=
            `width:${layer.offsetWidth}px;\
             height:${layer.offsetHeight}px;`;
    }

    function positionBlur() {
        let offset = getCoords(auth_window);

        frame.style.cssText +=
            `left:${offset.left}px;\
             top:${offset.top}px;`;

        content.style.cssText +=
            `left:-${offset.left}px;\
             top:-${offset.top}px;`;
    }

}
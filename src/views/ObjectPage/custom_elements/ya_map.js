import React from 'react';
import { YMaps, Map} from 'react-yandex-maps';


const YaMap = (props) => {

    const mapState = { center: [props.object.lattitude, props.object.longitude], zoom: 16, controls: [], behaviors:[], options:[] };

    return (
        <div>
            <a href={`https://yandex.ru/maps/213/moscow/?ll=${props.object.longitude}%2C${props.object.lattitude}&z=16&mode=poi&poi%5Bpoint%5D=${props.object.longitude}%2C${props.object.lattitude}`} target="blank" >
                <YMaps>
                    <Map state={mapState}
                         width={(props.viewportWidth < 1199) ? '100px' : '360px'}
                         height={(props.viewportWidth < 1199) ? '100px' : '420px'}
                    >
                    </Map>
                </YMaps>
            </a>
        </div>
    )
};


export default YaMap;


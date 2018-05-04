import React from 'react';
import { YMaps, Map} from 'react-yandex-maps';


const YaMap = (props) => {

    const mapState = { center: [props.state.object.lattitude, props.state.object.longitude], zoom: 16, controls: [], behaviors:[], options:[] };

    return (
        <div>
            <a href={`https://yandex.ru/maps/213/moscow/?ll=${props.state.object.longitude}%2C${props.state.object.lattitude}&z=16&mode=poi&poi%5Bpoint%5D=${props.state.object.longitude}%2C${props.state.object.lattitude}`} target="blank" >
                <YMaps>
                    <Map state={mapState}
                         width={(props.state.viewportWidth < 1199) ? '100px' : '360px'}
                         height={(props.state.viewportWidth < 1199) ? '100px' : '420px'}
                    >
                    </Map>
                </YMaps>
            </a>
        </div>
    )
};


export default YaMap;


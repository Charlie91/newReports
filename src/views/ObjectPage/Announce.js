import React from 'react';
import {Col, Row, Card, CardBody} from "reactstrap";
import { decodeHalfPunycodeLink, formatNumberBySimpleSpaces } from 'Src/utils/utils';
import moment from 'moment';
import {API} from 'Src/utils/api_paths';
import YaMap from './ya_map';

function getCorrectDeclensionToHours(hours){//вернуть нужное склонение
    if(hours > 10 && hours < 20)
        return 'часов';

    let str = String(hours);
    let last_digit = str[str.length - 1];

    let result = '';
    switch(last_digit){
        case '1':
            result = 'час';
            break;
        case '2':
        case '3':
        case '4':
            result = 'часа';
            break;
        default:
            result = 'часов';
    }

    return result;
}

function getCorrectDeclensionToMinutes(minutes){//вернуть нужное склонение
    if(minutes > 10 && minutes < 20)
        return 'минут';

    let str = String(minutes);
    let last_digit = str[str.length - 1];

    let result = '';
    switch(last_digit){
        case '1':
            result = 'минута';
            break;
        case '2':
        case '3':
        case '4':
            result = 'минуты';
            break;
        default:
            result = 'минут';
    }

    return result;
}

const Announce = (props) => {
    let hours,minutes;
    if(props.averageTimeOfVisit){
         hours = Math.floor(props.averageTimeOfVisit / 3600);
         minutes = Math.floor(props.averageTimeOfVisit / 60 % 60);
    }
    return (
        <Row className="announce">
            <Col className="data_wrapper order-12 order-md-1" md="6" xs="12">
                <Card>
                    <CardBody>
                        <div className="obj_title">
                            <Row>
                                <Col md="12" xs="9">
                                    <h4>{props.object.obj_name}</h4>
                                </Col>
                                <Col md="0" xs="3">
                                    <a className="link_mobile" target="_blank" href={props.object.website}>cайт</a>
                                </Col>
                            </Row>
                            <a className="link_desktop" href={props.object.website} target="_blank">{decodeHalfPunycodeLink(props.object.website) || ''}</a>
                            <p className="muted address_mobile" dangerouslySetInnerHTML={{__html: props.object.address}} />
                        </div>
                        <hr className={(props.object.floors_count &&
                                        props.object.gb_area &&
                                        props.object.gl_area &&
                                        props.object.since ) ? 'divider' : 'none'}
                        />
                        <Row>
                            <Col md="7" className="features">
                                <div className={props.object.floors_count ? '' : 'none'}>
                                    <strong>Этажей:</strong>
                                    <span className="muted">{props.object.floors_count || '?'}</span>
                                </div>

                                <div className={(props.object.gb_area && props.object.gl_area) ? '' : 'none'}>
                                    <strong>Площадь:</strong>
                                    <span className="muted">  GBA</span>
                                    <span className="muted-bold" dangerouslySetInnerHTML={{__html: formatNumberBySimpleSpaces(props.object.gb_area) + " м<sup>2</sup>"}} />
                                    <span className="muted">, GLA </span>
                                    <span className="muted-bold" dangerouslySetInnerHTML={{__html: formatNumberBySimpleSpaces(props.object.gl_area) + " м<sup>2</sup>"}} />
                                </div>

                                <div className={props.object.since ? 'opening_day' : 'none'}>
                                    <strong>Дата открытия:</strong>
                                    <span className="muted">  {moment(props.object.since).locale('ru').format('DD MMMM YYYY') || ''} </span>
                                </div>

                                {props.averageTimeOfVisit ?
                                    <div className="timeOfVisit_wrapper">
                                        <div className="timeOfVisit">
                                            {
                                                hours ?
                                                    `${hours} ${getCorrectDeclensionToHours(hours)}`
                                                    :
                                                    ''
                                            }
                                            {
                                                minutes ?
                                                    ` ${minutes} ${getCorrectDeclensionToMinutes(minutes)}`
                                                    :
                                                    ''
                                            }
                                        </div>
                                        <div className="muted">среднее время посещения</div>
                                    </div>
                                    :
                                    ''
                                }

                                {/*<div className="floor_plans">
                                 <strong>Поэтажные планы</strong>
                                 </div>*/}

                                <div className="social_links">
                                    <a href={props.object.vkontakte} target="blank" className={props.object.vkontakte ? 'vk' : 'vk none'}></a>
                                    <a href={props.object.facebook}  target="blank" className={props.object.facebook ? 'fb' : 'fb none'}></a>
                                    <a href={props.object.instagram}  target="blank" className={props.object.instagram ? 'ig' : 'ig none'}></a>
                                </div>
                            </Col>
                            <Col md="5" className="geolocation">
                                <div className="map_wrapper">
                                    <YaMap {...props}/>
                                </div>
                                <div className="address" dangerouslySetInnerHTML={{__html: props.object.city_name + ',<br/>' + String(props.object.address).replace(props.object.city_name + ',', '' ) }} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col style={{overflow:'hidden', backgroundImage: (props.images.length ? `url(${API.imgPath}/${props.object.id}/${props.images[0]})` : `url(${API.imgPath}/mall_default.jpg)`) }}
                 className={((props.images.length) ? "img_wrapper_full" : "img_wrapper_def") + ' img_wrapper order-1 order-md-12'} md="6" xs="12">
            </Col>
        </Row>
    )
};

export default Announce;
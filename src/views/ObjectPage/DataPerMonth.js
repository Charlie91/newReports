import React from 'react';
import {Col, Row, Card, CardBody} from "reactstrap";
import { formatNumericValue,formatNumberBySpaces,average} from './../../utils/utils';
import Loading from './../Loading/Small';


function formatMonths(index){
    return ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][index];
}


const DataPerMonth = (props) => {
    return (
        <Card className="data_per_month">
            <Row className="header">
                <Col md='6' xl="6" lg="7">
                    <h4>{(props.type === 'Выручка') ? 'Выручка' : 'Посещаемость'} по месяцам</h4>
                    <div className="muted">Указана суммарная {(props.type === 'Выручка') ? 'выручка' : 'посещаемость'} в месяц</div>
                </Col>

                <Col className={(props.viewportWidth < 768) ? 'none' : ''}
                     lg={{size:5,offset:0}}
                     xl={{size:3,offset:3}}
                     md={{size:3,offset:3}}
                >

                               <span className="data"
                                     dangerouslySetInnerHTML=
                                         {{
                                             __html:`${formatNumberBySpaces(props.countAverageOfMonths())} ${props.renderCurrency()}`
                                         }}
                               ></span>
                    <div className="muted">Средняя {(props.type === 'Выручка') ? 'выручка' : 'посещаемость'} в месяц</div>
                </Col>
            </Row>
            <div className="scrollHider">
                <CardBody>
                    {
                        (props.monthlyData) ?
                            <ul>
                                <li className={(props.viewportWidth > 768) ? 'none average' : 'average'}>
                                    <div>
                                        <strong
                                            dangerouslySetInnerHTML={{__html:`${formatNumberBySpaces(formatNumericValue(props.countAverageOfMonths()))} ${((props.type === 'Выручка') ? '' : 'чел.')}`}}
                                        >
                                        </strong>
                                    </div>
                                    <div className="muted">
                                        средняя в мес.
                                    </div>
                                </li>
                                {
                                    props.monthlyData.map( (item,i) => {
                                        return(
                                            <li key={i}>
                                                <div>
                                                    <strong
                                                        dangerouslySetInnerHTML={{__html:`${formatNumberBySpaces(formatNumericValue(item.value))} ${((props.type === 'Выручка') ? '' : 'чел.')}`}}
                                                    >
                                                    </strong>
                                                </div>
                                                <div className="muted">
                                                    {`${formatMonths(item.month)} ${ ((item.year === (new Date()).getFullYear()) ? '' : '') }` }
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            :
                            <Loading/>
                    }
                </CardBody>
            </div>
        </Card>
    )
};

export default DataPerMonth;
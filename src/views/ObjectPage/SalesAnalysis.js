import React from 'react';
import utils from './obj_utils';
import {Scatter,Chart} from "react-chartjs-2";
import {Card, CardBody, Row, Col} from "reactstrap";

const data = {
    labels: ['Scatter'],
    datasets: [
        {
            label: 'My First dataset',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
            data: [
                { x: 65, y: 75 },
                { x: 59, y: 49 },
                { x: 80, y: 90 },
                { x: 81, y: 29 },
                { x: 56, y: 36 },
                { x: 55, y: 25 },
                { x: 40, y: 18 },
            ]
        }
    ]
};

const SalesAnalysis = (props) => {
    return (
        <Card>
            <CardBody>
                <h5>ABC-XYZ анализ продаж</h5>
                <span className="muted">помогает определить надежных и ненадежных арендаторов</span>
                <Row>
                    <Col md="3">
                        <button className="filter_btn">Магазины</button>
                        <button className="filter_btn">Категории</button>
                        <button className="filter_btn">Ценовые сегменты</button>
                    </Col>
                </Row>
                <Scatter data={data} />
            </CardBody>
        </Card>
    );
};


export default SalesAnalysis;

import React from 'react';
import {Row,Col, Card, CardBody} from "reactstrap";
import {formatNumberBySpaces} from './../../utils/utils';
import DataChart from './DataChart';
import DataChartSmall from './DataChartSmall';
import utils from './obj_utils';
import Datepickers from './Datepickers';
import YearSelector from './YearSelector';
import FloorButtons from './floor_buttons';
import SegmentationButtons from './segmentation_buttons';


const MainData = (props) => {
    return(
        <Card className="all_data">
            <CardBody className="card-body">
                <Row>
                    <Col md="5" style={{whiteSpace:'nowrap'}}>
                        <h5 className="measure">{(props.type === 'Выручка') ? 'Выручка' : 'Трафик'}</h5>
                        <div className={"comparison_mode-wrp " + (props.comparison_mode ? 'active' : '' )  }>
                            <div className="outer_circle">
                                <div className="inner_circle"></div>
                            </div>
                            <button className="btn" onClick={props.changeComparisonMode}>
                                { (props.comparison_mode ? 'Выключить' : 'Включить') + ' режим сравнения' }
                            </button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="datepickers" xs="12" md="5" lg="5" xl="4">
                        <Datepickers
                            startDate={props.startDate}
                            endDate={props.endDate}
                            requestIsInProcess={props.requestIsInProcess}
                            handleChangeStart={props.handleChangeStart}
                            handleChangeEnd={props.handleChangeEnd}
                            handleMobileChangeStart={props.handleMobileChangeStart}
                            handleMobileChangeEnd={props.handleMobileChangeEnd}
                            comparison_mode={props.comparison_mode}
                            {...props}
                        />
                        {(props.viewportWidth > 767) &&
                        <YearSelector
                            render={props.comparison_mode}
                            comparison_mode={props.comparison_mode}
                            checkYear={props.checkYear}
                            title="Выберите годы:"
                            {...props}
                        />
                        }

                    </Col>
                    <Col xs="12" md="4" lg="4" xl="5">
                        <FloorButtons
                            changeFloor={props.changeFloor}
                            {...props}
                        />
                    </Col>
                    <Col xs="12" md="3" className={"totalSum " + (props.comparison_mode ? 'none' : '')}>
                                <span className="data"
                                      dangerouslySetInnerHTML=
                                          {{
                                              __html:`${formatNumberBySpaces(Math.round(props.totalSum))} ${utils.renderCurrency(props)}`
                                          }}
                                >
                                </span>
                        <span className="muted">{(props.type === 'Выручка') ? 'Выручка' : 'Посетители'} за выбранный период</span>
                    </Col>
                </Row>
                <div className="scrollHider">
                    <Row>
                        {(props.viewportWidth > 767) ?
                            <DataChart
                                render={!(props.type === 'Выручка')}
                                comparison_mode={props.comparison_mode}
                                data={props.chart}
                                startDate={props.startDate}
                                endDate={props.endDate}
                                currency={props.currency}
                                timeSegment={props.timeSegment}
                                emptyData={props.emptyData}
                            />
                            :
                            <DataChartSmall
                                render={!(props.type === 'Выручка')}
                                comparison_mode={props.comparison_mode}
                                data={props.chart}
                                startDate={props.startDate}
                                endDate={props.endDate}
                                currency={props.currency}
                                timeSegment={props.timeSegment}
                                emptyData={props.emptyData}
                            />
                        }
                        <SegmentationButtons
                            changeTimeSegment={props.changeTimeSegment}
                            {...props}
                        />
                    </Row>
                </div>
                {(props.viewportWidth <= 767) &&
                    <YearSelector
                        render={props.comparison_mode}
                        comparison_mode={props.comparison_mode}
                        checkYear={props.checkYear}
                        title="Годы:"
                        {...props}
                    />
                }
            </CardBody>
        </Card>
    )
};


export default MainData;


import React from 'react';
import {Card, CardBody} from "reactstrap";


const ShopList = (props) => {
    if(!props.shops.length)return null;

    let columnsCountClass = '';
    switch(props.shops.length){
        case 1:
            columnsCountClass = 'singleColumn';
            break;
        case 2:
            columnsCountClass = 'doubleColumns';
            break;
        case 3:
            columnsCountClass = 'tripleColumns';
            break;
        case 4:
            columnsCountClass = 'quadColumns';
            break;
        default:
            columnsCountClass = 'plurableColumns';
    }

    return (
        <Card className="inner_objects">
            <CardBody>
                <h5>Магазины в ТЦ</h5>
                <span className="muted">Список магазинов по категориям</span>
                <ul className={`list_wrapper ${columnsCountClass}`}>
                    {props.shops.map((item,i) => {
                        let children = item.objects.map((object,n) => {
                            return (
                                <li className="list-item">
                                    {object.obj_name}
                                </li>
                            )
                        });
                        return ([
                            <li className="title">{item.title}</li>,
                            children
                        ])
                    })}
                </ul>
            </CardBody>
        </Card>
    )
};


export default ShopList;
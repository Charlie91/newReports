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
                            if(!n)return null;                      {/*первый объект в списке привязываем к заголовку =*/}
                            return (
                                <li className={item.objects.length === (n + 1) ? 'last-item list-item' : 'list-item' }>
                                    <span>{object.obj_name}</span>
                                </li>
                            )
                        });
                        return ([
                            <li className="title">
                                {item.title}
                                <br/>
                                <span className={item.objects.length === 1 ? 'last-item' : '' }>        {/*первый объект в списке привязываем к заголовку =*/}
                                    {item.objects[0].obj_name}
                                </span>
                            </li>,
                            children
                        ])
                    })}
                </ul>
            </CardBody>
        </Card>
    )
};


export default ShopList;
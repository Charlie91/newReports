import React from 'react';
import {Card, CardBody} from "reactstrap";
import {Link} from 'react-router-dom';


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
                                        <Link to={{ pathname: `/concept${object.conception}/city${props.city}/object${object.id}` }}>
                                            {object.name}
                                        </Link>
                                </li>
                            )
                        });
                        return ([
                            <li className="title">
                                {item.title}
                                <br/>
                                <Link
                                      to={{ pathname: `/concept${item.objects[0].conception}/city${props.city}/object${item.objects[0].id}` }}
                                      className={item.objects.length === 1 ? 'last-item' : '' }
                                >
                                    {item.objects[0].name}
                                </Link>
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
//
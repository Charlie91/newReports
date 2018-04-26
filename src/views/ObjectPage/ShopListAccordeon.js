import React from 'react';
import {Card, CardBody, Collapse} from "reactstrap";
import {Link} from 'react-router-dom';


const ShopListAccordeon = (props) => {
    if(!props.shops.length)return null;

    function handleClick(i) {
        document.querySelectorAll('li.accordeon')[i].querySelector('.collapse').classList.toggle('show');
    }

    function stopPropagation(e){
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    return (
        <Card className="inner_objects">
            <CardBody>
                <h5>Магазины в ТЦ</h5>
                <span className="muted">Список магазинов по категориям</span>
                <ul className={`list_wrapper singleColumn`}>
                    {props.shops.map((item,i) => {
                        return (
                            <li key={i}
                                className="accordeon"
                                onClick={handleClick.bind(null,i)}
                            >
                                <span className="title">{item.title}</span>
                                <Collapse isOpen={false}>
                                    {item.objects.map((object,n) => {
                                        return (
                                            <Link to={'/authorization'} key={n} className="list-item">
                                                {object.name}
                                             </Link>
                                        )
                                    })}
                                </Collapse>
                            </li>
                         )
                    })}
                </ul>
            </CardBody>
        </Card>
    )
};


export default ShopListAccordeon;


// onClick={stopPropagation}
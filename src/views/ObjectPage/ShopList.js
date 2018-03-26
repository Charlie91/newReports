import React from 'react';

const ShopList = (props) => {
    return (
        <ul className="list_wrapper">
            {props.shops.map((item,i) => {
                let arr = item.objects.map((object,n) => {
                    return (
                        <li className="list-item">{object.obj_name}</li>
                    )
                });
                return ([
                    <li className="title">{item.title}</li>,
                    arr
                ])
            })}
        </ul>
    )
};


export default ShopList;
import React from 'react';
import Select from 'react-select';

const SelectList = (props) => (<Select
    className="select_list"
    closeOnSelect={true}
    removeSelected={false}
    onChange={props.onSelect}
    options={props.options}
    placeholder="Выберите"
    simpleValue
    value={props.default_value}
    inputProps={{readOnly:true}}
/>);
export default SelectList;
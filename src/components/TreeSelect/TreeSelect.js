import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import './style.css';

const tree = [
    {
        "label":'Выбрать все',
        "value":'select-all',
        className:'select-all'
    },
    {
        "label":'Очистить все',
        "value":'clear-all',
        className:'clear-all'
    },
    {
  "label": "Москва",
  "value": "Москва",
  checked:true
  },{
  "label": "Московская обл.",
  "value": "Московская обл.",
  expanded:true,
  "children": [
    {
      "label": "Балашиха",
      "value": "Балашиха",
      checked:true,
    },
    {
      "label": "Видное",
      "value": "Видное",
    },
    {
      "label": "Долгопрудный",
      "value": "Долгопрудный",
    }
  ]
},{
  "label": "Калужская обл.",
  "value": "Калужская обл.",
  expanded:true,
  "children": [
    {
      "label": "Балабаново",
      "value": "Балабаново",
    },
    {
      "label": "Калуга",
      "value": "Калуга",
      checked:true
    },
    {
      "label": "Киров",
      "value": "Киров",
    }
  ]
},{
  "label": "Брянская обл.",
  "value": "Брянская обл.",
  expanded:true,
  "children": [
    {
      "label": "Алтухово",
      "value": "Алтухово",
    },
    {
      "label": "Брянск",
      "value": "Брянск",
      checked:true
    },
    {
      "label": "Киров",
      "value": "Киров",
    },
    {
      "label": "Климово",
      "value": "Климово",
    }
  ]
},
{
  "label": "Ярославская обл.",
  "value": "Ярославская обл.",
  expanded:true,
  "children": [
    {
      "label": "Гаврилов-Ям",
      "value": "Гаврилов-Ям",
    },
    {
      "label": "Ростов",
      "value": "Ростов",
      checked:true
    },
    {
      "label": "Ярославль",
      "value": "Ярославль",
      checked:true,
    }
  ]
}]

function setClasses(){
  let checkboxes = document.getElementsByClassName('checkbox-item');
  for(let i = 0; i < checkboxes.length; i++){
    if(checkboxes[i].checked){
      checkboxes[i].parentNode.parentNode.classList.add('checkedField')
    }
    else{
      checkboxes[i].parentNode.parentNode.classList.remove('checkedField')
    }
  }
}

function checkAll(){
    let allSelect = document.getElementsByClassName('select-all')[0];
    allSelect.onclick = function(){
        let checkboxes = document.getElementsByClassName('checkbox-item');
        for(let i = 0; i < checkboxes.length; i++){
            checkboxes[i].checked = true;
        }
        setClasses();
    }
}

function clearAll(){
    let allSelect = document.getElementsByClassName('clear-all')[0];
    allSelect.onclick = function(){
        let checkboxes = document.getElementsByClassName('checkbox-item');
        for(let i = 0; i < checkboxes.length; i++){
            checkboxes[i].checked = false;
        }
        setClasses();
    }
}


const onChange = (currentNode, selectedNodes) => {
  console.log('onChange::', currentNode, selectedNodes);
  setTimeout(setClasses,10);
}
const onAction = ({action, node}) => { console.log(`onAction:: [${action}]`, node) }
const onNodeToggle = (currentNode) => {
  console.log('onNodeToggle::', currentNode);
  setTimeout(setClasses,10);
}

export default class TreeSelect extends Component{
  constructor(props){
    super(props)
  }
//        <i className="icon-arrow-down icons font-2xl d-block mt-4"></i>
disableInput(){
  let input = document.querySelector('.tag-item:last-child input');
  input.disabled = true;
}
componentDidMount(){
  this.disableInput();
  checkAll();
  clearAll();
  setTimeout(setClasses,10);
}
  render(){
    return (
      <div className="tree_select">
        <h5 style={{    marginLeft: '9px'}}>Трафик торговых центров</h5>
        <DropdownTreeSelect
          placeholderText="Выбрать город"
          data={tree}
          onChange={onChange}
          onAction={onAction}
          onNodeToggle={onNodeToggle}
        />
      </div>
    )
  }
}

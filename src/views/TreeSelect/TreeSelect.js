import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DropdownTreeSelect from './react-dropdown-tree-select.js';//измененный компонент с добавленной функцией поиска.
import './style.scss';                //Изначальный компонент в node_modules под названием react-dropdown-tree-select
import Buttons from "./Buttons";


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

const onAction = ({action, node}) => { console.log(`onAction:: [${action}]`, node) };
const onNodeToggle = (currentNode) => {
    console.log('onNodeToggle::', currentNode);
    setTimeout(setClasses,10);
};

export default class TreeSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            availableCities:[]
        }
    }

    onChange(currentNode, selectedNodes){
        console.log('onChange::', currentNode, selectedNodes);

        let cities = this.state.availableCities.map( item => {
            if(item.value === currentNode.value){
                item.checked = currentNode.checked;
                if(item.children){
                    item.children.forEach(child => child.checked = currentNode.checked)
                }
            }
            if(item.children){
                item.children.forEach( child => {
                    if(child.value === currentNode.value){
                        child.checked = currentNode.checked;
                        if(currentNode.checked === false){
                            item.checked = false;
                        }
                    }
                })
            }
            return item
        });
        this.setCities(cities);
    }


    disableInput(){
        let input = document.querySelector('.tag-item:last-child input');
        input.disabled = true;
    }

    addDataToSelect(nextprops){ //как данные приходят в props - устанавливаем их в state
        this.setState({availableCities:nextprops.availableCities});
        setTimeout(setClasses,10);
    }

    checkAllOptions(e){
        e.preventDefault();
        this.setCheckField(true);
    }

    clearAllOptions(e){
        e.preventDefault();
        this.setCheckField(false);
    }

    setCheckField(boolean){
        let cities = this.state.availableCities.map( item => {
            item.checked = boolean;
            if(item.children){
                item.children.forEach( child => {
                    child.checked = boolean
                })
            }
            return item
        });
        this.setCities(cities)
    }

    setCities(cities){
        this.setState({availableCities:cities});
        this.props.upState('availableCities',this.state.availableCities);
        setTimeout(setClasses,10);
    }

    componentWillReceiveProps(nextprops){
        this.addDataToSelect(nextprops);
    }

    componentDidMount(){
        this.disableInput();
        setTimeout(setClasses,10);
        this.fixSelect();
    }

    fixSelect(){
        if(document.body.clientWidth > 1199)return;
        let select = document.querySelector('.tree_select'),
            ul = document.querySelector('ul.tag-list'),
            layout = document.getElementsByClassName('layout')[0],
            dropdown = document.getElementsByClassName('dropdown')[0],
            links = document.getElementsByClassName('dropdown-button'),
            header = document.getElementsByClassName('app-header')[0],
            body = document.body;
    }

    render(){
        return (
            <div className="tree_select">
                <DropdownTreeSelect
                    checkAll = {this.checkAllOptions.bind(this)}
                    clearAll = {this.clearAllOptions.bind(this)}
                    searchPlaceholderText = "Поиск города"
                    placeholderText="Выбрать город"
                    data={this.state.availableCities}
                    onChange={this.onChange.bind(this)}
                    onAction={onAction}
                    onNodeToggle={onNodeToggle}
                />
            </div>
        )
    }
}
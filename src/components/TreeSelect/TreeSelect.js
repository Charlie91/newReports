import React, { Component } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import './style.css';


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



const onAction = ({action, node}) => { console.log(`onAction:: [${action}]`, node) }
const onNodeToggle = (currentNode) => {
    console.log('onNodeToggle::', currentNode);
    setTimeout(setClasses,10);
}

export default class TreeSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            availableCities:[]
        }
    }


    onChange(currentNode, selectedNodes){
        console.log('onChange::', currentNode, selectedNodes);
        let cities = this.state.availableCities;
        cities.forEach( item => {
            if(item.value === currentNode.value)item.checked = currentNode.checked;
        })
        this.setState({availableCities:cities});
        this.props.upState('availableCities',this.state.availableCities);
        setTimeout(setClasses,10);
    }

    disableInput(){
        let input = document.querySelector('.tag-item:last-child input');
        input.disabled = true;
    }

    addDataToSelect(nextprops){ //как данные приходят в props - устанавливаем их в state
        this.setState({availableCities:nextprops.availableCities});
        setTimeout(setClasses,10);
    }

    componentWillReceiveProps(nextprops){
        this.addDataToSelect(nextprops);
    }

    componentDidMount(){
        this.disableInput();
        setTimeout(setClasses,10);
    }
    render(){
        return (
            <div className="tree_select">
                <DropdownTreeSelect
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

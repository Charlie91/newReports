import React, { Component } from 'react';


class ParentInput extends Component {//Родительский класс для всех инпутов
    constructor(props){
        super(props);
        this.state = {
            focus:null,
            isValid:props.isValid
        }
    }

    setHint(){
        this.setState({focus:true});
    }

    hideHint(){
        this.setState({focus:false});
    }

    preventEnter(e){    //запрет нажатия клавиши Enter
        if(e.charCode === 13){
            e.preventDefault();
            return false;
        }
    }


    componentWillReceiveProps(nextProps){
            this.setState({isValid:nextProps.isValid})
    }

    clearField(e){
        e.preventDefault();
        this.setState({value:''},() =>  this.validateField());
    }

    setValue(e){
        this.setState({value:e.target.value})
    }

}

export default ParentInput;
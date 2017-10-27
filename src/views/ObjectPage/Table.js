import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import React, { Component } from 'react';
import {getCoords} from './../../utils/utils';
import {Link} from 'react-router-dom';
import './react-bootstrap-table.css';
//import './style.scss';
import {
    Table,
} from "reactstrap";


class Table2 extends Component {
    constructor(props) {
        super(props);
    };

    render(){
        return(
            <div style={{overflow:'scroll'}}>
                <Table className="object-table" responsive bordered striped>
                    <thead>
                    <tr>
                        {this.props.data.map((item,i) =>
                            <th key={i}>{item.THEDATE}</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {this.props.data.map((item,i) =>
                            <td key={i}>{item.VALUE}</td>
                        )}
                    </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}


export default Table2;

import React from 'react';
import moment from "moment/moment";
import xlsExport from "Src/views/ObjectPage/xls-export";

const XlsButton = (props) => (<div className="excellLinkWrapper">
    <a className="excellLink"
       onClick={ (props.excelData && new xlsExport((props.excelData), 'Reports')) ? () => {
           let xls = (props.excelData && new xlsExport((props.excelData), 'Reports'));
           xls.exportToXLS(`Отчет по ${props.filename}-${moment().format('DD.MM.YY')}.xls`,props)
       } : ''}
    >
        {props.title}
    </a>
</div>);
export default XlsButton;
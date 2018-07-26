import moment from 'moment';
import {filterArrayOnUniqueElems} from './../../utils/utils';

/**
 * __  ___     _____                       _
 * \ \/ / |___| ____|_  ___ __   ___  _ __| |_
 *  \  /| / __|  _| \ \/ / '_ \ / _ \| '__| __|
 *  /  \| \__ \ |___ >  <| |_) | (_) | |  | |_
 * /_/\_\_|___/_____/_/\_\ .__/ \___/|_|   \__|
 *                       |_|
 * 6/12/2017
 * Daniel Blanco Parla
 * https://github.com/deblanco/xlsExport
 */

class XlsExport {
    // data: array of objects with the data for each row of the table
    // name: title for the worksheet
    constructor(data, title = 'Worksheet') {
        // input validation: new xlsExport([], String)
        if (!Array.isArray(data) || (typeof title !== 'string' || Object.prototype.toString.call(title) !== '[object String]')) { throw new Error('Invalid input types: new xlsExport(Array [], String)'); }

        this._data = data;
        this._title = title;
    }

    set setData(data) {
        if (!Array.isArray(data)) throw new Error('Invalid input type: setData(Array [])');

        this._data = data;
    }

    get getData() {
        return this._data;
    }

    exportToXLS(fileName = 'export.xls') {
        if (typeof fileName !== 'string' || Object.prototype.toString.call(fileName) !== '[object String]') { throw new Error('Invalid input type: exportToCSV(String)'); }

        const TEMPLATE_XLS = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"/>
        <head><!--[if gte mso 9]><xml>
        <x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{title}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml>
        <![endif]--></head>
        <body>
        <h1>Reports</h1>
        <h5>Данные за ${moment().format('DD-MM-YYYY')}</h5>
        {table}
        </body></html>`;
        const MIME_XLS = 'data:application/vnd.ms-excel;base64,';

        const parameters = { title: this._title, table: this.objectToTable() };
        const computeOutput = TEMPLATE_XLS.replace(/{(\w+)}/g, (x, y) => parameters[y]);

        this.downloadFile(MIME_XLS + this.toBase64(computeOutput), fileName);
    }


    exportToCSV(fileName = 'export.csv',props) {
        if (typeof fileName !== 'string' || Object.prototype.toString.call(fileName) !== '[object String]') { throw new Error('Invalid input type: exportToCSV(String)'); }

        const MIME_CSV = 'data:attachament/csv;charset=utf-8,%EF%BB%BF';
        console.log(this._data);
        if(Array.isArray(this._data[0]))  //если режим сравнения включен
            this.downloadFile(MIME_CSV + encodeURIComponent(this.arrayToSemicolons(props)), fileName);
        else
            this.downloadFile(MIME_CSV + encodeURIComponent(this.objectToSemicolons()), fileName);
    }

    downloadFile(output, fileName) {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.download = fileName;
        link.href = output;
        link.click();
    }

    toBase64(string) {
        return window.btoa(unescape(encodeURIComponent(string)));
    }

    objectToTable() {
        // extract keys from the first object, will be the title for each column
        const colsHead = `<tr>${Object.keys(this._data[0]).map(key => `<td>${key}</td>`).join('')}</tr>`;

        const colsData = this._data.map(obj => [`<tr>
                ${Object.keys(obj).map(col => `<td>${obj[col] ? obj[col] : ''}</td>`).join('')}
            </tr>`]) // 'null' values not showed
            .join('');

        return `<table>${colsHead}${colsData}</table>`.trim(); // remove spaces...
    }

    objectToSemicolons() {
        const header = `Reports;;;  ${moment().format('DD-MM-YYYY')}\n\n`;
        const colsHead = Object.keys(this._data[0]).map(key => [key]).join(';').replace('THEDATE','Дата').replace('VALUE','Посещаемость/Выручка');
        const colsData = this._data.map(obj => [ // obj === row
            Object.keys(obj).map(col => [
                obj[col], // row[column]
            ]).join(';'), // join the row with ';'
        ]).join('\n'); // end of row

        return `${header}\n${colsHead}\n${colsData}`;
    }

    // arrayToSemicolons(){
    //     const header = `Reports\n Дата отчета:;; ${moment().format('DD-MM-YYYY')}\n\n`;
    //     const maxLength = Math.max.apply(null, this._data.map(item => item.length) ); //вычисление максимальной возможной длины дочерних элементов
    //     let colsData = '',
    //         colsHead = '';
    //
    //     for(let i = 0; i < this._data.length;i++){    //заполнение заголовков
    //         if(!this._data[i].length){
    //             colsHead += ';;;;';
    //             continue;
    //         }
    //         colsHead += Object.keys(this._data[i][0]).map(key => [key]).join(';').replace('THEDATE','Дата').replace('VALUE','Посещаемость/Выручка') + ';;;';
    //     }
    //
    //     for(let index = 0; index < maxLength; index++){
    //
    //         this._data.forEach(item => {
    //             if(!item[index]){
    //                 colsData += ';;;;';    //если нет данных добавляем только пропуск ячеек
    //                 return;
    //             }
    //             colsData += item[index].THEDATE + ';' + item[index].VALUE + ';;;';
    //         });
    //         colsData += '\n';
    //     }
    //
    //     return `${header}\n${colsHead}\n${colsData}`;
    // }

    arrayToSemicolons(props){
        const header = `Reports\n\n${props.type}\n ${props.object.obj_name}\n Дата отчета:;; ${moment().format('DD-MM-YYYY')}\n\n`;
        const maxLength = Math.max.apply(null, this._data.map(item => item.length) ); //вычисление максимальной возможной длины дочерних элементов
        const format = this.getFormat(props.timeSegment);
        console.log(props);

        let dates = this._data.reduce( (results,yearData) => {
            let arr = yearData.map( item => moment(item.THEDATE).format(format));
            results = [...results, ...arr];
            return results;
        }, [] );

        let stringUniqueDates = ';;' + filterArrayOnUniqueElems(dates).join(';');  //оставляем только уникальные значения дат и преобразуем в строку


        let values = '';
        for(let i = 0; i < this._data.length; i++){
            values += this._data[i].map( (item,index) => {
                if(!index)
                    return moment(item.THEDATE).year() + ';;' + item.VALUE;
                return item.VALUE;
            }).join(';');
            values += '\n';
        }


        return  `${header}\n${stringUniqueDates}\n${values}`

    }

    getFormat(timeSegment){
        let format;
        switch(timeSegment){
            case 'M':
                format = 'MMMM';
                break;
            case 'D':
                format = 'DD MMMM';
                break;
            case 'H':
                format = 'DD-MM THH';
        }
        return format
    }

}

export default XlsExport; // comment this line to babelize


/*
 Вспомогательные функции ObjectPage компонента
 */
import moment from 'moment';
import { digitCount, average,formatNumberBySpaces } from 'Src/utils/utils';
import {Chart} from "react-chartjs-2";



const obj_utils = {

    countAverageOfMonths(monthlyData){
        let arr = monthlyData;
        if(!arr)return 0;

        let sum = arr.reduce((sum, current, index) => {
            if(!index)return 0; //текущий месяц не участвует в расчете средних значений
            return sum + current.value
        },0);

        return Math.round(sum/11);
    },

    getNewStyleForChart(typeArr,chartObj){
        let chart = chartObj,
            color = (typeArr[0] === 'Выручка') ? '#f6aa25' : '#886ce6',
            backgroundColor = (typeArr[0] === 'Выручка') ? 'rgba(246, 170, 37, 0.1)' : 'rgba(163, 136, 227, 0.1)',
            label = (typeArr[0] === 'Выручка') ? 'Выручка' : 'Количество чел-к';

        chart.datasets = this.createNewDataset(null, label, backgroundColor, color);
        return chart;
    },

    chartStylingByYear(year){   //стилизация графиков сравнения
        return (
            year === 2018 ? '#74c2e8' :
                year === 2017 ? '#9fd473' :
                    year === 2016 ? '#8570CE' :
                        year === 2015 ? '#ed8455' :
                            year === 2014 ? '#e06c89' :
                                '#f6aa25'
        )
    },

    createNewDataset(year,label, backgroundColor, color){   //создание нового экземпляра данных для графика
        return [
            {
                label:label || String(year),
                year:year,
                fill: !year, //если с режима сравнения(имеет аргумент year) то false,иначе - true
                lineTension: 0,
                backgroundColor: backgroundColor || this.chartStylingByYear(year),
                borderColor: color || this.chartStylingByYear(year),
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffsent: 0.0,
                borderJoinStyle: 'miter',
                borderWidth: 0,
                pointBorderColor: color || this.chartStylingByYear(year),
                pointBackgroundColor: color || this.chartStylingByYear(year),
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBackgroundColor: color || this.chartStylingByYear(year),
                pointHoverBorderColor: color || this.chartStylingByYear(year),
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                pointHitRadius: 0,
                pointStyle:'ellipse',
                data: []
            },
            {
                label:String(year) + '_2',
                year:year,
                fill: false,
                lineTension: 0,
                borderDash: [],
                borderWidth: 0,
                pointBorderColor:  color || this.chartStylingByYear(year),
                pointBackgroundColor: color || this.chartStylingByYear(year),
                pointBorderWidth: window.innerWidth > 767 ? 6 : 2.3,
                pointHoverRadius: window.innerWidth > 767 ? 6 : 4,
                pointHoverBackgroundColor: color || this.chartStylingByYear(year),
                pointHoverBorderColor: color || this.chartStylingByYear(year),
                pointHoverBorderWidth: 2,
                pointRadius: 3,
                pointHitRadius: 10,
                pointStyle:'ellipse',
                data: []
            }
        ];
    },

    checkLeapYear(data){   // проверка и удаление лишнего дня с високосного года
        data.floorData.forEach((item,i) => {
            if(moment(item.THEDATE).format('DDMM') === '2902'){
                data.floorData.splice(i,1);
            }
        });
        return data;
    },

    checkForTail(data,state){//проверка нужен ли "хвостик"
        let [timeSegment,arr,lastMonth] = [state.timeSegment,data.floorData,state.endDate];

        if(timeSegment === 'M'){
            return moment(arr[arr.length - 1].THEDATE).month() === lastMonth.month()
        }
        else if(timeSegment === 'D'){
            return moment(arr[arr.length - 1].THEDATE).format('DD MM') === lastMonth.format('DD MM')
        }
    },

    checkPositionOnGraph(data,state){//фиксируем значения шкалы на нужные лейблы если это необходимо
        let arr = data.floorData,
            labels = state.chart.labels;
        if(!arr.length)return data;

        let [firstLable, lastLable, firstValue,lastValue] = [labels[1],labels[labels.length - 2], arr[0].THEDATE, arr[arr.length - 1].THEDATE];

        if(state.timeSegment === 'M'){
            if(moment(firstLable).month() !== moment(firstValue).month()){
                let diff = moment(firstValue).month() - moment(firstLable).month();

                for(let i = 0; i < diff; i++){
                    arr.unshift({VALUE:null, THEDATE:null})
                }
            }
        }
        else if(state.timeSegment === 'D'){
            if(moment(firstLable).format('MM DD') !== moment(firstValue).format('MM DD')){
                labels.forEach( (item,index) => {
                    if(moment(item).format('MM DD') === moment(firstValue).format('MM DD')){
                        for(let i = 0; i < index - 1; i++){
                            arr.unshift({VALUE:null, THEDATE:null})
                        }
                    }
                })
            }
        }

        return data;
    },

    replaceOmissionsWithNulls(data,state,year){
        let dataArr = data.floorData,
            dateFormat,type;

        switch (state.timeSegment){
            case 'M':
                dateFormat = 'YYYY-MM';
                type = 'months';
                break;
            case 'D':
                dateFormat = 'YYYY-MM-DD';
                type = 'days';
                break;
            case 'H':
                dateFormat = 'YYYY-MM-DDTHH';
                type = 'hours';
                break;
            default:
                console.log("неверное значение state.tomeSegment")
        }

        let startDate = year + state.startDate.hours(0).format(dateFormat.slice(4)),
            endDate = year + state.endDate.hours(23).format(dateFormat.slice(4)),
            dateWithoutYear = dateFormat.slice(5);

        data.floorData = dataArr.reduce( (newDates,item,index) => {
            if(index === 0 && moment(startDate).format(dateWithoutYear) !== moment(item.THEDATE).format(dateWithoutYear)){
                let amountOfOmissions = this.defineAmountOfOmissions(type)(item.THEDATE,startDate);
                for(let i = 0; i < amountOfOmissions; i++){
                    let newDate = moment(startDate).add(i,type).format(dateFormat);
                    this.pushEmptyValueToOmission(newDates,newDate);
                }
            }

            if(index !== 0 && moment(item.THEDATE).format(dateWithoutYear) !== moment(newDates[newDates.length - 1].THEDATE).add(1,type).format(dateWithoutYear)){
                let amountOfOmissions = this.defineAmountOfOmissions(type)(item.THEDATE,newDates[newDates.length - 1].THEDATE);
                for(let i = 0; i < amountOfOmissions - 1; i++){
                    let newDate = moment(newDates[newDates.length - 1].THEDATE).add(1,type).format(dateFormat);
                    this.pushEmptyValueToOmission(newDates,newDate);
                }
            }

            newDates.push(item);

            if(index === dataArr.length - 1){
                let amountOfOmissions = this.defineAmountOfOmissions(type)(endDate,item.THEDATE);
                for(let i = 1; i <= amountOfOmissions; i++){
                    let newDate = moment(item.THEDATE).add(i,type).format(dateFormat);
                    this.pushEmptyValueToOmission(newDates,newDate);
                }
            }

            return newDates

        },[]);

        return data
    },

    defineAmountOfOmissions(type){
        switch(type){
            case 'hours':
                return this.defineAmountOfHourOmissions;
                break;
            case 'days':
                return this.defineAmountOfDayOmissions;
                break;
            case 'months':
                return this.defineAmountOfMonthOmissions;
                break;
            default:
                console.log('неверно передан аргумент type')
        }
    },

    defineAmountOfDayOmissions(reduced, subtracted){
        return moment(reduced).dayOfYear() - moment(subtracted).dayOfYear();
    },

    defineAmountOfMonthOmissions(reduced, subtracted){
        return moment(reduced).month() - moment(subtracted).month();
    },

    defineAmountOfHourOmissions(reduced, subtracted){
        return ( moment(reduced) - moment(subtracted) ) / 1000 / 60 / 60;//миллисекунды в часы
    },

    pushEmptyValueToOmission(array,newDate){
        array.push({
            THEDATE: newDate,
            VALUE:null
        });
    },

    formatDatesForChart(dates){
        let diff = moment(dates[0]).diff(moment(dates[1]));
        let first_date = moment(moment(dates[0]) + diff).format(),
            last_date = moment(moment(dates[dates.length - 1]) - diff).format();

        return [first_date, ...dates, last_date];
    },

    returnFormattedChart(data,state){
        let labelsLength = 0;
        return data.reduce( (chart,item,i) => {
            data = this.replaceOmissionsWithNulls(item,state,state.chart.datasets[i * 2].year);//заменяем пропуски данных нулями чтобы не разрушать структуру графика

            let formattedData = this.checkLeapYear(item); //если високосный год - удаляем 29 февраля из выдачи, чтобы не мешать сравнению

            let [values,dates, styleValues] = [ [], [], [] ] ;

            formattedData.floorData.forEach(item => {
                values.push(item.VALUE);
                dates.push(item.THEDATE);
            });

            if(!dates.length){
                [ chart.datasets[i * 2].data, chart.datasets[i * 2 + 1].data ] = [[],[]];
                return chart;
            }
            dates = this.formatDatesForChart(dates);
            values = this.returnValuesWithAverageInCMode(values,formattedData,state);
            styleValues= this.returnStyleValuesInCMode(values,formattedData,state);

            [ chart.datasets[i * 2].data, chart.datasets[i * 2 + 1].data ] = [values,styleValues];

            if(dates.length >= labelsLength){// если пришедшие данные имеют больший диапозон дат - используем их в основной Y-шкале
                labelsLength = dates.length;
                chart.labels = dates;
            }
            return chart;
        },state.chart);
    },

    returnValuesWithAverageInCMode(values,data,state){
        let avg = parseInt(average(values));
        return this.checkForTail(data,state) ? [avg, ...values, avg] : [avg, ...values];
    },

    returnStyleValuesInCMode(values,data,state){
        return this.checkForTail(data,state) ? [NaN,...values.slice(1, values.length-1 ),NaN] : [NaN,...values.slice(1)];
    },

    findRemovalIndexes(chart,year){
        return chart.datasets.reduce( (filteredIndexes, currentItem, index) => {
            if(~currentItem.label.indexOf(String(year)))    //Если в названии лейбла содержит номер года, подлежащего удалению - поставить в очередь на удаление
                filteredIndexes.push(index);
            return filteredIndexes;
        },[]);
    },

    addOpacityToChart(){
        document.querySelector('.line-chart-wrapper') &&    //если DOM элемент отрендерился
        document.querySelector('.line-chart-wrapper').classList.add('child-half-opacity'); //задаем прозрачность графику во время смены состояний
    },

    removeOpacityFromChart(){
        document.querySelector('.line-chart-wrapper') &&    //если DOM элемент отрендерился
        document.querySelector('.line-chart-wrapper').classList.remove('child-half-opacity');//удаляем прозрачность с графика
    },

    localizeMoment(){
        moment.updateLocale('ru', {
            monthsShort : [
                "янв", "фев", "мар", "апр", "май", "июн", "июл",
                "авг", "сен", "окт", "ноя", "дек"
            ],
            months : [
                "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
                "августа", "сентября", "октября", "ноября", "декабря"
            ]
        });
        moment.defineLocale('ru-new', { //фикс бага с невосприятием дейтпикером ручного ввода
            parentLocale: 'en',
            monthsShort : [
                "янв", "фев", "мар", "апр", "май", "июн", "июл",
                "авг", "сен", "окт", "ноя", "дек"
            ],
            months : [
                "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
                "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
            ],
            weekdaysMin : [
                "вс", "пн", "вт", "ср", "чт", "пт", "сб"
            ],
            week : {
                dow : 1, // Начало недели - с понедельника
            }
        });
    },

    formatDataForExcelInCMode(data){
        return data.reduce( (arr,item) => {
            arr.push(item.floorData);
            return arr;
        },[] );
    },

    changeExcelData(excelData,data){
        let newExcel;

       if(Array.isArray(excelData[0]) || !excelData.length){ //если массив уже видоизменен под режим сравнения или пустой - просто добавляем данные
            newExcel = excelData;
            newExcel.push(data.floorData);
       }
        else{   //иначе обнуляем массив под новую структуру
            newExcel = [];
            newExcel.push(data.floorData);
        }

        return newExcel
    },

    returnFloorID(state){
        let selectedFloor = state.floors.find((item,i) => {
            return state.floorIndex === i
        });
        return selectedFloor.id
    },

    renderCurrency(state){
        if((digitCount(state.totalSum) > 6) || ( state.viewportWidth > 768 && state.viewportWidth < 1525))
            return state.currency.substring(0,3) + '.';
        else
            return state.currency
    },

    trackActualSegments(startDate, endDate){    // меняем значения сегментации(по часам,дням,месяцам) если текущий - неактуален
        let [cMode,timeSegment] = [this.state.comparison_mode, this.state.timeSegment];
        if(startDate.format('YYYY') !== endDate.format('YYYY') && timeSegment === 'H')
            timeSegment = 'M';
        else if(startDate.format('YYYY') === endDate.format('YYYY'))
            timeSegment = 'M';
        if(startDate.format('YYYY-MM') === endDate.format('YYYY-MM'))
            timeSegment = 'D';
        if(startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD'))
            timeSegment = 'H';

        if(cMode && (startDate.month() === endDate.month() && startDate.date() === 1 && endDate.date() === endDate.daysInMonth() ))
            timeSegment = 'M';

        return timeSegment
    },

    addSpecificStyles(){
        document.querySelector('.main').classList.add('main__additional-padding');//кастомизация хтмл элементов под страницу - добавление
        document.querySelector('.app-body').classList.add('app-body__reduce-margin');
        document.querySelector('.navbar').classList.add('changeHeaderPadding');
        document.querySelector('.navbar >div:first-of-type').classList.add('additional_position');
        document.querySelector('.navbar-toggler').classList.add('new_position_for_ham');
    },

    removeSpecificStyles(){
        document.querySelector('.main').classList.remove('main__additional-padding');//кастомизация хтмл элементов под страницу - удаление
        document.querySelector('.app-body').classList.remove('app-body__reduce-margin');
        document.querySelector('.navbar').classList.remove('changeHeaderPadding');
        document.querySelector('.navbar >div:first-of-type').classList.remove('additional_position');
        document.querySelector('.navbar-toggler').classList.remove('new_position_for_ham');
    },

    comparisonLabel(tooltipItem,data){
        let index = tooltipItem.index;

        let sortedArr = data.datasets.map(item => item).sort( (a,b) => b.year - a.year);//созд-е массива с сортировкой по годам - убыванию

        let values = sortedArr.reduce( (result, current, i) => {
            let className = 'checked y' + current.year;// имя класса
            let square = '<div class="' + className + '"></div>'; //строка HTML-тега
            let newValue = '<div>' + square + current.year + ' — ' + formatNumberBySpaces(Math.round(current.data[index])) + '</div>';

            let ifThereTheSameValue = result.some( item => {    // если есть уже подобное значение в результатах - не добавляем
                return item === newValue;
            });

            if(!ifThereTheSameValue && current.data[index])
                result.push(newValue);   //если значение не задвоено и не NaN, undefined и т.д. - добавляем

            return result;
        },[]);
        return values.join('')
    },

    editDrawFunction(){ //добавляем в Chart.js возможность использования эллипса как формы
        Chart.helpers.canvas.drawPoint = function(ctx, style, radius, x, y) {
            var type, edgeLength, xOffset, yOffset, height, size;

            if (style && typeof style === 'object') {
                type = style.toString();
                if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
                    ctx.drawImage(style, x - style.width / 2, y - style.height / 2, style.width, style.height);
                    return;
                }
            }

            if (isNaN(radius) || radius <= 0) {
                return;
            }


            switch (style) {
                default:
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'ellipse':
                    ctx.beginPath();
                    ctx.ellipse(x, y, radius, (radius >= 2 ? radius - 1.5 : 1) , 0, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'triangle':
                    ctx.beginPath();
                    edgeLength = 3 * radius / Math.sqrt(3);
                    height = edgeLength * Math.sqrt(3) / 2;
                    ctx.moveTo(x - edgeLength / 2, y + height / 3);
                    ctx.lineTo(x + edgeLength / 2, y + height / 3);
                    ctx.lineTo(x, y - 2 * height / 3);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'rect':
                    size = 1 / Math.SQRT2 * radius;
                    ctx.beginPath();
                    ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
                    ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
                    break;
                case 'rectRounded':
                    var offset = radius / Math.SQRT2;
                    var leftX = x - offset;
                    var topY = y - offset;
                    var sideSize = Math.SQRT2 * radius;
                    ctx.beginPath();
                    this.roundedRect(ctx, leftX, topY, sideSize, sideSize, radius / 2);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'rectRot':
                    size = 1 / Math.SQRT2 * radius;
                    ctx.beginPath();
                    ctx.moveTo(x - size, y);
                    ctx.lineTo(x, y + size);
                    ctx.lineTo(x + size, y);
                    ctx.lineTo(x, y - size);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'cross':
                    ctx.beginPath();
                    ctx.moveTo(x, y + radius);
                    ctx.lineTo(x, y - radius);
                    ctx.moveTo(x - radius, y);
                    ctx.lineTo(x + radius, y);
                    ctx.closePath();
                    break;
                case 'crossRot':
                    ctx.beginPath();
                    xOffset = Math.cos(Math.PI / 4) * radius;
                    yOffset = Math.sin(Math.PI / 4) * radius;
                    ctx.moveTo(x - xOffset, y - yOffset);
                    ctx.lineTo(x + xOffset, y + yOffset);
                    ctx.moveTo(x - xOffset, y + yOffset);
                    ctx.lineTo(x + xOffset, y - yOffset);
                    ctx.closePath();
                    break;
                case 'star':
                    ctx.beginPath();
                    ctx.moveTo(x, y + radius);
                    ctx.lineTo(x, y - radius);
                    ctx.moveTo(x - radius, y);
                    ctx.lineTo(x + radius, y);
                    xOffset = Math.cos(Math.PI / 4) * radius;
                    yOffset = Math.sin(Math.PI / 4) * radius;
                    ctx.moveTo(x - xOffset, y - yOffset);
                    ctx.lineTo(x + xOffset, y + yOffset);
                    ctx.moveTo(x - xOffset, y + yOffset);
                    ctx.lineTo(x + xOffset, y - yOffset);
                    ctx.closePath();
                    break;
                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(x - radius, y);
                    ctx.lineTo(x + radius, y);
                    ctx.closePath();
                    break;
                case 'dash':
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + radius, y);
                    ctx.closePath();
                    break;
            }

            ctx.stroke();
        }

    },

    checkIfFlashEnabled() {
        var isFlashEnabled = false;
        // Проверка для всех браузеров, кроме IE
        if (typeof(navigator.plugins)!="undefined"
            && typeof(navigator.plugins["Shockwave Flash"])=="object"
        ) {
            isFlashEnabled = true;
        } else if (typeof  window.ActiveXObject !=  "undefined") {
            // Проверка для IE
            try {
                if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
                    isFlashEnabled = true;
                }
            } catch(e) {};
        };
        return isFlashEnabled;
    }

};


export default obj_utils;
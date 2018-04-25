
/*
Вспомогательные функции ObjectPage компонента
*/
import moment from 'moment';


export function chartStylingByYear(year){   //стилизация графиков сравнения
    return (year === 2018) ? '#74c2e8' :
        (year === 2017) ? '#9fd473' :
            (year === 2016) ? '#8570CE' :
                (year === 2015) ? '#ed8455' :
                    (year === 2014) ? '#e06c89' :
                        '#f6aa25';
}

export function checkLeapYear(data){   // проверка и удаление лишнего дня с високосного года
    data.floorData.forEach((item,i) => {
        if(moment(item.THEDATE).format('DDMM') === '2902'){
            data.floorData.splice(i,1);
        }
    });
    return data;
}

export function formatDatesForChart(dates){
    let diff = moment(dates[0]).diff(moment(dates[1]));
    let first_date = moment(moment(dates[0]) + diff).format(),
        last_date = moment(moment(dates[dates.length - 1]) - diff).format();

    return [first_date, ...dates, last_date];
}

export function createNewDataset(year,label, backgroundColor, color){
    return [
        {
            label:label || String(year),
            year:String(year) || '',
            fill: !year, //если с режима сравнения(имеет аргумент year) то false,иначе - true
            lineTension: 0,
            backgroundColor: backgroundColor || chartStylingByYear(year),
            borderColor: color || chartStylingByYear(year) ,// #886ce6
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffsent: 0.0,
            borderJoinStyle: 'miter',
            borderWidth: 0,
            pointBorderColor: color || chartStylingByYear(year) ,// #886ce6
            pointBackgroundColor: color || chartStylingByYear(year),
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: color || chartStylingByYear(year),
            pointHoverBorderColor: color || chartStylingByYear(year),
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: []
        },
        {
            label:String(year) + '_2',
            year:String(year) || '',
            fill: false,
            lineTension: 0,
            borderDash: [],
            borderWidth: 0,
            pointBorderColor:  color || chartStylingByYear(year),
            pointBackgroundColor: color || chartStylingByYear(year),
            pointBorderWidth: 6,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: color || chartStylingByYear(year),
            pointHoverBorderColor: color || chartStylingByYear(year),
            pointHoverBorderWidth: 2,
            pointRadius: 2.4,
            pointHitRadius: 10,
            data: []
        }
    ];
}

export function addOpacityToChart(){    //задаем прозрачность графику во время смены состояний
    document.querySelector('.line-chart-wrapper').classList.add('half-opacity');
}

export function removeOpacityFromChart(){
    document.querySelector('.line-chart-wrapper').classList.remove('half-opacity');//удаляем прозрачность с графика
}

export function addSpecificStyles(){
    document.querySelector('.main').classList.add('main__additional-padding');//кастомизация хтмл элементов под страницу - добавление
    document.querySelector('.app-body').classList.add('app-body__reduce-margin');
    document.querySelector('.navbar').classList.add('changeHeaderPadding');
    document.querySelector('.navbar >div:first-of-type').classList.add('additional_position');
    document.querySelector('.navbar-toggler').classList.add('new_position_for_ham');
}

export function removeSpecificStyles(){
    document.querySelector('.main').classList.remove('main__additional-padding');//кастомизация хтмл элементов под страницу - удаление
    document.querySelector('.app-body').classList.remove('app-body__reduce-margin');
    document.querySelector('.navbar').classList.remove('changeHeaderPadding');
    document.querySelector('.navbar >div:first-of-type').classList.remove('additional_position');
    document.querySelector('.navbar-toggler').classList.remove('new_position_for_ham');
}
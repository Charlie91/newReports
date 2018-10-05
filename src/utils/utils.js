import {API} from './api_paths';
import punycode from 'punycode';
import parser from 'ua-parser-js';

//вспомогательные функции


export function checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
    return ajaxRequest(API.auth)
}

export function ajaxRequest(url,options){   //функция-шаблон для ajax-запросов
    if(!options)options = {     //дефолтные опции всех запросов
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    };
    return fetch(url, options)
        .then(function (response) {
            if(response.status === 401 && (parser().browser.name !== 'IE'))
                window.location = window.location.origin + window.location.pathname + '#/authorization';//перезагружаем страницу и редиректим если незалогинен
            if (!response.ok) {
                return Promise.reject(new Error(
                    'Response failed: ' + response.status + ' (' + response.statusText + ')'
                ));
            }
            return response.json();
        })
}

export function getCoords(elem) {                         //кроссбраузерная функция получения координат DOM-элемента
    let box = elem.getBoundingClientRect(),
        body = document.body,
        docEl = document.documentElement,
        scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop,
        scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft,
        clientTop = docEl.clientTop || body.clientTop || 0,
        clientLeft = docEl.clientLeft || body.clientLeft || 0,
        top = box.top + scrollTop - clientTop,
        left = box.left + scrollLeft - clientLeft;

    return {
        top: top,
        left: left
    };
}

export function mobileSidebarHidden() { //скрываем моб-е меню если открыто после перехода по ссылке из меню
    document.body.classList.remove('sidebar-mobile-show');
}

export function formatNumberBySimpleSpaces(num){
    if(num === undefined)return '';
    let str = String(num);
    return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}


export function formatNumberBySpaces(num){
    if(num === undefined)return '';
    let str = String(num);
    return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1<div class="digit_space"></div>');
}

export function formatNumericValue(number,object){
    if(!object)object = '';
    if(typeof number === 'number'){
        if(number > 999){
            let str_number = String(number);
            if(str_number.length > 9){
                let millions = str_number.substr(-9,3);
                let billions = str_number.slice(0,str_number.length - 9);
                return billions + ',' +  millions  + ' млрд.' + ' ' + object
            }
            //if(str_number.length > 6){
            //    let thousands = str_number.substr(-6,2);
            //    let millions = str_number.slice(0,str_number.length - 6);
            //    return millions + ',' +  thousands  + ' млн.' + ' ' + object
            //}
            if(str_number.length > 3){
                let units = str_number.substr(-3,1);
                let thousands = str_number.slice(0,str_number.length - 3);
                return thousands + ',' + units + ' т.' + ' ' + object
            }
        }
        return number + ' ' + object
    }
    else{
        console.log('Тип передаваемого аргумента - не число')
    }
}

export function formatNumericValueWithMnl(number,object){
    if(!object)object = '';
    if(typeof number === 'number'){
        if(number > 999){
            let str_number = String(number);
            if(str_number.length > 9){
                let millions = str_number.substr(-9,3);
                let billions = str_number.slice(0,str_number.length - 9);
                return billions + ',' +  millions  + ' млрд.' + ' ' + object
            }
            if(str_number.length > 6){
                let thousands = str_number.substr(-6,2);
                let millions = str_number.slice(0,str_number.length - 6);
                return millions + ',' +  thousands  + ' млн.' + ' ' + object
            }
            if(str_number.length > 3){
                let units = str_number.substr(-3,1);
                let thousands = str_number.slice(0,str_number.length - 3);
                return thousands + ',' + units + ' т.' + ' ' + object
            }
        }
        return number + ' ' + object
    }
    else{
        console.log('Тип передаваемого аргумента - не число')
    }
}

export function formatNumericValueWithSpaces(number,object) {

    if(!object)object = '';
    if(typeof number === 'number'){
        if(number > 999){
            let str_number = String(number);
            if(str_number.length > 9){
                let millions = str_number.substr(-9,3);
                let billions = str_number.slice(0,str_number.length - 9);
                return billions + ',' +  millions  + ' млрд.' + ' ' + object
            }
            if(str_number.length > 3){
                let units = str_number.substr(-3,1);
                let thousands = str_number.slice(0,str_number.length - 3);
                return thousands.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1<div class="digit_space"></div>') + ',' + units + '<div class="digit_space"></div>т.' + '<div class="digit_space"></div>' + object
            }
        }
        return number + ' ' + object
    }
    else{
        console.log('Тип передаваемого аргумента - не число')
    }
}

export function setCookie(name, value, options) {   //более полная функция установки кук
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

// возвращает cookie с именем name, если есть, если нет, то undefined
export function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

export function deleteRegistrationCookies(){
    deleteCookie('email');
    deleteCookie('password');
    deleteCookie('phone');
    deleteCookie('registrationStep');
}

export function average (arr) {
    let sum = arr.reduce((previous, current) => current += previous);
    return sum / arr.length;
}

export function getCountsOfDigits(number) {
    return(number == 0) ? 1 : Math.ceil(Math.log10(Math.abs(number) + 0.5));
}


export function getStepTick(timeSegment){
    let value = 'day';
    if(timeSegment === 'Y')
        value = 'year';
    if(timeSegment === 'M')
        value = 'month';
    if(timeSegment === 'D')
        value = 'day';
    if(timeSegment === 'H')
        value = 'day';
    return value;
}


export function getStepSize(number, timeSegment){
    let value = 1;
    if(timeSegment === 'Y')
        value = parseInt(number<21 ? 1: number/15);
    if(timeSegment === 'M')
        value = parseInt(number<21 ? 1: number/15);
    if(timeSegment === 'D')
        value = parseInt(number<21 ? 1: number/15);
    if(timeSegment === 'H')
        value = 1;
    return value;
}

export function getStepSizeSmall(number, timeSegment){
    let value = 1;
    if(timeSegment === 'Y')
        value = parseInt(number<17 ? 1: number/8);
    if(timeSegment === 'M')
        value = parseInt(number<17 ? 1: number/8);
    if(timeSegment === 'D')
        value = parseInt(number<17 ? 1: number/8);
    if(timeSegment === 'H')
        value = 1;
    return value;
}

export function getStepName(timeSegment){
    let value = 'MMM DD';
    if(timeSegment === 'Y')
        value = 'YYYY';
    if(timeSegment === 'M')
        value = 'MMM';
    if(timeSegment === 'D')
        value = 'MMM DD';
    if(timeSegment === 'H')
        value = 'MMM DD';
    return value;
}


export function digitCount(number) {
    return number.toString().length;
}

export function deleteURLPrefixes(link){
    if(typeof link !== 'string') return link;
    let cuttedValues = ['http://www.','https://www.','http://', 'https://'],
        cuttedValue = '';

    for(let i = 0; i < cuttedValues.length; i++){
        if(~link.lastIndexOf(cuttedValues[i])){
            cuttedValue = cuttedValues[i];
            break;
        }
    }
    return link.slice(cuttedValue.length);
}

export function decodeHalfPunycodeLink(link){
    if(typeof link !== 'string') return link;
    link = deleteURLPrefixes(link);

    let okPartIndex = link.lastIndexOf('/',link.length - 2);
    let [punycodePart,okPart] = [link.slice(0,okPartIndex),link.slice(okPartIndex)];
    return punycode.toUnicode(punycodePart) + okPart
}

export function deleteObjectProperties(obj, props) {

    for(let i = 0; i < props.length; i++) {
        if(obj.hasOwnProperty(props[i])) {
            delete obj[props[i]];
        }
    }

};

export function filterArrayOnUniqueElems(arr) {
    let obj = {};

    for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}


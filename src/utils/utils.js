import {API} from './api_paths';

export function checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
    let options = {
        method:'GET',
        credentials:'include',
        mode: 'cors'
    };
    return ajaxRequest(API.auth,options)
}

export function ajaxRequest(url,options){   //функция-шаблон для ajax-запросов
    return  fetch(url, options)
        .then(function (response) {
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
import {API} from './api_paths';

export function checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
    let options = {
        method:'GET',
        credentials:'include',
        mode: 'cors'
    };
    return ajaxRequest(API.auth,options)
}

export function ajaxRequest(url,options){                   //функция-шаблон для ajax-запросов
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

export function formatNumericValue(number){
    if(typeof number === 'number'){
        if(number > 999){
            let str_number = String(number);
            if(str_number.length > 9){
                let millions = str_number.substr(-9,3);
                let billions = str_number.slice(0,str_number.length - 9);
                return billions + ',' +  millions  + ' млрд.'
            }
            if(str_number.length > 6){
                let thousands = str_number.substr(-6,2);
                let millions = str_number.slice(0,str_number.length - 6);
                return millions + ',' +  thousands  + ' млн.'
            }
            if(str_number.length > 3){
                let units = str_number.substr(-3,1);
                let thousands = str_number.slice(0,str_number.length - 3);
                return thousands + ',' + units + ' тыс.'
            }
        }
        return number
    }
    else{
        console.log('Тип передаваемого аргумента - не число')
    }
}
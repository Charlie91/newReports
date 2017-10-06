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
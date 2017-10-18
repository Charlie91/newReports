// main build
export let API = {};
if(PRODUCTION){
     API = {
        main:'https://repo.re-ports.ru/app/',
        auth:'https://repo.re-ports.ru/app/Auth',
        register:'https://repo.re-ports.ru/app/Register',
        nav:'https://repo.re-ports.ru/app/Conceptions',
        cities:'https://repo.re-ports.ru/app/Cities?conceptId=',
        objects: 'https://repo.re-ports.ru/app/Objects',
        objectsData:'https://repo.re-ports.ru/app/ObjectCache'
    };
}
else {
     API = {
        main: 'https://repo.re-ports.ru/app_test/',
        auth: 'https://repo.re-ports.ru/app_test/Auth',
        register: 'https://repo.re-ports.ru/app_test/Register',
        nav: 'https://repo.re-ports.ru/app_test/Conceptions',
        cities: 'https://repo.re-ports.ru/app_test/Cities?conceptId=',
        objects: 'https://repo.re-ports.ru/app_test/Objects',
        objectsData: 'https://repo.re-ports.ru/app_test/ObjectCache'
    }
}
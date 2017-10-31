// main build
export let API = {};
if(PRODUCTION){
    API = {
        main:'https://repo.re-ports.ru/app/UserData',
        auth:'https://repo.re-ports.ru/app/Auth',
        register:'https://repo.re-ports.ru/app/Register',
        nav:'https://repo.re-ports.ru/app/Conceptions',
        cities:'https://repo.re-ports.ru/app/Cities?conceptId=',
        objects: 'https://repo.re-ports.ru/app/Objects',
        objectsData:'https://repo.re-ports.ru/app/ObjectCache',
        floors:'https://repo.re-ports.ru/app/ObjectFloors?objId=',
        floorsData:'https://repo.re-ports.ru/app/FloorData',
        userData:'https://repo.re-ports.ru/app/UserData'
    };
}
else {
    API = {
        main: 'https://repo.re-ports.ru/app_test/UserData',
        auth: 'https://repo.re-ports.ru/app_test/Auth',
        register: 'https://repo.re-ports.ru/app_test/Register',
        nav: 'https://repo.re-ports.ru/app_test/Conceptions',
        cities: 'https://repo.re-ports.ru/app_test/Cities?conceptId=',
        objects: 'https://repo.re-ports.ru/app_test/Objects',
        objectsData: 'https://repo.re-ports.ru/app_test/ObjectCache',
        floors:'https://repo.re-ports.ru/app_test/ObjectFloors?objId=',
        floorsData:'https://repo.re-ports.ru/app_test/FloorData',
        userData:'https://repo.re-ports.ru/app_test/UserData'
    }
}
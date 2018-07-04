
let postfix = PRODUCTION ? '' : '_test'; //пути различаются в девелопменте и продакшене

export let API = {
    main: `https://repo.re-ports.ru/app${postfix}/UserData`,
    auth: `https://repo.re-ports.ru/app${postfix}/Auth`,
    register: `https://repo.re-ports.ru/app${postfix}/Register`,
    nav: `https://repo.re-ports.ru/app${postfix}/Conceptions`,
    cities: `https://repo.re-ports.ru/app${postfix}/Cities?conceptId=`,
    objects: `https://repo.re-ports.ru/app${postfix}/Objects`,
    objectsData: `https://repo.re-ports.ru/app${postfix}/ObjectCache`,
    objectsArrayData: `https://repo.re-ports.ru/app${postfix}/ObjCacheArrays`,
    floors:`https://repo.re-ports.ru/app${postfix}/ObjectFloors?objId=`,
    floorsData:`https://repo.re-ports.ru/app${postfix}/FloorData`,
    innerObjects:`https://repo.re-ports.ru/trc_api${postfix}/shopData?trcId=`,
    userData:`https://repo.re-ports.ru/app${postfix}/UserData`,
    abcAnalysis_shops:`https://repo.re-ports.ru/trc_api${postfix}/abc_xyz_shops`,
    abcAnalysis_categories:`https://repo.re-ports.ru/trc_api${postfix}/abc_xyz_types`,
    imgPath:`https://re-ports.ru/app/img/malls/resize`,
    thumbPath:`https://re-ports.ru/app/img/malls/thumb/`
};
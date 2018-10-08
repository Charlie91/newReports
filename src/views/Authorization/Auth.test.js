import fetch from 'node-fetch';
import Authorization from './Authorization';
import renderer from 'react-test-renderer';
import React from 'react';
import * as utils from './../../utils/utils';


jest.mock('react-router-dom');
jest.mock('../AuthNav/AuthNav', () => 'AuthNav');

utils.ajaxRequest = jest.fn(() => new Promise(function(resolve, reject) {
    resolve('Promise resolved');//мокаем ajax request
}));

utils.insertFacebookSDK = jest.fn(() => 'facebook sdk inserting');//мокаем скрипт ФБ


test('logged in succesfully', () => {   //тестирование авторизации
    let user = {        //данные тестового пользователя
        login: 'Charlie91',
        pwd: '123456'
    };
    let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(user),
        mode: 'cors'
    };
    fetch('https://repo.re-ports.ru/app_test/Auth',options)
        .then(response => {
            return response.json();
        })
        .then(data => expect(data).toMatchObject({
            success:true
        }))
        .catch(err => console.log(err))
});


describe('Authorization works correctly', () => {//тестирование класса
    it('Auth component renders correctly', () => {
        const tree = renderer
            .create(<Authorization/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

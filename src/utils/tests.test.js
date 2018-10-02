import React from 'react';
import fetch from 'node-fetch';
import renderer from 'react-test-renderer';
import ErrorMessage from './assistantComponents/ErrorMessage';

function digitCount(number) {
    return number.toString().length;
};

it('renders correctly', () => {
    const tree = renderer
        .create(<ErrorMessage text="Текст ошибки"/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

test('count digit number', () => {
    expect(digitCount(123)).toBe(3);
});


test('logged in succesfully', () => {
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
        .then(response => response.json())
        .then(data => expect(data).toMatchObject({
            success:true
        }))
        .catch(err => console.log(err))
});

test('get user data', () => {
   const options = {
       method: 'GET',
       credentials: 'include',
       mode: 'cors'
   };
    fetch('https://repo.re-ports.ru/app_test/UserData',options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
});
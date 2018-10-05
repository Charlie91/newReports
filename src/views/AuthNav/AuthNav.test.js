import fetch from 'node-fetch';
import AuthNav from './AuthNav';
import renderer from 'react-test-renderer';
import React from 'react';
import { NavLink } from 'react-router-dom';


jest.mock('react-router-dom');
NavLink.mockImplementation(() => <div>Link</div>);

describe('Auth navigation works correctly', () => {//тестирование класса
    it('AuthNav component renders correctly', () => {
        const tree = renderer
            .create(<AuthNav/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
import React from 'react';
import renderer from 'react-test-renderer';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';


describe('Messages are shown correctly', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<ErrorMessage text="Текст ошибки"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly', () => {
        const tree = renderer
            .create(<SuccessMessage text="Текст успешного сообщения"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


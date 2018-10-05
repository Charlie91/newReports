/*

Тестирование вспомогательных функций проекта(утилит)

*/

import {average} from './utils';

test('count average of array', () => {
   expect(average([1,2,3])).toBe(2);
});



function digitCount(number) {
    return number.toString().length;
};


test('count digit number', () => {
    expect(digitCount(123)).toBe(3);
});

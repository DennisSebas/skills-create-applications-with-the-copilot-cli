const {
  calculate,
  formatUsage,
  modulo,
  normalizeOperation,
  parseNumber,
  power,
  squareRoot,
} = require('../calculator');

describe('calculate', () => {
  test.each([
    ['2 + 3', '+', 2, 3, 5],
    ['10 - 4', '-', 10, 4, 6],
    ['45 * 2', '*', 45, 2, 90],
    ['20 / 5', '/', 20, 5, 4],
    ['10 % 3', '%', 10, 3, 1],
    ['5 % 2', '%', 5, 2, 1],
    ['2 ^ 4', '^', 2, 4, 16],
    ['2 ^ 3', '^', 2, 3, 8],
  ])('returns the expected result for %s', (_, operation, left, right, expected) => {
    expect(calculate(operation, left, right)).toBe(expected);
  });

  test.each([
    ['add', 7, 8, 15],
    ['subtract', 15, 8, 7],
    ['multiply', 6, 7, 42],
    ['divide', 7, 2, 3.5],
    ['x', 9, 3, 27],
    ['×', 8, 4, 32],
    ['÷', 20, 4, 5],
    ['modulo', 17, 5, 2],
    ['power', 3, 3, 27],
    ['**', 4, 2, 16],
  ])('supports "%s" operations', (operation, left, right, expected) => {
    expect(calculate(operation, left, right)).toBe(expected);
  });

  test.each([
    ['squareRoot', 81, 9],
    ['sqrt', 49, 7],
    ['√', 64, 8],
    ['√', 16, 4],
  ])('supports unary "%s" operations', (operation, value, expected) => {
    expect(calculate(operation, value)).toBe(expected);
  });

  test('supports negative and decimal operands', () => {
    expect(calculate('+', -2.5, 1.5)).toBe(-1);
    expect(calculate('*', -3, -4)).toBe(12);
  });

  test('rejects unsupported operations', () => {
    expect(() => calculate('unknown', 2, 3)).toThrow('Unsupported operation: unknown.');
  });

  test.each([
    ['divide'],
    ['/'],
    ['÷'],
  ])('rejects division by zero for "%s"', (operation) => {
    expect(() => calculate(operation, 10, 0)).toThrow('Division by zero is not allowed.');
  });

  test.each([
    ['modulo'],
    ['%'],
  ])('rejects modulo by zero for "%s"', (operation) => {
    expect(() => calculate(operation, 10, 0)).toThrow('Modulo by zero is not allowed.');
  });

  test.each([
    ['squareRoot'],
    ['sqrt'],
    ['√'],
  ])('rejects square root of a negative number for "%s"', (operation) => {
    expect(() => calculate(operation, -9)).toThrow('Square root of a negative number is not allowed.');
  });
});

describe('normalizeOperation', () => {
  test.each([
    ['ADD', 'add'],
    ['+', 'add'],
    ['subtract', 'subtract'],
    ['-', 'subtract'],
    ['MULTIPLY', 'multiply'],
    ['x', 'multiply'],
    ['×', 'multiply'],
    ['DIVIDE', 'divide'],
    ['/', 'divide'],
    ['÷', 'divide'],
    ['MODULO', 'modulo'],
    ['%', 'modulo'],
    ['POWER', 'power'],
    ['^', 'power'],
    ['**', 'power'],
    ['squareRoot', 'squareRoot'],
    ['sqrt', 'squareRoot'],
    ['√', 'squareRoot'],
  ])('normalizes "%s" to "%s"', (input, expected) => {
    expect(normalizeOperation(input)).toBe(expected);
  });

  test.each([undefined, null, '', 'mod'])('returns null for unsupported input %p', (input) => {
    expect(normalizeOperation(input)).toBeNull();
  });
});

describe('parseNumber', () => {
  test.each([
    ['42', 42],
    [' 3.14 ', 3.14],
    ['-8', -8],
    ['0', 0],
  ])('parses "%s"', (input, expected) => {
    expect(parseNumber(input, 'Value')).toBe(expected);
  });

  test.each(['abc', 'five', '4.2.1', 'NaN'])('rejects invalid numeric input "%s"', (input) => {
    expect(() => parseNumber(input, 'Value')).toThrow('Value must be a valid number.');
  });
});

describe('formatUsage', () => {
  test('returns usage guidance with the supported operations', () => {
    expect(formatUsage()).toBe(
      [
        'Usage:',
        '  npm start -- <operation> <value>',
        '  npm start -- <operation> <left> <right>',
        '',
        'Supported operations:',
        '  add or +        Addition',
        '  subtract or -   Subtraction',
        '  multiply or *   Multiplication',
        '  divide or /     Division',
        '  modulo or %     Remainder',
        '  power or ^      Exponentiation',
        '  squareRoot      Square root',
        '  sqrt or √       Square root',
        '',
        'Example: npm start -- add 5 7',
      ].join('\n'),
    );
  });
});

describe('modulo', () => {
  test('returns the remainder of division', () => {
    expect(modulo(10, 3)).toBe(1);
  });

  test('matches the extended operations example', () => {
    expect(modulo(5, 2)).toBe(1);
  });
});

describe('power', () => {
  test('raises the base to the exponent', () => {
    expect(power(2, 5)).toBe(32);
  });

  test('matches the extended operations example', () => {
    expect(power(2, 3)).toBe(8);
  });
});

describe('squareRoot', () => {
  test('returns the square root of a number', () => {
    expect(squareRoot(25)).toBe(5);
  });

  test('matches the extended operations example', () => {
    expect(squareRoot(16)).toBe(4);
  });

  test('rejects negative numbers', () => {
    expect(() => squareRoot(-1)).toThrow('Square root of a negative number is not allowed.');
  });
});

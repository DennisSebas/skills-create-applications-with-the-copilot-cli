const {
  calculate,
  formatUsage,
  normalizeOperation,
  parseNumber,
} = require('../calculator');

describe('calculate', () => {
  test.each([
    ['2 + 3', '+', 2, 3, 5],
    ['10 - 4', '-', 10, 4, 6],
    ['45 * 2', '*', 45, 2, 90],
    ['20 / 5', '/', 20, 5, 4],
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
  ])('supports "%s" operations', (operation, left, right, expected) => {
    expect(calculate(operation, left, right)).toBe(expected);
  });

  test('supports negative and decimal operands', () => {
    expect(calculate('+', -2.5, 1.5)).toBe(-1);
    expect(calculate('*', -3, -4)).toBe(12);
  });

  test('rejects unsupported operations', () => {
    expect(() => calculate('power', 2, 3)).toThrow('Unsupported operation: power.');
  });

  test.each([
    ['divide'],
    ['/'],
    ['÷'],
  ])('rejects division by zero for "%s"', (operation) => {
    expect(() => calculate(operation, 10, 0)).toThrow('Division by zero is not allowed.');
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
        'Usage: npm start -- <operation> <left> <right>',
        '',
        'Supported operations:',
        '  add or +        Addition',
        '  subtract or -   Subtraction',
        '  multiply or *   Multiplication',
        '  divide or /     Division',
        '',
        'Example: npm start -- add 5 7',
      ].join('\n'),
    );
  });
});

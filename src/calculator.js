#!/usr/bin/env node

const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed.');
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Square root of a negative number is not allowed.');
  }

  return Math.sqrt(n);
}

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (^), and square root (sqrt, √).
const OPERATION_HANDLERS = {
  add: {
    arity: 2,
    symbols: ['+'],
    execute: (left, right) => left + right,
  },
  subtract: {
    arity: 2,
    symbols: ['-'],
    execute: (left, right) => left - right,
  },
  multiply: {
    arity: 2,
    symbols: ['*', 'x', '×'],
    execute: (left, right) => left * right,
  },
  divide: {
    arity: 2,
    symbols: ['/', '÷'],
    execute: (left, right) => {
      if (right === 0) {
        throw new Error('Division by zero is not allowed.');
      }

      return left / right;
    },
  },
  modulo: {
    arity: 2,
    symbols: ['%'],
    execute: modulo,
  },
  power: {
    arity: 2,
    symbols: ['^', '**'],
    execute: power,
  },
  squareRoot: {
    arity: 1,
    symbols: ['sqrt', '√'],
    execute: squareRoot,
  },
};

function normalizeOperation(operation) {
  if (!operation) {
    return null;
  }

  const normalizedOperation = operation.toLowerCase();

  for (const [name, config] of Object.entries(OPERATION_HANDLERS)) {
    if (name.toLowerCase() === normalizedOperation || config.symbols.includes(normalizedOperation)) {
      return name;
    }
  }

  return null;
}

function getOperationConfig(operation) {
  const normalizedOperation = normalizeOperation(operation);

  if (!normalizedOperation) {
    return null;
  }

  return {
    name: normalizedOperation,
    ...OPERATION_HANDLERS[normalizedOperation],
  };
}

function parseNumber(value, label) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return parsedValue;
}

function calculate(operation, left, right) {
  const config = getOperationConfig(operation);

  if (!config) {
    throw new Error(`Unsupported operation: ${operation}.`);
  }

  if (config.arity === 1) {
    return config.execute(left);
  }

  return config.execute(left, right);
}

function formatUsage() {
  return [
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
  ].join('\n');
}

async function promptForCalculation() {
  const rl = readline.createInterface({ input, output });

  try {
    const operation = await rl.question('Enter an operation (+, -, *, /, %, ^, sqrt, √): ');
    const config = getOperationConfig(operation);

    if (!config) {
      throw new Error(`Unsupported operation: ${operation}.`);
    }

    const leftPrompt = config.arity === 1 ? 'Enter the number: ' : 'Enter the first number: ';
    const leftLabel = config.arity === 1 ? 'The number' : 'The first number';
    const left = parseNumber(await rl.question(leftPrompt), leftLabel);
    const right =
      config.arity === 2
        ? parseNumber(await rl.question('Enter the second number: '), 'The second number')
        : undefined;

    return { left, operation, right };
  } finally {
    rl.close();
  }
}

async function main(argv = process.argv.slice(2)) {
  try {
    if (argv.length !== 0 && argv.length !== 2 && argv.length !== 3) {
      throw new Error(formatUsage());
    }

    if (argv.length === 0) {
      const values = await promptForCalculation();
      const result = calculate(values.operation, values.left, values.right);
      console.log(`Result: ${result}`);
      return;
    }

    const config = getOperationConfig(argv[0]);

    if (!config) {
      throw new Error(`Unsupported operation: ${argv[0]}.`);
    }

    if (argv.length !== config.arity + 1) {
      throw new Error(formatUsage());
    }

    const result =
      config.arity === 1
        ? calculate(argv[0], parseNumber(argv[1], 'The operand'))
        : calculate(
            argv[0],
            parseNumber(argv[1], 'The left operand'),
            parseNumber(argv[2], 'The right operand'),
          );
    console.log(`Result: ${result}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  calculate,
  formatUsage,
  modulo,
  normalizeOperation,
  parseNumber,
  power,
  squareRoot,
};

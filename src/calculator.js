#!/usr/bin/env node

const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/).
const OPERATION_HANDLERS = {
  add: {
    symbols: ['+'],
    execute: (left, right) => left + right,
  },
  subtract: {
    symbols: ['-'],
    execute: (left, right) => left - right,
  },
  multiply: {
    symbols: ['*', 'x', '×'],
    execute: (left, right) => left * right,
  },
  divide: {
    symbols: ['/', '÷'],
    execute: (left, right) => {
      if (right === 0) {
        throw new Error('Division by zero is not allowed.');
      }

      return left / right;
    },
  },
};

function normalizeOperation(operation) {
  if (!operation) {
    return null;
  }

  const normalizedOperation = operation.toLowerCase();

  for (const [name, config] of Object.entries(OPERATION_HANDLERS)) {
    if (name === normalizedOperation || config.symbols.includes(normalizedOperation)) {
      return name;
    }
  }

  return null;
}

function parseNumber(value, label) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return parsedValue;
}

function calculate(operation, left, right) {
  const normalizedOperation = normalizeOperation(operation);

  if (!normalizedOperation) {
    throw new Error(`Unsupported operation: ${operation}.`);
  }

  return OPERATION_HANDLERS[normalizedOperation].execute(left, right);
}

function formatUsage() {
  return [
    'Usage: npm start -- <operation> <left> <right>',
    '',
    'Supported operations:',
    '  add or +        Addition',
    '  subtract or -   Subtraction',
    '  multiply or *   Multiplication',
    '  divide or /     Division',
    '',
    'Example: npm start -- add 5 7',
  ].join('\n');
}

async function promptForCalculation() {
  const rl = readline.createInterface({ input, output });

  try {
    const left = parseNumber(await rl.question('Enter the first number: '), 'The first number');
    const operation = await rl.question('Enter an operation (+, -, *, /, ×, ÷): ');
    const right = parseNumber(await rl.question('Enter the second number: '), 'The second number');

    return { left, operation, right };
  } finally {
    rl.close();
  }
}

async function main(argv = process.argv.slice(2)) {
  try {
    if (argv.length !== 0 && argv.length !== 3) {
      throw new Error(formatUsage());
    }

    const values =
      argv.length === 0
        ? await promptForCalculation()
        : {
            operation: argv[0],
            left: parseNumber(argv[1], 'The left operand'),
            right: parseNumber(argv[2], 'The right operand'),
          };

    const result = calculate(values.operation, values.left, values.right);
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
  normalizeOperation,
  parseNumber,
};

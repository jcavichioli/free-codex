const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const actionButtons = document.querySelectorAll('[data-action]');

let currentOperand = '0';
let previousOperand = '';
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  previousOperandElement.textContent = operator
    ? `${previousOperand} ${getOperatorSymbol(operator)}`
    : previousOperand;
}

function getOperatorSymbol(value) {
  const symbols = {
    '/': '÷',
    '*': '×',
    '-': '−',
    '+': '+'
  };

  return symbols[value] || value;
}

function appendNumber(number) {
  if (shouldResetScreen) {
    currentOperand = '0';
    shouldResetScreen = false;
  }

  if (number === '.' && currentOperand.includes('.')) {
    return;
  }

  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand += number;
  }

  updateDisplay();
}

function chooseOperator(selectedOperator) {
  if (operator && !shouldResetScreen) {
    calculate();
  }

  previousOperand = currentOperand;
  operator = selectedOperator;
  shouldResetScreen = true;
  updateDisplay();
}

function calculate() {
  const previous = Number(previousOperand);
  const current = Number(currentOperand);

  if (!operator || Number.isNaN(previous) || Number.isNaN(current)) {
    return;
  }

  let result;

  switch (operator) {
    case '+':
      result = previous + current;
      break;
    case '-':
      result = previous - current;
      break;
    case '*':
      result = previous * current;
      break;
    case '/':
      result = current === 0 ? 'Erro' : previous / current;
      break;
    default:
      return;
  }

  currentOperand = String(result);
  previousOperand = '';
  operator = null;
  shouldResetScreen = true;
  updateDisplay();
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (shouldResetScreen) {
    return;
  }

  currentOperand = currentOperand.length > 1
    ? currentOperand.slice(0, -1)
    : '0';

  updateDisplay();
}

numberButtons.forEach((button) => {
  button.addEventListener('click', () => appendNumber(button.dataset.number));
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', () => chooseOperator(button.dataset.operator));
});

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;

    if (action === 'clear') {
      clearAll();
    }

    if (action === 'delete') {
      deleteLastCharacter();
    }

    if (action === 'calculate') {
      calculate();
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if ((key >= '0' && key <= '9') || key === '.') {
    appendNumber(key);
  }

  if (['+', '-', '*', '/'].includes(key)) {
    chooseOperator(key);
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  }

  if (key === 'Backspace') {
    deleteLastCharacter();
  }

  if (key === 'Escape') {
    clearAll();
  }
});

updateDisplay();

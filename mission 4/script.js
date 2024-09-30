const buttons = document.querySelectorAll('button');
const display = document.getElementById('display');
const dot = document.getElementById('dot');
const functions = document.querySelectorAll('.function');
const operators = document.querySelectorAll('.operator');
const operatorSymbols = [...operators].map((operator) => operator.textContent);
let firstOperand, secondOperand, operator;
let isReadyForNewINput = false;

Array.from(buttons)
  .filter((button) => button.className.match('number'))
  .forEach((number) =>
    number.addEventListener('click', () => {
      if (display.textContent === '0' || isReadyForNewINput) {
        display.textContent = number.textContent;
      } else {
        display.textContent += number.textContent;
      }
    })
  );

dot.addEventListener('click', () => {
  if (isReadyForNewINput) {
    display.textContent = '0.';
  } else if (display.textContent.indexOf(dot.textContent) === -1) {
    display.textContent += dot.textContent;
  }
});

Array.from(functions)
  .find((fn) => fn.textContent === 'C')
  .addEventListener('click', () => {
    display.textContent = '0';
    firstOperand = null;
    secondOperand = null;
    operator = null;
  });

operators.forEach((button) =>
  button.addEventListener('click', (e) => {
    if (!firstOperand) firstOperand = display.textContent;
    else if (firstOperand && operator) {
      secondOperand = display.textContent;
      calculate(firstOperand, secondOperand, operator);
    }
    operator = e.target.textContent;
    console.log(`firstOperand: ${firstOperand}\noperator: ${operator}`);
  })
);

Array.from(buttons)
  .find((button) => button.textContent === '=')
  .addEventListener('click', () => {
    if (firstOperand && operator) {
      secondOperand = display.textContent;
      calculate(firstOperand, secondOperand, operator);
    }
  });

function calculate(stringX, stringY, op) {
  const numberX = Number(stringX);
  const numberY = Number(stringY);
  let result;

  switch (op) {
    case '+':
      result = numberX + numberY;
      break;
    case '-':
      result = numberX - numberY;
      break;
    case '*':
      result = numberX * numberY;
      break;
    case '/':
      result = numberX / numberY;
      break;
    default:
      console.log('🚨 Invalid operator!');
  }

  result = Math.floor(result * 100) / 100;
  display.textContent = result;
  firstOperand = result;
  secondOperand = null;
  operator = null;
  return result;
}

buttons.forEach((button) =>
  button.addEventListener('click', (e) => {
    console.log(e.target.textContent);
    operatorSymbols.includes(e.target.textContent) ||
    e.target.textContent === '='
      ? (isReadyForNewINput = true)
      : (isReadyForNewINput = false);
  })
);

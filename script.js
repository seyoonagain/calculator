const calculator = document.querySelector('.calculator');
const calcIcon = document.getElementById('icon');
const closeButton = document.getElementById('close-button');
const buttons = document.querySelectorAll('.button');
const display = document.getElementById('display');
const dot = document.getElementById('dot');
const functions = document.querySelectorAll('.function');
const operators = document.querySelectorAll('.operator');
let firstOperand, secondOperand, operator, prevOperator, prevOperand;
let isReadyForNewInput = false;

calcIcon.addEventListener('dblclick', () => {
  calculator.style.display = 'block';
});
closeButton.addEventListener('click', () => {
  calculator.style.display = 'none';
  display.textContent = '0';
  resetOperandsAndOperator();
});

Array.from(buttons)
  .filter((button) => button.className.match('number'))
  .forEach((number) =>
    number.addEventListener('click', () => {
      if (
        display.textContent === '0' ||
        isReadyForNewInput ||
        display.textContent === 'too long!'
      ) {
        display.textContent = limitLengthAndDecimals(number.textContent[0]);
      } else {
        display.textContent = limitLengthAndDecimals(
          display.textContent + number.textContent
        );
      }
    })
  );

dot.addEventListener('click', () => {
  if (isReadyForNewInput) {
    display.textContent = '0.';
  } else if (display.textContent.indexOf(dot.textContent) === -1) {
    display.textContent = limitLengthAndDecimals(
      display.textContent + dot.textContent
    );
  }
});

Array.from(functions)
  .find((fn) => fn.textContent === 'C')
  .addEventListener('click', () => {
    display.textContent = '0';
    resetOperandsAndOperator();
  });

Array.from(functions)
  .find((fn) => fn.textContent === '±')
  .addEventListener('click', () => {
    display.textContent = -1 * display.textContent;
    setOperands();
  });

Array.from(functions)
  .find((fn) => fn.textContent === '√')
  .addEventListener('click', () => {
    display.textContent = limitLengthAndDecimals(
      Math.sqrt(display.textContent)
    );
    setOperands();
  });

operators.forEach((button) =>
  button.addEventListener('click', (e) => {
    if (!firstOperand || firstOperand === 'too long!')
      firstOperand = display.textContent;
    else if (firstOperand && operator) {
      secondOperand = display.textContent;
      calculate(firstOperand, secondOperand, operator);
    }
    operator = e.target.textContent;
  })
);

Array.from(buttons)
  .find((button) => button.textContent === '=')
  .addEventListener('click', () => {
    if (firstOperand && operator) {
      secondOperand = display.textContent;
      calculate(firstOperand, secondOperand, operator);
      return;
    }
    if (firstOperand && prevOperand && prevOperator) {
      calculate(firstOperand, prevOperand, prevOperator);
      return;
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

  prevOperator = op;
  prevOperand = stringY;
  display.textContent = limitLengthAndDecimals(result);
  firstOperand = display.textContent;
  secondOperand = null;
  operator = null;
}

buttons.forEach((button) =>
  button.addEventListener('click', (e) => {
    const operatorSymbols = [...operators].map(
      (operator) => operator.textContent
    );
    operatorSymbols.includes(e.target.textContent) ||
    e.target.textContent === '=' ||
    e.target.textContent === '±' ||
    e.target.textContent === '√'
      ? (isReadyForNewInput = true)
      : (isReadyForNewInput = false);
  })
);

function limitLengthAndDecimals(number) {
  const result =
    number.toString().indexOf('.') === -1
      ? number
      : number[number.toString().length - 1] === '.'
      ? number
      : Math.round(Number(number) * 10000) / 10000;

  if (result.toString().length <= 8) {
    return result;
  } else {
    isReadyForNewInput = true;
    return 'too long!';
  }
}

function resetOperandsAndOperator() {
  firstOperand = null;
  secondOperand = null;
  operator = null;
}

function setOperands() {
  operator
    ? (secondOperand = display.textContent)
    : (firstOperand = display.textContent);
}

function displayDateAndTime() {
  const dateAndTime = document.getElementById('date-time');
  const date = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const hour = date.getHours();
  const min = date.getMinutes();
  const second = date.getSeconds();
  const currentTime = `${days[date.getDay()]} 
  ${months[date.getMonth()]} 
  ${date.getDate()}${'\xa0\xa0'}
  ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${
    second < 10 ? '0' + second : second
  }`;
  dateAndTime.textContent = currentTime;
}

function displayTime() {
  const time = document.getElementById('time');
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  const currentTime = `
  ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}`;
  time.textContent = currentTime;
}

displayDateAndTime();
displayTime();
setInterval(() => displayDateAndTime(), 1000);
setInterval(() => displayTime(), 1000 * 10);

const calculator = document.querySelector('.calculator');
const display = document.getElementById('display');
let calcState = {
  firstOperand: null,
  secondOperand: null,
  operator: null,
  prevOperand: null,
  prevOperator: null,
};
let isReadyForNewInput = false;

document.querySelectorAll('.button').forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

function handleButtonClick(e) {
  const classList = [...e.target.classList];
  if (classList.includes('number')) {
    handleNumberClick(e.target.textContent);
  } else if (classList.includes('function')) {
    handleFunctionClick(e.target.textContent);
  } else if (classList.includes('operator')) {
    handleOperatorClick(e.target.textContent);
  } else if (classList.includes('dot')) {
    handleDotClick();
  } else if (classList.includes('equal')) {
    handleEqualClick();
  }
}

function handleNumberClick(number) {
  if (
    getNumberOnDisplay() === '0' ||
    getNumberOnDisplay() === 'Too long!' ||
    getNumberOnDisplay() === 'Error' ||
    isReadyForNewInput
  ) {
    setNumberOnDisplay(number[0]);
  } else {
    setNumberOnDisplay(getNumberOnDisplay() + number);
  }
  isReadyForNewInput = false;
}

function handleFunctionClick(fn) {
  if (fn === 'C') {
    setNumberOnDisplay('0');
    resetOperandsAndOperatorToNull();
    return;
  }
  if (fn === '±') {
    setNumberOnDisplay(-1 * getNumberOnDisplay());
    setOperands();
    return;
  }
  if (fn === '√') {
    setNumberOnDisplay(Math.sqrt(getNumberOnDisplay()));
    setOperands();
    return;
  }
  isReadyForNewInput = true;
}

function handleOperatorClick(op) {
  if (
    !calcState.firstOperand ||
    calcState.firstOperand === 'Too long!' ||
    calcState.firstOperand === 'Error'
  )
    calcState.firstOperand = getNumberOnDisplay();
  else if (calcState.firstOperand && calcState.operator) {
    calcState.secondOperand = getNumberOnDisplay();
    executeCalculation();
  }
  isReadyForNewInput = true;
  calcState.operator = op;
}

function handleDotClick() {
  if (isReadyForNewInput) {
    setNumberOnDisplay('0.');
  } else if (getNumberOnDisplay().indexOf('.') === -1) {
    setNumberOnDisplay(getNumberOnDisplay() + '.');
  }
  isReadyForNewInput = false;
}

function handleEqualClick() {
  if (calcState.firstOperand && calcState.operator) {
    calcState.secondOperand = getNumberOnDisplay();
    executeCalculation();
    return;
  }
  if (
    calcState.firstOperand &&
    calcState.prevOperand &&
    calcState.prevOperator
  ) {
    executeCalculation(true);
    return;
  }
  isReadyForNewInput = true;
}

function setNumberOnDisplay(number) {
  display.textContent = limitLengthAndDecimals(number.toString());
}

function getNumberOnDisplay() {
  return display.textContent;
}

function executeCalculation(usePrev = false) {
  if (usePrev) {
    calcState = {
      ...calcState,
      secondOperand: calcState.prevOperand,
      operator: calcState.prevOperator,
    };
  }
  const result = calculate(
    Number(calcState.firstOperand),
    Number(calcState.secondOperand),
    calcState.operator
  );
  updateCalculationState(result);
}

function calculate(x, y, op) {
  switch (op) {
    case '+':
      return x + y;
    case '-':
      return x - y;
    case '*':
      return x * y;
    case '/':
      return y !== 0 ? x / y : 'Error';
    default:
      console.log('🚨 Invalid operator!');
  }
}

function updateCalculationState(result) {
  setNumberOnDisplay(result);
  calcState = {
    ...calcState,
    firstOperand: getNumberOnDisplay(),
    secondOperand: null,
    operator: null,
    prevOperand: calcState.secondOperand,
    prevOperator: calcState.operator,
  };
}

function limitLengthAndDecimals(strNumber) {
  const roundedOutput =
    strNumber.includes('.') &&
    strNumber[strNumber.length - 1] !== '.' &&
    strNumber.length <= 8
      ? Math.round(Number(strNumber) * 1000000) / 1000000
      : strNumber;

  return roundedOutput.toString().length <= 8 ? roundedOutput : 'Too long!';
}

function resetOperandsAndOperatorToNull() {
  calcState = {
    ...calcState,
    firstOperand: null,
    secondOperand: null,
    operator: null,
  };
}

function setOperands() {
  calcState.operator
    ? (calcState.secondOperand = getNumberOnDisplay())
    : (calcState.firstOperand = getNumberOnDisplay());
}

document.getElementById('icon').addEventListener('dblclick', () => {
  calculator.style.display = 'block';
});

document.getElementById('close-button').addEventListener('click', () => {
  calculator.style.display = 'none';
  setNumberOnDisplay('0');
  resetOperandsAndOperatorToNull();
});

function getDateAndTime() {
  const dateAndTime = document.getElementById('date-time');
  const time = document.getElementById('time');
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
  const currentTime = `
  ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}`;
  const currentDateAndTime = `${days[date.getDay()]} 
  ${months[date.getMonth()]} 
  ${date.getDate()}${'\xa0\xa0'}
  ${currentTime}:${second < 10 ? '0' + second : second}`;
  dateAndTime.textContent = currentDateAndTime;
  time.textContent = currentTime;
}

getDateAndTime();
setInterval(() => getDateAndTime(), 1000);

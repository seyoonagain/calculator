const icon = document.getElementById('icon');
const titleBar = document.getElementById('title-bar');
const container = document.querySelector('.container');
const display = document.getElementById('display');
let calcState = {
  firstOperand: null,
  secondOperand: null,
  operator: null,
  prevOperand: null,
  prevOperator: null,
};
let isReadyForNewInput = false;

function handleButtons() {
  const buttonMap = {
    number: handleNumberClick,
    function: handleFunctionClick,
    operator: handleOperatorClick,
    dot: handleDotClick,
    equal: handleEqualClick,
  };

  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const buttonClassName = Array.from(e.target.classList) //
        .find((className) => Object.keys(buttonMap).includes(className));

      buttonClassName === 'dot' || buttonClassName === 'equal'
        ? buttonMap[buttonClassName]()
        : buttonMap[buttonClassName](e.target.textContent);
    });
  });
}
handleButtons();

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
  setOperands();
}

function handleFunctionClick(fn) {
  if (fn === 'C') {
    setNumberOnDisplay('0');
    resetOperandsAndOperatorToNull();
  } else if (fn === '±') {
    setNumberOnDisplay(-1 * getNumberOnDisplay());
    setOperands();
  } else if (fn === '√') {
    getNumberOnDisplay() < 0
      ? setNumberOnDisplay('Error')
      : setNumberOnDisplay(Math.sqrt(getNumberOnDisplay()));
    setOperands();
  }
  isReadyForNewInput = true;
}

function handleOperatorClick(op) {
  if (
    calcState.firstOperand === 'Too long!' ||
    calcState.firstOperand === 'Error'
  )
    calcState.firstOperand = getNumberOnDisplay();
  else if (calcState.firstOperand && calcState.operator) {
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
  } else if (
    calcState.firstOperand &&
    calcState.prevOperand &&
    calcState.prevOperator
  ) {
    executeCalculation(true);
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
    firstOperand: getNumberOnDisplay(),
    secondOperand: null,
    operator: null,
    prevOperand: calcState.secondOperand,
    prevOperator: calcState.operator,
  };
}

function limitLengthAndDecimals(strNumber) {
  const MAX_LENGTH = 8;
  let output = strNumber;

  if (
    !strNumber.includes('-') &&
    strNumber.includes('.') &&
    strNumber[strNumber.length - 1] !== '0' &&
    strNumber[strNumber.length - 1] !== '.' &&
    strNumber.length > MAX_LENGTH
  ) {
    const integerPart = strNumber.split('.')[0];
    const roomForDecimalDigits = MAX_LENGTH - integerPart.length - 1;
    const factor = Math.pow(10, roomForDecimalDigits);
    integerPart.length > MAX_LENGTH
      ? (output = strNumber)
      : (output = Math.round(Number(strNumber) * factor) / factor);
  }

  return output.toString().length <= MAX_LENGTH ? output : 'Too long!';
}

function resetOperandsAndOperatorToNull() {
  calcState = {
    firstOperand: null,
    secondOperand: null,
    operator: null,
    prevOperand: null,
    prevOperator: null,
  };
}

function setOperands() {
  calcState.operator
    ? (calcState.secondOperand = getNumberOnDisplay())
    : (calcState.firstOperand = getNumberOnDisplay());
}

document.getElementById('icon').addEventListener('dblclick', () => {
  container.style.display = 'block';
});

document.getElementById('close-button').addEventListener('click', () => {
  container.style.display = 'none';
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

function enableDragging(grab, el) {
  let offsetX, offsetY;
  grab.addEventListener('mousedown', (e) => {
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    document.addEventListener('mousemove', dragCalculator);
    document.addEventListener(
      'mouseup',
      () => {
        document.removeEventListener('mousemove', dragCalculator);
      },
      { once: true }
    );
  });
  const dragCalculator = (e) => {
    const left = e.clientX - offsetX;
    const top = e.clientY - offsetY;
    const minX = 0;
    const minY = 31;
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    el.style.left = `${left < minX ? minX : left > maxX ? maxX : left}px`;
    el.style.top = `${top < minY ? minY : top > maxY ? maxY : top}px`;
  };
}

enableDragging(titleBar, container);
enableDragging(icon, icon);

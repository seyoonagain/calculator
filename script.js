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

handleButtons();
function handleButtons() {
  const buttons = document.querySelectorAll('.button');
  const buttonMap = {
    number: handleNumberClick,
    function: handleFunctionClick,
    operator: handleOperatorClick,
    dot: handleDotClick,
    equal: handleEqualClick,
  };

  buttons.forEach((button) => {
    button.addEventListener('click', (e) => handleButtonClick(e, buttonMap));
  });

  document.addEventListener('keydown', (e) =>
    handleKeydown(e, buttons, buttonMap)
  );
}

function handleButtonClick(e, buttonMap) {
  const buttonClassName = Array.from(e.target.classList) //
    .find((className) => Object.keys(buttonMap).includes(className));

  buttonClassName === 'dot' || buttonClassName === 'equal'
    ? buttonMap[buttonClassName]()
    : buttonMap[buttonClassName](e.target.textContent);
}

function handleKeydown(e, buttons, buttonMap) {
  buttons.forEach((button) => e.key === button.textContent && button.click());
  e.key === 'Enter' && buttonMap.equal();
  e.key === 'Escape' && buttonMap.function('C');
  e.key === 'Backspace' && deleteLastDigit();
}

function handleNumberClick(number) {
  if (
    getNumberOnDisplay() === '0' ||
    checkErrorMessage() ||
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
    if (checkErrorMessage()) return;
    setNumberOnDisplay(-1 * getNumberOnDisplay());
    setOperands();
  } else if (fn === '√') {
    if (checkErrorMessage()) return;
    try {
      if (getNumberOnDisplay() < 0) {
        throw new Error('Cannot take the square root of a negative number.');
      }
      setNumberOnDisplay(Math.sqrt(getNumberOnDisplay()));
    } catch (error) {
      setNumberOnDisplay();
      resetOperandsAndOperatorToNull();
      showPopupAlert(error.message);
    } finally {
      setOperands();
    }
  }
  isReadyForNewInput = true;
}

function handleOperatorClick(op) {
  if (calcState.firstOperand === null) return;
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

function deleteLastDigit() {
  const number = getNumberOnDisplay();
  number.length === 1
    ? setNumberOnDisplay(0)
    : setNumberOnDisplay(number.slice(0, number.length - 1));
  setOperands();
}

function setNumberOnDisplay(number) {
  display.textContent =
    number !== undefined ? limitLengthAndDecimals(number.toString()) : 'Error';
}

function getNumberOnDisplay() {
  return display.textContent;
}

function checkErrorMessage() {
  return (
    getNumberOnDisplay() === 'Too long!' || getNumberOnDisplay() === 'Error'
  );
}

function executeCalculation(usePrev = false) {
  if (usePrev) {
    calcState = {
      ...calcState,
      secondOperand: calcState.prevOperand,
      operator: calcState.prevOperator,
    };
  }
  try {
    const result = calculate(
      Number(calcState.firstOperand),
      Number(calcState.secondOperand),
      calcState.operator
    );
    updateCalculationState(result);
  } catch (error) {
    updateCalculationState();
    resetOperandsAndOperatorToNull();
    showPopupAlert(error.message);
  }
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
      if (y === 0) throw new Error('Division by zero is not allowed.');
      else return x / y;
    default:
      console.log('🚨 Invalid operator!');
  }
}

function updateCalculationState(result = undefined) {
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
    integerPart.length <= MAX_LENGTH &&
      (strNumber = Math.round(Number(strNumber) * factor) / factor);
  }

  try {
    if (strNumber.toString().length <= MAX_LENGTH) {
      return strNumber;
    } else throw new Error('The display can show a maximum of 8 characters.');
  } catch (error) {
    showPopupAlert(error.message);
    return 'Too long!';
  }
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

function showPopupAlert(error) {
  const body = document.querySelector('body');
  const overlay = document.createElement('div');
  const outerDiv = document.createElement('div');
  const div = document.createElement('div');
  const bomb = document.createElement('img');
  const span = document.createElement('span');
  const button = document.createElement('button');

  overlay.classList.add('overlay');
  overlay.classList.add('flex');
  outerDiv.classList.add('alert-container');
  outerDiv.classList.add('flex');
  div.classList.add('alert');
  div.classList.add('flex');
  bomb.src =
    'https://gist.github.com/user-attachments/assets/e9fbb2f4-7dab-4715-977c-765ed838c0d4';
  span.textContent = error;
  button.id = 'ok-button';
  button.textContent = 'OK';
  button.onclick = () => overlay.remove();

  div.append(bomb, span);
  outerDiv.append(div, button);
  overlay.appendChild(outerDiv);
  body.appendChild(overlay);
  makeElementDraggable(div, outerDiv);
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

function makeElementDraggable(grab, el) {
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
    const minY = 30;
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    el.style.left = `${left < minX ? minX : left > maxX ? maxX : left}px`;
    el.style.top = `${top < minY ? minY : top > maxY ? maxY : top}px`;
  };
}

makeElementDraggable(titleBar, container);
makeElementDraggable(icon, icon);

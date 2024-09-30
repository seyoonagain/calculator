const buttons = document.querySelectorAll('button');
const display = document.getElementById('display');
const dot = document.getElementById('dot');
const functions = document.querySelectorAll('.function');

buttons.forEach((button) =>
  button.addEventListener('click', (e) => {
    console.log(e.target.textContent);
  })
);

Array.from(buttons)
  .filter((button) => button.className.match('number'))
  .forEach((number) =>
    number.addEventListener('click', () => {
      if (display.textContent === '0') {
        display.textContent = number.textContent;
      } else {
        display.textContent += number.textContent;
      }
    })
  );

dot.addEventListener('click', () => {
  if (display.textContent.indexOf(dot.textContent) === -1) {
    display.textContent += dot.textContent;
  }
});

Array.from(functions)
  .find((fn) => fn.textContent === 'C')
  .addEventListener('click', () => (display.textContent = '0'));

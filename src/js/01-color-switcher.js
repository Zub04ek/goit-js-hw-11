function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const bodyRef = document.querySelector('body');
const startBtnRef = document.querySelector('button[data-start]');
const stopBtnRef = document.querySelector('button[data-stop]');

startBtnRef.addEventListener('click', onChangeBcgColor);
stopBtnRef.addEventListener('click', onStopChangeColor);

let counterId = null;

function onChangeBcgColor() {
  counterId = setInterval(() => {
    const randomColor = getRandomHexColor();
    bodyRef.style.backgroundColor = randomColor;
  }, 1000);
  startBtnRef.disabled = true;
  stopBtnRef.disabled = false;
}

function onStopChangeColor() {
  clearInterval(counterId);
  startBtnRef.disabled = false;
  stopBtnRef.disabled = true;
}

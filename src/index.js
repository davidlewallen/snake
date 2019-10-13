document.body.onload = init;

let height = 500;
let width = 500;
let nextX = 5;
let nextY = 5;
let goingDown = true;

function init() {
  const root = document.getElementById("root");
  const canvasEl = document.createElement("canvas");

  canvasEl.id = "canvas";
  canvasEl.width = width.toString();
  canvasEl.height = height.toString();

  root.appendChild(canvasEl);

  loop();
}

function draw() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, 500, 500);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(nextX, nextY, 5, 0, 2 * Math.PI);
  ctx.fill();

  if (nextY >= height - 5) {
    goingDown = false;
  }
  if (nextY <= 5) {
    goingDown = true;
  }
  if (goingDown === true) {
    nextY = nextY + 2.0;
  } else {
    nextY = nextY - 2.0;
  }
}

function loop() {
  setInterval(draw, 10);
}

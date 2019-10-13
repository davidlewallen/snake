document.body.onload = init;

let height = 520;
let width = 520;

let nextX = 10;
let nextY = 10;

let previousDirection = "down";
let direction = "down";
let gameOver = false;

function addEventsToDirectionalKeys() {
  const keyMap = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };

  document.body.addEventListener("keydown", event => {
    const key = keyMap[event.keyCode];
    const validKey = Boolean(key);

    if (validKey) {
      const differentDirection = key !== previousDirection;
      const oppositeAxis =
        (key === "left" && previousDirection !== "right") ||
        (key === "right" && previousDirection !== "left") ||
        (key === "up" && previousDirection !== "down") ||
        (key === "down" && previousDirection !== "up");

      if (differentDirection && oppositeAxis) {
        direction = keyMap[event.keyCode];
        previousDirection = direction;
      }
    }
  });
}

function checkGameover() {
  const hitTop = nextY < 10;
  const hitRight = nextX >= width;
  const hitBottom = nextY > height;
  const hitLeft = nextX < 10;

  if (hitTop || hitRight || hitBottom || hitLeft) {
    gameOver = true;
  }
}

function draw() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(nextX, nextY, 10, 0, 2 * Math.PI);
  ctx.fill();

  if (direction === "down") {
    nextY += 20;
  }
  if (direction === "up") {
    nextY -= 20;
  }
  if (direction === "left") {
    nextX -= 20;
  }
  if (direction === "right") {
    nextX += 20;
  }

  checkGameover();
}

function loop() {
  let gameLoop = null;

  gameLoop = setInterval(() => {
    if (gameOver) {
      console.error("Game Over");
      return clearInterval(gameLoop);
    }

    draw();
  }, 500);
}

function init() {
  const root = document.getElementById("root");
  const canvasEl = document.createElement("canvas");

  canvasEl.id = "canvas";
  canvasEl.width = width.toString();
  canvasEl.height = height.toString();

  root.appendChild(canvasEl);

  addEventsToDirectionalKeys();

  loop();
}

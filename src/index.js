document.body.onload = init;

let gameTime = 100;

let height = 520;
let width = 520;

let unitList = [
  {
    currentPosition: [10, 10],
    previousPosition: [10, 10]
  }
];

let fruit = { currentPosition: [] };

let currentDirection = "down";
let previousDirection = "down";
let requestedDirection = "down";

let gameOver = false;

function getGameStatus() {
  return unitList.some(unit => {
    const [unitX, unitY] = unit.currentPosition;
    const hitTop = unitY < 10;
    const hitRight = unitX >= width;
    const hitBottom = unitY > height;
    const hitLeft = unitX < 10;

    return hitTop || hitRight || hitBottom || hitLeft;
  });
}

function addUnit() {
  const lastIndex = unitList.length - 1;
  const lastUnit = unitList[lastIndex];
  const lastUnitPosition = lastUnit.previousPosition;

  unitList.push({
    currentPosition: lastUnitPosition,
    previousPosition: lastUnitPosition
  });
}

function eatFruit() {
  const [player] = unitList;
  const [playerX, playerY] = player.currentPosition;

  const [fruitX, fruitY] = fruit.currentPosition;

  if (playerX === fruitX && playerY === fruitY) {
    addUnit();

    gameTime = gameTime * 0.1;

    fruit.currentPosition = [];
  }
}

function drawUnit(ctx, x, y, isPlayer = false) {
  ctx.fillStyle = isPlayer ? "green" : "red";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function moveUnits(ctx) {
  const [, ...units] = unitList;

  units.forEach((unit, index) => {
    const [nextX, nextY] = unit.currentPosition;

    drawUnit(ctx, nextX, nextY);

    updateUnitPosition(index + 1, ...unitList[index].previousPosition);
  });
}

function updateUnitPosition(index, x, y) {
  const unitListCopy = [...unitList];

  unitListCopy[index].previousPosition = unitListCopy[index].currentPosition;

  unitListCopy[index].currentPosition = [x, y];

  unitList = unitListCopy;
}

function movePlayer(ctx) {
  const [{ currentPosition }] = unitList;
  const [x, y] = currentPosition;

  drawUnit(ctx, x, y, true);

  if (currentDirection === "down") {
    updateUnitPosition(0, x, y + 20);
  }
  if (currentDirection === "up") {
    updateUnitPosition(0, x, y - 20);
  }
  if (currentDirection === "left") {
    updateUnitPosition(0, x - 20, y);
  }
  if (currentDirection === "right") {
    updateUnitPosition(0, x + 20, y);
  }
}

function drawUnits(ctx) {
  movePlayer(ctx);

  moveUnits(ctx);
}

function updateFruitPosition(x, y) {
  fruit.currentPosition = [x, y];
}

function randomLocation() {
  const randomNumber = Math.floor(Math.random() * (510 - 10) + 10);

  const divisibleBy10 = randomNumber % 10 === 0;
  const divisibleBy20 = (randomNumber - 10) % 20 === 0;

  if (randomNumber === 10 || (divisibleBy10 && divisibleBy20)) {
    return randomNumber;
  }

  return randomLocation();
}

function randomizeFruitLocation() {
  const x = randomLocation();
  const y = randomLocation();

  const [mainUnit] = unitList;
  const [currentX, currentY] = mainUnit.currentPosition;

  const notWithin20pX = x + 20 < currentX || x - 20 > currentX;
  const notWithin20pY = y + 20 < currentY || y - 20 > currentY;

  if (notWithin20pX && notWithin20pY) {
    updateFruitPosition(x, y);
  } else {
    randomizeFruitLocation();
  }
}

function drawFruit(ctx) {
  if (!fruit.currentPosition.length) {
    randomizeFruitLocation();
  }

  const [currentX, currentY] = fruit.currentPosition;

  ctx.fillStyle = "Blue";
  ctx.beginPath();
  ctx.arc(currentX, currentY, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function setDirection() {
  previousDirection = currentDirection;
  currentDirection = requestedDirection;
}

function loop() {
  let gameLoop = null;

  gameLoop = setInterval(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    console.error("loop");

    ctx.clearRect(0, 0, width, height);

    drawFruit(ctx);

    setDirection();

    drawUnits(ctx);

    eatFruit();

    if (getGameStatus()) {
      return clearInterval(gameLoop);
    }
  }, gameTime);
}

function addEventsToDirectionalKeys() {
  const keyMap = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
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
        requestedDirection = keyMap[event.keyCode];
      }
    }
  });
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

"use strict";
const canvasGame = document.querySelector(".canvas-game");
const ctx = canvasGame.getContext("2d");
// set snake, food and step size
const size = 10;
// get random position for food
const getRandomPosition = () =>
  Math.trunc((Math.random() * canvasGame.width) / 10) * 10;
// set the snake object
const snake = {
  //set initial values
  color: "white",
  direction: "right",
  xPosition: [50, 40, 30, 20, 10, 0],
  yPosition: [200, 200, 200, 200, 200, 200],
  lastPosition: [0, 200],
  // set a function to draw current position of snake on canvas
  draw: function () {
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.xPosition.length; i++) {
      ctx.beginPath();
      ctx.fillRect(this.xPosition[i], this.yPosition[i], size, size);
    }
  },
  // set a function to clear snake on canvas
  clear: function () {
    for (let i = 0; i < this.xPosition.length; i++) {
      ctx.clearRect(this.xPosition[i], this.yPosition[i], size, size);
    }
  },
  // set the tail position for each step
  setTail: function () {
    this.lastPosition[0] = this.xPosition[this.xPosition.length - 1];
    this.lastPosition[1] = this.yPosition[this.yPosition.length - 1];
  },
  // set a function if snake eats food
  eatCheck: function () {
    if (
      this.xPosition[0] === food.xPosition &&
      this.yPosition[0] === food.yPosition
    ) {
      // clear the food on canvas and generate the new food
      food.clear();
      food.create();
      food.draw();
      // add tail to grow the snake
      this.xPosition.push(this.lastPosition[0]);
      this.yPosition.push(this.lastPosition[1]);
    }
  },
};
// set the food object
const food = {
  // set the initial values
  color: "red",
  xPosition: getRandomPosition(),
  yPosition: getRandomPosition(),
  // set a function to draw current position of food on canvas
  draw: function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPosition, this.yPosition, size, size);
  },
  // set a function to clear food on canvas
  clear: function () {
    ctx.clearRect(this.xPosition, this.yPosition, size, size);
  },
  // set a function to create food with the random positions on canvas
  create: function () {
    food.xPosition = getRandomPosition();
    food.yPosition = getRandomPosition();
  },
};
// set a loop function to move the snake
function move() {
  setTimeout(function gameStarter() {
    snake.clear();
    snake.setTail();
    getDirection();
    getNewPosition(snake.direction);
    if (collisionCheck()) return;
    snake.eatCheck();
    snake.draw();
    move();
  }, 100);
}
// set a function that use shifting method to get new position of the snake
function getNewPosition(direction) {
  let xNewPosition = [];
  let yNewPosition = [];
  if (direction === "up") {
    xNewPosition.push(snake.xPosition[0]);
    yNewPosition.push(snake.yPosition[0] - size);
  } else if (direction === "down") {
    xNewPosition.push(snake.xPosition[0]);
    yNewPosition.push(snake.yPosition[0] + size);
  } else if (direction === "left") {
    xNewPosition.push(snake.xPosition[0] - size);
    yNewPosition.push(snake.yPosition[0]);
  } else if (direction === "right") {
    xNewPosition.push(snake.xPosition[0] + size);
    yNewPosition.push(snake.yPosition[0]);
  }
  snake.xPosition.pop();
  snake.yPosition.pop();
  snake.xPosition = xNewPosition.concat(snake.xPosition);
  snake.yPosition = yNewPosition.concat(snake.yPosition);
}
// set a function to get direction of the snake using keyboard interaction
function getDirection() {
  document.addEventListener("keydown", function (e) {
    if (
      (e.key === "ArrowLeft" || e.key === "a") &&
      !(snake.direction === "right")
    ) {
      snake.direction = "left";
    } else if (
      (e.key === "ArrowRight" || e.key === "d") &&
      !(snake.direction === "left")
    ) {
      snake.direction = "right";
    } else if (
      (e.key === "ArrowUp" || e.key === "w") &&
      !(snake.direction === "down")
    ) {
      snake.direction = "up";
    } else if (
      (e.key === "ArrowDown" || e.key === "s") &&
      !(snake.direction === "up")
    ) {
      snake.direction = "down";
    }
  });
}
// set a function to detect collisions
function collisionCheck() {
  // ouroboros condition (snake eating itself)
  for (let i = 1; i < snake.xPosition.length; i++) {
    const ouroboros =
      snake.xPosition[0] === snake.xPosition[i] &&
      snake.yPosition[0] === snake.yPosition[i];
    if (ouroboros) return true;
  }
  // snake hits the walls
  return (
    snake.xPosition[0] < 0 ||
    snake.xPosition[0] > canvasGame.width ||
    snake.yPosition[0] < 0 ||
    snake.yPosition[0] > canvasGame.height
  );
}

function gameStart() {
  food.draw();
  move();
}
gameStart();

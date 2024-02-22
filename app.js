const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 448;
canvas.height = 400;

/* Ball Variables */
const ballRadius = 4;
// ball position variables
let x = canvas.width / 2;
let y = canvas.height - 30;
// ball speed variables
let dx = 2;
let dy = -2;

/* Paddle Variables */
const paddleHeight = 10;
const paddleWidth = 50;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 20;
let rightPressed = false;
let leftPresserd = false;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

function ballMovement() {
  // la pelota toca las paredes
  if (x > canvas.width - ballRadius || x < ballRadius) {dx = -dx;}

  // la pelota toca el techo
  if (y < ballRadius) {dy = -dy}

  // la pelota toca el suelo
  if (y > canvas.height - ballRadius) {gameOver()}

  // mover la pelota
  x += dx;
  y += dy;
}

function drawPaddle() {
  ctx.fillStyle = '#09f';
  ctx.fillRect(
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  )
}

function paddleMovement() {

  console.log(rightPressed);
  if(rightPressed) {
    paddleX += 5;
    console.log(paddleX);
  }
}


function collisionDetection() {}
function drawBricks() {}

function cleanCanvas() {
  ctx.clearRect(0,0, canvas.width, canvas.height)
}

function gameOver() {
  document.location.reload();
}

function initEvents() {
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  function keyDownHandler(e) {
    const { key } = e;
    console.log(rightPressed);
    if(key === 'ArrowRight' || key === 'd') {
      rightPressed = true;
    } else if (key === 'ArrowLeft' || key === 'a') {
      leftPresserd = true;
    }
  }

  function keyUpHandler(e) {
    const { key } = e;
    if(key === 'ArrowRight' || key === 'd') {
      rightPressed = false;
    } else if (key === 'ArrowLeft' || key === 'a') {
      leftPresserd = false;
    }

  }
}

function draw() {
  initEvents();
  cleanCanvas();
  // dibujar elementos
  drawBall();
  ballMovement();
  drawPaddle();
  drawBricks();
  // drawScore();

  // colisiones y movimientos
  collisionDetection();
  paddleMovement();
  
  window.requestAnimationFrame(draw);
}

draw();
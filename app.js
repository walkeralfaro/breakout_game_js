const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const $sprite = document.querySelector('#sprite');

canvas.width = 448;
canvas.height = 400;

/* Ball Variables */
const ball = new Object;
ball.radius = 5;
ball.x = canvas.width / 2;
ball.y = canvas.height - 30;
ball.dx = 2;
ball.dy = -4;
ball.width = 10;
ball.height = 10;

/* Paddle Variables */
const paddle = new Object;
paddle.width = 67;
paddle.height = 15;
paddle.x = (canvas.width - paddle.width) / 2;
paddle.y = canvas.height - paddle.height - 20;
paddle.sensitivity = 7;
paddle.right = false;
paddle.left = false;

/* Bricks Variables */
const brick = new Object;
brick.rowCount = 6;
brick.columnCount = 13;
brick.width = 32;
brick.height = 16;
brick.offsetTop = 80;
brick.offsetLeft = 16;
const bricks = [];
brick.status = {
  ACTIVE: 1,
  DESTROYED: 0
}

for (let r = 0; r < brick.rowCount; r++) {
  bricks[r] = [];
  for (let c = 0; c <brick.columnCount; c++) {
    const brickY = ( r * brick.height ) + brick.offsetTop;
    const brickX = ( c * brick.width ) + brick.offsetLeft;
    const random = Math.floor(Math.random() * 8);

    bricks[r][c] = {
      x: brickX,
      y: brickY,
      width: brick.width,
      height: brick.height,
      status: brick.status.ACTIVE,
      color: random
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgb(70,180,50)';
  ctx.fill();
}

function shadowObjects() {
  ctx.shadowColor = '#121212';
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 6;
}

function ballMovement() {
  // la pelota toca las paredes
  if (ball.x > canvas.width - ball.radius || ball.x < ball.radius) {ball.dx = -ball.dx;}
  
  // la pelota toca el techo
  if (ball.y < ball.radius) {ball.dy = -ball.dy}
  
  // la pelota toca el suelo
  if (ball.y > canvas.height - ball.radius) {gameOver()}

  // mover la pelota
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function drawPaddle() {
  ctx.drawImage(
    $sprite, // imagen que contiene los sprites
    0, // coordenada x inicial del sprite en la imagen
    0, // coordenada y inicial del sprite en la imagen
    67, // coordenada x final del sprite en la imagen
    15, // coordenada y final del sprite en la imagen
    paddle.x, // coordenada x inicial en al canvas
    paddle.y, // coordenada y inicial en al canvas
    paddle.width, // coordenada x final en al canvas
    paddle.height, // coordenada y final en al canvas
  )
}
  
function paddleMovement() {
  if(paddle.right && paddle.x < canvas.width - paddle.width - 4) {
    paddle.x += paddle.sensitivity;
  } else if (paddle.left && paddle.x > 4) {
    paddle.x -= paddle.sensitivity;
  }
}

function twoObjectsIntersect(object1, object2) {

  return object1.x < object2.x + object2.width &&
         object1.x + object1.width > object2.x &&
         object1.y < object2.y + object2.height &&
         object1.y + object1.height > object2.y;
}

function collisionDetection() {

  // collition detection paddle with ball
  if(twoObjectsIntersect(paddle, ball)) {
    if(ball.dy > 0 ) {
      ball.dy = -ball.dy
    } 
  }

  // collition detection ball with brick
  // for (let r = 0; r < brick.rowCount; r++) {
  //   for (let c = 0; c <brick.columnCount; c++) {
  //     const currentBrick = bricks[r][c];
  //     if (currentBrick.status === brick.status.DESTROYED) 
  //     continue;

  //     if(twoObjectsIntersect(ball, currentBrick)){
  //       currentBrick.status = brick.status.DESTROYED;
  //       ball.dy = -ball.dy;
  //     }
  //   }
  // }

}

function drawBricks() {

  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c <brick.columnCount; c++) {
      const currentBrick = bricks[r][c];
      if (currentBrick.status === brick.status.DESTROYED) 
      continue;

      const clipX = (currentBrick.color * 32) + 288;

      ctx.drawImage(
        $sprite,
        clipX,
        0,
        brick.width,
        brick.height,
        currentBrick.x,
        currentBrick.y,
        brick.width,
        brick.height,
      )

      if(twoObjectsIntersect(ball, currentBrick)){
        currentBrick.status = brick.status.DESTROYED;
        ball.dy = -ball.dy;
      }

    }
  }

}

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
    if(key === 'ArrowRight' || key === 'd') {
      paddle.right = true;
    } else if (key === 'ArrowLeft' || key === 'a') {
      paddle.left
     = true;
    }
  }

  function keyUpHandler(e) {
    const { key } = e;
    if(key === 'ArrowRight' || key === 'd') {
      paddle.right = false;
    } else if (key === 'ArrowLeft' || key === 'a') {
      paddle.left
     = false;
    }

  }
}

function draw() {
  cleanCanvas();
  shadowObjects();

  initEvents();
  drawBricks();
  
  ballMovement();
  drawBall();
  drawPaddle();
  paddleMovement();
  collisionDetection();
  
  window.requestAnimationFrame(draw);
  
}

draw();
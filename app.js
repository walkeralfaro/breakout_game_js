const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const $sprite = document.querySelector('#sprite');
const $backgrounds = document.querySelector('#backgrounds');
const sounds = {
  pong: chargeAudio('./assets/sounds/breakout_audio_1.wav'),
  pong2: chargeAudio('./assets/sounds/breakout_audio_2.wav'),
}

canvas.width = 448;
canvas.height = 400;

/* Ball Variables */
const ball = new Object;
ball.width = 8;
ball.height = 8;
ball.x = (canvas.width - ball.width) / 2;
ball.y = canvas.height - ball.height - 30;
ball.dx = 1;
ball.dy = -3;

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

function chargeAudio(url) {
  const audio = new Audio();
  audio.src = url;
  return audio;
}

function playAudio(audio) {
  const newAudioInstance = audio.cloneNode();
  newAudioInstance.play();
}

function drawBall() {
  ctx.drawImage(
    $sprite,
    2,
    26,
    8,
    8,
    ball.x,
    ball.y,
    ball.width,
    ball.height
  )

}

function shadowObjects() {
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 8;
}

function ballMovement() {
  // la pelota toca las paredes
  if (ball.x > canvas.width - ball.width || ball.x < ball.width) {
    playAudio(sounds.pong2);
    ball.dx = -ball.dx;
  }
  
  // la pelota toca el techo
  if (ball.y < ball.height - 4) {
    playAudio(sounds.pong2);
    ball.dy = -ball.dy
  }
  
  // la pelota toca el suelo
  if (ball.y > canvas.height - ball.height) {
    gameOver();
  }

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

  return object1.x < object2.x + object2.width &&object1.x + object1.width > object2.x &&object1.y < object2.y + object2.height &&object1.y + object1.height > object2.y;

}

function collisionDetectionPaddleBall() {

  // collition detection paddle with ball
  if(twoObjectsIntersect(paddle, ball)) {
    playAudio(sounds.pong);

    const angle = calcArctangent(paddle, ball);

    switch(true) {
      case angle > 185 && angle < 210:
        ball.dx = -2;
        ball.dy = -2.5;
        break;
      case angle >= 210 && angle < 240:
        ball.dx = -1;
        ball.dy = -3;
        break;
      case angle >= 240 && angle < 270:
        ball.dx = -0.5;
        ball.dy = -3;
        break;
      case angle >= 270 && angle < 300:
        ball.dx = 0.5;
        ball.dy = -3;
        break;
      case angle >= 300 && angle < 330:
        ball.dx = 1;
        ball.dy = -3;
        break;
      case angle >= 330 && angle < 355:
        ball.dx = 2;
        ball.dy = -2.5;
        break;
      default:
        ball.dx = 1;
        ball.dy = -3;
    }
  }
}

function collisionDetectionBrickBall(object1, object2) {

  // collition detection ball with brick
  if(twoObjectsIntersect(object1,object2)) {
    playAudio(sounds.pong);
    object1.status = brick.status.DESTROYED;

    const angle = calcArctangent(object1, object2);
    
    if(angle >= 25 && angle < 155) {
      if(object2.dy < 0 ) {
        object2.dy = -object2.dy;
      }
    } else if(angle >= 155 && angle < 205) {
      if(object2.dx > 0 ) {
        object2.dx = -object2.dx;
      }
    } else if(angle >= 205 && angle < 335) {
      if(object2.dy > 0 ) {
        object2.dy = -object2.dy;
      }
    } else if(angle >= 335 && angle <= 360 ) {
      if(object2.dx < 0 ) {
        object2.dx = -object2.dx;
      }
    } else if(angle >= 0 && angle < 25 ) {
      if(object2.dx < 0 ) {
        ball.dx = -ball.dx;
      }
    }
  }

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

      collisionDetectionBrickBall(currentBrick, ball);
    }
  }

}

function calcArctangent(object1, object2) {

  object1.xo = object1.x + (object1.width / 2);
  object1.yo = object1.y + (object1.height / 2);

  object2.xo = object2.x + (object2.width / 2);
  object2.yo = object2.y + (object2.height / 2);

  const deltaX = object2.xo - object1.xo;
  const deltaY = object2.yo - object1.yo;
  const radianAngle = Math.atan2(deltaY, deltaX);
  
  let degreeAngle = radianAngle * (180 / Math.PI);
  if (degreeAngle < 0) {
    degreeAngle += 360;
  }

  return degreeAngle;
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
  drawBall();
  ballMovement();
  
  drawPaddle();
  paddleMovement();
  
  collisionDetectionPaddleBall();
  
  window.requestAnimationFrame(draw);
  
}

draw();
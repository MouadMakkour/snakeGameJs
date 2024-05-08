//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context; 
var scoreTag;
var isInvincibleTag;
var score;

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;
var speed = 10;

//power-up
var powerUpX;
var powerUpY;
var invincibileActive = false;
var invincibilityDuration = 5000; // milliseconds

var gameOver = false;

var gameInterval;


window.onload = function() {
    board = document.getElementById("board");
    scoreTag = document.getElementById("score");
    speedSpan = document.getElementById("speed");
    isInvincibleTag = document.getElementById("isInvincible");
    score = parseInt(scoreTag.textContent);
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); 

    placeFood();
    document.addEventListener("keyup", changeDirection);
    gameInterval = setInterval(update, 1000 / speed);}

function update() {
    if (gameOver) {
        return;
    }

    if(snakeX !== (5 * blockSize) && snakeY !==(5 * blockSize)) speedSpan.textContent = speed;

    clearInterval(gameInterval);
    gameInterval = setInterval(update, 1000 / speed);

    //borad
    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    //food
    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    //power-up
    context.fillStyle="gold";
    context.fillRect(powerUpX, powerUpY, blockSize, blockSize);

    //add block for snake
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        scoreTag.textContent = score;
        placeFood();
        if (score % 5 === 0) {
            placePowerUp();
            speed += 3;
            setTimeout(makePowerUpDisappear, 50000);
        }
        
    }

    // Check if snake collects power-up
    if (snakeX === powerUpX && snakeY === powerUpY) {
        activateInvincibility();
        makePowerUpDisappear();
    }

    //make the blocks moving (snake body move with the head)
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Update snake position
    snakeX = (snakeX + velocityX * blockSize + board.width) % board.width;
    snakeY = (snakeY + velocityY * blockSize + board.height) % board.height;

    // Draw snake
    if (invincibileActive) {
        context.fillStyle = "rgba(255, 255, 255, 255)"; // Make snake invisible
    } else {
        context.fillStyle = "lime"; // Regular color
    }
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if(!invincibileActive){
        // Check for collision with snake body
        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
                gameOver = true;
                alert("Game Over");
            }
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Function to place food on the board
function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

// Function to place power-up on the board
function placePowerUp() {
    powerUpX = Math.floor(Math.random() * cols) * blockSize;
    powerUpY = Math.floor(Math.random() * rows) * blockSize;
}

function makePowerUpDisappear() {
    powerUpX = board.width + blockSize; // Set X coordinate outside the board
    powerUpY = board.height + blockSize; // Set Y coordinate outside the board
}

// Function to activate invincibility
function activateInvincibility() {
    invincibileActive = true;
    isInvincibleTag.textContent = "You are invincible";
    setTimeout(deactivateInvincibility, invincibilityDuration);
}

// Function to deactivate invincibility
function deactivateInvincibility() {
    isInvincibleTag.textContent = "";
    invincibileActive = false;
}

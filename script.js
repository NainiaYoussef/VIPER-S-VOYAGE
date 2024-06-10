const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = canvas.width; 

let snake;
let direction;
let food;
let game;
let score = 0;
let coins = 0;
let gameTimer;

const snakeColors = ['green', 'yellow', 'pink', 'red', 'blue', 'gray'];
let currentSnakeColorIndex = 0;

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('score-btn').addEventListener('click', showScores);
document.getElementById('buy-skins-btn').addEventListener('click', buySkins);
document.getElementById('exit-btn').addEventListener('click', exitGame);
document.getElementById('back-btn').addEventListener('click', backToMenu);


function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    coins = 0;
    document.getElementById('coin-counter').innerText = 'Coins: ' + coins;
    init();
}

function showScores() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';
    updateScoreList();
}

function exitGame() {
    window.close();
}

function backToMenu() {
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function updateScoreList() {
    fetch('get_scores.php')
        .then(response => response.json())
        .then(scores => {
            const scoreList = document.getElementById('score-list');
            scoreList.innerHTML = scores.map(score => `<li>${score.score} - Coins: ${score.coins}</li>`).join('');
        });
}

function init() {
    snake = [];
    snake[0] = {
        x: Math.floor(canvasSize / 2 / box) * box,
        y: Math.floor(canvasSize / 2 / box) * box
    };

    direction = 'RIGHT';

    food = {
        x: Math.floor(Math.random() * canvasSize / box) * box,
        y: Math.floor(Math.random() * canvasSize / box) * box
    };

    score = 0;

    if (game) {
        clearInterval(game);
    }
    game = setInterval(draw, 100);

    if (gameTimer) {
        clearInterval(gameTimer);
    }
    gameTimer = setInterval(() => {
        coins += 10;
        document.getElementById('coin-counter').innerText = 'Coins: ' + coins;
    }, 10000);
}


document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if ((event.keyCode == 37 || event.keyCode == 65) && direction != 'RIGHT') { // Left arrow or 'A'
        direction = 'LEFT';
    } else if ((event.keyCode == 38 || event.keyCode == 87) && direction != 'DOWN') { // Up arrow or 'W'
        direction = 'UP';
    } else if ((event.keyCode == 39 || event.keyCode == 68) && direction != 'LEFT') { // Right arrow or 'D'
        direction = 'RIGHT';
    } else if ((event.keyCode == 40 || event.keyCode == 83) && direction != 'UP') { // Down arrow or 'S'
        direction = 'DOWN';
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    
    ctx.fillStyle = snakeColors[currentSnakeColorIndex];
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

 
    if (direction == 'LEFT') snakeX -= box;
    if (direction == 'UP') snakeY -= box;
    if (direction == 'RIGHT') snakeX += box;
    if (direction == 'DOWN') snakeY += box;


    if (snakeX == food.x && snakeY == food.y) {
        score++;
       
        food = {
            x: Math.floor(Math.random() * canvasSize / box) * box,
            y: Math.floor(Math.random() * canvasSize / box) * box
        };
    } else {

        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
        clearInterval(gameTimer);
        if (confirm("Game Over! You lost. Do you want to restart?")) {
            saveScore(score, coins);
            startGame();
        } else {
            saveScore(score, coins);
            document.getElementById('main-menu').style.display = 'flex';
            document.getElementById('game-container').style.display = 'none';
            return; 
        }
    }

  
    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function saveScore(score, coins) {
    fetch('save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score, coins })
    });
}

function buySkins() {
    const skinCosts = [0, 100, 200, 300, 400, 500];
    if (coins >= skinCosts[currentSnakeColorIndex + 1]) {
        coins -= skinCosts[currentSnakeColorIndex + 1];
        currentSnakeColorIndex++;
        document.getElementById('coin-counter').innerText = 'Coins: ' + coins;
        draw();
    } else {
        alert("Sorry, you don't have enough coins to buy this skin!");
    }
}


init();

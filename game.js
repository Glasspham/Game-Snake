const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

let snake = [
    { x: 50, y: 50 },
    { x: 40, y: 50 },
    { x: 30, y: 50 },
];

let snakeDirection = { x: 10, y: 0 };
let food = { x: 200, y: 200 };
let score = 0;
let level = 1;
let speed = 100;
let isGameOver = false;

// Detect if the user is on a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Show or hide controls based on device type
const controls = document.getElementById('mobile-controls');
if (isMobile) {
    controls.classList.remove('hidden');
} else {
    controls.classList.add('hidden');
}

// Ask user for starting level
level = prompt('Enter the starting level (1-6):');
if (level < 1) level = 1;
if (level > 6) level = 6;

// Draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = `hsl(${(index * 15) % 360}, 100%, 50%)`;
        ctx.fillRect(segment.x, segment.y, 10, 10);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Update the snake's position
function updateSnake() {
    const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };

    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - 10;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - 10;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score % 3 === 0 && level < 10) speed *= 0.95;
        food = { x: Math.floor(Math.random() * canvas.width / 10) * 10, y: Math.floor(Math.random() * canvas.height / 10) * 10 };
        if (score % 3 === 0) {
            level++;
        }
    } else {
        snake.pop();
    }

    if (checkCollision()) {
        gameOver();
    }
}

// Check for collisions with the snake itself
function checkCollision() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Display Game Over
function gameOver() {
    isGameOver = true;
    document.getElementById('game-over').textContent = 'Game Over';
    let fadeOut = false;
    setInterval(() => {
        if (fadeOut) {
            canvas.style.backgroundColor = '#1a1a1a';
        } else {
            canvas.style.backgroundColor = '#330000';
        }
        fadeOut = !fadeOut;
    }, 500);
}

// Game loop
function gameLoop() {
    if (isGameOver) return;
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        updateSnake();
        document.getElementById('score').textContent = score;
        document.getElementById('level').textContent = level;
        gameLoop();
    }, speed);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowUp' && snakeDirection.y === 0) {
        snakeDirection = { x: 0, y: -10 };
    } else if (key === 'ArrowDown' && snakeDirection.y === 0) {
        snakeDirection = { x: 0, y: 10 };
    } else if (key === 'ArrowLeft' && snakeDirection.x === 0) {
        snakeDirection = { x: -10, y: 0 };
    } else if (key === 'ArrowRight' && snakeDirection.x === 0) {
        snakeDirection = { x: 10, y: 0 };
    }
});

// Handle mobile input (button controls)
document.getElementById('upBtn').addEventListener('click', () => {
    if (snakeDirection.y === 0) snakeDirection = { x: 0, y: -10 };
});

document.getElementById('downBtn').addEventListener('click', () => {
    if (snakeDirection.y === 0) snakeDirection = { x: 0, y: 10 };
});

document.getElementById('leftBtn').addEventListener('click', () => {
    if (snakeDirection.x === 0) snakeDirection = { x: -10, y: 0 };
});

document.getElementById('rightBtn').addEventListener('click', () => {
    if (snakeDirection.x === 0) snakeDirection = { x: 10, y: 0 };
});

// Start the game
gameLoop();

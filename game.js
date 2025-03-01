// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 100; // milliseconds

// Game variables
let canvas, ctx;
let snake, food;
let direction, nextDirection;
let score;
let gameInterval;
let gameRunning;

// DOM elements
let scoreDisplay, gameOverScreen, finalScore;

// Initialize the game
window.onload = function() {
    // Get canvas and context
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Get DOM elements
    scoreDisplay = document.getElementById('score-display');
    gameOverScreen = document.getElementById('game-over');
    finalScore = document.getElementById('final-score');
    
    // Set up event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    
    // Set up touch controls
    document.getElementById('up-button').addEventListener('click', () => changeDirection('up'));
    document.getElementById('down-button').addEventListener('click', () => changeDirection('down'));
    document.getElementById('left-button').addEventListener('click', () => changeDirection('left'));
    document.getElementById('right-button').addEventListener('click', () => changeDirection('right'));
    
    // Start the game
    startGame();
};

// Start a new game
function startGame() {
    // Reset game state
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameRunning = true;
    
    // Update score display
    updateScore();
    
    // Hide game over screen
    gameOverScreen.style.display = 'none';
    
    // Generate initial food
    generateFood();
    
    // Clear any existing interval
    if (gameInterval) clearInterval(gameInterval);
    
    // Start game loop
    gameInterval = setInterval(gameLoop, GAME_SPEED);
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Update direction
    direction = nextDirection;
    
    // Move snake
    moveSnake();
    
    // Check for collisions
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // Check if food eaten
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Draw everything
    draw();
}

// Move the snake in the current direction
function moveSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // Add new head to the beginning of snake array
    snake.unshift(head);
}

// Check for collisions with walls or self
function checkCollision() {
    const head = snake[0];
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width / GRID_SIZE ||
        head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        return true;
    }
    
    // Check self collision (skip the head)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Generate food at random position
function generateFood() {
    // Generate random coordinates
    const x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
    const y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
    
    // Check if food is on snake
    const isOnSnake = snake.some(segment => segment.x === x && segment.y === y);
    
    if (isOnSnake) {
        // If food is on snake, try again
        generateFood();
    } else {
        food = {x, y};
    }
}

// Handle eating food
function eatFood() {
    // Increase score
    score += 10;
    updateScore();
    
    // Generate new food
    generateFood();
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    
    // Update final score
    finalScore.textContent = `Your score: ${score}`;
    
    // Show game over screen
    gameOverScreen.style.display = 'block';
}

// Restart the game
function restartGame() {
    startGame();
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key;
    
    // Prevent default action for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
    }
    
    switch(key) {
        case 'ArrowUp':
            changeDirection('up');
            break;
        case 'ArrowDown':
            changeDirection('down');
            break;
        case 'ArrowLeft':
            changeDirection('left');
            break;
        case 'ArrowRight':
            changeDirection('right');
            break;
    }
}

// Change direction
function changeDirection(newDirection) {
    // Prevent 180-degree turns
    if (
        (direction === 'up' && newDirection === 'down') ||
        (direction === 'down' && newDirection === 'up') ||
        (direction === 'left' && newDirection === 'right') ||
        (direction === 'right' && newDirection === 'left')
    ) {
        return;
    }
    
    nextDirection = newDirection;
}

// Draw everything on the canvas
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        // Head is a different color
        if (index === 0) {
            ctx.fillStyle = '#4CAF50'; // Green head
        } else {
            ctx.fillStyle = '#8BC34A'; // Lighter green body
        }
        
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE,
            GRID_SIZE
        );
        
        // Add a border to make segments distinct
        ctx.strokeStyle = '#222';
        ctx.strokeRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE,
            GRID_SIZE
        );
    });
    
    // Draw food
    ctx.fillStyle = '#FF5722'; // Orange food
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE/2,
        food.y * GRID_SIZE + GRID_SIZE/2,
        GRID_SIZE/2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}
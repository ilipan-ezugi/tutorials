// src/game.js
// Snake Game Engine with RxJS Epics

import { Subject, merge, interval } from 'rxjs';
import { filter, takeUntil, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { keyboardEpic, gameLoopEpic, rootEpic } from './epics';
import { 
    KEY_DOWN, 
    TICK, 
    MOVE_SNAKE, 
    EAT_FOOD, 
    COLLISION, 
    GAME_OVER,
    SCORE_UPDATE,
    START_GAME,
    logAction
} from './actions';

// ============================================
// Game Constants
// ============================================
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = 400;

// ============================================
// Game State
// ============================================
let state = {
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    score: 0,
    bestScore: parseInt(localStorage.getItem('snakeBestScore') || '0'),
    isPlaying: false,
    isPaused: false,
    gameOver: false
};

// ============================================
// Canvas Setup
// ============================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ============================================
// Action Stream
// ============================================
export const action$ = new Subject();

// ============================================
// Epic Subscriptions
// ============================================

// Keyboard input
const keyboard$ = keyboardEpic(action$);
keyboard$.pipe(
    tap(action => logAction(action, 'Keyboard'))
).subscribe(action => {
    if (action.type === KEY_DOWN) {
        handleKeyDown(action.payload.key);
    }
});

// Game loop - emits every 150ms
const gameLoop$ = interval(150).pipe(
    map(() => ({ type: TICK })),
    takeUntil(action$.pipe(filter(a => a.type === GAME_OVER)))
);

gameLoop$.pipe(
    tap(action => {
        if (state.isPlaying && !state.isPaused && !state.gameOver) {
            action$.next({ type: TICK });
        }
    })
).subscribe();

// Handle TICK actions
action$.pipe(
    filter(action => action.type === TICK),
    tap(action => logAction(action, 'GameLoop'))
).subscribe(() => {
    if (state.isPlaying && !state.isPaused && !state.gameOver) {
        moveSnake();
        checkCollision();
        checkFood();
        render();
    }
});

// ============================================
// Game Logic
// ============================================

function handleKeyDown(key) {
    if (state.gameOver) {
        if (key === 'Space' || key === 'Enter') {
            resetGame();
        }
        return;
    }
    
    if (key === 'Space') {
        // Toggle pause
        state.isPaused = !state.isPaused;
        return;
    }
    
    // Change direction (prevent 180 degree turns)
    const directionMap = {
        'ArrowUp': { x: 0, y: -1 },
        'ArrowDown': { x: 0, y: 1 },
        'ArrowLeft': { x: -1, y: 0 },
        'ArrowRight': { x: 1, y: 0 }
    };
    
    const newDir = directionMap[key];
    if (newDir) {
        // Prevent reversing direction
        if (newDir.x !== -state.direction.x || newDir.y !== -state.direction.y) {
            state.nextDirection = newDir;
        }
    }
}

function moveSnake() {
    // Update direction
    state.direction = { ...state.nextDirection };
    
    // Calculate new head position
    const head = state.snake[0];
    const newHead = {
        x: head.x + state.direction.x,
        y: head.y + state.direction.y
    };
    
    // Add new head
    state.snake.unshift(newHead);
    
    // Remove tail (will be adjusted if food eaten)
    state.snake.pop();
}

function checkCollision() {
    const head = state.snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        endGame();
        return;
    }
    
    // Self collision (skip head)
    for (let i = 1; i < state.snake.length; i++) {
        if (head.x === state.snake[i].x && head.y === state.snake[i].y) {
            endGame();
            return;
        }
    }
}

function checkFood() {
    const head = state.snake[0];
    
    if (head.x === state.food.x && head.y === state.food.y) {
        // Eat food - grow snake
        state.snake.push({ ...state.snake[state.snake.length - 1] });
        
        // Update score
        state.score += 10;
        updateScore();
        
        // Spawn new food
        spawnFood();
    }
}

function spawnFood() {
    let newFood;
    let valid = false;
    
    while (!valid) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        // Make sure food doesn't spawn on snake
        valid = !state.snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
    }
    
    state.food = newFood;
}

function endGame() {
    state.gameOver = true;
    state.isPlaying = false;
    
    // Update best score
    if (state.score > state.bestScore) {
        state.bestScore = state.score;
        localStorage.setItem('snakeBestScore', state.bestScore.toString());
    }
    
    // Show game over screen
    document.getElementById('finalScore').textContent = state.score;
    document.getElementById('gameOver').style.display = 'block';
}

function resetGame() {
    state = {
        snake: [{ x: 10, y: 10 }],
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        food: { x: 15, y: 15 },
        score: 0,
        bestScore: state.bestScore,
        isPlaying: true,
        isPaused: false,
        gameOver: false
    };
    
    document.getElementById('gameOver').style.display = 'none';
    updateScore();
    spawnFood();
    render();
}

function updateScore() {
    document.getElementById('score').textContent = state.score;
    document.getElementById('bestScore').textContent = state.bestScore;
}

// ============================================
// Rendering
// ============================================

function render() {
    // Clear canvas
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw grid (optional)
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }
    
    // Draw snake
    state.snake.forEach((segment, index) => {
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;
        
        // Head is a different color
        if (index === 0) {
            ctx.fillStyle = '#00ff88';
        } else {
            ctx.fillStyle = '#00cc6a';
        }
        
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
    
    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(
        state.food.x * CELL_SIZE + CELL_SIZE / 2,
        state.food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw pause overlay
    if (state.isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = '#00ff88';
        ctx.font = '30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const restartBtn = document.getElementById('restartBtn');
    
    restartBtn.addEventListener('click', resetGame);
    
    // Start the game
    resetGame();
    
    console.log('%c🐍 Snake Game Initialized!', 'font-size: 16px; color: #00ff88');
    console.log('%cUse arrow keys to move, Space to pause', 'color: #888');
});

// Export for debugging
window.gameState = state;
window.action$ = action$;
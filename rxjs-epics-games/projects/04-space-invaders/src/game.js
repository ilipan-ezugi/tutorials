// src/game.js
// Space Invaders Game Engine with RxJS Epics

import { Subject, merge, interval } from 'rxjs';
import { filter, takeUntil, map, tap } from 'rxjs/operators';
import { rootEpic } from './epics';
import { 
    KEY_DOWN, 
    TICK, 
    FIRE, 
    MOVE_BULLETS, 
    MOVE_ENEMIES,
    ENEMY_FIRE,
    MOVE_PLAYER,
    COLLISION_DETECTED,
    ENEMY_DESTROYED,
    PLAYER_HIT,
    GAME_OVER,
    logAction
} from './actions';

// ============================================
// Game Constants
// ============================================
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 20;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;

// ============================================
// Game State
// ============================================
let state = {
    player: { x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 40 },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    score: 0,
    lives: 3,
    level: 1,
    isPlaying: true,
    isPaused: false,
    gameOver: false,
    enemyDirection: 1,
    enemyMoveCounter: 0
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
// Initialize Epics
// ============================================
const epicOutput$ = rootEpic(action$);

epicOutput$.pipe(
    tap(action => logAction(action, 'Epic'))
).subscribe(action => {
    handleAction(action);
});

// ============================================
// Action Handler
// ============================================
function handleAction(action) {
    switch (action.type) {
        case MOVE_PLAYER:
            movePlayer(action.payload.direction);
            break;
        case FIRE:
            fireBullet();
            break;
        case MOVE_BULLETS:
            moveBullets();
            break;
        case MOVE_ENEMIES:
            moveEnemies();
            break;
        case ENEMY_FIRE:
            enemyFire();
            break;
        case 'CHECK_COLLISIONS':
            checkCollisions();
            break;
    }
}

// ============================================
// Player Functions
// ============================================
function movePlayer(direction) {
    if (state.gameOver || state.isPaused) return;
    
    state.player.x += direction * 10;
    
    // Clamp to canvas
    state.player.x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.player.x));
}

function fireBullet() {
    if (state.gameOver || state.isPaused) return;
    
    // Limit bullets on screen
    if (state.bullets.length < 5) {
        state.bullets.push({
            x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
            y: state.player.y
        });
    }
}

// ============================================
// Bullet Functions
// ============================================
function moveBullets() {
    if (state.gameOver || state.isPaused) return;
    
    // Move player bullets up
    state.bullets = state.bullets.filter(bullet => {
        bullet.y -= 8;
        return bullet.y > -BULLET_HEIGHT;
    });
    
    // Move enemy bullets down
    state.enemyBullets = state.enemyBullets.filter(bullet => {
        bullet.y += 5;
        return bullet.y < CANVAS_HEIGHT;
    });
}

// ============================================
// Enemy Functions
// ============================================
function initEnemies() {
    state.enemies = [];
    const rows = 4;
    const cols = 8;
    const startX = 50;
    const startY = 50;
    const spacingX = 60;
    const spacingY = 40;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            state.enemies.push({
                id: `${row}-${col}`,
                x: startX + col * spacingX,
                y: startY + row * spacingY,
                alive: true
            });
        }
    }
}

function moveEnemies() {
    if (state.gameOver || state.isPaused) return;
    
    state.enemyMoveCounter++;
    
    // Move every 30 ticks
    if (state.enemyMoveCounter < 30) return;
    state.enemyMoveCounter = 0;
    
    let hitEdge = false;
    
    state.enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        enemy.x += 10 * state.enemyDirection;
        
        if (enemy.x <= 0 || enemy.x + ENEMY_WIDTH >= CANVAS_WIDTH) {
            hitEdge = true;
        }
    });
    
    if (hitEdge) {
        state.enemyDirection *= -1;
        state.enemies.forEach(enemy => {
            enemy.y += 20;
            
            // Check if enemies reached bottom
            if (enemy.y + ENEMY_HEIGHT >= state.player.y) {
                playerHit();
            }
        });
    }
}

function enemyFire() {
    if (state.gameOver || state.isPaused) return;
    
    // Random enemy fires
    const aliveEnemies = state.enemies.filter(e => e.alive);
    if (aliveEnemies.length > 0) {
        const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        state.enemyBullets.push({
            x: shooter.x + ENEMY_WIDTH / 2,
            y: shooter.y + ENEMY_HEIGHT
        });
    }
}

// ============================================
// Collision Detection
// ============================================
function checkCollisions() {
    if (state.gameOver || state.isPaused) return;
    
    // Check player bullets vs enemies
    state.bullets.forEach((bullet, bulletIndex) => {
        state.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            if (rectsCollide(
                bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT,
                enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT
            )) {
                enemy.alive = false;
                state.bullets.splice(bulletIndex, 1);
                state.score += 100;
                updateUI();
                
                // Check level complete
                if (state.enemies.every(e => !e.alive)) {
                    nextLevel();
                }
            }
        });
    });
    
    // Check enemy bullets vs player
    state.enemyBullets.forEach((bullet, index) => {
        if (rectsCollide(
            bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT,
            state.player.x, state.player.y, PLAYER_WIDTH, PLAYER_HEIGHT
        )) {
            state.enemyBullets.splice(index, 1);
            playerHit();
        }
    });
}

function rectsCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function playerHit() {
    state.lives--;
    updateUI();
    
    if (state.lives <= 0) {
        endGame();
    } else {
        // Reset positions
        state.bullets = [];
        state.enemyBullets = [];
    }
}

function nextLevel() {
    state.level++;
    state.enemyDirection = 1;
    initEnemies();
    updateUI();
}

function endGame() {
    state.gameOver = true;
    state.isPlaying = false;
}

// ============================================
// Rendering
// ============================================
function render() {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137) % CANVAS_WIDTH;
        const y = (i * 89) % CANVAS_HEIGHT;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Draw player
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.moveTo(state.player.x + PLAYER_WIDTH / 2, state.player.y);
    ctx.lineTo(state.player.x + PLAYER_WIDTH, state.player.y + PLAYER_HEIGHT);
    ctx.lineTo(state.player.x, state.player.y + PLAYER_HEIGHT);
    ctx.closePath();
    ctx.fill();
    
    // Draw enemies
    state.enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT);
        
        // Enemy eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
        ctx.fillRect(enemy.x + ENEMY_WIDTH - 10, enemy.y + 5, 5, 5);
    });
    
    // Draw player bullets
    ctx.fillStyle = '#00d9ff';
    state.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
    
    // Draw enemy bullets
    ctx.fillStyle = '#ff6b6b';
    state.enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
    
    // Draw game over
    if (state.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '40px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = '20px Courier New';
        ctx.fillText(`Final Score: ${state.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }
    
    // Draw pause
    if (state.isPaused && !state.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = '30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

function updateUI() {
    document.getElementById('score').textContent = state.score;
    document.getElementById('lives').textContent = state.lives;
    document.getElementById('level').textContent = state.level;
}

// ============================================
// Game Loop
// ============================================
function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initEnemies();
    updateUI();
    gameLoop();
    
    console.log('%c🚀 Space Invaders Initialized!', 'font-size: 16px; color: #00ff88');
    console.log('%cUse arrow keys to move, Space to fire', 'color: #888');
});

// Export for debugging
window.gameState = state;
window.action$ = action$;
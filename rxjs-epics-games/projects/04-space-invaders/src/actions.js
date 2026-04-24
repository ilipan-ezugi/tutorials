// src/actions.js
// Action types for Space Invaders game

export const KEY_DOWN = 'KEY_DOWN';
export const TICK = 'TICK';
export const FIRE = 'FIRE';
export const MOVE_PLAYER = 'MOVE_PLAYER';
export const MOVE_BULLETS = 'MOVE_BULLETS';
export const MOVE_ENEMIES = 'MOVE_ENEMIES';
export const ENEMY_FIRE = 'ENEMY_FIRE';
export const COLLISION_DETECTED = 'COLLISION_DETECTED';
export const ENEMY_DESTROYED = 'ENEMY_DESTROYED';
export const PLAYER_HIT = 'PLAYER_HIT';
export const LEVEL_COMPLETE = 'LEVEL_COMPLETE';
export const GAME_OVER = 'GAME_OVER';
export const START_GAME = 'START_GAME';
export const PAUSE_GAME = 'PAUSE_GAME';

// Action creators
export const keyDown = (key) => ({ type: KEY_DOWN, payload: { key } });
export const tick = () => ({ type: TICK });
export const fire = () => ({ type: FIRE });
export const movePlayer = (direction) => ({ type: MOVE_PLAYER, payload: { direction } });
export const moveBullets = () => ({ type: MOVE_BULLETS });
export const moveEnemies = () => ({ type: MOVE_ENEMIES });
export const enemyFire = () => ({ type: ENEMY_FIRE });
export const collisionDetected = (a, b) => ({ type: COLLISION_DETECTED, payload: { a, b } });
export const enemyDestroyed = (id, points) => ({ type: ENEMY_DESTROYED, payload: { id, points } });
export const playerHit = () => ({ type: PLAYER_HIT });
export const levelComplete = () => ({ type: LEVEL_COMPLETE });
export const gameOver = () => ({ type: GAME_OVER });
export const startGame = () => ({ type: START_GAME });
export const pauseGame = () => ({ type: PAUSE_GAME });

// Console logging helper
export const logAction = (action, prefix = 'Action') => {
    const colors = {
        'KEY_DOWN': '#ff6b6b',
        'FIRE': '#feca57',
        'TICK': '#00d9ff',
        'COLLISION_DETECTED': '#ff9ff3',
        'ENEMY_DESTROYED': '#00ff88'
    };
    const color = colors[action.type] || '#00d9ff';
    console.log(`%c ${prefix}: ${action.type}`, `color: ${color}; font-weight: bold`, action.payload || '');
};
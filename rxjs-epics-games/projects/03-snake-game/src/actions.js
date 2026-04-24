// src/actions.js
// Action types for the Snake game

export const KEY_DOWN = 'KEY_DOWN';
export const TICK = 'TICK';
export const MOVE_SNAKE = 'MOVE_SNAKE';
export const EAT_FOOD = 'EAT_FOOD';
export const COLLISION = 'COLLISION';
export const GAME_OVER = 'GAME_OVER';
export const SCORE_UPDATE = 'SCORE_UPDATE';
export const START_GAME = 'START_GAME';
export const PAUSE_GAME = 'PAUSE_GAME';
export const RESUME_GAME = 'RESUME_GAME';

// Action creators
export const keyDown = (key) => ({ type: KEY_DOWN, payload: { key } });
export const tick = () => ({ type: TICK });
export const moveSnake = (direction) => ({ type: MOVE_SNAKE, payload: { direction } });
export const eatFood = () => ({ type: EAT_FOOD });
export const collision = () => ({ type: COLLISION });
export const gameOver = () => ({ type: GAME_OVER });
export const scoreUpdate = (points) => ({ type: SCORE_UPDATE, payload: { points } });
export const startGame = () => ({ type: START_GAME });
export const pauseGame = () => ({ type: PAUSE_GAME });
export const resumeGame = () => ({ type: RESUME_GAME });

// Console logging helper
export const logAction = (action, prefix = 'Action') => {
    console.log(`%c ${prefix}: ${action.type}`, 'color: #00d9ff; font-weight: bold', action.payload || '');
};
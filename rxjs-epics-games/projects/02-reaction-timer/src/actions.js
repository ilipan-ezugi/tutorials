// src/actions.js
// Action types for the reaction timer game

export const START_GAME = 'START_GAME';
export const SHAPE_APPEARED = 'SHAPE_APPEARED';
export const CLICKED = 'CLICKED';
export const RECORD_TIME = 'RECORD_TIME';
export const RESET_GAME = 'RESET_GAME';
export const TOO_EARLY = 'TOO_EARLY';

// Action creators
export const startGame = () => ({ type: START_GAME });
export const shapeAppeared = () => ({ type: SHAPE_APPEARED });
export const clicked = () => ({ type: CLICKED });
export const recordTime = (ms) => ({ type: RECORD_TIME, payload: { ms } });
export const resetGame = () => ({ type: RESET_GAME });
export const tooEarly = () => ({ type: TOO_EARLY });

// Console logging helper
export const logAction = (action, prefix = 'Action') => {
    console.log(`%c ${prefix}: ${action.type}`, 'color: #00d9ff; font-weight: bold', action.payload || '');
};
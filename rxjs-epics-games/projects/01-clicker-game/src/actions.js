// src/actions.js
// Action types - the different kinds of events in our game
export const CLICK = 'CLICK';
export const INCREMENT_SCORE = 'INCREMENT_SCORE';
export const RESET = 'RESET';

// Action creators - helper functions to create action objects
export const clickAction = () => ({ type: CLICK });

export const incrementScore = (points) => ({ 
    type: INCREMENT_SCORE, 
    payload: { points } 
});

export const resetAction = () => ({ type: RESET });

// Console logging helper to see actions flow
export const logAction = (action) => {
    console.log(`%c Action: ${action.type}`, 'color: #00d9ff; font-weight: bold', action);
};
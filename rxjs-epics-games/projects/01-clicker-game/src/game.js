// src/game.js
// The main game engine - ties together actions, epics, and UI

import { Subject, merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { clickEpic, rootEpic } from './epics';
import { CLICK, INCREMENT_SCORE, RESET, logAction } from './actions';

// ============================================
// STEP 1: Create the Action Stream
// ============================================
// The action$ is the heart of our system - all actions flow through it
export const action$ = new Subject();

// ============================================
// STEP 2: Create the State Store
// ============================================
let state = {
    score: 0,
    clicks: 0
};

// ============================================
// STEP 3: Subscribe to Epic Output
// ============================================
// The epic returns a new stream of actions that we subscribe to
const epicOutput$ = rootEpic(action$);

epicOutput$.pipe(
    tap(action => {
        console.log('%c Epic Output → ', 'color: #00ff88; font-weight: bold', action.type);
    })
).subscribe(action => {
    // Handle each action type from the epic
    switch (action.type) {
        case INCREMENT_SCORE:
            state.score += action.payload.points;
            state.clicks++;
            console.log(`%c Score: ${state.score}`, 'color: #ffff00');
            updateDisplay();
            break;
            
        case 'RESET_COMPLETE':
            state.score = 0;
            state.clicks = 0;
            updateDisplay();
            break;
    }
});

// ============================================
// STEP 4: UI Event Handlers
// ============================================

// Handle button click - dispatch a CLICK action
function handleClick() {
    // This is the key moment - we send an action into the stream
    action$.next(clickAction());
    console.log('%c ← UI Event', 'color: #ff6b6b; font-weight: bold');
}

// Handle reset - dispatch a RESET action
function handleReset() {
    action$.next(resetAction());
}

// Update the display
function updateDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = state.score;
    }
}

// ============================================
// STEP 5: Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const clickBtn = document.getElementById('clickBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (clickBtn) {
        clickBtn.addEventListener('click', handleClick);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
    
    console.log('%c🎮 Clicker Game Initialized!', 'font-size: 16px; color: #00ff88');
    console.log('%cClick the button to see the action flow:', 'color: #888');
    console.log('  CLICK → Epic → INCREMENT_SCORE → State');
});

// Export for debugging
window.gameState = state;
window.action$ = action$;
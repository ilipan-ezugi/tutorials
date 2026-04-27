// src/game.js
// Reaction Timer Game Engine

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { gameTimerEpic, reactionTimerEpic, tooEarlyEpic } from './epics';
import {
    START_GAME,
    SHAPE_APPEARED,
    CLICKED,
    RECORD_TIME,
    RESET_GAME,
    TOO_EARLY,
    startGame,
    clicked,
    resetGame,
    logAction
} from './actions';

// ============================================
// Game State
// ============================================
let state = {
    isPlaying: false,
    shapeVisible: false,
    lastTime: null,
    bestTime: null,
    attempts: 0
};

// ============================================
// Action Stream
// ============================================
export const action$ = new Subject();

// ============================================
// Subscribe to Epics
// ============================================

// Main game timer epic
// FIX: dispatch the output action back into action$ so other epics can see SHAPE_APPEARED
const timerEpic$ = gameTimerEpic(action$);
timerEpic$.pipe(
    tap(action => logAction(action, 'Epic'))
).subscribe(action => {
    action$.next(action); // ← feed back into the stream!
    if (action.type === SHAPE_APPEARED) {
        state.shapeVisible = true;
        updateUI();
    }
});

// Reaction timer epic
// FIX: same — dispatch RECORD_TIME back so anything listening for it on action$ would see it
const reactionEpic$ = reactionTimerEpic(action$);
reactionEpic$.pipe(
    tap(action => logAction(action, 'Epic'))
).subscribe(action => {
    action$.next(action); // ← feed back into the stream!
    if (action.type === RECORD_TIME) {
        state.lastTime = action.payload.ms;
        state.attempts++;

        if (!state.bestTime || action.payload.ms < state.bestTime) {
            state.bestTime = action.payload.ms;
        }

        state.isPlaying = false;
        state.shapeVisible = false;
        updateUI();
    }
});

// Too early detection epic
const tooEarly$ = tooEarlyEpic(action$);
tooEarly$.pipe(
    tap(action => logAction(action, 'Epic'))
).subscribe(action => {
    action$.next(action); // ← consistent, even if nothing else listens for TOO_EARLY
    if (action.type === TOO_EARLY) {
        state.isPlaying = false;
        state.shapeVisible = false;
        showMessage('Too early! Wait for the shape...');
        updateUI();
    }
});

// ============================================
// UI Functions
// ============================================

function updateUI() {
    const gameArea = document.getElementById('gameArea');
    const message = document.getElementById('message');
    const shape = document.getElementById('shape');
    const startBtn = document.getElementById('startBtn');
    const lastTimeEl = document.getElementById('lastTime');
    const bestTimeEl = document.getElementById('bestTime');
    const attemptsEl = document.getElementById('attempts');

    // Update game area state
    gameArea.className = 'game-area';
    if (state.isPlaying && !state.shapeVisible) {
        gameArea.classList.add('waiting');
    } else if (state.shapeVisible) {
        gameArea.classList.add('ready');
    }

    // Update shape visibility
    shape.classList.toggle('visible', state.shapeVisible);

    // Update message
    if (state.isPlaying && !state.shapeVisible) {
        message.textContent = 'Wait for it...';
    } else if (state.shapeVisible) {
        message.textContent = 'CLICK NOW!';
    } else if (state.lastTime) {
        message.textContent = `Your time: ${state.lastTime}ms`;
    } else {
        message.textContent = 'Click "Start Game" to begin';
    }

    // Update stats
    lastTimeEl.textContent = state.lastTime !== null ? state.lastTime : '--';
    bestTimeEl.textContent = state.bestTime !== null ? state.bestTime : '--';
    attemptsEl.textContent = state.attempts;

    // Update button
    startBtn.disabled = state.isPlaying;
}

function showMessage(text) {
    const message = document.getElementById('message');
    message.textContent = text;
}

function handleStart() {
    if (state.isPlaying) return;

    state.isPlaying = true;
    state.shapeVisible = false;
    updateUI();

    console.log('%c 🚀 Starting game...', 'color: #00ff88');
    action$.next(startGame());
}

function handleGameAreaClick() {
    if (!state.isPlaying) return;

    if (state.shapeVisible) {
        // Good click - record time
        console.log('%c 👆 Clicked!', 'color: #00d9ff');
        action$.next(clicked());
    } else {
        // Too early - handled by epic
        console.log('%c 👆 Clicked too early!', 'color: #ff6b6b');
        action$.next(clicked()); // still dispatch so tooEarlyEpic can catch it
    }
}

function handleReset() {
    state = {
        isPlaying: false,
        shapeVisible: false,
        lastTime: null,
        bestTime: null,
        attempts: 0
    };
    updateUI();
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const gameArea = document.getElementById('gameArea');

    startBtn.addEventListener('click', handleStart);
    gameArea.addEventListener('click', handleGameAreaClick);

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (state.isPlaying && state.shapeVisible) {
                action$.next(clicked());
            } else if (!state.isPlaying) {
                handleStart();
            }
        }
    });

    console.log('%c⚡ Reaction Timer Initialized!', 'font-size: 16px; color: #00ff88');
    console.log('%cPress Space or click to play!', 'color: #888');
});

// Export for debugging
window.gameState = state;
window.action$ = action$;
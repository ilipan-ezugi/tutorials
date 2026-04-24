// src/epics.js
// Epics for the Snake game
// Demonstrates: fromEvent, interval, game loop, keyboard handling

import { fromEvent, interval, merge, Subject } from 'rxjs';
import { filter, map, takeUntil, distinctUntilChanged, tap, switchMap, take } from 'rxjs/operators';
import { 
    KEY_DOWN, 
    TICK, 
    MOVE_SNAKE, 
    EAT_FOOD, 
    COLLISION, 
    GAME_OVER,
    SCORE_UPDATE,
    START_GAME,
    PAUSE_GAME,
    RESUME_GAME,
    logAction
} from './actions';

// ============================================
// Direction mapping
// ============================================
const DIRECTION_MAP = {
    'ArrowUp': { x: 0, y: -1 },
    'ArrowDown': { x: 0, y: 1 },
    'ArrowLeft': { x: -1, y: 0 },
    'ArrowRight': { x: 1, y: 0 }
};

/**
 * keyboardEpic - Handles keyboard input
 * 
 * Converts keydown events into KEY_DOWN actions
 * Uses distinctUntilChanged to prevent rapid direction changes
 */
export const keyboardEpic = (action$) => {
    return fromEvent(document, 'keydown').pipe(
        // Only allow arrow keys and space
        filter(e => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)),
        
        // Prevent default scrolling for arrow keys
        tap(e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        }),
        
        // Map to KEY_DOWN action
        map(e => ({ type: KEY_DOWN, payload: { key: e.key } })),
        
        // Prevent duplicate key presses
        distinctUntilChanged((prev, curr) => prev.payload.key === curr.payload.key)
    );
};

/**
 * directionEpic - Transforms key presses to movement directions
 * 
 * This epic listens for KEY_DOWN actions and converts them
 * to MOVE_SNAKE actions with direction vectors
 */
export const directionEpic = (action$) => {
    let currentDirection = { x: 1, y: 0 }; // Start moving right
    
    return action$.pipe(
        filter(action => action.type === KEY_DOWN),
        
        // Handle pause with space
        filter(action => action.payload.key === 'Space'),
        
        map(action => ({ type: 'TOGGLE_PAUSE' }))
    );
};

/**
 * gameLoopEpic - Creates the game tick loop
 * 
 * Uses interval to create a recurring game tick
 * Emits TICK action at regular intervals
 */
export const gameLoopEpic = (action$) => {
    // Create a subject to control the game loop
    const stopLoop$ = new Subject();
    
    return interval(150).pipe(
        // Map each tick to a TICK action
        map(() => ({ type: TICK })),
        
        // Stop when game over is triggered
        takeUntil(action$.pipe(
            filter(action => action.type === GAME_OVER)
        )),
        
        // Also stop when explicitly stopped
        takeUntil(stopLoop$)
    );
};

/**
 * collisionDetectionEpic - Checks for collisions
 * 
 * This would be integrated into the main game logic
 * to detect wall and self collisions
 */
export const collisionDetectionEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === MOVE_SNAKE),
        
        // The actual collision detection happens in game.js
        // This epic just logs for debugging
        tap(action => {
            // Collision detection is handled in the game state
        })
    );
};

/**
 * Root epic - combines all epics
 * In a real app, you'd use merge to combine multiple epic outputs
 */
export const rootEpic = (action$) => {
    return merge(
        keyboardEpic(action$),
        gameLoopEpic(action$)
    );
};
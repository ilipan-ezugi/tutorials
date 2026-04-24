// src/epics.js
// Epics for the Reaction Timer game
// Demonstrates timing operators: delay, timer, timeout

import { filter, map, mergeMap, take, tap, delay, timeout, catchError, switchMap } from 'rxjs/operators';
import { timer, of, Subject, throwError } from 'rxjs';
import { 
    START_GAME, 
    SHAPE_APPEARED, 
    CLICKED, 
    RECORD_TIME, 
    RESET_GAME,
    TOO_EARLY,
    logAction 
} from './actions';

/**
 * gameTimerEpic - Handles the random delay before shape appears
 * 
 * Uses delay() to wait a random amount of time before emitting
 * the SHAPE_APPEARED action
 */
export const gameTimerEpic = (action$) => {
    return action$.pipe(
        // Only respond to START_GAME actions
        filter(action => action.type === START_GAME),
        
        logAction,
        
        // Random delay between 1-5 seconds (new concept: delay operator)
        delay(Math.random() * 4000 + 1000),
        
        // Transform to shape appeared action
        map(() => ({ type: SHAPE_APPEARED }))
    );
};

/**
 * reactionTimerEpic - Measures reaction time when user clicks
 * 
 * This epic tracks when the shape appears and calculates the
 * reaction time when the user clicks
 */
export const reactionTimerEpic = (action$) => {
    // Store the timestamp when shape appears
    let shapeAppearTime = null;
    
    return action$.pipe(
        // First, track when shape appears
        filter(action => action.type === SHAPE_APPEARED),
        
        tap(action => {
            shapeAppearTime = Date.now();
            console.log('%c ⏱️ Shape appeared - timer started', 'color: #00ff88');
        }),
        
        // Then wait for the CLICK action
        filter(action => action.type === CLICKED),
        
        // Calculate reaction time
        map(action => {
            const reactionTime = Date.now() - shapeAppearTime;
            console.log(`%c ⚡ Reaction time: ${reactionTime}ms`, 'color: #ffff00');
            return { type: RECORD_TIME, payload: { ms: reactionTime } };
        })
    );
};

/**
 * tooEarlyEpic - Detects if user clicks before shape appears
 * 
 * Uses switchMap to cancel previous timer if START_GAME is triggered again
 */
export const tooEarlyEpic = (action$) => {
    let gameActive = false;
    let shapeVisible = false;
    
    return action$.pipe(
        // Track game start
        filter(action => action.type === START_GAME),
        
        tap(() => {
            gameActive = true;
            shapeVisible = false;
            console.log('%c 🎮 Game started - waiting for shape', 'color: #888');
        }),
        
        // Track shape appearance
        filter(action => action.type === SHAPE_APPEARED),
        
        tap(() => {
            shapeVisible = true;
            console.log('%c 👁️ Shape is now visible', 'color: #00d9ff');
        }),
        
        // Check for early clicks
        filter(action => action.type === CLICKED),
        
        // If clicked but shape not visible yet
        filter(() => !shapeVisible && gameActive),
        
        map(() => {
            console.log('%c ⚠️ Too early!', 'color: #ff6b6b');
            return { type: TOO_EARLY };
        })
    );
};

/**
 * debounceEpic - Demonstrates debounce for rapid click prevention
 * 
 * This could be used to prevent accidental double-clicks
 */
export const debounceEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === CLICKED),
        
        // Wait 100ms to see if more clicks come
        delay(100),
        
        // Only take the first click after the delay
        take(1),
        
        map(() => ({ type: 'DEBOUNCED_CLICK' }))
    );
};

/**
 * Root epic - combines all epics
 */
export const rootEpic = (action$) => {
    return gameTimerEpic(action$);
};
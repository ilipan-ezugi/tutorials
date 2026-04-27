// src/epics.js
// Epics for the Reaction Timer game
// Demonstrates timing operators: delay, timer, timeout

// TODO: Import these operators from rxjs/operators:
// - filter, map, tap, delay, take
import { of, filter, map, tap, delay, take } from 'rxjs';
import {
    START_GAME,
    SHAPE_APPEARED,
    CLICKED,
    RECORD_TIME,
    TOO_EARLY,
    logAction
} from './actions';

/**
 * gameTimerEpic - Handles the random delay before shape appears
 * 
 * Your Task:
 * 1. Filter for START_GAME actions
 * 2. Apply delay() with Math.random() * 4000 + 1000 (1-5 seconds)
 * 3. Transform to SHAPE_APPEARED action
 * 4. Return the stream
 *
 * This is your first use of the delay() operator!
 */
export const gameTimerEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === 'START_GAME'),
        delay(Math.random() * 4000 + 1000),
        map(() => ({ type: 'SHAPE_APPEARED' })),
        tap(() => console.log('%c ⏱️ Shape appeared!', 'color: #00ff88'))
    );
};

/**
 * reactionTimerEpic - Measures reaction time when user clicks
 * 
 * Your Task:
 * 1. Create a variable to store: let shapeAppearTime = null;
 * 2. Filter for SHAPE_APPEARED and use tap() to capture: shapeAppearTime = Date.now()
 * 3. Then filter for CLICKED actions
 * 4. Use map() to calculate: const reactionTime = Date.now() - shapeAppearTime
 * 5. Return action: { type: RECORD_TIME, payload: { ms: reactionTime } }
 *
 * This demonstrates chaining multiple operations in one epic!
 */
export const reactionTimerEpic = (action$) => {
    let shapeAppearTime = null;

    // Stream 1: record when shape appears (side effect only, no output)
    action$.pipe(
        filter(action => action.type === 'SHAPE_APPEARED'),
        tap(() => {
            shapeAppearTime = Date.now();
            console.log('%c ⏱️ Timer started', 'color: #00ff88');
        })
    ).subscribe(); // just runs the side effect

    // Stream 2: when user clicks, calculate time since shape appeared
    return action$.pipe(
        filter(action => action.type === 'CLICKED'),
        filter(() => shapeAppearTime !== null), // safety guard
        map(() => {
            const reactionTime = Date.now() - shapeAppearTime;
            shapeAppearTime = null; // reset for next round
            console.log(`%c ⚡ Reaction time: ${reactionTime}ms`, 'color: #ffff00');
            return { type: RECORD_TIME, payload: { ms: reactionTime } };
        })
    );
};

/**
 * tooEarlyEpic - Detects if user clicks before shape appears
 * 
 * Your Task:
 * 1. Create state flags: gameActive = false, shapeVisible = false
 * 2. Filter for START_GAME, use tap() to set gameActive = true, shapeVisible = false
 * 3. Filter for SHAPE_APPEARED, use tap() to set shapeVisible = true
 * 4. Filter for CLICKED
 * 5. Only emit TOO_EARLY if: !shapeVisible && gameActive
 * 6. Map to: { type: TOO_EARLY }
 *
 * This is more complex - tracks game state across multiple action types!
 */
export const tooEarlyEpic = (action$) => {
    let gameActive = false;
    let shapeVisible = false;

    // Side effect: track START_GAME
    action$.pipe(
        filter(action => action.type === 'START_GAME'),
        tap(() => { gameActive = true; shapeVisible = false; })
    ).subscribe();

    // Side effect: track SHAPE_APPEARED
    action$.pipe(
        filter(action => action.type === 'SHAPE_APPEARED'),
        tap(() => { shapeVisible = true; })
    ).subscribe();

    // Output stream: only emit TOO_EARLY on early clicks
    return action$.pipe(
        filter(action => action.type === 'CLICKED'),
        filter(() => !shapeVisible && gameActive),
        map(() => ({ type: 'TOO_EARLY' }))
    );
};

/**
 * rootEpic - combines all epics
 * 
 * TODO: Use merge() to combine all three epics so they work together!
 */
export const rootEpic = (action$) => {
    // TODO: Return merge of gameTimerEpic, reactionTimerEpic, and tooEarlyEpic
    return merge(
        gameTimerEpic(action$),
        reactionTimerEpic(action$),
        tooEarlyEpic(action$)
    );
};
// src/epics.js
// Epics are long-running observables that listen to the action stream
// and transform them into other actions or side effects

import { filter, map, delay, mergeMap, tap } from 'rxjs/operators';
import { of, interval } from 'rxjs';
import { CLICK, INCREMENT_SCORE, RESET, logAction } from './actions';

/**
 * clickEpic - The main game epic
 * 
 * This epic listens for CLICK actions and transforms them into
 * INCREMENT_SCORE actions. This is the core pattern of Redux-Observable.
 * 
 * @param {Observable} action$ - The stream of all actions
 * @returns {Observable} - A stream of new actions
 */
export const clickEpic = (action$) => {
    return action$.pipe(
        // Step 1: Filter - only let CLICK actions through
        filter(action => action.type === CLICK),
        
        // Log for debugging
        tap(action => logAction(action)),
        
        // Step 2: Transform - convert CLICK to INCREMENT_SCORE
        map(action => ({
            type: INCREMENT_SCORE,
            payload: { points: 1 }
        })),
        
        // Log the transformed action
        tap(action => logAction(action))
    );
};

/**
 * bonusPointsEpic - Adds bonus points for rapid clicking
 * 
 * This demonstrates more advanced epic patterns with timing
 */
export const bonusPointsEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === CLICK),
        
        // Add a small delay to "batch" rapid clicks
        delay(100),
        
        // Could add bonus logic here
        map(action => ({
            type: 'BONUS_POINTS',
            payload: { bonus: 0 } // Placeholder for bonus logic
        }))
    );
};

/**
 * resetEpic - Handles game reset
 */
export const resetEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === RESET),
        tap(action => logAction(action)),
        map(action => ({
            type: 'RESET_COMPLETE',
            payload: {}
        }))
    );
};

/**
 * Combine all epics into one
 */
export const rootEpic = (action$) => {
    return clickEpic(action$);
};
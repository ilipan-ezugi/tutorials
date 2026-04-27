// src/epics.js
// Epics are long-running observables that listen to the action stream
// and transform them into other actions or side effects

// TODO: Import the necessary operators from rxjs/operators
// You'll need: filter, map, tap, merge
import { of, merge } from 'rxjs';
import { CLICK, INCREMENT_SCORE, RESET, logAction } from './actions';

/**
 * clickEpic - The main game epic
 * 
 * Your Task:
 * 1. Listen to the action stream (action$)
 * 2. Filter for CLICK actions
 * 3. Transform each CLICK into an INCREMENT_SCORE action with payload { points: 1 }
 * 4. Return the new action stream
 *
 * @param {Observable} action$ - The stream of all actions
 * @returns {Observable} - A stream of new actions
 *
 * Hint: Use action$.pipe(filter(...), map(...))
 * Reference: see INSTRUCTIONS.md
 */
export const clickEpic = (action$) => {
    // TODO: Implement this epic
    // Step 1: Filter for CLICK actions using filter()
    // Step 2: Transform to INCREMENT_SCORE using map()
    return of(); // Placeholder - replace with your implementation
};

/**
 * resetEpic - Handles game reset
 *
 * Your Task:
 * 1. Filter for RESET actions
 * 2. Transform to RESET_COMPLETE action with empty payload
 * 3. Return the new action stream
 */
export const resetEpic = (action$) => {
    // TODO: Implement this epic
    // Similar pattern to clickEpic, but filter for RESET
    return of(); // Placeholder - replace with your implementation
};

/**
 * rootEpic - Combines all epics
 *
 * Your Task:
 * Use merge() to combine clickEpic and resetEpic
 * so that both epics process actions simultaneously
 * 
 * This is how you handle multiple epics working together!
 */
export const rootEpic = (action$) => {
    // TODO: Combine both epics using merge()
    return merge(
        clickEpic(action$),
        resetEpic(action$)
    );
};
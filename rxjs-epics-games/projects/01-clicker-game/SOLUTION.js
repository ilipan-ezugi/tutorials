// SOLUTION.js - Complete working implementation
// If you get stuck, compare your epics.js with this solution!

import { filter, map, tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { CLICK, INCREMENT_SCORE, RESET, logAction } from './actions';

/**
 * SOLUTION: clickEpic
 * 
 * This is how the clickEpic should be implemented.
 * It listens for CLICK actions and transforms them into INCREMENT_SCORE actions.
 */
export const clickEpic = (action$) => {
    return action$.pipe(
        // Step 1: Filter - only let CLICK actions through
        filter(action => action.type === CLICK),
        
        // Optional: Log the incoming action for debugging
        tap(action => console.log('%c ← CLICK received', 'color: #ff6b6b')),
        
        // Step 2: Transform - convert CLICK to INCREMENT_SCORE
        map(action => ({
            type: INCREMENT_SCORE,
            payload: { points: 1 }
        })),
        
        // Optional: Log the output for debugging
        tap(action => console.log('%c → INCREMENT_SCORE created', 'color: #00ff88'))
    );
};

/**
 * SOLUTION: resetEpic
 * 
 * This epic handles the RESET action by transforming it to RESET_COMPLETE.
 */
export const resetEpic = (action$) => {
    return action$.pipe(
        // Filter for RESET actions
        filter(action => action.type === RESET),
        
        // Log for debugging
        tap(action => logAction(action)),
        
        // Transform to RESET_COMPLETE
        map(action => ({
            type: 'RESET_COMPLETE',
            payload: {}
        }))
    );
};

/**
 * SOLUTION: rootEpic
 * 
 * Combines both epics using merge() so they work together.
 * This is the pattern for coordinating multiple epics!
 */
export const rootEpic = (action$) => {
    return merge(
        clickEpic(action$),
        resetEpic(action$)
    );
};

// ============================================
// EXPLANATION OF THE EPIC PATTERN
// ============================================

/*
WHAT HAPPENS WHEN YOU CLICK:

1. User clicks button
   ↓
2. handleClick() fires: action$.next(clickAction())
   ↓
3. action$ stream emits { type: CLICK }
   ↓
4. rootEpic receives the action through clickEpic
   ↓
5. clickEpic processes:
   a) filter: Does action.type === CLICK? YES ✓
   b) map: Create new action { type: INCREMENT_SCORE, payload: { points: 1 } }
   ↓
6. epicOutput$ emits the new action
   ↓
7. game.js switch statement receives INCREMENT_SCORE
   ↓
8. State updates: state.score += 1
   ↓
9. updateDisplay() runs, UI shows new score
   ↓
10. Done! ✨

KEY CONCEPTS:

- Epics are pure functions that take action$ and return a new observable
- They use operators like filter(), map(), delay(), etc.
- filter() checks a condition, map() transforms data
- merge() combines multiple epic outputs into one stream
- This pattern decouples "what should happen" from "how to update the state"

BENEFITS:

- Testable: Each epic is a pure function
- Composable: Easy to add new epics
- Observable: Can see exactly what actions flow through the system
- Powerful: Can handle complex async logic elegantly
*/

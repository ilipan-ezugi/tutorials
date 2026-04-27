// src/epics.js
// Epics for the Reaction Timer game
// Demonstrates timing operators: delay, timer, timeout

// TODO: Import these operators from rxjs/operators:
// - filter, map, tap, delay, take
import { of } from 'rxjs';
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
    // TODO: Implement
    // Hint: action$.pipe(
    //   filter(...),
    //   delay(...),
    //   map(...)
    // )
    return of(); // Placeholder
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
    // TODO: Implement
    // Create a variable to store the appearance time
    let shapeAppearTime = null;
    
    // TODO: Build the pipe:
    // 1. filter(SHAPE_APPEARED)
    // 2. tap to set shapeAppearTime = Date.now()
    // 3. filter(CLICKED)
    // 4. map to calculate and return RECORD_TIME action
    
    return of(); // Placeholder
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
    // TODO: Create state flags
    let gameActive = false;
    let shapeVisible = false;
    
    return action$.pipe(
        // TODO: Implement the full logic
        // Start with filtering and updating state
        // Then chain to detect early clicks
    );
};

/**
 * rootEpic - combines all epics
 * 
 * TODO: Use merge() to combine all three epics so they work together!
 */
export const rootEpic = (action$) => {
    // TODO: Return merge of gameTimerEpic, reactionTimerEpic, and tooEarlyEpic
    return of(); // Placeholder
};
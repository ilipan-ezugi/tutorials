// SOLUTION.js - Complete working implementation for Reaction Timer

import { filter, map, tap, delay, merge } from 'rxjs/operators';
import { of } from 'rxjs';
import { 
    START_GAME, 
    SHAPE_APPEARED, 
    CLICKED, 
    RECORD_TIME, 
    TOO_EARLY
} from './actions';

/**
 * SOLUTION: gameTimerEpic
 * 
 * Waits for a random delay (1-5 seconds) before emitting SHAPE_APPEARED.
 * This is where we first see the power of the delay() operator!
 */
export const gameTimerEpic = (action$) => {
    return action$.pipe(
        // Only respond to START_GAME actions
        filter(action => action.type === START_GAME),
        
        // Random delay between 1-5 seconds
        delay(Math.random() * 4000 + 1000),
        
        // Transform to shape appeared action
        map(() => ({ type: SHAPE_APPEARED })),
        
        // Log for debugging
        tap(() => console.log('%c ⏱️ Shape appeared!', 'color: #00ff88'))
    );
};

/**
 * SOLUTION: reactionTimerEpic
 * 
 * Measures reaction time by:
 * 1. Recording when shape appears
 * 2. Waiting for click
 * 3. Calculating the elapsed time
 * 
 * This demonstrates state management within an epic!
 */
export const reactionTimerEpic = (action$) => {
    // Store the timestamp when shape appears
    let shapeAppearTime = null;
    
    return action$.pipe(
        // First, track when shape appears
        filter(action => action.type === SHAPE_APPEARED),
        
        // Use tap() to capture the time without transforming the action
        tap(action => {
            shapeAppearTime = Date.now();
            console.log('%c ⏱️ Timer started', 'color: #00ff88');
        }),
        
        // Now wait for the CLICK action
        // NOTE: This is chained filtering!
        filter(action => action.type === CLICKED),
        
        // Calculate reaction time
        map(action => {
            const reactionTime = Date.now() - shapeAppearTime;
            console.log(`%c ⚡ Reaction time: ${reactionTime}ms`, 'color: #ffff00');
            return { 
                type: RECORD_TIME, 
                payload: { ms: reactionTime } 
            };
        })
    );
};

/**
 * SOLUTION: tooEarlyEpic
 * 
 * Detects and prevents scoring for clicking before shape appears.
 * 
 * This is a more advanced pattern that tracks state across multiple
 * action types in a single epic!
 */
export const tooEarlyEpic = (action$) => {
    let gameActive = false;
    let shapeVisible = false;
    
    return action$.pipe(
        // This epic processes ALL actions, filtering at different steps
        // Step 1: Track when game starts
        tap(action => {
            if (action.type === START_GAME) {
                gameActive = true;
                shapeVisible = false;
                console.log('%c 🎮 Game started - waiting for shape', 'color: #888');
            }
        }),
        
        // Step 2: Track when shape becomes visible
        tap(action => {
            if (action.type === SHAPE_APPEARED) {
                shapeVisible = true;
                console.log('%c 👁️ Shape is visible', 'color: #00d9ff');
            }
        }),
        
        // Step 3: Check for clicks that happen too early
        filter(action => action.type === CLICKED),
        filter(action => {
            // Only emit TOO_EARLY if conditions are met
            return !shapeVisible && gameActive;
        }),
        
        map(() => {
            console.log('%c ⚠️ Too early!', 'color: #ff6b6b');
            return { type: TOO_EARLY };
        })
    );
};

/**
 * SOLUTION: rootEpic
 * 
 * Combines all three epics using merge() so they all run in parallel!
 */
export const rootEpic = (action$) => {
    return merge(
        gameTimerEpic(action$),
        reactionTimerEpic(action$),
        tooEarlyEpic(action$)
    );
};

// ============================================
// LEARNING NOTES
// ============================================

/*
KEY PATTERNS:

1. THE delay() OPERATOR:
   - Pauses the observable stream for X milliseconds
   - Perfect for timed events
   - Works like: action$ -> delay(1000) -> emits after 1 second

2. STATE TRACKING IN EPICS:
   - You can create variables in the epic scope
   - Use tap() to update these without transforming the action
   - Use these variables in filter() conditions
   
3. CHAINED FILTERING:
   - You can have multiple filter() calls in sequence
   - First filters for SHAPE_APPEARED
   - Later filters for CLICKED
   - Creates a dependent relationship
   
4. COMPLEX STATE MANAGEMENT:
   - The tooEarlyEpic shows how to track multiple state flags
   - Use tap() to update state
   - Use filter() to decide if action should pass through
   - This pattern scales to complex game logic

THE EPIC FLOW FOR REACTION TIMER:

Game Start:
  1. User clicks "Start Game"
  2. action$ emits START_GAME
  3. gameTimerEpic receives it, applies delay()
  4. After delay, emits SHAPE_APPEARED
  
When Shape Appears:
  1. SHAPE_APPEARED is emitted
  2. reactionTimerEpic captures: shapeAppearTime = Date.now()
  3. tooEarlyEpic sets: shapeVisible = true
  
User Clicks:
  1. action$ emits CLICKED
  2. reactionTimerEpic calculates: Date.now() - shapeAppearTime
  3. reactionTimerEpic emits: RECORD_TIME with reaction time
  4. OR if too early, tooEarlyEpic emits: TOO_EARLY
  
Result:
  - game.js receives the action and updates display
  - "Your time: 250ms" or "Too early!"

This pattern is incredibly powerful for game development!
*/

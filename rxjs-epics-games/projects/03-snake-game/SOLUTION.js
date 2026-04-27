// SOLUTION.js - Snake Game Complete Implementation

import { fromEvent, interval, merge } from 'rxjs';
import { filter, map, tap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { KEY_DOWN, TICK, MOVE_SNAKE, GAME_OVER } from './actions';

// Direction mapping
const DIRECTION_MAP = {
    'ArrowUp': { x: 0, y: -1 },
    'ArrowDown': { x: 0, y: 1 },
    'ArrowLeft': { x: -1, y: 0 },
    'ArrowRight': { x: 1, y: 0 }
};

/**
 * SOLUTION: keyboardEpic
 * 
 * Converts DOM keydown events into KEY_DOWN actions.
 * This is a bridge between the browser and our RxJS stream!
 */
export const keyboardEpic = (action$) => {
    return fromEvent(document, 'keydown').pipe(
        // Only allow arrow keys and space
        filter(e => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)),
        
        // Prevent default browser behavior (scrolling on arrows)
        tap(e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        }),
        
        // Transform DOM event to KEY_DOWN action
        map(e => ({ type: KEY_DOWN, payload: { key: e.key } })),
        
        // Prevent sending duplicate keys (important for fast repeat events!)
        distinctUntilChanged((prev, curr) => prev.payload.key === curr.payload.key)
    );
};

/**
 * SOLUTION: directionEpic
 * 
 * Transforms KEY_DOWN actions into MOVE_SNAKE actions with direction vectors.
 * This separates "what key was pressed" from "where should we go"
 */
export const directionEpic = (action$) => {
    return action$.pipe(
        // Only process KEY_DOWN actions
        filter(action => action.type === KEY_DOWN),
        
        // Only process arrow keys (not space)
        filter(action => Object.keys(DIRECTION_MAP).includes(action.payload.key)),
        
        // Use the DIRECTION_MAP to convert key to direction
        map(action => ({
            type: MOVE_SNAKE,
            payload: {
                direction: DIRECTION_MAP[action.payload.key]
            }
        })),
        
        // Log for debugging
        tap(action => console.log('%c 🐍 Direction:', 'color: #00ff88', action.payload.direction))
    );
};

/**
 * SOLUTION: gameLoopEpic
 * 
 * Creates the game's heartbeat using interval().
 * This is called a "ticker" or "frame loop" - the clock that drives everything!
 */
export const gameLoopEpic = (action$) => {
    let tickCount = 0;
    
    return interval(150).pipe(
        // Create TICK actions
        map(() => {
            tickCount++;
            return { type: TICK, payload: { tick: tickCount } };
        }),
        
        // Log every 10 ticks to see game speed (without spamming console)
        tap(action => {
            if (tickCount % 10 === 0) {
                console.log('%c ⏱️ Ticks:', 'color: #00d9ff', tickCount);
            }
        }),
        
        // Stop the interval when GAME_OVER is received
        takeUntil(action$.pipe(
            filter(action => action.type === GAME_OVER),
            tap(() => console.log('%c 💀 Game loop stopped', 'color: #ff6b6b'))
        ))
    );
};

/**
 * SOLUTION: rootEpic
 * 
 * Merges all epics so they work in parallel:
 * - Keyboard epic listens for keypresses
 * - Direction epic transforms keys to directions
 * - Game loop epic provides the heartbeat
 * 
 * All three work simultaneously!
 */
export const rootEpic = (action$) => {
    return merge(
        keyboardEpic(action$),
        directionEpic(action$),
        gameLoopEpic(action$)
    );
};

// ============================================
// LEARNING NOTES
// ============================================

/*
KEY PATTERNS:

1. FROMEVENT - DOM BRIDGE:
   fromEvent(element, 'eventName') creates an observable of DOM events
   Perfect for: clicks, key presses, mouse movement, scrolling, etc.
   
2. INTERVAL - GAME LOOPS:
   interval(ms) emits a value every N milliseconds
   Perfect for: game ticks, animation frames, heartbeats
   
3. DISTINCTUNTILCHANGED - DEDUPLICATION:
   Prevents the same value from being emitted twice in a row
   Perfect for: preventing rapid key repeats, input debouncing
   
4. TAKEUNTIL - STOPPING CONDITIONS:
   Stops the observable when another observable emits
   Perfect for: stopping timers, cleanup on game over
   
5. MULTI-SOURCE COORDINATION:
   Multiple epics working on the same action stream
   Each can filter for what it cares about
   merge() combines all outputs

THE GAME LOOP FLOW:

Every 150ms:
  ↓
interval(150) emits
  ↓
gameLoopEpic: TICK action
  ↓
Meanwhile:
  User presses key
  ↓
keyboardEpic: KEY_DOWN action
  ↓
directionEpic: MOVE_SNAKE action
  ↓
game.js:
  - Processes both TICK and MOVE_SNAKE
  - Updates snake position
  - Checks collisions
  - Updates display
  
This architecture is used in MANY game engines!

PERFORMANCE NOTES:

- The 150ms interval is configurable (faster = harder game)
- distinctUntilChanged prevents duplicate processing
- takeUntil(GAME_OVER) ensures cleanup (important for memory!)
- Logging only every N ticks keeps console readable

You now have the foundation for building complex interactive games!
*/

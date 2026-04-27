// src/epics.js
// Epics for the Snake game
// Demonstrates: fromEvent, interval, game loop, keyboard handling

// TODO: Import operators and functions:
// - filter, map, tap, distinctUntilChanged, takeUntil, merge
// - fromEvent, interval
import { of, merge } from 'rxjs';
import { 
    KEY_DOWN, 
    TICK, 
    MOVE_SNAKE, 
    GAME_OVER
} from './actions';

// Direction mapping - convert key names to movement vectors
const DIRECTION_MAP = {
    'ArrowUp': { x: 0, y: -1 },
    'ArrowDown': { x: 0, y: 1 },
    'ArrowLeft': { x: -1, y: 0 },
    'ArrowRight': { x: 1, y: 0 }
};

/**
 * keyboardEpic - Handles keyboard input
 * 
 * Your Task:
 * 1. Use fromEvent(document, 'keydown') to listen for key presses
 * 2. Filter for arrow keys and space: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']
 * 3. Use tap() to call preventDefault() on arrow keys (stops page scrolling)
 * 4. Map events to KEY_DOWN actions with payload.key
 * 5. Use distinctUntilChanged() to prevent duplicate key events
 *
 * This is your first use of fromEvent() - connecting DOM to RxJS!
 */
export const keyboardEpic = (action$) => {
    // TODO: Implement
    // Return fromEvent(document, 'keydown').pipe(...)
    return of(); // Placeholder
};

/**
 * directionEpic - Transforms key presses to movement directions
 * 
 * Your Task:
 * 1. Filter for KEY_DOWN actions only
 * 2. Filter for arrow keys only (not space)
 * 3. Use DIRECTION_MAP to convert key to direction vector
 * 4. Transform to MOVE_SNAKE actions with direction payload
 *
 * This demonstrates converting one action type to another!
 */
export const directionEpic = (action$) => {
    // TODO: Implement
    // return action$.pipe(
    //   filter(...),
    //   filter(...),
    //   map(...)
    // )
    return of(); // Placeholder
};

/**
 * gameLoopEpic - Creates the game tick loop
 * 
 * Your Task:
 * 1. Use interval(150) to create a timer that emits every 150ms
 * 2. Map each emission to a TICK action
 * 3. Use takeUntil() to stop when GAME_OVER is received
 * 4. Log occasionally for debugging (but not every tick!)
 *
 * This is the heartbeat of your game!
 */
export const gameLoopEpic = (action$) => {
    // TODO: Implement
    // return interval(150).pipe(
    //   map(...),
    //   takeUntil(action$.pipe(filter(...)))
    // )
    return of(); // Placeholder
};

/**
 * rootEpic - Combines all epics
 * 
 * TODO: Use merge() to combine keyboardEpic, directionEpic, and gameLoopEpic
 * so they all work together in parallel!
 */
export const rootEpic = (action$) => {
    // TODO: Return merge of all epics
    return of(); // Placeholder
};
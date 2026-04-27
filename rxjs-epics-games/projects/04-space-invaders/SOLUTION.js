// SOLUTION.js - Space Invaders Complete Implementation

import { fromEvent, interval, merge } from 'rxjs';
import { filter, map, tap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { KEY_DOWN, TICK, FIRE, MOVE_BULLETS, MOVE_ENEMIES, ENEMY_FIRE, GAME_OVER } from './actions';

/**
 * SOLUTION: keyboardEpic
 * 
 * Converts DOM keyboard events into KEY_DOWN actions.
 * This is the interface between the player and the game!
 */
export const keyboardEpic = (action$) => {
    return fromEvent(document, 'keydown').pipe(
        // Only listen for relevant keys
        filter(e => ['ArrowLeft', 'ArrowRight', 'Space', 'KeyP'].includes(e.code)),
        
        // Prevent default for arrow keys (don't scroll page)
        tap(e => {
            if (e.code !== 'Space') e.preventDefault();
        }),
        
        // Transform to KEY_DOWN action
        map(e => ({ type: KEY_DOWN, payload: { key: e.code } })),
        
        // Prevent duplicate key events
        distinctUntilChanged((prev, curr) => prev.payload.key === curr.payload.key)
    );
};

/**
 * SOLUTION: playerMovementEpic
 * 
 * Filters for arrow key presses and transforms them into movement commands.
 * Example of action chaining: KEY_DOWN → MOVE_PLAYER
 */
export const playerMovementEpic = (action$) => {
    return action$.pipe(
        // Only process KEY_DOWN actions
        filter(action => action.type === KEY_DOWN),
        
        // Only process arrow keys
        filter(action => ['ArrowLeft', 'ArrowRight'].includes(action.payload.key)),
        
        // Transform to movement with direction: -1 (left) or 1 (right)
        map(action => ({
            type: 'MOVE_PLAYER',
            payload: { 
                direction: action.payload.key === 'ArrowLeft' ? -1 : 1 
            }
        })),
        
        // Log for debugging
        tap(action => console.log('%c 🚀 Player:', 'color: #feca57', 'direction', action.payload.direction))
    );
};

/**
 * SOLUTION: shootingEpic
 * 
 * Detects spacebar and fires a bullet.
 * One of the simplest epics, but critical to gameplay!
 */
export const shootingEpic = (action$) => {
    return action$.pipe(
        // Only process KEY_DOWN actions
        filter(action => action.type === KEY_DOWN),
        
        // Only process spacebar
        filter(action => action.payload.key === 'Space'),
        
        // Transform to FIRE action
        map(() => ({ type: FIRE })),
        
        // Log for debugging
        tap(() => console.log('%c 🔫 Fire!', 'color: #feca57'))
    );
};

/**
 * SOLUTION: gameLoopEpic
 * 
 * Creates the game's heartbeat at 20 FPS (50ms per frame).
 * This is the master clock that synchronizes everything!
 */
export const gameLoopEpic = (action$) => {
    let frameCount = 0;
    
    return interval(50).pipe(
        // Create TICK action for each frame
        map(() => {
            frameCount++;
            return { type: TICK, payload: { frame: frameCount } };
        }),
        
        // Log occasionally (every 20 frames = 1 second)
        tap(action => {
            if (frameCount % 20 === 0) {
                console.log('%c ⏱️ Frame:', 'color: #00d9ff', frameCount);
            }
        }),
        
        // Stop the game loop when GAME_OVER
        takeUntil(action$.pipe(
            filter(a => a.type === GAME_OVER),
            tap(() => console.log('%c 💥 Game Over', 'color: #ff6b6b'))
        ))
    );
};

/**
 * SOLUTION: bulletMovementEpic
 * 
 * On each game tick, tells the game to update bullet positions.
 * Responds to TICK, emits MOVE_BULLETS.
 */
export const bulletMovementEpic = (action$) => {
    return action$.pipe(
        // Only on game ticks
        filter(action => action.type === TICK),
        
        // Tell game to move bullets
        map(() => ({ type: MOVE_BULLETS }))
    );
};

/**
 * SOLUTION: enemyMovementEpic
 * 
 * On each game tick, tells the game to update enemy positions.
 * Independent of bullet movement - they happen simultaneously!
 */
export const enemyMovementEpic = (action$) => {
    return action$.pipe(
        // Only on game ticks
        filter(action => action.type === TICK),
        
        // Tell game to move enemies
        map(() => ({ type: MOVE_ENEMIES }))
    );
};

/**
 * SOLUTION: enemyFiringEpic
 * 
 * Randomly fires enemy bullets based on a probability.
 * This creates pseudo-random enemy behavior!
 * 
 * With 50ms ticks and 2% chance:
 * - Average time between shots: ~2.5 seconds
 * - Creates unpredictable enemy patterns
 */
export const enemyFiringEpic = (action$) => {
    let bulletsFired = 0;
    
    return action$.pipe(
        // Only check on game ticks
        filter(action => action.type === TICK),
        
        // Random chance: 2% per tick
        filter(() => Math.random() < 0.02),
        
        // Transform to ENEMY_FIRE action
        map(() => {
            bulletsFired++;
            return { type: ENEMY_FIRE, payload: { bulletsFired } };
        }),
        
        // Log for debugging
        tap(action => console.log('%c 🔴 Enemy fired!', 'color: #ff9ff3', action.payload.bulletsFired))
    );
};

/**
 * SOLUTION: collisionDetectionEpic
 * 
 * Triggers collision checking when bullets move.
 * The actual collision logic happens in game.js
 * This epic just ensures we check every frame when bullets exist.
 */
export const collisionDetectionEpic = (action$) => {
    return action$.pipe(
        // After bullets move each frame
        filter(action => action.type === MOVE_BULLETS),
        
        // Trigger collision detection
        map(() => ({ type: 'CHECK_COLLISIONS' }))
    );
};

/**
 * SOLUTION: rootEpic
 * 
 * The maestro of the game - coordinates all 8 epics!
 * 
 * This is the pattern for building complex interactive systems:
 * - Each epic is independent (single responsibility)
 * - All run simultaneously (through merge)
 * - Each listens to the action stream
 * - Together they create complex behavior from simple pieces
 */
export const rootEpic = (action$) => {
    return merge(
        keyboardEpic(action$),           // 1. Listen to keyboard
        playerMovementEpic(action$),     // 2. Process player movement
        shootingEpic(action$),           // 3. Process shooting
        gameLoopEpic(action$),           // 4. Game heartbeat
        bulletMovementEpic(action$),     // 5. Move bullets
        enemyMovementEpic(action$),      // 6. Move enemies
        enemyFiringEpic(action$),        // 7. Random enemy fire
        collisionDetectionEpic(action$)  // 8. Check collisions
    );
};

// ============================================
// LEARNING NOTES
// ============================================

/*
ARCHITECTURE PATTERNS:

1. SINGLE RESPONSIBILITY:
   Each epic does ONE thing
   - keyboardEpic: Listen to keys
   - playerMovementEpic: Transform keys to movement
   - shootingEpic: Handle firing
   
2. COMPOSITION:
   Combine simple pieces into complex behaviors
   8 independent epics = powerful game engine

3. SIMULTANEOUS EXECUTION:
   merge() doesn't sequence - it combines!
   All 8 epics work at the SAME TIME
   
4. EVENT-DRIVEN:
   Everything flows from the action stream
   No direct coupling between epics
   Easy to add/remove/modify epics

THE GAME LOOP:

Every 50ms:
  ├─ interval() emits
  ├─ gameLoopEpic creates TICK
  ├─ bulletMovementEpic: MOVE_BULLETS
  ├─ enemyMovementEpic: MOVE_ENEMIES
  ├─ enemyFiringEpic: maybe ENEMY_FIRE (2%)
  └─ collisionDetectionEpic: CHECK_COLLISIONS

Meanwhile (asynchronously):
  └─ User presses key
     └─ keyboardEpic: KEY_DOWN
        ├─ playerMovementEpic: MOVE_PLAYER
        └─ shootingEpic: FIRE

All these actions feed back into game.js
which updates the game state and display!

REAL-WORLD APPLICATIONS:

This pattern is used in:
- Redux Observable (official RxJS middleware)
- Video games (some use similar reactive patterns)
- Real-time applications (trading, monitoring, etc.)
- UI frameworks (reactive programming)
- Multiplayer games (coordinating player actions)

You've now learned professional game development architecture!
*/

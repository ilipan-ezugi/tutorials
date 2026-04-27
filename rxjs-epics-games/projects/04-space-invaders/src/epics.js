// src/epics.js
// Epics for Space Invaders game
// Demonstrates: merge, coordinating multiple epics, complex interactions

// TODO: Import from rxjs:
// - fromEvent, interval, merge
// TODO: Import operators:
// - filter, map, tap, distinctUntilChanged, takeUntil, withLatestFrom
import { of, fromEvent, interval, merge, filter, map, tap, distinctUntilChanged, takeUntil, withLatestFrom } from 'rxjs';
import {
    KEY_DOWN,
    TICK,
    FIRE,
    MOVE_BULLETS,
    MOVE_ENEMIES,
    ENEMY_FIRE,
    GAME_OVER
} from './actions';

/**
 * keyboardEpic - Handles player keyboard input
 * 
 * Your Task:
 * 1. Use fromEvent(document, 'keydown')
 * 2. Filter for: 'ArrowLeft', 'ArrowRight', 'Space', 'KeyP'
 * 3. Prevent default for arrow keys
 * 4. Transform to KEY_DOWN action with key code
 * 5. Use distinctUntilChanged to prevent rapid repeats - not needed!
 */
export const keyboardEpic = (action$) => {
    return fromEvent(document, 'keydown').pipe(
        filter(e => ['ArrowLeft', 'ArrowRight', 'Space', 'KeyP'].includes(e.code)),
        tap(e => {
            if (e.code !== 'Space') e.preventDefault();
        }),
        map(e => ({ type: KEY_DOWN, payload: { key: e.code } })),
    );
};

/**
 * playerMovementEpic - Handles player movement from key presses
 * 
 * Your Task:
 * 1. Filter for KEY_DOWN actions
 * 2. Filter for 'ArrowLeft' or 'ArrowRight' only
 * 3. Transform to MOVE_PLAYER action
 * 4. Include direction: -1 for left, 1 for right
 */
export const playerMovementEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === KEY_DOWN),
        filter(action => ['ArrowLeft', 'ArrowRight'].includes(action.payload.key)),
        map(action => ({
            type: 'MOVE_PLAYER',
            payload: {
                direction: action.payload.key === 'ArrowLeft' ? -1 : 1
            }
        })),
        tap(action => console.log('%c 🚀 Player:', 'color: #feca57', 'direction', action.payload.direction))
    );
};

/**
 * shootingEpic - Handles player shooting
 * 
 * Your Task:
 * 1. Filter for KEY_DOWN actions
 * 2. Check if action.payload.key === 'Space'
 * 3. Transform to FIRE action
 */
export const shootingEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === KEY_DOWN),
        filter(action => action.payload.key === 'Space'),
        map(() => ({ type: FIRE })),
        tap(() => console.log('%c 🔫 Fire!', 'color: #feca57'))
    );
};

/**
 * gameLoopEpic - Creates the main game tick
 * 
 * Your Task:
 * 1. Use interval(50) for 50ms ticks
 * 2. Map to TICK action
 * 3. Stop when GAME_OVER using takeUntil()
 */
export const gameLoopEpic = (action$) => {
    return interval(50).pipe(
        map(() => ({ type: TICK })),
        takeUntil(action$.pipe(filter(action => action.type === GAME_OVER)))
    );
};

/**
 * bulletMovementEpic - Moves player bullets
 * 
 * Your Task:
 * 1. Filter for TICK actions
 * 2. Map to MOVE_BULLETS action
 */
export const bulletMovementEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === TICK),
        map(() => ({ type: MOVE_BULLETS }))
    );
};

/**
 * enemyMovementEpic - Moves enemies
 * 
 * Your Task:
 * 1. Filter for TICK actions
 * 2. Map to MOVE_ENEMIES action
 */
export const enemyMovementEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === TICK),
        map(() => ({ type: MOVE_ENEMIES }))
    );
};

/**
 * enemyFiringEpic - Random enemy firing
 * 
 * Your Task:
 * 1. Filter for TICK actions
 * 2. Random chance: Math.random() < 0.02 (2% per tick)
 * 3. Map to ENEMY_FIRE action
 *
 * This creates pseudo-random enemy behavior!
 */
export const enemyFiringEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === TICK),
        filter(() => Math.random() < 0.02),
        map(() => ({ type: ENEMY_FIRE })),
        tap(() => console.log('%c 👾 Enemy fired!', 'color: #ff6b6b'))
    );
};

/**
 * collisionDetectionEpic - Detects bullet-enemy collisions
 * 
 * Your Task:
 * 1. Filter for MOVE_BULLETS action
 * 2. Map to CHECK_COLLISIONS action
 * 3. The actual collision logic happens in game.js
 *
 * This epic just triggers collision checks each frame
 */
export const collisionDetectionEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === MOVE_BULLETS),
        map(() => ({ type: 'CHECK_COLLISIONS' }))
    );
};

/**
 * Root epic - combines all epics using merge
 * 
 * Your Task:
 * Use merge() to combine ALL 8 epics
 * This allows them to work independently but simultaneously!
 */
export const rootEpic = (action$) => {
    // TODO: Return merge of all 8 epics
    return merge(
        keyboardEpic(action$),
        playerMovementEpic(action$),
        shootingEpic(action$),
        gameLoopEpic(action$),
        bulletMovementEpic(action$),
        enemyMovementEpic(action$),
        enemyFiringEpic(action$),
        collisionDetectionEpic(action$)
    );
};
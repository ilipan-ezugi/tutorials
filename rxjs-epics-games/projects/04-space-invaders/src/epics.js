// src/epics.js
// Epics for Space Invaders game
// Demonstrates: merge, combineLatest, withLatestFrom, collision detection

import { fromEvent, interval, merge, Subject, combineLatest } from 'rxjs';
import { filter, map, takeUntil, distinctUntilChanged, tap, withLatestFrom, delay } from 'rxjs/operators';
import { 
    KEY_DOWN, 
    TICK, 
    FIRE, 
    MOVE_BULLETS, 
    MOVE_ENEMIES,
    ENEMY_FIRE,
    COLLISION_DETECTED,
    ENEMY_DESTROYED,
    PLAYER_HIT,
    GAME_OVER,
    PAUSE_GAME,
    logAction
} from './actions';

/**
 * keyboardEpic - Handles player keyboard input
 * 
 * Converts keydown events into game actions
 */
export const keyboardEpic = (action$) => {
    return fromEvent(document, 'keydown').pipe(
        filter(e => ['ArrowLeft', 'ArrowRight', 'Space', 'KeyP'].includes(e.code)),
        tap(e => {
            if (e.code !== 'Space') e.preventDefault();
        }),
        map(e => ({ type: KEY_DOWN, payload: { key: e.code } }))
    );
};

/**
 * playerMovementEpic - Handles player movement from key presses
 */
export const playerMovementEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === KEY_DOWN),
        filter(action => ['ArrowLeft', 'ArrowRight'].includes(action.payload.key)),
        map(action => ({
            type: 'MOVE_PLAYER',
            payload: { direction: action.payload.key === 'ArrowLeft' ? -1 : 1 }
        }))
    );
};

/**
 * shootingEpic - Handles player shooting
 */
export const shootingEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === KEY_DOWN),
        filter(action => action.payload.key === 'Space'),
        map(() => ({ type: FIRE }))
    );
};

/**
 * gameLoopEpic - Creates the main game tick
 */
export const gameLoopEpic = (action$) => {
    return interval(50).pipe(
        map(() => ({ type: TICK })),
        takeUntil(action$.pipe(filter(a => a.type === GAME_OVER)))
    );
};

/**
 * bulletMovementEpic - Moves player bullets
 */
export const bulletMovementEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === TICK),
        map(() => ({ type: MOVE_BULLETS }))
    );
};

/**
 * enemyMovementEpic - Moves enemies
 */
export const enemyMovementEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === TICK),
        map(() => ({ type: MOVE_ENEMIES }))
    );
};

/**
 * enemyFiringEpic - Random enemy firing
 */
export const enemyFiringEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === TICK),
        filter(() => Math.random() < 0.02), // 2% chance per tick
        map(() => ({ type: ENEMY_FIRE }))
    );
};

/**
 * collisionDetectionEpic - Detects bullet-enemy collisions
 * 
 * This demonstrates withLatestFrom - getting the latest state
 * when another action occurs
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
 * This is the key pattern for coordinating multiple epics!
 */
export const rootEpic = (action$) => {
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
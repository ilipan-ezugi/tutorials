# Project 4: Space Invaders - Multiple Epics Coordination

Build a Space Invaders-style shooter game that demonstrates advanced epic patterns including collision detection and coordinating multiple game systems!

## 🎮 What We're Building

A space shooter game where:
- Player controls a spaceship at the bottom
- Enemies descend from the top in formation
- Shoot enemies to score points
- Avoid enemy bullets
- Multiple epics working together

## 📖 New Concepts You'll Learn

- **merge**: Combine multiple epic streams
- **zip**: Combine actions that happen together
- **withLatestFrom**: Get latest value from another stream
- **combineLatest**: React to changes in multiple streams
- **Collision Detection**: Detecting when game objects intersect

## 🏗️ Project Structure

```
04-space-invaders/
├── src/
│   ├── index.html      # Game UI
│   ├── game.js         # Core game logic
│   ├── epics.js        # Epic definitions
│   └── actions.js      # Action creators
├── package.json
└── README.md
```

## 🚀 Getting Started

```bash
cd projects/04-space-invaders
npm install
npm start
```

---

## 📚 The Code

### Step 1: Multiple Action Types

```javascript
// src/actions.js
export const FIRE = 'FIRE';
export const ENEMY_MOVE = 'ENEMY_MOVE';
export const ENEMY_FIRE = 'ENEMY_FIRE';
export const BULLET_MOVE = 'BULLET_MOVE';
export const COLLISION_DETECTED = 'COLLISION_DETECTED';
export const ENEMY_DESTROYED = 'ENEMY_DESTROYED';
export const PLAYER_HIT = 'PLAYER_HIT';
export const LEVEL_COMPLETE = 'LEVEL_COMPLETE';
```

### Step 2: Multiple Coordinated Epics

```javascript
// src/epics.js
import { merge, combineLatest, zip } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

// Epic 1: Player shooting
export const shootingEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === FIRE),
        map(() => ({ type: 'SPAWN_BULLET', payload: { from: 'player' } }))
    );
};

// Epic 2: Enemy movement
export const enemyMovementEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === TICK),
        map(() => ({ type: ENEMY_MOVE }))
    );
};

// Epic 3: Collision detection
export const collisionEpic = (action$) => {
    return combineLatest([
        action$.pipe(filter(a => a.type === BULLET_MOVE)),
        action$.pipe(filter(a => a.type === ENEMY_MOVE))
    ]).pipe(
        map(([bullet, enemy]) => checkCollision(bullet, enemy))
    );
};

// Combine all epics
export const rootEpic = (action$) => {
    return merge(
        shootingEpic(action$),
        enemyMovementEpic(action$),
        collisionEpic(action$)
    );
};
```

---

## 🎯 Key RxJS Operators Used

| Operator | Purpose | Example |
|----------|---------|---------|
| `merge` | Combine multiple streams | `merge(epic1$, epic2$)` |
| `combineLatest` | Latest from multiple | `combineLatest(a$, b$)` |
| `zip` | Pair up emissions | `zip(tick$, move$)` |
| `withLatestFrom` | Get latest from other stream | `withLatestFrom(player$)` |

---

## 💡 Challenge

Try adding:
- Different enemy types with different behaviors
- Boss levels
- Power-ups
- Sound effects

---

## 🎉 Congratulations!

After completing all 4 projects, you'll have a solid understanding of:

1. ✅ Basic Actions & Epics
2. ✅ Timing Operators (delay, timer, interval)
3. ✅ Event Handling (fromEvent, keyboard)
4. ✅ Multiple Epic Coordination

Keep building and experimenting!
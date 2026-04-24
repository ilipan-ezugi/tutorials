# Project 3: Snake Game - Keyboard Input & Game Loop

Build the classic Snake game while learning how to handle keyboard input and create game loops with RxJS!

## 🎮 What We're Building

The classic Snake game:
- Control a snake that grows when eating food
- Avoid hitting walls and yourself
- Use arrow keys to change direction
- Score increases with each food eaten

## 📖 New Concepts You'll Learn

- **fromEvent**: Convert DOM events to observables
- **interval**: Create recurring emissions for game loop
- **switchMap**: Handle stream switching
- **scan**: Accumulate state over time
- **distinctUntilChanged**: Prevent duplicate actions

## 🏗️ Project Structure

```
03-snake-game/
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
cd projects/03-snake-game
npm install
npm start
```

---

## 📚 The Code

### Step 1: Keyboard Actions

```javascript
// src/actions.js
export const KEY_DOWN = 'KEY_DOWN';
export const MOVE_SNAKE = 'MOVE_SNAKE';
export const EAT_FOOD = 'EAT_FOOD';
export const COLLISION = 'COLLISION';
export const GAME_OVER = 'GAME_OVER';
export const SCORE_UPDATE = 'SCORE_UPDATE';

export const keyDown = (key) => ({ type: KEY_DOWN, payload: { key } });
export const moveSnake = (direction) => ({ type: MOVE_SNAKE, payload: { direction } });
```

### Step 2: Keyboard Input Epic

```javascript
// src/epics.js
import { fromEvent } from 'rxjs';
import { filter, map, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { KEY_DOWN, MOVE_SNAKE } from './actions';

// Convert keyboard events to actions
export const keyboardEpic = (action$) => {
    return fromEvent(document, 'keydown').pipe(
        // Only allow arrow keys
        filter(e => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)),
        
        // Prevent default scrolling
        tap(e => e.preventDefault()),
        
        // Map to KEY_DOWN action
        map(e => ({ type: KEY_DOWN, payload: { key: e.key } })),
        
        // Prevent duplicate directions
        distinctUntilChanged((prev, curr) => prev.payload.key === curr.payload.key)
    );
};
```

### Step 3: Game Loop Epic

```javascript
// src/gameLoopEpic.js
import { interval } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MOVE_SNAKE } from './actions';

// Create a game loop that emits every 150ms
export const gameLoopEpic = (action$) => {
    return interval(150).pipe(
        map(() => ({ type: 'TICK' })),
        takeUntil(action$.pipe(filter(a => a.type === 'GAME_OVER')))
    );
};
```

---

## 🎯 Key RxJS Operators Used

| Operator | Purpose | Example |
|----------|---------|---------|
| `fromEvent` | Convert DOM events | `fromEvent(document, 'keydown')` |
| `interval` | Recurring timer | `interval(100)` - emit every 100ms |
| `takeUntil` | Stop when condition | `takeUntil(gameOver$)` |
| `scan` | Accumulate state | `scan((acc, curr) => acc + 1)` |
| `distinctUntilChanged` | Skip duplicates | Only new values pass through |

---

## 💡 Challenge

Try adding:
- Different difficulty levels (speed up the game)
- A pause feature
- High score tracking with localStorage

---

## ⏭️ Next Steps

Move on to **Project 4: Space Invaders** to learn about collision detection and coordinating multiple epics!
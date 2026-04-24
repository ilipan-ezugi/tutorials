# Project 2: Reaction Timer - Timers & Timing Operators

Build a reaction time testing game that measures how fast you can respond to visual stimuli!

## 🎮 What We're Building

A reaction timer game where:
- A shape appears after a random delay
- Click as fast as you can to measure reaction time
- Track your best times and see statistics

## 📖 New Concepts You'll Learn

- **delay**: Postpone actions for a specified time
- **debounce**: Wait for a pause before acting
- **timeout**: Handle actions that take too long
- **take**: Limit the number of emissions
- **timer**: Create time-based emissions

## 🏗️ Project Structure

```
02-reaction-timer/
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
cd projects/02-reaction-timer
npm install
npm start
```

---

## 📚 The Code

### Step 1: New Actions

```javascript
// src/actions.js
export const START_GAME = 'START_GAME';
export const SHAPE_APPEARED = 'SHAPE_APPEARED';
export const CLICKED = 'CLICKED';
export const RECORD_TIME = 'RECORD_TIME';
export const RESET_GAME = 'RESET_GAME';

export const startGame = () => ({ type: START_GAME });
export const shapeAppeared = () => ({ type: SHAPE_APPEARED });
export const clicked = () => ({ type: CLICKED });
export const recordTime = (ms) => ({ type: RECORD_TIME, payload: { ms } });
```

### Step 2: The Timer Epic

```javascript
// src/epics.js
import { filter, map, delay, mergeMap, take, timeout } from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { START_GAME, SHAPE_APPEARED, CLICKED, RECORD_TIME } from './actions';

// This epic handles the game timing
export const gameTimerEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === START_GAME),
        
        // Random delay between 1-5 seconds before shape appears
        delay(Math.random() * 4000 + 1000),
        
        // Transform to shape appeared action
        map(() => ({ type: SHAPE_APPEARED }))
    );
};

// This epic handles the click timing
export const reactionTimerEpic = (action$) => {
    let startTime = null;
    
    return action$.pipe(
        filter(action => action.type === SHAPE_APPEARED),
        
        // Record when shape appeared
        tap(() => { startTime = Date.now(); }),
        
        // Wait for the click
        filter(action => action.type === CLICKED),
        
        // Calculate reaction time
        map(() => {
            const reactionTime = Date.now() - startTime;
            return { type: RECORD_TIME, payload: { ms: reactionTime } };
        })
    );
};
```

---

## 🎯 Key RxJS Operators Used

| Operator | Purpose | Example |
|----------|---------|---------|
| `delay` | Postpone emission | `delay(2000)` - wait 2 seconds |
| `timer` | Emit after time | `timer(1000)` - emit once at 1s |
| `take` | Limit emissions | `take(1)` - only first one |
| `timeout` | Handle timeouts | `timeout(5000)` - error after 5s |

---

## 💡 Challenge

Try adding:
- A "too early" check - if they click before the shape appears
- A high score leaderboard
- Different difficulty levels

---

## ⏭️ Next Steps

Move on to **Project 3: Snake Game** to learn about keyboard input handling and game loops!
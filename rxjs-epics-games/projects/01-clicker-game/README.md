# Project 1: Clicker Game - Introduction to Epics

This project teaches the fundamentals of RxJS Epics through a simple clicker game.

## 🎮 What We're Building

A clicker game where:
- Click a button to earn points
- Points accumulate over time
- An Epic listens for click actions and handles score updates

## 📖 Concepts Covered

- **Actions**: Simple objects describing what happened
- **Epics**: Long-running observables that listen to action streams
- **map**: Transforming actions into other actions
- **mergeMap**: Handling side effects

## 🏗️ Project Structure

```
01-clicker-game/
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
cd projects/01-clicker-game
npm install
npm start
```

Then open http://localhost:8080 in your browser!

---

## 📚 The Code

### Step 1: Define Actions

```javascript
// src/actions.js

// Action types
export const CLICK = 'CLICK';
export const INCREMENT_SCORE = 'INCREMENT_SCORE';
export const RESET = 'RESET';

// Action creators
export const clickAction = () => ({ type: CLICK });
export const incrementScore = (points) => ({ type: INCREMENT_SCORE, payload: { points } });
export const resetAction = () => ({ type: RESET });
```

### Step 2: Create the Epic

```javascript
// src/epics.js
import { CLICK, INCREMENT_SCORE } from './actions';
import { map, mergeMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

// The main epic - listens for CLICK actions and transforms to INCREMENT_SCORE
export const clickEpic = (action$) => {
    return action$.pipe(
        // Filter for only CLICK actions
        filter(action => action.type === CLICK),
        // Transform each click into a score increment
        map(() => ({ 
            type: INCREMENT_SCORE, 
            payload: { points: 1 } 
        }))
    );
};
```

### Step 3: The Game Engine

```javascript
// src/game.js
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { clickEpic } from './epics';
import { CLICK, INCREMENT_SCORE, RESET } from './actions';

// The action stream - where all actions flow
export const action$ = new Subject();

// The state store
let state = { score: 0 };

// Subscribe to the epic and get its output
const epicOutput$ = clickEpic(action$);
epicOutput$.subscribe(action => {
    if (action.type === INCREMENT_SCORE) {
        state.score += action.payload.points;
        updateDisplay();
    }
});

// UI Functions
function updateDisplay() {
    document.getElementById('score').textContent = state.score;
}

function handleClick() {
    action$.next({ type: 'CLICK' });
}

function handleReset() {
    state.score = 0;
    updateDisplay();
}
```

---

## 🎯 Try It Out

1. Open the game in your browser
2. Click the button - watch the score increase!
3. Each click is an action that flows through the epic

## 🔍 What's Happening

```
[Button Click] → action$.next(CLICK) → [clickEpic filters & transforms] → State Updated
```

The Epic is constantly listening, transforming actions, and the result flows back to update our state!

---

## 💡 Challenge

Try modifying the epic to:
- Add a 500ms delay before points are added
- Add a "combo" system where rapid clicks give bonus points

---

## ⏭️ Next Steps

Once you understand this flow, move on to **Project 2: Reaction Timer** to learn about timers and timing operators!
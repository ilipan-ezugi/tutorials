# 🎮 Snake Game - Learning Game Loops & Keyboard Input

## 📚 Learning Objectives

In this project, you'll learn:
- **`fromEvent()` operator** - Converting DOM events into observable streams
- **`interval()` operator** - Creating recurring timed events (game loop)
- **`distinctUntilChanged()` operator** - Preventing duplicate actions
- **`takeUntil()` operator** - Stopping observables when conditions are met
- **Coordinating multiple epics** - Keyboard + game loop + movement logic

## 🎯 What You Need to Do

Implement the core game mechanics using RxJS epics:

### Task 1: Implement `keyboardEpic`

This epic converts DOM keyboard events into game actions.

**Requirements:**
1. Use `fromEvent(document, 'keydown')` to listen for key presses
2. Filter for arrow keys and space: `['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']`
3. Use `preventDefault()` for arrow keys to prevent scrolling
4. Transform to `KEY_DOWN` actions with `payload.key`
5. Use `distinctUntilChanged()` to prevent duplicate key events

**Hint:**
```
fromEvent(document, 'keydown').pipe(
  filter(e => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)),
  tap(e => e.preventDefault()),
  map(e => ({ type: KEY_DOWN, payload: { key: e.key } })),
  distinctUntilChanged((prev, curr) => prev.payload.key === curr.payload.key)
)
```

### Task 2: Implement `directionEpic`

This transforms key presses into snake movement directions.

**Requirements:**
1. Filter for `KEY_DOWN` actions
2. Map arrow keys to direction vectors:
   - `ArrowUp` → `{ x: 0, y: -1 }`
   - `ArrowDown` → `{ x: 0, y: 1 }`
   - `ArrowLeft` → `{ x: -1, y: 0 }`
   - `ArrowRight` → `{ x: 1, y: 0 }`
3. Transform to `MOVE_SNAKE` actions with the direction payload
4. Create a `DIRECTION_MAP` object for cleaner code

### Task 3: Implement `gameLoopEpic`

This creates the heartbeat of the game using intervals.

**Requirements:**
1. Use `interval(150)` to emit an event every 150ms
2. Map each event to a `TICK` action
3. Stop the loop when `GAME_OVER` is detected using `takeUntil()`
4. Log the tick for debugging (every N ticks to avoid spam)

**Hint:**
```
interval(150).pipe(
  map(() => ({ type: TICK })),
  takeUntil(action$.pipe(filter(a => a.type === GAME_OVER)))
)
```

### Task 4: Implement `rootEpic`

Merge the keyboard epic and game loop epic so they work together.

## 📊 Understanding the Flow

```
Game Running:
  ↓
Every 150ms: interval emits
  ↓ (gameLoopEpic)
TICK action (game update)
  ↓
game.js moves snake, checks collisions
  ↓
Meanwhile, user presses key
  ↓ (keyboardEpic)
KEY_DOWN action
  ↓ (directionEpic)
MOVE_SNAKE action with direction
  ↓
Next TICK: snake moves in new direction
```

## 🧪 Testing Your Implementation

1. Run the game
2. Use arrow keys to control the snake
3. The snake should move in the pressed direction
4. Check the console to see the action flow
5. When you hit a wall or yourself, GAME_OVER should fire and the game stops

## 💡 Key Concepts

- **`fromEvent()`** - Bridge between DOM and RxJS streams
- **`interval()`** - Perfect for game loops and timing
- **`distinctUntilChanged()`** - Prevents processing the same key repeatedly
- **`takeUntil()`** - Stops the stream when a condition is met
- **Event-driven architecture** - Decouples input handling from game logic

## 🎓 Advanced Challenges

1. Implement a `pauseEpic` that pauses/resumes the game with Space key
2. Add different speed levels using faster/slower intervals
3. Implement smooth movement by buffering direction changes
4. Add debug mode that shows action counts per second

---

**Next:** When comfortable with game loops, move to Project 4 (Space Invaders) to handle multiple coordinated epics!

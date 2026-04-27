# 🎮 Reaction Timer Game - Learning RxJS Timing Operators

## 📚 Learning Objectives

In this project, you'll learn:
- **`delay()` operator** - Wait for a specified time before emitting
- **`filter()` with state tracking** - Managing state across epic executions
- **Event timing and reaction measurement** - Practical application of timing
- **Chaining operators** - Complex multi-step pipelines

## 🎯 What You Need to Do

Implement three epics that work together to create a reaction time testing game:

### Task 1: Implement `gameTimerEpic`

This epic waits for a random delay, then signals that the shape should appear.

**Requirements:**
1. Filter for `START_GAME` actions
2. Wait for a random delay between 1-5 seconds using `delay()`
3. Emit a `SHAPE_APPEARED` action when the delay completes
4. Use a formula like: `Math.random() * 4000 + 1000` (milliseconds)

**Hint:** 
```
return action$.pipe(
  filter(action => action.type === START_GAME),
  delay(Math.random() * 4000 + 1000),
  map(() => ({ type: SHAPE_APPEARED }))
);
```

### Task 2: Implement `reactionTimerEpic`

This epic measures the time between when a shape appears and when the user clicks.

**Requirements:**
1. Create a variable to store the timestamp when shape appears
2. Filter for `SHAPE_APPEARED` actions and capture the time with `tap()`
3. Then filter for `CLICKED` actions
4. Calculate: `Date.now() - shapeAppearTime`
5. Emit a `RECORD_TIME` action with the reaction time in `payload.ms`

**Tricky part:** This epic needs to wait for SHAPE_APPEARED first, then listen for CLICKED.

### Task 3: Implement `tooEarlyEpic`

This epic detects when someone clicks before the shape appears.

**Requirements:**
1. Use state flags: `gameActive` and `shapeVisible`
2. Set `gameActive = true` when START_GAME is received
3. Set `shapeVisible = true` when SHAPE_APPEARED is received
4. When CLICKED happens:
   - If `!shapeVisible && gameActive`: emit `TOO_EARLY`
   - Otherwise, let it pass (or emit nothing)

**Hint:** Use `tap()` to update state flags without transforming the action.

## 📊 Understanding the Flow

```
START_GAME action
  ↓ (gameTimerEpic starts)
Wait 1-5 seconds
  ↓
SHAPE_APPEARED action (screen shows shape, timer starts)
  ↓ (reactionTimerEpic captures timestamp)
User clicks
  ↓
CLICKED action
  ↓ (reactionTimerEpic calculates time difference)
RECORD_TIME action (emit with ms: 123)
  ↓
game.js updates display with reaction time
```

## 🧪 Testing Your Implementation

1. Click "Start Game"
2. Wait for the shape to appear
3. Click as quickly as you can
4. Your reaction time should display
5. Try clicking before the shape appears - it should show "Too early!"

## 💡 Key Concepts

- **`delay()`** pauses the observable stream
- **State tracking** - You can use variables in epic scope to remember things
- **`tap()`** - Side effects without changing the stream
- **Timing is everything** - RxJS makes timing logic elegant and testable

## 🎓 Advanced Challenges

1. Add a `timeoutEpic` that cancels the game if user doesn't click within 10 seconds
2. Track best time and show personal records
3. Add a `speedUp` epic that gradually reduces the max delay time

---

**Next:** When comfortable with timing operators, move to Project 3 (Snake Game) to handle game loops and keyboard input!

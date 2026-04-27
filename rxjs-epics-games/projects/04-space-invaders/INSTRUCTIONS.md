# 🎮 Space Invaders - Advanced Epic Coordination

## 📚 Learning Objectives

In this project, you'll learn:
- **Coordinating multiple independent epics** - Complex interactions
- **`combineLatest()` and `withLatestFrom()`** - Combining streams with state
- **Multiplexing** - Handling different input types (keyboard, timers, collision detection)
- **Collision detection logic** - Advanced game mechanics
- **Scaling epics** - Managing 5+ epics working together

## 🎯 What You Need to Do

This is the most advanced project - you'll implement 8 epic functions!

### Core Epics to Implement

**1. `keyboardEpic`** - Convert DOM events to actions
- Listen to keydown events
- Filter for: ArrowLeft, ArrowRight, Space, KeyP (pause)
- Transform to KEY_DOWN actions with key code
- Prevent default browser behavior

**2. `playerMovementEpic`** - Handle player input
- Filter for KEY_DOWN actions
- Extract left/right arrow keys
- Transform to MOVE_PLAYER with direction (-1 or 1)

**3. `shootingEpic`** - Handle fire input
- Filter for KEY_DOWN with Space key
- Transform to FIRE action (player shoots)

**4. `gameLoopEpic`** - Game heartbeat
- Use interval(50) for 50ms ticks
- Transform to TICK actions
- Stop on GAME_OVER using takeUntil()

**5. `bulletMovementEpic`** - Move player bullets
- Filter for TICK actions
- Transform to MOVE_BULLETS action

**6. `enemyMovementEpic`** - Move enemies
- Filter for TICK actions
- Transform to MOVE_ENEMIES action

**7. `enemyFiringEpic`** - Random enemy shots
- Filter for TICK actions
- Random chance: `Math.random() < 0.02` (2% each tick)
- Transform to ENEMY_FIRE action

**8. `collisionDetectionEpic`** - Check collisions
- Filter for MOVE_BULLETS action
- Transform to CHECK_COLLISIONS action
- Could use withLatestFrom() to get latest game state

## 💡 Pattern: Multiple Simultaneous Epics

This project demonstrates the real power of RxJS:

```
Game State:
  ├─ Player position
  ├─ Bullets on screen
  ├─ Enemy positions
  └─ Score

Input Stream (keyboard)
    ↓ (playerMovementEpic, shootingEpic)
Action Stream (MOVE_PLAYER, FIRE, etc.)
    ↓ (all 8 epics listen and respond)
Output Streams (multiple simultaneous)
    ↓
game.js processes all actions
    ↓
Game State updates
    ↓
Display updates
```

## 🧪 Testing Your Implementation

1. Run the game
2. Arrow keys should move the player left/right
3. Space should fire bullets
4. Enemies should move automatically
5. Collisions should be detected
6. Check the console for action flow

## 🎓 Advanced Concepts

**Combinable Streams:**
- `withLatestFrom()` - Get latest state when bullet moves
- `combineLatest()` - Combine multiple streams
- These patterns are essential for complex game logic

**Scaling Pattern:**
```javascript
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
```

This is how you build game engines with RxJS!

## 🏆 Mastery Challenge

Once basic epics work:

1. Implement collision detection using `withLatestFrom()`
2. Add power-up system with timed effects
3. Create multi-level difficulty escalation
4. Add sound effects coordination
5. Implement AI enemy movement patterns

---

**Congratulations!** You now understand:
- Basic epics (Project 1)
- Timing operators (Project 2)
- Game loops & input handling (Project 3)
- Complex multi-epic coordination (Project 4)

You're ready to build professional RxJS applications!

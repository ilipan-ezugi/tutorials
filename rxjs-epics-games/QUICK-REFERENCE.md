# RxJS Epics Quick Reference Guide

A quick reference for the key concepts learned across all 4 tutorial projects.

---

## 🎯 Core Concepts

### What is an Epic?

An **Epic** is a function that takes an action stream and returns an action stream. It's a long-running observable that listens for specific actions and can transform them or trigger side effects.

```javascript
// Basic Epic Structure
export const myEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === 'SPECIFIC_ACTION'),
        map(action => ({ type: 'NEW_ACTION' }))
    );
};
```

---

## 📚 Key Operators

### Transformation Operators

| Operator | Description | Used In |
|----------|-------------|---------|
| `map` | Transform each emission | All projects |
| `filter` | Filter emissions by condition | All projects |
| `delay` | Postpone emissions | Project 2 |
| `tap` | Side effects without changing | All projects |

### Creation Operators

| Operator | Description | Used In |
|----------|-------------|---------|
| `fromEvent` | Convert DOM events to observable | Project 3, 4 |
| `interval` | Recurring emissions | Project 3, 4 |
| `timer` | Single delayed emission | Project 2 |
| `merge` | Combine multiple streams | Project 4 |

### Combination Operators

| Operator | Description | Used In |
|----------|-------------|---------|
| `combineLatest` | Latest from multiple streams | Project 4 |
| `withLatestFrom` | Get latest from another stream | Project 4 |
| `distinctUntilChanged` | Skip duplicate values | Project 3 |

### Control Operators

| Operator | Description | Used In |
|----------|-------------|---------|
| `take` | Limit number of emissions | Project 2 |
| `takeUntil` | Stop when condition met | Project 3 |
| `switchMap` | Switch to new observable | Project 2 |

---

## 🔄 Action Flow Pattern

```
User Event → action$.next(action) → Epic filters & transforms → New Action → State Update
```

Example:
```javascript
// 1. User clicks button
action$.next({ type: 'CLICK' });

// 2. Epic listens and transforms
const clickEpic = (action$) => action$.pipe(
    filter(a => a.type === 'CLICK'),
    map(() => ({ type: 'INCREMENT_SCORE' }))
);

// 3. Result updates state
action$.subscribe(action => {
    if (action.type === 'INCREMENT_SCORE') {
        state.score++;
    }
});
```

---

## 📁 Project Summary

### Project 1: Clicker Game
- **Concepts**: Basic actions, simple epic, map, filter
- **Key File**: `epics.js`

### Project 2: Reaction Timer
- **Concepts**: delay, timer, timeout
- **Key File**: `epics.js`

### Project 3: Snake Game
- **Concepts**: fromEvent, interval, game loop, keyboard input
- **Key File**: `epics.js`, `game.js`

### Project 4: Space Invaders
- **Concepts**: merge, combineLatest, collision detection, multiple epics
- **Key File**: `epics.js`

---

## 💡 Pro Tips

1. **Always filter first** - Filter actions early to avoid unnecessary processing
2. **Use tap for debugging** - `tap(console.log)` helps understand flow
3. **Keep epics pure** - Avoid side effects inside epics, use them to trigger actions
4. **Use distinctUntilChanged** - Prevents duplicate actions from causing issues

---

## 🔗 Additional Resources

- [RxJS Documentation](https://rxjs.dev/)
- [Redux-Observable](https://redux-observable.js.org/)
- [RxJS Marbles](https://rxmarbles.com/) - Visualize operator behavior
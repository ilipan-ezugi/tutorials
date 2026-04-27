# RxJS Epics Tutorial - Interactive Games Learning Guide

Welcome to learning RxJS Epics through building interactive games! This tutorial will take you from understanding the basics to building real-time game mechanics.

## 🎯 How to Use This Tutorial

Each project is designed to teach specific RxJS concepts through building games:

1. **Read INSTRUCTIONS.md** - Understand what you need to build
2. **Edit src/epics.js** - Fill in the TODO sections
3. **Test in browser** - See if your game works
4. **Compare with SOLUTION.js** - Check the reference implementation
5. **Move to next project** - Build on what you learned

## 📚 Learning Path

| Level | Project | Key Concepts | Status |
|-------|---------|----------------|--------|
| 🔰 | [Clicker Game](projects/01-clicker-game/) | Basic Actions, filter(), map(), merge() | TODO: Fill in epics.js |
| 🟡 | [Reaction Timer](projects/02-reaction-timer/) | delay(), tap(), state tracking | TODO: Fill in epics.js |
| 🟠 | [Snake Game](projects/03-snake-game/) | fromEvent(), interval(), distinctUntilChanged() | TODO: Fill in epics.js |
| 🔴 | [Space Invaders](projects/04-space-invaders/) | Multiple epics, complex coordination | TODO: Fill in epics.js |

## 🚀 Getting Started

### Install Dependencies

```bash
cd rxjs-epics-games
npm install
```

This installs the monorepo. Each project has its own dependencies via workspaces.

### Run a Project

Each project uses a local development server:

**Project 1 - Clicker Game:**
```bash
cd projects/01-clicker-game
npm install
npm start
# Opens on http://localhost:8080
```

**Project 2 - Reaction Timer:**
```bash
cd projects/02-reaction-timer
npm install
npm start
```

**Project 3 - Snake Game:**
```bash
cd projects/03-snake-game
npm install
npm start
```

**Project 4 - Space Invaders:**
```bash
cd projects/04-space-invaders
npm install
npm start
```

## 🗂️ Project Structure

Each project contains:

```
project/
├── src/
│   ├── actions.js          # Action types and creators
│   ├── epics.js           # WHERE YOU CODE - fill in the TODO sections
│   ├── game.js            # Game state management (mostly complete)
│   └── index.html         # Game UI
├── INSTRUCTIONS.md         # What to build and how
├── SOLUTION.js            # Reference implementation
├── package.json           # Project dependencies
└── README.md              # Project-specific notes
```

## 🎓 What You'll Learn

### Project 1: Clicker Game
- **Epic basics** - What are epics and how do they work?
- **Operators** - filter() and map()
- **Action transformation** - Converting one action to another
- **Merging epics** - Working with multiple epics

### Project 2: Reaction Timer
- **Timing operators** - delay() for timed events
- **State tracking** - Storing data within an epic
- **tap() for side effects** - Doing things without transforming
- **Complex filters** - Chaining multiple conditions
- **Combining timing concepts** - Multiple timed operations

### Project 3: Snake Game
- **fromEvent()** - Connecting browser events to RxJS
- **Game loops** - interval() for consistent frame rates
- **Event deduplication** - distinctUntilChanged()
- **Stream termination** - takeUntil() for cleanup
- **Coordinating input and timers** - Two epics working together

### Project 4: Space Invaders
- **Scaling epics** - Managing 8+ epics simultaneously
- **Complex coordination** - Multiple epics depending on each other
- **Random behavior** - Injecting probability into deterministic systems
- **Professional patterns** - Production-ready epic architecture

## 💡 Key RxJS Concepts

### Operators You'll Use

| Operator | Purpose | First Seen |
|----------|---------|-----------|
| `filter()` | Keep only matching items | Project 1 |
| `map()` | Transform items | Project 1 |
| `merge()` | Combine multiple streams | Project 1 |
| `tap()` | Do something without changing stream | Project 2 |
| `delay()` | Wait before emitting | Project 2 |
| `fromEvent()` | Convert DOM events to stream | Project 3 |
| `interval()` | Emit at regular intervals | Project 3 |
| `distinctUntilChanged()` | Remove consecutive duplicates | Project 3 |
| `takeUntil()` | Stop when condition met | Project 3 |

### Epic Pattern

Every epic follows this pattern:

```javascript
export const myEpic = (action$) => {
    return action$.pipe(
        filter(action => action.type === ACTION_TYPE),
        map(action => ({ type: NEW_ACTION_TYPE, payload: ... }))
    );
};
```

An epic:
- **Takes** an action stream (`action$`)
- **Filters** for specific action types
- **Transforms** into new actions
- **Returns** a new action stream

## 🧪 Testing Tips

1. **Browser console** - Watch the action flow in real-time
2. **Colorized logs** - Different action types have different colors
3. **Browser DevTools** - Set breakpoints in your epic code
4. **SOLUTION.js** - Compare your implementation step-by-step

## ❓ Getting Stuck?

1. **Read INSTRUCTIONS.md** again - Make sure you understand the requirements
2. **Check browser console** - Look for error messages and action flow
3. **Compare with SOLUTION.js** - See how the reference implementation works
4. **Try a simple version first** - Get basic functionality before advanced features

## 🎁 Bonus: After You Finish

Once you complete all projects, you're ready for:

- Building real apps with Redux Observable
- Understanding reactive programming patterns
- Creating complex interactive systems
- Contributing to RxJS-based projects

## 📚 Additional Resources

- [RxJS Official Docs](https://rxjs.dev/)
- [Learn RxJS Operators](https://www.learnrxjs.io/)
- [Redux Observable](https://redux-observable.js.org/)
- [Reactive Programming Guide](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)

## 🎮 Challenge Mode

After completing a project, try these challenges:

**Clicker Game:**
- Add a combo multiplier that resets after 5 seconds
- Track click speed (clicks per second)

**Reaction Timer:**
- Add difficulty levels with faster delays
- Track statistics (average, fastest, slowest)

**Snake Game:**
- Add food that appears randomly
- Increase speed as you eat food
- Add obstacles to navigate around

**Space Invaders:**
- Implement collision detection with score
- Add power-ups with timed effects
- Multiple difficulty levels
- Boss enemy that appears after waves

---

**Happy Learning!** 🚀

Remember: The goal isn't to memorize operators, but to understand HOW to think reactively.
Each operator is just a tool - the real skill is knowing WHEN to use it.

Start with Project 1! 🎮

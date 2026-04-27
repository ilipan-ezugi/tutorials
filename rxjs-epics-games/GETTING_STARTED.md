# 🚀 Getting Started Guide

## Quick Setup (5 minutes)

### 1. Install Root Dependencies
```bash
cd rxjs-epics-games
npm install
```

This installs all dependencies for all projects (using npm workspaces).

### 2. Start with Project 1
```bash
cd projects/01-clicker-game
npm start
```

This opens http://localhost:5173 in your browser with the clicker game.

### 3. Follow the Learning Path

Each project has:
- **INSTRUCTIONS.md** - What to learn and what to build
- **src/epics.js** - Where you write your code (has TODO comments)
- **SOLUTION.js** - Reference implementation
- **src/game.js** - Game engine (mostly complete, don't edit)

## The Learning Pattern

For each project:

1. **Read INSTRUCTIONS.md**
   - Understand the learning objectives
   - Read what each epic should do
   - Study the flow diagrams

2. **Open src/epics.js**
   - Find the TODO comments
   - Implement each epic function
   - Use the hints provided

3. **Test in Browser**
   - Open DevTools Console (F12)
   - Play the game
   - Watch the action flow in the console
   - Fix any errors

4. **Compare with SOLUTION.js**
   - If stuck, look at the solution
   - Understand why it works that way
   - Try to write it yourself after understanding

5. **Move to Next Project**
   - Commit your work
   - Move to the next project folder
   - Repeat!

## Project Order

Start here → Beginner concepts:
```
Project 1: Clicker Game
├─ Learn: Basic epics, filter(), map()
└─ Time: 30-60 minutes
```

Then → Timing concepts:
```
Project 2: Reaction Timer
├─ Learn: delay(), tap(), state tracking
└─ Time: 60-90 minutes
```

Then → Game mechanics:
```
Project 3: Snake Game
├─ Learn: fromEvent(), interval(), game loops
└─ Time: 90-120 minutes
```

Finally → Advanced coordination:
```
Project 4: Space Invaders
├─ Learn: Multiple epics, complex flows
└─ Time: 120-180 minutes
```

## Debugging Tips

### 1. Browser Console
Open DevTools (F12) and check the console. You'll see:
- 🔴 ← UI Event (user action)
- 🔵 Action: CLICK (action received)
- 🟢 Epic Output → INCREMENT_SCORE (epic transforms it)
- 🟡 Score: 1 (state updated)

### 2. Add Console Logs
In your epic, add:
```javascript
tap(action => console.log('My action:', action))
```

### 3. Check imports
Make sure you're importing operators:
```javascript
import { filter, map, tap } from 'rxjs/operators';
```

### 4. Read the Error Message
Browser console shows exactly what's wrong. Google the error message!

## Common Issues

### "RxJS not found"
- Make sure you ran `npm install` in the project directory
- The vite server needs to be running (`npm start`)

### "Cannot find module"
- Check you're using correct import paths
- Should be: `import { filter } from 'rxjs/operators';`
- Not: `import { filter } from 'rxjs';` (this works too, but different)

### "Epic doesn't work"
- Check that rootEpic returns merge() with all epics
- Verify filter conditions are correct
- Add tap() with console.log to debug

### Game doesn't start
- Check browser console for errors
- Make sure npm start is running
- Refresh the page (Ctrl+R or Cmd+R)

## Pro Tips

1. **Take breaks** - RxJS concepts take time to click (pun intended!)
2. **Copy-paste operators** - You can copy from SOLUTION.js and modify
3. **One epic at a time** - Don't implement all at once, test as you go
4. **Read error messages** - They're usually very helpful
5. **Ask ChatGPT** - "How do I use RxJS filter() to..." works great

## Getting Help

- **Read the INSTRUCTIONS.md** again - Really read it carefully
- **Check SOLUTION.js** - See how it's supposed to work
- **Read QUICK-REFERENCE.md** - Concepts explained
- **Read the comments in game.js** - Understand how game works
- **Search "RxJS [operator name]"** - Google is your friend

## Next Steps After Finishing

Once you complete all projects, you can:

1. **Build your own game** - Use the same pattern!
2. **Learn Redux Observable** - Professional RxJS in React apps
3. **Explore reactive programming** - A whole new way to think
4. **Build real apps** - RxJS patterns work everywhere

## Time Commitment

- **Total estimated time**: 4-6 hours
- **Per project**: 1-2 hours
- **Breaks included**: Take 5-10 min breaks between projects
- **Learning speed**: Everyone learns differently - take your time!

---

Ready? Start with:
```bash
cd projects/01-clicker-game
npm start
```

Then open [INSTRUCTIONS.md](projects/01-clicker-game/INSTRUCTIONS.md) in the same folder!

Happy learning! 🎮

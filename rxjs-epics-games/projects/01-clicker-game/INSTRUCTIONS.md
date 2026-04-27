# 🎮 Clicker Game - Learning RxJS Epics

## 📚 Learning Objectives

In this project, you'll learn:
- What are **Epics** and how they transform actions
- Creating your first epic with `filter` and `map` operators
- The action stream flow: UI Event → Action → Epic → New Action → State Update
- Merging multiple epics with `merge()`

## 🎯 What You Need to Do

The `epics.js` file contains stub functions with TODO comments. Your job is to implement the epic logic to make the game work.

### Task 1: Implement `clickEpic`

This is the core epic of the clicker game. It should:

1. **Filter** for `CLICK` actions only
2. **Transform** each `CLICK` into an `INCREMENT_SCORE` action with `{ points: 1 }`
3. **Return** the transformed action stream

**Hints:**
- Use `action$.pipe()` to start the epic
- Use `filter()` to check `action.type === CLICK`
- Use `map()` to transform the action
- Look at the action types in `actions.js`

### Task 2: Implement `resetEpic`

This epic handles game reset:

1. **Filter** for `RESET` actions
2. **Transform** to a `RESET_COMPLETE` action
3. **Return** the new action

### Task 3: Update `rootEpic`

Combine `clickEpic` and `resetEpic` using `merge()` so both work together.

**Hint:** Use `merge(clickEpic(action$), resetEpic(action$))`

## 📊 Understanding the Flow

```
User Clicks Button
         ↓
   handleClick() dispatches CLICK action
         ↓
   action$ stream receives CLICK
         ↓
   clickEpic processes it through:
   - filter(CLICK) 
   - map → INCREMENT_SCORE
         ↓
   incrementScore$ emits
         ↓
   game.js receives INCREMENT_SCORE
         ↓
   State updates: score += 1
         ↓
   Display updates ✨
```

## 🧪 Testing Your Implementation

1. Open `index.html` in a browser (or run `npm start` if available)
2. Click the button - you should see the score increase
3. Open the browser console to see the action flow
4. The console should show:
   - RED: ← UI Event (click detected)
   - CYAN: Action: CLICK
   - GREEN: Epic Output → INCREMENT_SCORE
   - YELLOW: Score: 1

## 💡 Tips

- The `logAction` function is already provided for debugging
- Check the difference between the ACTION (input to epic) and the OUTPUT (what the epic returns)
- Use the browser console to debug your epic logic
- Compare with `SOLUTION.js` if you get stuck!

## 🎓 Advanced Challenge (Optional)

Once the basic epic works, try adding:

1. A `bonusPointsEpic` that:
   - Listens for rapid clicks (within 500ms)
   - Awards bonus points (2x multiplier)
   - Uses `debounceTime()` or `throttleTime()`

2. A multiplier system where:
   - Each action increases a multiplier
   - After 5 seconds of no clicks, the multiplier resets

---

**Next Level:** When you're comfortable with epics, move to Project 2 (Reaction Timer) to learn timing operators like `delay()` and `timer()`!

# Problem 1: Stencil does not see which signals `render()` reads

Reading `signal.value` inside `render()` is not seen by Stencil. The component is never told to update. The value is right the first time and then stops changing.

```bash
npm run test:issue1   # 2 of 4 tests fail
npm start             # localhost:3333, press the buttons
```

- `count.ts` the signal, in a plain module outside any component
- `issue1.tsx` renders it three ways, one that updates and two that do not
- `issue1.spec.tsx` two failing tests, plus two that pass and show the setup works
- `vitest.config.ts` uses the patched plugin from problem 3, because the normal one turns signals off in tests and would hide this


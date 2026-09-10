# Problem 3: signals are off under `@stencil/vitest`

A signal used in JSX renders as an empty string in tests. The same component works in the browser. No error is raised.

```bash
npm run test:issue3   # 1 of 2 tests fails
```

- `count.ts` the signal
- `issue3.tsx` renders it two ways
- `issue3.spec.tsx` the failing test, plus one that passes and shows a plain `.value` read still gives its first value
- `vitest.config.ts` the normal plugin, unchanged
- `fixed-plugin.ts` the same plugin plus `buildOverrides`, which is the whole fix, and what problem 1's tests use




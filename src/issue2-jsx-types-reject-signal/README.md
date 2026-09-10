# Problem 2: the JSX types do not accept a signal as a prop

The runtime accepts a signal as an attribute or a property value. The JSX types do not, so this folder does not compile.

```bash
npm run test:issue2   # 2 type errors
```

- `count.ts` the signal
- `target.tsx` a normal component with `label: string` and `items: Item[]`
- `issue2.tsx` passes computed signals of those types to it, and fails to compile
- `tsconfig.json` its own program, because the main build leaves `issue2.tsx` out

**If `npm run test:issue2` passes, the setup is broken, not fixed.** It only shows the problem while `issue-two-target` is in `src/components.d.ts`. If the build stops writing that file, or stops reading `target.tsx`, the element becomes unknown to the JSX types. Unknown elements accept any attribute, so the errors go away. Check with:

```bash
grep -o '"issue-two-target"' ../components.d.ts
```


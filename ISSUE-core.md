# bug: changes to a signal read in `render()` do not update the component

## Prerequisites

- [x] I have read the Contributing Guidelines.
- [x] I agree to follow the Code of Conduct.
- [x] I have searched for existing issues that already report this problem, without success.

## Stencil Version

5.0.0-beta.7

## Current Behavior

Two problems. The second one only matters because of the first, so I report them together.

**1. Reading `signal.value` inside `render()` does not update the component.** Stencil does not see that `render` read the signal. So nothing tells the component to render again. The value is right the first time and then stops changing. `npm run test:issue1`:

```
✓ a signal passed into JSX updates
× reading .value inside render() updates the component
× a conditional on .value updates
✓ the old value catches up on an unrelated re-render
```

The tests wait on real timers, so no render is still waiting to run.

The last test shows why this is easy to miss. Any other re-render reads the signal again. The value then changes to the current one and stops changing again. So the problem looks occasional instead of constant.

This means the signal object itself has to go into the JSX. That works for a child, an attribute, or `class`. It does not work for anything that needs the value while `render` runs:

```tsx
return count.value > 0 ? <a-thing /> : <empty-state />;        // never updates
return <ul>{items.value.map((i) => <li>{i.name}</li>)}</ul>;   // never updates
```

For those cases the only option is an `@Effect()` that writes to a `@State`. The component is then back to full re-renders.

**2. The JSX types do not accept a signal as a prop**, even though the runtime does. So the option above does not compile. `npm run test:issue2`:

```
issue2.tsx(17,34): error TS2322:
  Type 'ReadonlySignal<string>' is not assignable to type 'string'.
issue2.tsx(17,53): error TS2740:
  Type 'ReadonlySignal<Item[]>' is missing the following properties from
  type 'Item[]': length, pop, push, concat, and 29 more.
```

The target is a component in the same project. It declares `label: string` and `items: Item[]`. The computed signals have exactly those types. Each one needs `as unknown as Item[]`, and that removes the type check on the attribute.

## Expected Behavior

1. A signal read as `.value` inside `render()` should update the component when it changes. Or there should be a documented option to turn that on.
2. The JSX attribute types should accept `ReadonlySignal<T>` anywhere `T` is accepted. The runtime already does.

## System Info

```shell
      System: node 24.18.1
    Platform: darwin (25.6.0)
   CPU Model: Apple M4 (10 cpus)
     Stencil: 5.0.0-beta.7
  TypeScript: 5.9.3
    Rolldown: 1.2.8
```

`signalBacking: true` in `stencil.config.ts`.

## Steps to Reproduce

1. `npm install`
2. `npm run test:issue1` — 2 of the 4 tests fail
3. `npm run test:issue2` — 2 type errors
4. `npm start` and open localhost:3333. Press *increment the signal*. Only the first line follows it. Then press *unrelated re-render*. The other two catch up and stop changing again.

## Code Reproduction URL

https://github.com/jgroth/stencil-5-signals

## Additional Information

For problem 1, `instance.render()` is called directly. Nothing wraps it in an effect:

```js
instance = allRenderFn ? instance.render() : instance.render && instance.render();
```

The only effects created are the ones per `@Prop` and `@State` that schedule an update, and the ones for `@Watch`. There is no config option to change this. So this may be on purpose rather than a mistake. If it is on purpose, it needs to be documented, because it decides what signals can and cannot be used for.

For problem 2, the runtime does support this. It sets the property directly, including objects and arrays:

```js
if (BUILD$1.vdomSignals && isSignalLike(newValue)) {
    attrMap.set(memberName, effect$1(() => {
        const curVal = newValue.value;
        setAccessor(elm, memberName, prevVal, curVal, isSvg, flags);
        prevVal = curVal;
    }));
    return;
}
```

`ReadonlySignal` and `Signal` do not appear in the public JSX attribute types at all. The hard part of fixing this is that types cannot read the build config. So every project would accept signals in JSX, even projects that never turned them on.

<details>
<summary>A possible fix for problem 1 suggested by my AI friend</summary>

`callRender` and `scheduleUpdate` are in the same module, and `$signalCleanup$` already exists for cleanup. So `render` could run inside an effect and ask for an update through the normal queue:

```js
if (BUILD.trackedRender) {
    hostRef.$renderDispose$?.();

    let vdom;
    let tracked = false;

    hostRef.$renderDispose$ = effect(() => {
        if (!tracked) {
            vdom = instance.render();   // signal reads are seen here
            tracked = true;
        } else {
            scheduleUpdate(hostRef, false);
        }
    });

    instance = vdom;
}
```

Render runs once, because `effect` calls its function right away. Four things would need care:

- State written during render becomes a cycle, and `@preact/signals-core` throws `Cycle detected`.
- The per-prop effects and this one could both schedule the same update. `scheduleUpdate` already checks `isQueuedForUpdate`, so this may be fine.
- The async render path is `BUILD.hydrateServerSide` only and would need to be left out.
- The cleanup order from one render to the next should follow the `$signalCleanup$` pattern.

This comes from reading `dist/runtime/client/runtime.js`, not from building Stencil from source.

</details>

To reproduce either problem you need a patched `@stencil/vitest`. Its plugin turns the signal build flags off in tests. 

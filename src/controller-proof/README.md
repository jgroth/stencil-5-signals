# Reactive controllers plus signals

Our state lives outside Stencil. A host application owns it and hands each piece out as something you can subscribe to. Components in many separate bundles read that state and have to re-render when it changes.

This folder is a small, complete version of that. Two folders, split by who writes the code. `lib/` is what the library ships. `consumer/` is what a component author writes.

```bash
npm run test:controllers   # 8 tests
npm start                  # localhost:3333/todo.html to click through
```

## The whole API a component author sees

```ts
import { observe, todos, filter } from '../lib';
```

One function, and one signal per piece of state.

```tsx
export const visibleTodos = computed(() => visible(todos.value, filter.value));

@Component({ tag: 'todo-list', encapsulation: { type: 'shadow' } })
export class TodoList extends Mixin(ReactiveControllerHost) {
    private todos = observe(this, visibleTodos);

    public render() {
        if (this.todos.value.length === 0) {
            return <p>nothing to show</p>;
        }

        return <ul>{this.todos.value.map((todo) => <li>{todo.title}</li>)}</ul>;
    }
}
```

`observe` takes state from the host app and a `computed` over it the same way, so there is nothing new to learn for derived state.

No `@State`, no `@Effect()`, and `render` is free to branch and to build lists.

## Why it is built this way

Two separate problems, two separate mechanisms.

**Getting a change to cause a re-render.** Reactive controllers. `observe` is the only controller, about seventy lines, and a component author never sees it.

**Deriving and sharing state.** Signals. A `computed` only notifies when its own value changes, memoises, and can be shared by every component without belonging to one.

Neither replaces the other. Without signals, a source changes, the derived value stays the same, and the component re-renders anyway.

The JSX signal path does not fit us. Putting a signal straight in JSX patches one DOM node and skips the render, so it only works for a child, an attribute, or `class`. Conditionals and list building cannot use it, and about half of our components do one or the other.

That has a useful consequence: **`signalBacking` is not needed.** These tests pass under the stock `@stencil/vitest` plugin, which turns the signal build flags off.

## lib/

| File | What it is |
| --- | --- |
| `store.ts` | the `subscribe` contract of the host app, plus a stand-in for it |
| `state.ts` | one signal per store |
| `observe.ts` | the whole re-render mechanism, about seventy lines |
| `index.ts` | the public surface |

`ReactiveController`, `addController` and `requestUpdate` never reach a component author. All they do is extend `Mixin(ReactiveControllerHost)` and call `observe`.

## consumer/

| File | What it is |
| --- | --- |
| `visible-todos.ts` | the derivation, a plain function plus a `computed` over it |
| `todo-list.tsx` | the component |
| `todo-demo.tsx` | buttons that push values into the store, so the page can be clicked through |

`todo-list` carries a `renders` counter it prints in its own output. A real component would not, but a lazy build does not expose plain fields on the element, so counting renders from outside is not possible. It is how the two "costs no render" tests are written and what the page shows.

## What the tests show

- a change in the host app reaches the component and re-renders it
- a conditional and a list both follow the state, which the JSX signal path cannot do
- a value derived from two sources updates when only one of them changes
- a source change that leaves the derived value unchanged costs no render
- an equal but newly built object does cost a render, so the source has to keep object identity stable
- one subscription per piece of state, however many components observe it
- the subscription is released when the element is removed
- the derivation is a plain function, testable with no component and no mocks

## One thing worth calling out

Deduping belongs in `observe`, not in the derivation. A `computed` that runs `filter` returns a fresh array every time, so its identity moves on every source change. Comparing at the point of render means a component author can write the obvious `computed`. Putting a `stableComputed` helper in the public surface instead just pushes the problem onto them.

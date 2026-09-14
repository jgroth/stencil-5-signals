# Problem 4: two copies of `@preact/signals-core` break signals, silently

`@stencil/core/signals` re-exports its primitives from `@preact/signals-core`. With two copies of that package around, a `computed` never sees a signal made by the other copy. Nothing is thrown, and the signal still notifies its own subscribers, so the data is right everywhere except on screen: a component renders once and then stops updating.

```bash
npm run test:issue4   # 1 of 4 tests fails
```

- `duplicate-copies.spec.ts` one failing test, plus three that pass and show the setup works
- `vitest.config.ts` plain vitest with no `dedupe`, because deduping hides this

The second copy is installed under an alias here, so `npm install` is all it takes. In a real project it arrives through `npm link`: a linked library resolves `@stencil/core` from its own `node_modules`, and that copy resolves its own `@preact/signals-core`, while the consumer resolves the one in its tree. A registry install has a single copy and is fine. Installing a second `@stencil/core` does not reproduce this, because npm hoists one `@preact/signals-core` and both copies share it.

`dist/signals/index.js` declares and exports `Symbol.for("stencil.signals")` and never reads it. That is the usual way a library lets duplicate copies find one shared instance. Registering the runtime under it and reusing an existing registration would fix this with nothing needed from consumers.

The alternative is exposing rolldown's `resolve.symlinks`, which Stencil's config has no equivalent of. Rolldown's own documentation names the case: "this may cause module resolution to fail when using tools that symlink packages (like npm link)".

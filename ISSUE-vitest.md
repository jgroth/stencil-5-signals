# bug: signals are always off, so a signal in JSX renders as empty in tests

## Prerequisites

- [x] I have searched for existing issues that already report this problem, without success.

## Package Version

1.15.1

## Stencil Version

5.0.0-beta.7

## Vitest Version

4.1.11

## Reproduction URL

https://github.com/jgroth/stencil-5-signals

## Describe the Bug

`signalBacking` and `vdomSignals` are build flags. The plugin transpiles component files without `buildOverrides`, and it never reads `stencil.config.ts`:

```js
const result = await transpile(code, {
    file: id,
    componentExport: 'customelement',
    componentMetadata: 'runtimestatic',
    currentDirectory: process.cwd(),
});
```

So both flags are always `false` in tests, whatever the project config says. A signal used in JSX then renders as an empty string, and no error is raised:

```
Expected: "signal in JSX: 1"
Received: "signal in JSX: .value in render: 1"
```

The label is there and the value is gone. A plain `.value` read in the same component still shows its first value. So this looks like a bug in the component rather than in the tooling.

The result is that a component that works in the browser cannot be unit tested once it uses signals.

Adding one option fixes it. `fixed-plugin.ts` in the reproduction is the same plugin plus:

```ts
buildOverrides: { signalBacking: true, vdomSignals: true },
```

With that, the signal checks pass.

## Steps to Reproduce

1. `npm install`
2. `npm run test:issue3` — 1 of the 2 tests fails
3. `npm run test:issue1` — the same components with `buildOverrides` added. The signal checks pass.

## Expected Behavior

`signalBacking` from `stencil.config.ts` is used in tests. Or `buildOverrides` can be passed through. Or it is available as a plugin option.

## Logs

```shell
      System: node 24.18.1
    Platform: darwin (25.6.0)
     Stencil: 5.0.0-beta.7
  TypeScript: 5.9.3
```

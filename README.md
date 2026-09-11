# Stencil 5 signals

Reproductions for problems with the signals support from [stenciljs/core#6733](https://github.com/stenciljs/core/pull/6733), plus a worked example of the pattern we want to use instead. Everything is on `@stencil/core@5.0.0-beta.7`.

```bash
npm install

npm run test:issue1      # 2 of 4 tests fail
npm run test:issue2      # 2 type errors
npm run test:issue3      # 1 of 2 tests fails

npm run test:controllers # 8 pass, the example

npm start                # localhost:3333, /index.html and /todo.html
```

| | Problem | Folder |
| --- | --- | --- |
| 1 | Stencil does not see which signals `render()` reads | [`src/issue1-render-does-not-update`](src/issue1-render-does-not-update) |
| 2 | JSX types do not accept a signal as a prop | [`src/issue2-jsx-types-reject-signal`](src/issue2-jsx-types-reject-signal) |
| 3 | signals are off under `@stencil/vitest` | [`src/issue3-signals-off-in-tests`](src/issue3-signals-off-in-tests) |

## The example

[`src/controller-proof`](src/controller-proof) is not a bug report. It is how we would read state that lives outside Stencil, using reactive controllers for the re-render and signals for the derivation, without the JSX signal path. `/todo.html` is the same thing to click through.

## Notes on the reproductions

The failing tests and the type errors are the reproductions. Some tests in the same files pass on purpose. They use the same setup, so they show the failures are not caused by a broken test setup.

Problem 2 only matters because of problem 1. Problem 3 is separate and the smallest, but it stops the other two from being tested at all. So problem 1's test config uses the patched plugin from problem 3's folder.

## Reporting

- [`ISSUE-core.md`](ISSUE-core.md) covers problems 1 and 2, which are in `@stencil/core`
- [`ISSUE-vitest.md`](ISSUE-vitest.md) covers problem 3, which is in `@stencil/vitest`

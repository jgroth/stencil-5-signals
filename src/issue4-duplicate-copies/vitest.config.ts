import { defineConfig } from 'vitest/config';

/**
 * Nothing here renders a component, so no Stencil environment and no patched
 * plugin. `dedupe` is left unset on purpose: deduping is what hides this.
 *
 * Run from the project root: npm run test:issue4
 */
export default defineConfig({
    test: {
        include: ['src/issue4-duplicate-copies/*.spec.ts'],
    },
});

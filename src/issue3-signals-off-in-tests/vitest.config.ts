import { defineVitestConfig } from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';

/**
 * The stock plugin, unmodified.
 *
 * Run from the project root: npm run test:issue3
 */
export default defineVitestConfig({
    plugins: [stencilVitestPlugin()],
    test: {
        environment: 'stencil',
        include: ['src/issue3-signals-off-in-tests/*.spec.tsx'],
    },
});

import { defineVitestConfig } from '@stencil/vitest/config';
import { signalsEnabledPlugin } from '../issue3-signals-off-in-tests/fixed-plugin';

/**
 * Uses the patched plugin from issue 3, because the stock one disables signals
 * in tests and would mask this issue entirely.
 *
 * Run from the project root: npm run test:issue1
 */
export default defineVitestConfig({
    plugins: [signalsEnabledPlugin()],
    test: {
        environment: 'stencil',
        include: ['src/issue1-render-does-not-update/*.spec.tsx'],
    },
});

import { defineVitestConfig } from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';

export default defineVitestConfig({
    plugins: [stencilVitestPlugin()],
    test: {
        environment: 'stencil',
        include: ['src/controller-proof/**/*.spec.tsx'],
    },
});

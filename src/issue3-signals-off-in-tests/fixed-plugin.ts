import { transpile } from '@stencil/core/compiler';
import type { Plugin } from 'vitest/config';

/**
 * `stencilVitestPlugin` with one addition, `buildOverrides`. That is all this
 * issue needs. Issue 1's tests use this plugin, because without it signals are
 * off in tests and issue 1 cannot be isolated.
 */
export function signalsEnabledPlugin(): Plugin {
    return {
        name: 'stencil-signals-enabled',
        enforce: 'pre',
        async transform(code: string, id: string) {
            const file = id.split('?')[0];
            if (file.includes('node_modules')) {
                return null;
            }

            const buildOverrides = { signalBacking: true, vdomSignals: true };

            if (file.endsWith('.tsx')) {
                const result = await transpile(code, {
                    file,
                    componentExport: 'customelement',
                    componentMetadata: 'runtimestatic',
                    currentDirectory: process.cwd(),
                    buildOverrides,
                });

                return { code: result.code, map: null };
            }

            if (file.endsWith('.ts')) {
                const result = await transpile(code, { file, buildOverrides });

                return { code: result.code, map: null };
            }

            return null;
        },
    };
}

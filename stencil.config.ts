import { Config } from '@stencil/core';

export const config: Config = {
    namespace: 'signal-issues',
    signalBacking: true,
    outputTargets: [{ type: 'www', copy: [{ src: 'todo.html' }] }],
};

import { expect, test } from 'vitest';

import { signal, computed } from '@stencil/core/signals';

// The second copy, by file path. The alias keeps its original name in
// package.json, so importing it by name lets the bundler merge the two.
import {
    signal as otherSignal,
    computed as otherComputed,
} from '../../node_modules/@preact/signals-core-copy/dist/signals-core.mjs';

test('the two copies are separate', () => {
    expect(signal).not.toBe(otherSignal);
    expect(computed).not.toBe(otherComputed);
});

test('a computed sees a signal from its own copy', () => {
    const source = signal(1);
    const doubled = computed(() => source.value * 2);

    expect(doubled.value).toBe(2);

    source.value = 5;

    expect(doubled.value).toBe(10);
});

test('a computed does not see a signal from the other copy', () => {
    const source = otherSignal(1);
    const doubled = computed(() => source.value * 2);

    expect(doubled.value).toBe(2);

    source.value = 5;

    // Reads 2, and nothing was thrown.
    expect(doubled.value).toBe(10);
});

test('the signal still notifies its own subscribers', () => {
    const source = otherSignal(1);
    const seen: number[] = [];

    source.subscribe((value: number) => {
        seen.push(value);
    });

    source.value = 5;

    expect(seen).toContain(5);
});

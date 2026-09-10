import { h } from '@stencil/core';
import { render } from '@stencil/vitest';
import { expect, test } from 'vitest';
import { count } from './count';
import './issue3';

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

async function renderIssue() {
    const page = await render(<issue-three />);
    await settle();

    return () => page.root.shadowRoot.textContent as string;
}

test('a signal in JSX renders its value', async () => {
    count.value = 1;
    const text = await renderIssue();

    expect(text()).toContain('signal in JSX: 1');
});

test('a plain .value read renders its initial value', async () => {
    count.value = 7;
    const text = await renderIssue();

    expect(text()).toContain('.value in render: 7');
});

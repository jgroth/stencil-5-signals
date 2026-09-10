import { forceUpdate, h } from '@stencil/core';
import { render } from '@stencil/vitest';
import { expect, test } from 'vitest';
import { count } from './count';
import './issue1';

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

async function renderIssue() {
    count.value = 1;

    const page = await render(<issue-one />);
    await settle();

    return {
        element: page.root,
        text: () => page.root.shadowRoot?.textContent as string,
    };
}

test('a signal passed into JSX updates', async () => {
    const { text } = await renderIssue();
    expect(text()).toContain('updates, signal in JSX: 1');

    count.value = 42;
    await settle();

    expect(text()).toContain('updates, signal in JSX: 42');
});

test('reading .value inside render() updates the component', async () => {
    const { text } = await renderIssue();
    expect(text()).toContain('does not update, .value in render: 1');

    count.value = 42;
    await settle();

    expect(text()).toContain('does not update, .value in render: 42');
});

test('a conditional on .value updates', async () => {
    const { text } = await renderIssue();
    expect(text()).toContain('conditional on .value: odd');

    count.value = 42;
    await settle();

    expect(text()).toContain('conditional on .value: even');
});

test('the old value catches up on an unrelated re-render', async () => {
    const { element, text } = await renderIssue();

    count.value = 42;
    await settle();
    expect(text()).toContain('does not update, .value in render: 1');

    forceUpdate(element);
    await settle();

    expect(text()).toContain('does not update, .value in render: 42');
});

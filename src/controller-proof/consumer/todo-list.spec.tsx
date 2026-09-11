import { h } from '@stencil/core';
import { render } from '@stencil/vitest';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { filterStore, todoStore } from '../lib/store';
import { visible } from './visible-todos';
import './todo-list';

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

const write = { id: 1, title: 'Write the code', done: true };
const ship = { id: 2, title: 'Ship it', done: false };
const rest = { id: 3, title: 'Take a break', done: false };

beforeEach(() => {
    todoStore.set([]);
    filterStore.set('all');
});

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

async function renderList() {
    const page = await render(<todo-list />);
    await settle();

    return {
        element: page.root,
        renders: () => (page.root as unknown as { renders: number }).renders,
        text: () => page.root.shadowRoot!.textContent as string,
    };
}

test('the derivation is a plain function, testable without a component', () => {
    expect(visible([write, ship], 'all')).toEqual([write, ship]);
    expect(visible([write, ship], 'done')).toEqual([write]);
});

test('a change in the host app re-renders the component', async () => {
    const { text } = await renderList();
    expect(text()).toContain('nothing to show');

    todoStore.set([write]);
    await settle();

    expect(text()).toContain('showing: 1');
    expect(text()).toContain('Write the code');
});

test('a conditional and a list both follow the state', async () => {
    const { text } = await renderList();
    todoStore.set([write, ship, rest]);
    await settle();

    expect(text()).toContain('Write the code');
    expect(text()).toContain('Ship it');
    expect(text()).toContain('Take a break');

    todoStore.set([]);
    await settle();

    expect(text()).toContain('nothing to show');
});

test('a change to one source updates a value derived from two', async () => {
    const { text } = await renderList();
    todoStore.set([write, ship]);
    await settle();
    expect(text()).toContain('showing: 2');

    filterStore.set('done');
    await settle();

    expect(text()).toContain('showing: 1');
    expect(text()).not.toContain('Ship it');
});

test('a source change that leaves the derived value the same costs no render', async () => {
    const { text, renders } = await renderList();
    filterStore.set('done');
    todoStore.set([write, ship]);
    await settle();

    const before = renders();
    expect(text()).toContain('showing: 1');

    todoStore.set([write, rest]);
    await settle();

    expect(text()).toContain('showing: 1');
    expect(renders()).toBe(before);
});

test('an equal but newly built object does cost a render', async () => {
    const { text, renders } = await renderList();
    todoStore.set([write]);
    await settle();

    const before = renders();

    todoStore.set([{ ...write }]);
    await settle();

    expect(text()).toContain('showing: 1');
    expect(renders()).toBe(before + 1);
});

test('one subscription per piece of state, however many components observe it', async () => {
    await renderList();
    await renderList();
    await renderList();

    expect(todoStore.subscriberCount()).toBe(1);
    expect(filterStore.subscriberCount()).toBe(1);
});

test('the subscription is released when the element is removed', async () => {
    const { element, text } = await renderList();
    todoStore.set([write]);
    await settle();
    expect(text()).toContain('Write the code');

    element.remove();
    await settle();
    const afterRemoval = (element as unknown as { renders: number }).renders;

    todoStore.set([write, ship]);
    await settle();

    expect((element as unknown as { renders: number }).renders).toBe(afterRemoval);
});


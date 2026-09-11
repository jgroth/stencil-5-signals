import { Component, h } from '@stencil/core';
import { filterStore, todoStore } from '../lib/store';
import type { Filter, Todo } from '../lib';

/**
 * Drives the store from the page so the example can be clicked through. A
 * harness standing in for the host application, not part of the API.
 */
@Component({ tag: 'todo-demo', encapsulation: { type: 'shadow' } })
export class TodoDemo {
    private items: Todo[] = [];
    private nextId = 1;

    public render() {
        return (
            <div>
                <button onClick={() => this.add(true)}>add a done todo</button>
                <button onClick={() => this.add(false)}>add an open todo</button>
                <button onClick={() => this.setFilter('all')}>show all</button>
                <button onClick={() => this.setFilter('done')}>show done only</button>
                <button onClick={() => this.clear()}>clear</button>
            </div>
        );
    }

    private add(done: boolean) {
        const title = `Todo ${this.nextId} (${done ? 'done' : 'open'})`;

        // spreading keeps the identity of the existing objects, which is what
        // lets observe skip a render when the visible list has not moved
        this.items = [...this.items, { id: this.nextId, title, done }];
        this.nextId++;
        todoStore.set(this.items);
    }

    private setFilter(mode: Filter) {
        filterStore.set(mode);
    }

    private clear() {
        this.items = [];
        todoStore.set(this.items);
    }
}

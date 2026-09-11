import { computed, signal } from '@stencil/core/signals';
import type { ReadonlySignal } from '@stencil/core/signals';
import { filterStore, todoStore } from './store';
import type { Filter, Store, Todo } from './store';

/**
 * One signal per store. The store is subscribed once, however many components
 * read it. The `computed` wrapper is there to hand out a value consumers cannot
 * write to.
 */
function fromStore<T>(store: Store<T>, initial: T): ReadonlySignal<T> {
    const state = signal(initial);
    store.subscribe((value) => {
        state.value = value;
    });

    return computed(() => state.value);
}

export const todos: ReadonlySignal<Todo[]> = fromStore(todoStore, []);
export const filter: ReadonlySignal<Filter> = fromStore(filterStore, 'all');

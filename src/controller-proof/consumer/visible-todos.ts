import { computed } from '@stencil/core/signals';
import { filter, todos } from '../lib';
import type { Filter, Todo } from '../lib';

/**
 * A plain function of plain values. No component, no host, no signals, so it
 * can be tested on its own.
 */
export function visible(items: Todo[], mode: Filter): Todo[] {
    if (mode === 'all') {
        return items;
    }

    return items.filter((item) => item.done);
}

/**
 * Derived state, shared by every component that observes it. `filter` returns a
 * fresh array each run, and that is fine: `observe` compares before asking for
 * a render.
 */
export const visibleTodos = computed(() => visible(todos.value, filter.value));

import { Component, h } from '@stencil/core';
import { computed } from '@stencil/core/signals';
import { count } from './count';
import type { Item } from './target';

/**
 * `issue-two-target` declares `label: string` and `items: Item[]`. The
 * computed signals below produce exactly those types. The
 * runtime accepts this. The JSX types do not, so this file does not compile.
 */
@Component({ tag: 'issue-two', encapsulation: { type: 'shadow' } })
export class IssueTwo {
    private label = computed((): string => `count is ${count.value}`);
    private items = computed((): Item[] => [{ label: String(count.value) }]);

    public render() {
        return <issue-two-target label={this.label} items={this.items} />;
    }
}

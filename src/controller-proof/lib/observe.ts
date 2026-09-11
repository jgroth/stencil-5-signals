import type { ReactiveController, ReactiveControllerHostInterface } from '@stencil/core';
import type { ReadonlySignal } from '@stencil/core/signals';

/**
 * Shallow compare. A `computed` that runs `filter` returns a fresh array every
 * time, so comparing by identity alone would re-render on every source change.
 */
function shallowEqual(previous: unknown, next: unknown): boolean {
    if (previous === next) {
        return true;
    }

    if (Array.isArray(previous) && Array.isArray(next)) {
        return (
            previous.length === next.length &&
            previous.every((item, index) => item === next[index])
        );
    }

    return false;
}

/** Not exported. The controller is an implementation detail. */
class SignalController<T> implements ReactiveController {
    private dispose?: () => void;
    private last?: T;

    constructor(
        private host: ReactiveControllerHostInterface,
        private source: ReadonlySignal<T>
    ) {
        host.addController(this);
    }

    public get value(): T {
        return this.source.value;
    }

    public hostConnected(): void {
        this.last = this.source.peek();

        this.dispose = this.source.subscribe((next) => {
            if (shallowEqual(this.last, next)) {
                return;
            }

            this.last = next;
            this.host.requestUpdate();
        });
    }

    public hostDisconnected(): void {
        this.dispose?.();
        this.dispose = undefined;
    }
}

/**
 * Observe a value in a component. Read `.value` anywhere in `render`, and the
 * component re-renders when the value changes.
 *
 * Works the same for state from the host app and for a value derived with
 * `computed`. Unchanged values cost no render, so a `computed` that builds a
 * fresh array each run is fine.
 *
 * @param host - the component, so always `this`
 * @param source - the state, or a `computed` over it
 */
export function observe<T>(
    host: ReactiveControllerHostInterface,
    source: ReadonlySignal<T>
): { readonly value: T } {
    return new SignalController(host, source);
}

/**
 * Stands in for our host application, which is not Stencil. It owns the state
 * and hands each piece out as something you can subscribe to. This is the
 * constraint the whole design starts from: the state does not live in a
 * component, and the code that owns it knows nothing about Stencil.
 */
export interface Store<T> {
    subscribe(callback: (value: T) => void): () => void;
}

export interface TestStore<T> extends Store<T> {
    set(value: T): void;
    subscriberCount(): number;
}

export function createStore<T>(initial: T): TestStore<T> {
    let current = initial;
    const listeners = new Set<(value: T) => void>();

    return {
        set(value: T) {
            current = value;
            listeners.forEach((listener) => listener(value));
        },

        subscriberCount: () => listeners.size,

        subscribe(callback) {
            listeners.add(callback);
            callback(current);

            return () => {
                listeners.delete(callback);
            };
        },
    };
}

export interface Todo {
    id: number;
    title: string;
    done: boolean;
}

export type Filter = 'all' | 'done';

export const todoStore = createStore<Todo[]>([]);
export const filterStore = createStore<Filter>('all');

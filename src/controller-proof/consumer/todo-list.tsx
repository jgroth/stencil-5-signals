import { Component, Mixin, ReactiveControllerHost, h } from '@stencil/core';
import { observe } from '../lib';
import { visibleTodos } from './visible-todos';

@Component({ tag: 'todo-list', encapsulation: { type: 'shadow' } })
export class TodoList extends Mixin(ReactiveControllerHost) {
    /** Counts renders, so the proof can show none are wasted. */
    public renders = 0;

    private todos = observe(this, visibleTodos);

    public render() {
        this.renders++;

        if (this.todos.value.length === 0) {
            return <p>nothing to show, renders: {this.renders}</p>;
        }

        return (
            <div>
                <p>
                    showing: {this.todos.value.length}, renders: {this.renders}
                </p>
                <ul>
                    {this.todos.value.map((todo) => (
                        <li>{todo.title}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

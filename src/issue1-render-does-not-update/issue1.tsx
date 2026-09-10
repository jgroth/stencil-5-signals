import { Component, State, h } from '@stencil/core';
import { count } from './count';

@Component({ tag: 'issue-one', encapsulation: { type: 'shadow' } })
export class IssueOne {
    /** Only here to trigger a re-render unrelated to the signal. */
    @State() private nudge = 0;

    public render() {
        return (
            <div>
                <p>
                    <button onClick={() => (count.value = count.value + 1)}>
                        increment the signal
                    </button>{' '}
                    <button onClick={() => this.nudge++}>
                        unrelated re-render ({this.nudge})
                    </button>
                </p>

                <p>updates, signal in JSX: {count}</p>
                <p>does not update, .value in render: {count.value}</p>
                <p>
                    does not update, conditional on .value:{' '}
                    {count.value % 2 === 0 ? 'even' : 'odd'}
                </p>
            </div>
        );
    }
}

import { Component, h } from '@stencil/core';
import { count } from './count';

@Component({ tag: 'issue-three', encapsulation: { type: 'shadow' } })
export class IssueThree {
    public render() {
        return (
            <div>
                <p>signal in JSX: {count}</p>
                <p>.value in render: {count.value}</p>
            </div>
        );
    }
}

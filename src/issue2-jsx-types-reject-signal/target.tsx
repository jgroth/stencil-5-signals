import { Component, Prop, h } from '@stencil/core';

export interface Item {
    label: string;
}

/** An ordinary component with ordinary typed props. */
@Component({ tag: 'issue-two-target', encapsulation: { type: 'shadow' } })
export class IssueTwoTarget {
    @Prop() public label!: string;
    @Prop() public items: Item[] = [];

    public render() {
        return (
            <div>
                {this.label}
                <ul>
                    {this.items.map((i) => (
                        <li>{i.label}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

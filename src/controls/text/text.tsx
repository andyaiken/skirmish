import { Component } from 'react';

import './text.scss';

export enum TextType {
	Default = 'default',
	Heading = 'heading',
	SubHeading = 'subheading',
	Information = 'information'
}

interface Props {
	type: TextType;
	children: JSX.Element | string | number | null | (JSX.Element | string | number | null)[];
}

export class Text extends Component<Props> {
	public static defaultProps = {
		type: TextType.Default
	};

	public render = () => {
		const className = `skirmish-text ${this.props.type}`;
		return (
			<div className={className}>
				{this.props.children}
			</div>
		);
	};
}

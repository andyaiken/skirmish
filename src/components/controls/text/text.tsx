import { Component } from 'react';

import './text.scss';

export enum TextType {
	Default = 'default',
	Heading = 'heading',
	SubHeading = 'subheading',
	MinorHeading = 'minorheading',
	ListItem = 'listitem',
	Information = 'information',
	Small = 'small'
}

interface Props {
	type: TextType;
	children: (JSX.Element | number | string | null)[] | JSX.Element | number | string | null;
}

export class Text extends Component<Props> {
	static defaultProps = {
		type: TextType.Default
	};

	render = () => {
		const className = `skirmish-text ${this.props.type}`;
		return (
			<div className={className}>
				{this.props.children}
			</div>
		);
	};
}

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
		try {
			return (
				<div className={`skirmish-text ${this.props.type}`}>
					{this.props.children}
				</div>
			);
		} catch {
			return <div className='skirmish-text render-error' />;
		}
	};
}

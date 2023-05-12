import { Component } from 'react';

import { Text, TextType } from '../../controls';

import './placeholder-card.scss';

interface Props {
	text: string | JSX.Element;
	subtext: string | JSX.Element | null;
}

export class PlaceholderCard extends Component<Props> {
	static defaultProps = {
		subtext: null
	};

	render = () => {
		return (
			<div className='placeholder-card'>
				{this.props.text ? <Text type={TextType.SubHeading}>{this.props.text}</Text> : null}
				{this.props.subtext ? <hr /> : null}
				{this.props.subtext ? <Text type={TextType.Small}>{this.props.subtext}</Text> : null}
			</div>
		);
	};
}

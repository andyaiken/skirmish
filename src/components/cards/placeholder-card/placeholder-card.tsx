import { Component } from 'react';

import { Text, TextType } from '../../../controls';

import './placeholder-card.scss';

interface Props {
	text: string;
}

export class PlaceholderCard extends Component<Props> {
	render = () => {
		return (
			<div className='placeholder-card'>
				<Text type={TextType.SubHeading}>{this.props.text}</Text>
			</div>
		);
	};
}

import { Component } from 'react';

import { Text, TextType } from '../../controls';

import './placeholder-card.scss';

interface Props {
	children: string | JSX.Element | JSX.Element[];
}

export class PlaceholderCard extends Component<Props> {
	render = () => {
		if (typeof(this.props.children) === 'string') {
			return (
				<div className='placeholder-card'>
					<Text type={TextType.SubHeading}>{this.props.children}</Text>
				</div>
			);
		}

		return (
			<div className='placeholder-card'>
				{this.props.children}
			</div>
		);
	};
}

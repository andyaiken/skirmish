import { Component, MouseEvent } from 'react';

import { Text, TextType } from '../../controls';

import './placeholder-card.scss';

// TODO: Rename this to PlayingCardFace
// TODO: Create a new card type, PlainCard

interface Props {
	text: string | JSX.Element;
	subtext: string | JSX.Element | null;
	onClick: (() => void) | null;
}

export class PlaceholderCard extends Component<Props> {
	static defaultProps = {
		subtext: null,
		onClick: null
	};

	onClick = (e: MouseEvent) => {
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	render = () => {
		const className = this.props.onClick ? 'placeholder-card clickable' : 'placeholder-card';

		return (
			<div className={className} onClick={this.onClick}>
				{this.props.text ? <Text type={TextType.SubHeading}>{this.props.text}</Text> : null}
				{this.props.text && this.props.subtext ? <hr /> : null}
				{this.props.subtext ? <Text type={TextType.Small}>{this.props.subtext}</Text> : null}
			</div>
		);
	};
}

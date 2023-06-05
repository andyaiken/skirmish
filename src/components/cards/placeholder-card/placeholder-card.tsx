import { Component, MouseEvent } from 'react';

import './placeholder-card.scss';

// TODO: Rename this to PlayingCardFace, and add it to the PlayingCard file
// TODO: Create a new card type, SimpleCard, which uses PlayingCard like the others

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
				{this.props.text ? <div className='main-text'>{this.props.text}</div> : null}
				{this.props.text && this.props.subtext ? <hr /> : null}
				{this.props.subtext ? <div className='sub-text'>{this.props.subtext}</div> : null}
			</div>
		);
	};
}

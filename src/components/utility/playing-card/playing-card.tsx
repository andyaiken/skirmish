import { Component } from 'react';

import './playing-card.scss';

export enum PlayingCardSide {
	Front = 'front',
	Back = 'back'
}

interface Props {
	front: JSX.Element | string;
	back: JSX.Element | string;
	display: PlayingCardSide;
	onClick: (() => void) | null;
}

export class PlayingCard extends Component<Props> {
	public static defaultProps = {
		back: null,
		display: PlayingCardSide.Front,
		onClick: null
	};

	onClick = () => {
		if (this.props.onClick) {
			this.props.onClick();
		}
	}

	public render() {
		let className = 'playing-card';
		if (this.props.onClick) {
			className += ' clickable';
		}
		if (this.props.display === PlayingCardSide.Back) {
			className += ' flipped';
		}
		return (
			<div className={className} onClick={this.onClick}>
				<div className='playing-card-inner'>
					<div className='playing-card-front'>
						{this.props.front}
					</div>
					<div className='playing-card-back'>
						{this.props.back}
					</div>
				</div>
			</div>
		);
	}
}

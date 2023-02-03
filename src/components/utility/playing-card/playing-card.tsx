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
	onClick: () => void;
}

export class PlayingCard extends Component<Props> {
	public static defaultProps = {
		back: null,
		display: PlayingCardSide.Front,
		onClick: () => null
	};

	public render() {
		const className = this.props.display === PlayingCardSide.Front ? 'playing-card' : 'playing-card flipped';
		return (
			<div className={className} onClick={this.props.onClick} role='button'>
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

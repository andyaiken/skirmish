import { Component } from 'react';

import './playing-card.scss';

type CardType = 'default' | 'hero' | 'species' | 'role' | 'background' | 'item' | 'boon' | 'feature' | 'action' | 'universal';

export enum PlayingCardSide {
	Front = 'front',
	Back = 'back'
}

interface Props {
	type: CardType;
	front: JSX.Element | string | null;
	back: JSX.Element | string | null;
	footer: JSX.Element | string | null;
	footerType: CardType;
	display: PlayingCardSide;
	onClick: (() => void) | null;
}

export class PlayingCard extends Component<Props> {
	static defaultProps = {
		type: 'default',
		back: null,
		footer: null,
		footerType: 'default',
		display: PlayingCardSide.Front,
		onClick: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			display: props.display
		};
	}

	onClick = () => {
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	render = () => {
		let className = 'playing-card';
		if (this.props.onClick !== null) {
			className += ' clickable';
		}
		if (this.props.display === PlayingCardSide.Back) {
			className += ' flipped';
		}
		const hasFront = (this.props.front !== null) && (this.props.front !== '');
		const hasFooter = (this.props.footer !== null) && (this.props.footer !== '');
		return (
			<div className={className} onClick={this.onClick}>
				<div className='playing-card-inner'>
					<div className={`playing-card-front ${this.props.type}`}>
						{hasFront ? <div className='front-content'>{this.props.front}</div> : null }
						{hasFooter ? <div className={`front-footer ${this.props.footerType}`}>{this.props.footer}</div> : null }
					</div>
					<div className={`playing-card-back ${this.props.type}`}>
						{this.props.back}
					</div>
				</div>
			</div>
		);
	};
}

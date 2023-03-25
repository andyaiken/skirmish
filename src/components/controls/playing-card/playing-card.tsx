import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { Random } from '../../../utils/random';

import './playing-card.scss';

export enum PlayingCardSide {
	Front = 'front',
	Back = 'back'
}

interface Props {
	stack: boolean;
	type: CardType;
	front: JSX.Element | string | null;
	back: JSX.Element | string | null;
	footer: JSX.Element | string | null;
	footerType: CardType | null;
	display: PlayingCardSide;
	onClick: (() => void) | null;
}

export class PlayingCard extends Component<Props> {
	static defaultProps = {
		stack: false,
		type: CardType.Default,
		back: null,
		footer: null,
		footerType: null,
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

		const stack = [];
		if (this.props.stack) {
			for (let n = 0; n !== 3; ++n) {
				const degrees = (Random.randomDecimal() * 10) - 5;
				const offsetX = (Random.randomDecimal() * 10) - 5;
				const offsetY = (Random.randomDecimal() * 10) - 5;
				stack.push(
					<div
						key={n}
						className={`stack-card ${this.props.type.toLowerCase()}`}
						style={
							{
								transform: `rotate(${degrees}deg)`,
								left: `${offsetX}px`,
								top: `${offsetY}px`
							}
						}
					/>
				);
			}
		}

		const hasFront = (this.props.front !== null) && (this.props.front !== '');
		const hasFooter = (this.props.footer !== null) && (this.props.footer !== '');
		const footerType = this.props.footerType || this.props.type;

		return (
			<div className={className} onClick={this.onClick}>
				{stack}
				<div className='playing-card-inner' style={this.props.stack ? { transform: `rotate(${(Random.randomDecimal() * 6) - 3}deg)` } : {}}>
					<div className={`playing-card-front ${this.props.type.toLowerCase()}`}>
						{hasFront ? <div className='front-content'>{this.props.front}</div> : null }
						{hasFooter ? <div className={`front-footer ${footerType.toLowerCase()}`}>{this.props.footer}</div> : null }
					</div>
					<div className={`playing-card-back ${this.props.type.toLowerCase()}`}>
						{this.props.back}
					</div>
				</div>
			</div>
		);
	};
}

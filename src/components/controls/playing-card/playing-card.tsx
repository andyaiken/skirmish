import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

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
	front: JSX.Element;
	back: JSX.Element | null;
	footer: JSX.Element | string | null;
	footerType: CardType | null;
	onClick: (() => void) | null;
}

interface State {
	display: PlayingCardSide;
}

export class PlayingCard extends Component<Props, State> {
	static defaultProps = {
		stack: false,
		type: CardType.Default,
		back: null,
		footer: null,
		footerType: null,
		onClick: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			display: PlayingCardSide.Front
		};
	}

	onClick = () => {
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	flip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			display: this.state.display === PlayingCardSide.Front ? PlayingCardSide.Back : PlayingCardSide.Front
		});
	};

	render = () => {
		let className = 'playing-card';
		if (this.props.onClick !== null) {
			className += ' clickable';
		}
		if (this.state.display === PlayingCardSide.Back) {
			className += ' flipped';
		}

		const stack = [];
		if (this.props.stack) {
			for (let n = 0; n !== 10; ++n) {
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

		const hasFooter = (this.props.footer !== null);
		const footerType = this.props.footerType || this.props.type;

		return (
			<div className={className} onClick={this.onClick}>
				{stack}
				<div className='playing-card-inner'>
					<div className={`playing-card-front ${this.props.type.toLowerCase()}`}>
						{ this.props.back !== null ? <button className='icon-btn' onClick={e => this.flip(e)}><IconRefresh /></button> : null }
						<div className='front-content'>{this.props.front}</div>
						{ hasFooter ? <div className={`front-footer ${footerType.toLowerCase()}`}>{this.props.footer}</div> : null }
					</div>
					<div className={`playing-card-back ${this.props.type.toLowerCase()}`}>
						<button className='icon-btn' onClick={e => this.flip(e)}><IconRefresh /></button>
						{this.props.back}
					</div>
				</div>
			</div>
		);
	};
}

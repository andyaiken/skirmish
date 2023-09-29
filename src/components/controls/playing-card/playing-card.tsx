import { Component, MouseEvent } from 'react';

import { CardType } from '../../../enums/card-type';
import { Random } from '../../../utils/random';

import './playing-card.scss';

interface Props {
	stack: boolean;
	type: CardType;
	front: JSX.Element;
	back: JSX.Element | null;
	footerText: string;
	footerContent: JSX.Element[];
	footerType: CardType | null;
	flipped: boolean;
	disabled: boolean;
	onClick: ((e: MouseEvent) => void) | null;
}

export class PlayingCard extends Component<Props> {
	static defaultProps = {
		stack: false,
		type: CardType.Default,
		back: null,
		footerText: '',
		footerContent: [],
		footerType: null,
		flipped: false,
		disabled: false,
		onClick: null
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(e);
		}
	};

	render = () => {
		try {
			let className = 'playing-card';
			if ((this.props.onClick !== null) && !this.props.disabled) {
				className += ' clickable';
			}
			if (this.props.flipped) {
				className += ' flipped';
			}
			if (this.props.disabled) {
				className += ' disabled';
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

			const hasFooter = (this.props.footerText !== '') || (this.props.footerContent.length !== 0);
			const footerType = (this.props.footerType || this.props.type).toLowerCase();

			return (
				<div className={className} onClick={this.onClick}>
					{stack}
					<div className='playing-card-inner'>
						<div className={`playing-card-front ${this.props.type.toLowerCase()}`}>
							<div className='card-content'>{this.props.front}</div>
							{
								hasFooter ?
									<div className={`card-footer ${footerType}`}>
										<div className={this.props.footerContent.length === 0 ? 'card-footer-text card-footer-text-full' : 'card-footer-text card-footer-text-left'}>
											{this.props.footerText}
										</div>
										<div className='card-footer-content'>
											{this.props.disabled ? null : this.props.footerContent}
										</div>
									</div>
									: null
							}
						</div>
						<div className={`playing-card-back ${this.props.type.toLowerCase()}`}>
							<div className='card-content'>{this.props.back}</div>
							{
								hasFooter ?
									<div className={`card-footer ${footerType}`}>
										<div className={this.props.footerContent.length === 0 ? 'card-footer-text card-footer-text-full' : 'card-footer-text card-footer-text-left'}>
											{this.props.footerText}
										</div>
										<div className='card-footer-content'>
											{this.props.disabled ? null : this.props.footerContent}
										</div>
									</div>
									: null
							}
						</div>
					</div>
				</div>
			);
		} catch {
			return <div className='playing-card render-error' />;
		}
	};
}

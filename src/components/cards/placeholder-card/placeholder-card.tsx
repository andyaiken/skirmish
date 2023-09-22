import { Component, MouseEvent } from 'react';

import './placeholder-card.scss';

interface Props {
	text: string | JSX.Element | null;
	subtext: string | JSX.Element | null;
	content: JSX.Element | null;
	onClick: (() => void) | null;
}

export class PlaceholderCard extends Component<Props> {
	static defaultProps = {
		text: null,
		subtext: null,
		content: null,
		onClick: null
	};

	onClick = (e: MouseEvent) => {
		if (this.props.onClick) {
			this.props.onClick();
		}
	};

	render = () => {
		let className = 'placeholder-card';
		if (this.props.onClick) {
			className += ' clickable';
		}

		// Text only
		if (this.props.text && !this.props.subtext && !this.props.content) {
			className += ' centered';
			return (
				<div className={className} onClick={this.onClick}>
					<div className='main-text'>{this.props.text}</div>
				</div>
			);
		}

		// Subtext only
		if (!this.props.text && this.props.subtext && !this.props.content) {
			className += ' centered';
			return (
				<div className={className} onClick={this.onClick}>
					<div className='sub-text'>{this.props.subtext}</div>
				</div>
			);
		}

		// Content only
		if (!this.props.text && !this.props.subtext && this.props.content) {
			className += ' centered';
			return (
				<div className={className} onClick={this.onClick}>
					{this.props.content}
				</div>
			);
		}

		return (
			<div className={className} onClick={this.onClick}>
				{this.props.text ? <div className='main-text'>{this.props.text}</div> : null}
				{this.props.subtext ? <div className='sub-text'>{this.props.subtext}</div> : null}
				{this.props.content}
			</div>
		);
	};
}

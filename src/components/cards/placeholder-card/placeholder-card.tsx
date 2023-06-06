import { Component, MouseEvent } from 'react';

import './placeholder-card.scss';

interface Props {
	text: string;
	subtext: string;
	content: JSX.Element | null;
	onClick: (() => void) | null;
}

export class PlaceholderCard extends Component<Props> {
	static defaultProps = {
		text: '',
		subtext: '',
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

		return (
			<div className={className} onClick={this.onClick}>
				{this.props.text ? <div className='main-text'>{this.props.text}</div> : null}
				{this.props.subtext ? <div className='sub-text'>{this.props.subtext}</div> : null}
				{this.props.content}
			</div>
		);
	};
}

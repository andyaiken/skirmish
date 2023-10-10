import { Component } from 'react';

import './placeholder-card.scss';

interface Props {
	text: string | null;
	subtext: string | null;
	content: JSX.Element | null;
}

export class PlaceholderCard extends Component<Props> {
	static defaultProps = {
		text: null,
		subtext: null,
		content: null
	};

	render = () => {
		// Text only
		if (this.props.text && !this.props.subtext && !this.props.content) {
			return (
				<div className='placeholder-card centered'>
					<div className='main-text'>{this.props.text}</div>
				</div>
			);
		}

		// Subtext only
		if (!this.props.text && this.props.subtext && !this.props.content) {
			return (
				<div className='placeholder-card centered'>
					<div className='sub-text'>{this.props.subtext}</div>
				</div>
			);
		}

		// Content only
		if (!this.props.text && !this.props.subtext && this.props.content) {
			return (
				<div className='placeholder-card centered'>
					{this.props.content}
				</div>
			);
		}

		return (
			<div className='placeholder-card'>
				{this.props.text ? <div className='main-text'>{this.props.text}</div> : null}
				{this.props.subtext ? <div className='sub-text'>{this.props.subtext}</div> : null}
				{this.props.content}
			</div>
		);
	};
}

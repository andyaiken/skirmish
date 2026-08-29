import { Component, ReactNode } from 'react';

import './stat-value.scss';

interface Props {
	orientation: 'horizontal' | 'vertical' | 'compact';
	label: ReactNode;
	value: ReactNode;
}

export class StatValue extends Component<Props> {
	static defaultProps = {
		orientation: 'horizontal'
	};

	render = () => {
		const label = (
			<div className='stat-value-label'>
				{this.props.label}
			</div>
		);

		let value = null;
		if (Array.isArray(this.props.value)) {
			value = (
				<div className='stat-value-list'>
					{this.props.value.map((v, n) => (<div key={n} className='stat-value-value'>{v}</div>))}
				</div>
			);
		} else {
			value = (
				<div className='stat-value-value'>
					{this.props.value}
				</div>
			);
		}

		if (this.props.orientation === 'vertical') {
			return (
				<div className='stat-value vertical'>
					{value}
					{label}
				</div>
			);
		}

		let className = `stat-value ${this.props.orientation}`;
		if (!this.props.value) {
			className += ' zero';
		}

		return (
			<div className={className}>
				{label}
				{value}
			</div>
		);
	};
}

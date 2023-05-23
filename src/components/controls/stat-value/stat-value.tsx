import { Component } from 'react';

import './stat-value.scss';

interface Props {
	orientation: 'horizontal' | 'vertical' | 'compact';
	label: JSX.Element | number | string;
	value: (JSX.Element | number | string)[] | JSX.Element | number | string;
}

export class StatValue extends Component<Props> {
	static defaultProps = {
		orientation: 'horizontal'
	};

	render = () => {
		try {
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

			if (this.props.orientation === 'compact') {
				return (
					<div className='stat-value compact'>
						{label}
						{value}
					</div>
				);
			}

			return (
				<div className='stat-value horizontal'>
					{label}
					{value}
				</div>
			);
		} catch {
			return <div className='stat-value render-error' />;
		}
	};
}

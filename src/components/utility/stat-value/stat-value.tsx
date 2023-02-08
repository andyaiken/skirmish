import { Component } from 'react';

import './stat-value.scss';

interface Props {
	orientation: 'horizontal' | 'vertical';
	label: number | string | JSX.Element;
	value: number | string | JSX.Element | (number | string | JSX.Element)[];
}

export class StatValue extends Component<Props> {
	static defaultProps = {
		orientation: 'horizontal'
	};

	public render() {
		if (Array.isArray(this.props.value)) {
			return (
				<div className='stat-value horizontal'>
					<div className='stat-value-label'>
						{this.props.label}
					</div>
					<div className='stat-value-list'>
						{this.props.value.map((v, n) => (<div key={n} className='stat-value-value'>{v}</div>))}
					</div>
				</div>
			);
		}

		if (this.props.orientation === 'vertical') {
			return (
				<div className='stat-value vertical'>
					<div className='stat-value-value'>
						{this.props.value}
					</div>
					<div className='stat-value-label'>
						{this.props.label}
					</div>
				</div>
			);
		}

		return (
			<div className='stat-value horizontal'>
				<div className='stat-value-label'>
					{this.props.label}
				</div>
				<div className='stat-value-value'>
					{this.props.value}
				</div>
			</div>
		);
	}
}

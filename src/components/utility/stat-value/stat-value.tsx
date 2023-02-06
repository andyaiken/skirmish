import { Component } from 'react';

import './stat-value.scss';

interface StatValueProps {
	label: number | string | JSX.Element;
	value: number | string | JSX.Element;
}

export class StatValue extends Component<StatValueProps> {
	public render() {
		return (
			<div className='stat-value'>
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

interface StatValueListProps {
	label: number | string | JSX.Element;
	values: (number | string | JSX.Element)[];
}

export class StatValueList extends Component<StatValueListProps> {
	public render() {
		return (
			<div className='stat-value stat-list'>
				<div className='stat-value-label'>
					{this.props.label}
				</div>
				<div className='stat-value-list'>
					{this.props.values.map((v, n) => (<div key={n} className='stat-value-value'>{v}</div>))}
				</div>
			</div>
		);
	}
}

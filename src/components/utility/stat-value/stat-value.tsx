import { Component } from 'react';

import './stat-value.scss';

interface Props {
	label: number | string | JSX.Element;
	value: number | string | JSX.Element;
}

export class StatValue extends Component<Props> {
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

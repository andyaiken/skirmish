import { Component } from 'react';

import './developer.scss';

interface DeveloperProps {
	children: JSX.Element | JSX.Element[];
}

export class Developer extends Component<DeveloperProps> {
	render = () => {
		return (
			<div className='developer' title='For Developer Use'>
				{this.props.children}
			</div>
		);
	};
}

interface NotImplementedProps {
	children: JSX.Element | JSX.Element[];
}

export class NotImplemented extends Component<NotImplementedProps> {
	render = () => {
		return (
			<div className='not-implemented' title='Not Implemented'>
				{this.props.children}
			</div>
		);
	};
}

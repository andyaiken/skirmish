import { Component } from 'react';

import './box.scss';

interface Props {
	label: string;
	children: JSX.Element | null | (JSX.Element | null)[];
}

export class Box extends Component<Props> {
	render = () => {
		return (
			<div className='box'>
				<div className='box-content'>
					{this.props.children}
				</div>
				<div className='box-label'>
					{this.props.label}
				</div>
			</div>
		);
	};
}

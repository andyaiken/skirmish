import { Component } from 'react';

import './tag.scss';

interface Props {
	children: JSX.Element | string | number | null | (JSX.Element | string | number | null)[];
}

export class Tag extends Component<Props> {
	public render = () => {
		return (
			<div className='tag'>
				{this.props.children}
			</div>
		);
	};
}

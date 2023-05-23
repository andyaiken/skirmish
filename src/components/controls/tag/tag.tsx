import { Component } from 'react';

import './tag.scss';

interface Props {
	children: (JSX.Element | number | string | null)[] | JSX.Element | number | string | null;
}

export class Tag extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='tag'>
					{this.props.children}
				</div>
			);
		} catch {
			return <div className='tag render-error' />;
		}
	};
}

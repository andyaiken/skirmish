import { Component } from 'react';

import './list-item-panel.scss';

interface Props {
	item: string;
}

export class ListItemPanel extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='list-item-panel'>
					{this.props.item}
				</div>
			);
		} catch {
			return <div className='list-item-panel render-error' />;
		}
	};
}

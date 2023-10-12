import { Component } from 'react';

import { CardGridPanel } from '../../../panels';

import './dev-page.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

export class DevPage extends Component<Props> {
	render = () => {
		try {
			const content = <CardGridPanel />;
			return (
				<div className='dev-page'>
					{content}
				</div>
			);
		} catch {
			return <div className='dev-page render-error' />;
		}
	};
}

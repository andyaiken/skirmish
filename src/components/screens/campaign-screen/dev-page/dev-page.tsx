import { Component } from 'react';

import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';

import { CardGridPanel } from '../../../panels';

import './dev-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
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

import { Component } from 'react';

import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';

import { Format } from '../../../../utils/format';

import { StatValue, Text } from '../../../controls';

import './about-tab.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
}

export class AboutTab extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='about-tab'>
					<Text>Skirmish designed by <a href='mailto:andy.aiken@live.co.uk'>Andy Aiken</a>; © Andy Aiken 2024</Text>
					<hr />
					<StatValue label='Version' value={this.props.options.version} />
					<hr />
					<StatValue label='Data size' value={this.props.game ? Format.toSize(JSON.stringify(this.props.game).length) : 0} />
					<StatValue label='Options size' value={Format.toSize(JSON.stringify(this.props.options).length)} />
				</div>
			);
		} catch {
			return <div className='about-tab render-error' />;
		}
	};
}

import { Component } from 'react';

import type { OptionsModel } from '../../../../models/options';

import { Platform } from '../../../../platform/platform';

import { CardListPanel } from './card-list/card-list-panel';
import { DamageListPanel } from './damage-list/damage-list-panel';
import { EffectListPanel } from './effect-list/effect-list-panel';
import { Tabs } from '../../../controls';

import './dev-page.scss';

interface Props {
	options: OptionsModel;
	platform: Platform;
}

interface State {
	view: string;
}

export class DevPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'cards'
		};
	}

	render = () => {
		try {
			const options = [
				{ id: 'cards', display: 'Cards' },
				{ id: 'damage', display: 'Damage' },
				{ id: 'effects', display: 'Effects' }
			];

			let content = null;
			switch (this.state.view) {
				case 'cards':
					content = <CardListPanel options={this.props.options} platform={this.props.platform} />;
					break;
				case 'damage':
					content = <DamageListPanel options={this.props.options} platform={this.props.platform} />;
					break;
				case 'effects':
					content = <EffectListPanel options={this.props.options} platform={this.props.platform} />;
					break;
			}

			return (
				<div className='dev-page'>
					<Tabs options={options} selectedID={this.state.view} onSelect={id => this.setState({ view: id })} />
					<div className='dev-page-content'>
						{content}
					</div>
				</div>
			);
		} catch {
			return <div className='dev-page render-error' />;
		}
	};
}

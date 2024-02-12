import { Component } from 'react';
import { IconCodeCircle2 } from '@tabler/icons-react';

import type { OptionsModel } from '../../../models/options';

import { CardPage } from './card-page/card-page';
import { DamagePage } from './damage-page/damage-page';
import { EffectPage } from './effect-page/effect-page';
import { LogoPanel } from '../../panels';
import { Tabs } from '../../controls';

import './backstage-screen.scss';

interface Props {
	options: OptionsModel;
	toggleBackstage: () => void;
}

interface State {
	view: string;
}

export class BackstageScreen extends Component<Props, State> {
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
					content = <CardPage options={this.props.options} />;
					break;
				case 'damage':
					content = <DamagePage options={this.props.options} />;
					break;
				case 'effects':
					content = <EffectPage options={this.props.options} />;
					break;
			}

			return (
				<div className='backstage-screen'>
					<div className='backstage-top-bar'>
						<div className='branding'>
							<LogoPanel text='Skirmish - Backstage' size={36} />
						</div>
						<div className='buttons'>
							<button className='icon-btn developer checked' title='Backstage' onClick={this.props.toggleBackstage}><IconCodeCircle2 /></button>
						</div>
					</div>
					<Tabs options={options} selectedID={this.state.view} onSelect={id => this.setState({ view: id })} />
					<div className='backstage-content'>
						{content}
					</div>
				</div>
			);
		} catch {
			return <div className='backstage-screen render-error' />;
		}
	};
}

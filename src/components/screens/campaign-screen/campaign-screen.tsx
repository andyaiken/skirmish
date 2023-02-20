import { Component } from 'react';

import type { BoonModel } from '../../../models/boon';
import type { CampaignMapRegionModel } from '../../../models/campaign-map';
import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { Selector } from '../../../controls';

import { CampaignMapPage } from './campaign-map-page/campaign-map-page';
import { HeroesPage } from './heroes-page/heroes-page';
import { OptionsPage } from './options-page/options-page';

import './campaign-screen.scss';

interface Props {
	game: GameModel;
	addHero: (hero: CombatantModel) => void;
	incrementXP: (hero: CombatantModel) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null) => void;
	startEncounter: (region: CampaignMapRegionModel, heroes: CombatantModel[]) => void;
	endCampaign: () => void;
}

interface State {
	page: string;
}

export class CampaignScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		let page = 'map';
		if (props.game.heroes.some(h => h.name === '') || props.game.heroes.some(h => h.xp >= h.level)) {
			page = 'heroes';
		}
		this.state = {
			page: page
		};
	}

	setPage = (page: string) => {
		this.setState({
			page: page
		});
	};

	public render() {
		let content = null;
		switch (this.state.page) {
			case 'heroes':
				content = (
					<HeroesPage
						game={this.props.game}
						addHero={this.props.addHero}
						incrementXP={this.props.incrementXP}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						levelUp={this.props.levelUp}
						redeemBoon={this.props.redeemBoon}
					/>
				);
				break;
			case 'map':
				content = (
					<CampaignMapPage
						game={this.props.game}
						startEncounter={this.props.startEncounter}
					/>
				);
				break;
			case 'options':
				content = (
					<OptionsPage
						endCampaign={this.props.endCampaign}
					/>
				);
				break;
		}

		const options = [
			{ id: 'heroes', display: 'Your Team' },
			{ id: 'map', display: 'The Island' },
			{ id: 'options', display: 'Options' }
		];
		return (
			<div className='campaign-screen'>
				<Selector options={options} selectedID={this.state.page} onSelect={this.setPage} />
				{content}
			</div>
		);
	}
}

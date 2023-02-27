import { Component } from 'react';

import type { BoonModel } from '../../../models/boon';
import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { RegionModel } from '../../../models/campaign-map';

import { Selector } from '../../controls';

import { CampaignMapPage } from './campaign-map-page/campaign-map-page';
import { HeroesPage } from './heroes-page/heroes-page';
import { ItemsPage } from './items-page/items-page';
import { OptionsPage } from './options-page/options-page';

import './campaign-screen.scss';

interface Props {
	game: GameModel;
	developer: boolean;
	addHero: (hero: CombatantModel) => void;
	incrementXP: (hero: CombatantModel) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null) => void;
	buyItem: (item: ItemModel) => void;
	sellItem: (item: ItemModel, all: boolean) => void;
	addMoney: () => void;
	startEncounter: (region: RegionModel, heroes: CombatantModel[]) => void;
	conquer: (region: RegionModel) => void;
	endCampaign: () => void;
	setDeveloper: (value: boolean) => void;
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

	render = () => {
		let content = null;
		switch (this.state.page) {
			case 'heroes':
				content = (
					<HeroesPage
						game={this.props.game}
						developer={this.props.developer}
						addHero={this.props.addHero}
						incrementXP={this.props.incrementXP}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						pickUpItem={this.props.pickUpItem}
						dropItem={this.props.dropItem}
						levelUp={this.props.levelUp}
						redeemBoon={this.props.redeemBoon}
					/>
				);
				break;
			case 'items':
				content = (
					<ItemsPage
						game={this.props.game}
						developer={this.props.developer}
						buyItem={this.props.buyItem}
						sellItem={this.props.sellItem}
						addMoney={this.props.addMoney}
					/>
				);
				break;
			case 'map':
				content = (
					<CampaignMapPage
						game={this.props.game}
						developer={this.props.developer}
						startEncounter={this.props.startEncounter}
						conquer={this.props.conquer}
					/>
				);
				break;
			case 'options':
				content = (
					<OptionsPage
						developer={this.props.developer}
						endCampaign={this.props.endCampaign}
						setDeveloper={this.props.setDeveloper}
					/>
				);
				break;
		}

		const options = [
			{ id: 'heroes', display: 'Your Team' },
			{ id: 'items', display: 'Your Equipment' },
			{ id: 'map', display: 'The Island' },
			{ id: 'options', display: 'Options' }
		];
		return (
			<div className='campaign-screen'>
				<Selector options={options} selectedID={this.state.page} onSelect={this.setPage} />
				{content}
			</div>
		);
	};
}

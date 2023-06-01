import { IconInfoCircle, IconInfoCircleFilled } from '@tabler/icons-react';
import { Component } from 'react';

import type { BoonModel } from '../../../models/boon';
import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { RegionModel } from '../../../models/region';

import { Selector } from '../../controls';

import { CampaignMapPage } from './campaign-map-page/campaign-map-page';
import { HeroesPage } from './heroes-page/heroes-page';
import { ItemsPage } from './items-page/items-page';

import './campaign-screen.scss';

enum CampaignScreenType {
	Island = 'island',
	Team = 'team',
	Items = 'items'
}

interface Props {
	game: GameModel;
	developer: boolean;
	hasExceptions: boolean;
	showHelp: (file: string) => void;
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
}

interface State {
	screen: CampaignScreenType;
}

export class CampaignScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			screen: CampaignScreenType.Island
		};
	}

	setScreen = (screen: CampaignScreenType) => {
		this.setState({
			screen: screen
		});
	};

	render = () => {
		try {
			//
			let content = null;
			switch (this.state.screen) {
				case CampaignScreenType.Island:
					content = (
						<CampaignMapPage
							game={this.props.game}
							developer={this.props.developer}
							startEncounter={this.props.startEncounter}
							conquer={this.props.conquer}
						/>
					);
					break;
				case CampaignScreenType.Team:
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
				case CampaignScreenType.Items:
					content = (
						<ItemsPage
							game={this.props.game}
							developer={this.props.developer}
							buyItem={this.props.buyItem}
							sellItem={this.props.sellItem}
							redeemBoon={this.props.redeemBoon}
							addMoney={this.props.addMoney}
						/>
					);
					break;
			}

			const options = [
				{ id: 'island', display: 'The Island' },
				{ id: 'team', display: 'Your Team' },
				{ id: 'items', display: 'Your Equipment' }
			];

			return (
				<div className='campaign-screen'>
					<div className='campaign-top-bar'>
						<div className='logo-text inset-text'>Skirmish</div>
						<Selector options={options} selectedID={this.state.screen} onSelect={id => this.setScreen(id as CampaignScreenType)} />
						<button className='icon-btn' title='Information' onClick={() => this.props.showHelp(this.state.screen)}>
							{this.props.developer && this.props.hasExceptions ? <IconInfoCircleFilled /> : <IconInfoCircle />}
						</button>
					</div>
					<div className='campaign-content'>
						{content}
					</div>
				</div>
			);
		} catch {
			return <div className='campaign-screen render-error' />;
		}
	};
}

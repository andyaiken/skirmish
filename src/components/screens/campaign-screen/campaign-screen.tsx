import { IconBackpack, IconCards, IconInfoCircle, IconInfoCircleFilled, IconMap, IconUsers } from '@tabler/icons-react';
import { Component } from 'react';

import { GameLogic } from '../../../logic/game-logic';

import type { BoonModel } from '../../../models/boon';
import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { Badge, Selector } from '../../controls';

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
	options: OptionsModel;
	hasExceptions: boolean;
	showHelp: (file: string) => void;
	showPacks: () => void;
	addHero: (hero: CombatantModel) => void;
	incrementXP: (hero: CombatantModel) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
	retireHero: (combatant: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => void;
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
							options={this.props.options}
							startEncounter={this.props.startEncounter}
							conquer={this.props.conquer}
						/>
					);
					break;
				case CampaignScreenType.Team:
					content = (
						<HeroesPage
							game={this.props.game}
							options={this.props.options}
							addHero={this.props.addHero}
							incrementXP={this.props.incrementXP}
							equipItem={this.props.equipItem}
							unequipItem={this.props.unequipItem}
							pickUpItem={this.props.pickUpItem}
							dropItem={this.props.dropItem}
							levelUp={this.props.levelUp}
							retireHero={this.props.retireHero}
							redeemBoon={this.props.redeemBoon}
						/>
					);
					break;
				case CampaignScreenType.Items:
					content = (
						<ItemsPage
							game={this.props.game}
							options={this.props.options}
							buyItem={this.props.buyItem}
							sellItem={this.props.sellItem}
							equipItem={this.props.equipItem}
							dropItem={this.props.dropItem}
							redeemBoon={this.props.redeemBoon}
							addMoney={this.props.addMoney}
						/>
					);
					break;
			}

			const options = [
				{
					id: 'island',
					display: (
						<div className='tab-icon'>
							<IconMap />
							The Island
						</div>
					)
				},
				{
					id: 'team',
					display: (
						<div className='tab-icon'>
							<IconUsers />
							Your Team
						</div>
					)
				},
				{
					id: 'items',
					display: (
						<div className='tab-icon'>
							<IconBackpack />
							Your Equipment
						</div>
					)
				}
			];

			const availablePacks = GameLogic.getPacks().filter(p => !this.props.options.packIDs.includes(p.id)).length;

			return (
				<div className='campaign-screen'>
					<div className='campaign-top-bar'>
						<div className='logo-text inset-text'>Skirmish</div>
						<Selector options={options} selectedID={this.state.screen} onSelect={id => this.setScreen(id as CampaignScreenType)} />
						<button className='icon-btn' title='Information' onClick={() => this.props.showHelp(this.state.screen)}>
							{this.props.options.developer && this.props.hasExceptions ? <IconInfoCircleFilled /> : <IconInfoCircle />}
						</button>
						<Badge value={availablePacks}>
							<button className='icon-btn' title='Packs' onClick={() => this.props.showPacks()}>
								<IconCards />
							</button>
						</Badge>
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

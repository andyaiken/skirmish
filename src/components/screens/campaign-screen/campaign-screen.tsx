import { IconCards, IconHelpCircle, IconHelpCircleFilled } from '@tabler/icons-react';
import { Component } from 'react';

import { OrientationType } from '../../../enums/orientation-type';
import { PageType } from '../../../enums/page-type';
import { StructureType } from '../../../enums/structure-type';

import { GameLogic } from '../../../logic/game-logic';
import { PackLogic } from '../../../logic/pack-logic';

import type { BoonModel } from '../../../models/boon';
import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';
import type { StructureModel } from '../../../models/structure';

import type { Platform } from '../../../platform/platform';

import { Badge, Selector } from '../../controls';

import { CampaignMapPage } from './campaign-map-page/campaign-map-page';
import { DevPage } from './dev-page/dev-page';
import { HeroesPage } from './heroes-page/heroes-page';
import { ItemsPage } from './items-page/items-page';
import { StrongholdPage } from './stronghold-page/stronghold-page';

import './campaign-screen.scss';

import logo from '../../../assets/images/logo.png';

interface Props {
	game: GameModel;
	options: OptionsModel;
	platform: Platform;
	orientation: OrientationType;
	page: PageType;
	hasExceptions: boolean;
	setPage: (page: PageType) => void;
	showHelp: (file: string) => void;
	showPacks: () => void;
	buyStructure: (structure: StructureModel, cost: number) => void;
	sellStructure: (structure: StructureModel) => void;
	chargeStructure: (structure: StructureModel) => void;
	upgradeStructure: (structure: StructureModel) => void;
	useCharge: (type: StructureType, count: number) => void;
	addHero: (hero: CombatantModel) => void;
	addXP: (hero: CombatantModel, useCharge: StructureType | null) => void;
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
	startEncounter: (region: RegionModel, heroes: CombatantModel[], benefits: number, detriments: number) => void;
	regenerateCampaignMap: () => void;
	conquer: (region: RegionModel) => void;
}

export class CampaignScreen extends Component<Props> {
	render = () => {
		try {
			let content = null;
			switch (this.props.page) {
				case PageType.Island:
					content = (
						<CampaignMapPage
							game={this.props.game}
							options={this.props.options}
							orientation={this.props.orientation}
							startEncounter={this.props.startEncounter}
							regenerateCampaignMap={this.props.regenerateCampaignMap}
							conquer={this.props.conquer}
						/>
					);
					break;
				case PageType.Stronghold:
					content = (
						<StrongholdPage
							game={this.props.game}
							options={this.props.options}
							orientation={this.props.orientation}
							buyStructure={this.props.buyStructure}
							sellStructure={this.props.sellStructure}
							chargeStructure={this.props.chargeStructure}
							upgradeStructure={this.props.upgradeStructure}
							useCharge={this.props.useCharge}
							redeemBoon={this.props.redeemBoon}
						/>
					);
					break;
				case PageType.Team:
					content = (
						<HeroesPage
							game={this.props.game}
							options={this.props.options}
							orientation={this.props.orientation}
							addHero={this.props.addHero}
							addXP={this.props.addXP}
							equipItem={this.props.equipItem}
							unequipItem={this.props.unequipItem}
							pickUpItem={this.props.pickUpItem}
							dropItem={this.props.dropItem}
							levelUp={this.props.levelUp}
							retireHero={this.props.retireHero}
							redeemBoon={this.props.redeemBoon}
							useCharge={this.props.useCharge}
						/>
					);
					break;
				case PageType.Items:
					content = (
						<ItemsPage
							game={this.props.game}
							options={this.props.options}
							orientation={this.props.orientation}
							buyItem={this.props.buyItem}
							sellItem={this.props.sellItem}
							equipItem={this.props.equipItem}
							dropItem={this.props.dropItem}
							redeemBoon={this.props.redeemBoon}
							useCharge={this.props.useCharge}
							addMoney={this.props.addMoney}
						/>
					);
					break;
				case PageType.Developer:
					content = (
						<DevPage options={this.props.options} platform={this.props.platform} />
					);
					break;
			}

			const options = [
				{
					id: PageType.Island,
					display: (
						<div className='page-btn'>
							The Island
						</div>
					)
				},
				{
					id: PageType.Stronghold,
					display: (
						<div className='page-btn'>
							<div>Your Stronghold</div>
							{this.props.game.boons.some(b => GameLogic.getBoonIsStrongholdType(b)) ? <div>⭑</div> : null}
						</div>
					)
				},
				{
					id: PageType.Team,
					display: (
						<div className='page-btn'>
							<div>Your Team</div>
							{this.props.game.boons.some(b => GameLogic.getBoonIsHeroType(b)) || this.props.game.heroes.some(h => h.xp >= h.level) ? <div>⭑</div> : null}
						</div>
					)
				},
				{
					id: PageType.Items,
					display: (
						<div className='page-btn'>
							<div>Your Equipment</div>
							{this.props.game.boons.some(b => GameLogic.getBoonIsItemType(b)) ? <div>⭑</div> : null}
						</div>
					)
				}
			];

			if (this.props.options.developer) {
				options.push({
					id: PageType.Developer,
					display: (
						<div className='page-btn developer'>
							Developer
						</div>
					)
				});
			}

			const availablePacks = PackLogic.getPacks().filter(p => !this.props.options.packIDs.includes(p.id)).length;

			return (
				<div className={`campaign-screen ${this.props.orientation}`}>
					<div className='campaign-top-bar'>
						<img className='logo' alt='Logo' src={logo} />
						<div className='logo-text inset-text'>Skirmish</div>
						<div className='buttons'>
							<Badge value={availablePacks}>
								<button className='icon-btn' title='Packs' onClick={() => this.props.showPacks()}>
									<IconCards />
								</button>
							</Badge>
							<button className='icon-btn' title='Help' onClick={() => this.props.showHelp(this.props.page)}>
								{this.props.options.developer && this.props.hasExceptions ? <IconHelpCircleFilled /> : <IconHelpCircle />}
							</button>
						</div>
					</div>
					<Selector options={options} selectedID={this.props.page} onSelect={id => this.props.setPage(id as PageType)} />
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

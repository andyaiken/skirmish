import { IconBackpack, IconBuildingCastle, IconCards, IconCirclePlus, IconCodeCircle2, IconHelpCircle, IconHelpCircleFilled, IconMap2, IconUsers } from '@tabler/icons-react';
import { Component } from 'react';

import { PageType } from '../../../enums/page-type';
import { StructureType } from '../../../enums/structure-type';

import { GameLogic } from '../../../logic/game/game-logic';
import { OrientationLogic } from '../../../logic/orientation/orientation-logic';
import { PackLogic } from '../../../logic/pack/pack-logic';

import type { BoonModel } from '../../../models/boon';
import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { LayoutModel } from '../../../models/layout';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';
import type { StructureModel } from '../../../models/structure';

import type { Platform } from '../../../platform/platform';

import { Format } from '../../../utils/format/format';

import { Badge, IconSize, IconType, IconValue, Selector } from '../../controls';

import { CampaignMapPage } from './campaign-map-page/campaign-map-page';
import { HeroesPage } from './heroes-page/heroes-page';
import { ItemsPage } from './items-page/items-page';
import { LogoPanel } from '../../panels';
import { StrongholdPage } from './stronghold-page/stronghold-page';

import './campaign-screen.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	platform: Platform;
	layout: LayoutModel;
	page: PageType;
	hasExceptions: boolean;
	setPage: (page: PageType) => void;
	showHelp: (file: string) => void;
	showPacks: () => void;
	toggleBackstage: () => void;
	buyStructure: (structure: StructureModel, cost: number) => void;
	sellStructure: (structure: StructureModel) => void;
	chargeStructure: (structure: StructureModel, useTavern: boolean) => void;
	upgradeStructure: (structure: StructureModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
	addHero: (hero: CombatantModel) => void;
	addXP: (hero: CombatantModel, spendCharge: StructureType | null) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
	retireHero: (combatant: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => void;
	buyItem: (item: ItemModel, free?: boolean) => void;
	sellItem: (item: ItemModel, all: boolean) => void;
	addMoney: () => void;
	startEncounter: (region: RegionModel, heroes: CombatantModel[], benefits: number, detriments: number) => void;
	regenerateCampaignMap: () => void;
	conquer: (region: RegionModel) => void;
	purchaseRegion: (region: RegionModel) => void;
}

export class CampaignScreen extends Component<Props> {
	// The selector becomes a rail of icons down the left when a band across the top would cost more
	// height than there is to spend - which is a question about height, and nothing to do with what
	// kind of device this is. Only sideways, because that is where the width to spare comes from;
	// upright a rail would take the dimension that is already short.
	usesPageRail = () => {
		return OrientationLogic.isLandscape(this.props.layout.orientation) && !this.props.layout.roomForSelectorBand;
	};

	// One column down the side as a rail; otherwise all four across where they fit, and two rows of
	// two where they don't - at 320 the four together are wider than the band, and the last label
	// ran off the edge of the screen rather than being cut off neatly inside it.
	getSelectorColumns = () => {
		if (this.usesPageRail()) {
			return 1;
		}

		return this.props.layout.roomForSelectorColumns ? 0 : 2;
	};

	// Whether the bar can carry its branding as well as the money and the buttons.
	showsBranding = () => {
		return this.props.layout.roomForBranding;
	};

	render = () => {
		let content = null;
		switch (this.props.page) {
			case PageType.Island:
				content = (
					<CampaignMapPage
						game={this.props.game}
						options={this.props.options}
						layout={this.props.layout}
						startEncounter={this.props.startEncounter}
						regenerateCampaignMap={this.props.regenerateCampaignMap}
						conquer={this.props.conquer}
						purchaseRegion={this.props.purchaseRegion}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						pickUpItem={this.props.pickUpItem}
						dropItem={this.props.dropItem}
						levelUp={this.props.levelUp}
						spendCharge={this.props.spendCharge}
					/>
				);
				break;
			case PageType.Stronghold:
				content = (
					<StrongholdPage
						game={this.props.game}
						options={this.props.options}
						layout={this.props.layout}
						setPage={this.props.setPage}
						buyStructure={this.props.buyStructure}
						sellStructure={this.props.sellStructure}
						chargeStructure={this.props.chargeStructure}
						upgradeStructure={this.props.upgradeStructure}
						spendCharge={this.props.spendCharge}
						redeemBoon={this.props.redeemBoon}
					/>
				);
				break;
			case PageType.Team:
				content = (
					<HeroesPage
						game={this.props.game}
						options={this.props.options}
						layout={this.props.layout}
						addHero={this.props.addHero}
						addXP={this.props.addXP}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						pickUpItem={this.props.pickUpItem}
						dropItem={this.props.dropItem}
						levelUp={this.props.levelUp}
						retireHero={this.props.retireHero}
						redeemBoon={this.props.redeemBoon}
						spendCharge={this.props.spendCharge}
					/>
				);
				break;
			case PageType.Items:
				content = (
					<ItemsPage
						game={this.props.game}
						options={this.props.options}
						layout={this.props.layout}
						buyItem={this.props.buyItem}
						sellItem={this.props.sellItem}
						equipItem={this.props.equipItem}
						dropItem={this.props.dropItem}
						redeemBoon={this.props.redeemBoon}
						spendCharge={this.props.spendCharge}
						addMoney={this.props.addMoney}
					/>
				);
				break;
		}

		// The star marks a page with something waiting on it, and survives the move to the rail -
		// it is the only thing in the selector that the player would miss.
		const pages = [
			{
				id: PageType.Island,
				label: 'The Island',
				icon: <IconMap2 />,
				marked: false
			},
			{
				id: PageType.Stronghold,
				label: 'Your Stronghold',
				icon: <IconBuildingCastle />,
				marked: this.props.game.boons.some(b => GameLogic.getBoonIsStrongholdType(b))
			},
			{
				id: PageType.Team,
				label: 'Your Team',
				icon: <IconUsers />,
				marked: this.props.game.boons.some(b => GameLogic.getBoonIsHeroType(b)) || this.props.game.heroes.some(h => h.xp >= h.level)
			},
			{
				id: PageType.Items,
				label: 'Your Equipment',
				icon: <IconBackpack />,
				marked: this.props.game.boons.some(b => GameLogic.getBoonIsItemType(b))
			}
		];

		const options = pages.map(page => {
			return {
				id: page.id,
				display: (
					<div className='page-btn' title={page.label}>
						{this.usesPageRail() ? page.icon : <div>{page.label}</div>}
						{page.marked ? <div>⭑</div> : null}
					</div>
				)
			};
		});

		const availablePacks = PackLogic.getExpansionPacks().filter(pack => !this.props.options.packIDs.includes(pack.id)).length;

		return (
			<div className={`campaign-screen ${OrientationLogic.getClassName(this.props.layout.orientation)} ${this.usesPageRail() ? 'page-rail' : 'page-band'}`}>
				<div className='campaign-top-bar'>
					{/*
						The bar has the branding, the money and the buttons to fit across it, and on a phone
						held upright they don't: the help button was pushed off the right-hand edge, where the
						screen clips rather than scrolls, so it was gone rather than merely out of sight. The
						branding is the part doing no work - the player knows which game they opened - so it is
						what gives way, name and mark together. The money takes its place on the left, which
						space-between does on its own once there are two things left to space apart.
					*/}
					{
						this.showsBranding() ?
							<div className='branding'>
								<LogoPanel size={36} />
							</div>
							: null
					}
					<div className='money'>
						<IconValue type={IconType.Money} value={Format.toText(this.props.game.money)} size={IconSize.Large} />
						{this.props.options.developer ? <button className='developer icon-btn' onClick={() => this.props.addMoney()}><IconCirclePlus /></button> : null}
					</div>
					<div className='buttons'>
						<Badge value={availablePacks}>
							<button className='icon-btn' title='Packs' onClick={() => this.props.showPacks()}>
								<IconCards />
							</button>
						</Badge>
						<button className='icon-btn' title='Help' onClick={() => this.props.showHelp(this.props.page)}>
							{this.props.options.developer && this.props.hasExceptions ? <IconHelpCircleFilled /> : <IconHelpCircle />}
						</button>
						{this.props.options.developer ? <button className='icon-btn developer' title='Backstage' onClick={this.props.toggleBackstage}><IconCodeCircle2 /></button> : null}
					</div>
				</div>
				<Selector options={options} columnCount={this.getSelectorColumns()} selectedID={this.props.page} onSelect={id => this.props.setPage(id as PageType)} />
				<div className='campaign-content'>
					{content}
				</div>
			</div>
		);
	};
}

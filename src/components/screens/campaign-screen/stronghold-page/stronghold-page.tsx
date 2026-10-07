import { IconHexagon, IconHexagonFilled } from '@tabler/icons-react';
import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { OrientationType } from '../../../../enums/orientation-type';
import { PageType } from '../../../../enums/page-type';
import { StructureType } from '../../../../enums/structure-type';

import { GameLogic } from '../../../../logic/game/game-logic';
import { StrongholdLogic } from '../../../../logic/stronghold/stronghold-logic';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';
import type { StructureModel } from '../../../../models/structure';

import { BoonCard, StructureCard } from '../../../cards';
import { Box, CardList, Dialog, Expander, IconSize, IconType, IconValue, StatValue, Text, TextType } from '../../../controls';
import { BuyStructureModal } from '../../../modals/buy-structure/buy-structure-modal';
import { StrongholdMapPanel } from '../../../panels';

import './stronghold-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	orientation: OrientationType;
	setPage: (page: PageType) => void;
	buyStructure: (structure: StructureModel, cost: number) => void;
	sellStructure: (structure: StructureModel) => void;
	chargeStructure: (structure: StructureModel, useTavern: boolean) => void;
	upgradeStructure: (structure: StructureModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => void;
}

interface State {
	selectedStructure: StructureModel | null;
	addingStructure: '' | 'free' | 'paid';
}

export class StrongholdPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedStructure: null,
			addingStructure: ''
		};
	}

	selectBoon = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.Structure: {
				this.props.redeemBoon(boon, null, null, null, 0);
				break;
			}
		}
	};

	buyStructure = (structure: StructureModel) => {
		const cost = this.state.addingStructure === 'free' ? 0 : StrongholdLogic.getPrice(this.props.game, 'structure');
		this.setState({
			addingStructure: ''
		}, () => {
			this.props.buyStructure(structure, cost);
		});
	};

	sellStructure = (structure: StructureModel) => {
		this.setState({
			selectedStructure: null
		}, () => {
			this.props.sellStructure(structure);
		});
	};

	getStrongholdBenefits = () => {
		const benefits = StrongholdLogic.getBenefits(this.props.game);

		if (!benefits.hasBenefits) {
			return null;
		}

		return (
			<div className='sidebar-section'>
				<Box label='Stronghold Benefits'>
					{benefits.redraws.heroes > 0 ? <StatValue label='Hero Card Redraws' value={benefits.redraws.heroes} /> : null}
					{benefits.redraws.items > 0 ? <StatValue label='Item Card Redraws' value={benefits.redraws.items} /> : null}
					{benefits.redraws.features > 0 ? <StatValue label='Feature Card Redraws' value={benefits.redraws.features} /> : null}
					{benefits.redraws.actions > 0 ? <StatValue label='Action Card Redraws' value={benefits.redraws.actions} /> : null}
					{benefits.redraws.magicItems > 0 ? <StatValue label='Magic Item Card Redraws' value={benefits.redraws.magicItems} /> : null}
					{benefits.redraws.structures > 0 ? <StatValue label='Structure Card Redraws' value={benefits.redraws.structures} /> : null}
					{(benefits.redrawTotal > 0) && (benefits.encounterTotal + benefits.heroXP > 0) ? <hr /> : null}
					{benefits.encounters.benefits > 0 ? <StatValue label='Encounter Benefits' value={benefits.encounters.benefits} /> : null}
					{benefits.encounters.detriments > 0 ? <StatValue label='Encounter Detriments' value={benefits.encounters.detriments} /> : null}
					{benefits.encounters.actions > 0 ? <StatValue label='Additional Actions' value={benefits.encounters.actions} /> : null}
					{benefits.encounters.heroes > 0 ? <StatValue label='Additional Heroes' value={benefits.encounters.heroes} /> : null}
					{(benefits.heroXP > 0) && (benefits.redrawTotal + benefits.encounterTotal > 0) ? <hr /> : null}
					{benefits.heroXP > 0 ? <StatValue label='Additional XP' value={benefits.heroXP} /> : null}
					{(benefits.campaignTotal > 0) && (benefits.redrawTotal + benefits.encounterTotal + benefits.heroXP > 0) ? <hr /> : null}
					{benefits.campaign.voyages > 0 ? <StatValue label='Sea Voyages' value={benefits.campaign.voyages} /> : null}
					{benefits.campaign.discounts > 0 ? <StatValue label='Region Discounts' value={benefits.campaign.discounts} /> : null}
					{benefits.campaign.recharges > 0 ? <StatValue label='Free Recharges' value={benefits.campaign.recharges} /> : null}
					{benefits.campaign.scrolls > 0 ? <StatValue label='Free Scrolls' value={benefits.campaign.scrolls} /> : null}
					{
						(benefits.permanent.shopDiscount || benefits.permanent.regionIncome)
						&& (benefits.redrawTotal + benefits.encounterTotal + benefits.heroXP + benefits.campaignTotal > 0)
							? <hr />
							: null
					}
					{benefits.permanent.shopDiscount ? <StatValue label='Shop Prices' value='-25%' /> : null}
					{benefits.permanent.regionIncome ? <StatValue label='Region Income' value='Yes' /> : null}
				</Box>
			</div>
		);
	};

	getSidebar = () => {
		if (this.state.selectedStructure) {
			const upgradeCost = StrongholdLogic.getUpgradeCost(this.state.selectedStructure);
			// A Tavern recharges another structure without money changing hands. It can't recharge
			// itself: recharging needs a spare charge, and a Tavern that needs recharging has none.
			const tavernCharges = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Tavern);

			let upgrade = null;
			let charge = null;

			// Demolishing no longer follows from whether a structure charges - a Bazaar or Counting
			// House is permanent but can still be torn down - so it stands on its own, below
			// everything else as the destructive option
			let demolish = null;
			if (StrongholdLogic.canDemolish(this.state.selectedStructure)) {
				demolish = (
					<div className='sidebar-section'>
						<button onClick={() => this.sellStructure(this.state.selectedStructure as StructureModel)}>
							<div>Demolish structure</div>
							<IconValue type={IconType.Money} value={25} size={IconSize.Button} />
						</button>
					</div>
				);
			}

			if (StrongholdLogic.canCharge(this.state.selectedStructure)) {
				const canRecharge = StrongholdLogic.canRecharge(this.state.selectedStructure);

				upgrade = (
					<div className='sidebar-section'>
						<div className='upgrade-section'>
							<StatValue orientation='vertical' label='Level' value={this.state.selectedStructure.level} />
							<button disabled={this.props.game.money < upgradeCost} onClick={() => this.props.upgradeStructure(this.state.selectedStructure as StructureModel)}>
								<div>Upgrade<br/>structure</div>
								<IconValue type={IconType.Money} value={upgradeCost} size={IconSize.Button} />
							</button>
						</div>
						<button disabled={(this.props.game.money < 100) || !canRecharge} onClick={() => this.props.chargeStructure(this.state.selectedStructure as StructureModel, false)}>
							<div>Recharge structure</div>
							<IconValue type={IconType.Money} value={100} size={IconSize.Button} />
						</button>
						{
							tavernCharges > 0 ?
								<button disabled={!canRecharge} onClick={() => this.props.chargeStructure(this.state.selectedStructure as StructureModel, true)}>
									<div>Recharge from the Tavern</div>
									<StatValue label='Charges' value={tavernCharges} />
								</button>
								: null
						}
					</div>
				);

				if (this.state.selectedStructure.charges > 0) {
					const bolts = [];
					for (let n = 0; n < this.state.selectedStructure.level; ++n) {
						bolts.push(n >= this.state.selectedStructure.charges ? <IconHexagon key={n} size={50} /> : <IconHexagonFilled key={n} size={50} />);
					}

					charge = (
						<div className='sidebar-section'>
							<StatValue
								orientation='vertical'
								label='Charges Remaining'
								value={
									<div className='bolts'>
										{bolts}
									</div>
								}
							/>
						</div>
					);
				}
			} else {
				switch (this.state.selectedStructure.type) {
					case StructureType.Barracks:
						upgrade = (
							<div className='sidebar-section'>
								<Text type={TextType.Information}>
									<p>
										See your heroes <button className='link' onClick={() => this.props.setPage(PageType.Team)}>here</button>.
									</p>
								</Text>
							</div>
						);
						break;
					case StructureType.Warehouse:
						upgrade = (
							<div className='sidebar-section'>
								<Text type={TextType.Information}>
									<p>
										See your items <button className='link' onClick={() => this.props.setPage(PageType.Items)}>here</button>.
									</p>
								</Text>
							</div>
						);
						break;
				}
			}

			return (
				<div key={this.state.selectedStructure.id} className='sidebar'>
					<div className='sidebar-section'>
						<CardList cards={[ <StructureCard key='selected' structure={this.state.selectedStructure} /> ]} />
					</div>
					{upgrade}
					{charge}
					{demolish}
				</div>
			);
		}

		let boons = null;
		if (this.props.game.boons.filter(boon => GameLogic.getBoonIsStrongholdType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => GameLogic.getBoonIsStrongholdType(boon))
				.map(b => <BoonCard key={b.id} boon={b} onClick={boon => this.selectBoon(boon)} />);
			boons = (
				<div>
					<Text type={TextType.Information}><p><b>You have won these rewards.</b> Select a card to redeem a reward.</p></Text>
					<CardList cards={cards} />
				</div>
			);
		}

		const structurePrice = StrongholdLogic.getPrice(this.props.game, 'structure');

		let addSection = null;
		if (GameLogic.getStructureDeck(this.props.options.packIDs).length > 0) {
			addSection = (
				<button disabled={this.props.game.money < structurePrice} onClick={() => this.setState({ addingStructure: 'paid' })}>
					<div>Build a Structure</div>
					<IconValue type={IconType.Money} value={structurePrice} size={IconSize.Button} />
				</button>
			);
		}

		return (
			<div key='map' className='sidebar'>
				<div className='sidebar-section'>
					<Text type={TextType.SubHeading}>Your Stronghold</Text>
					<Text>This is your base of operations.</Text>
					<Text>It&apos;s made up of structures, each of which can grant you a unique benefit.</Text>
					<Text>Select a structure on the map to see what it can do.</Text>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>Your stronghold can provide useful benefits.</Text>
								}
								content={
									<div>
										<p>The different structures have different effects:</p>
										<ul>
											<li>Some structures allow you to redraw cards.</li>
											<li>Some structures provide advantages in encounters.</li>
										</ul>
										<p>Structures can be upgraded, which increases their usefulness.</p>
										<p>Most structures need to be charged before they can be used, which costs money.</p>
									</div>
								}
							/>
							: null
					}
				</div>
				{this.getStrongholdBenefits()}
				{
					(boons !== null) || (addSection !== null) ?
						<div className='sidebar-section'>
							{boons}
							{(boons !== null) && (addSection !== null) ? <hr /> : null}
							{addSection}
						</div>
						: null
				}
			</div>
		);
	};

	getDialog = () => {
		if (this.state.addingStructure !== '') {
			return (
				<Dialog
					content={(
						<BuyStructureModal
							game={this.props.game}
							options={this.props.options}
							buyStructure={this.buyStructure}
							spendCharge={this.props.spendCharge}
						/>
					)}
				/>
			);
		}

		return null;
	};

	getPeople = () => {
		return [
			...Array.from({ length: this.props.game.heroSlots }, (_, n) => ({ id: `townsfolk-${n}`, color: null })),
			...this.props.game.heroes.map(h => ({ id: h.id, color: h.color }))
		];
	};

	render = () => {
		return (
			<div className={`stronghold-page ${this.props.orientation}`}>
				<div className='map-content' onClick={() => this.setState({ selectedStructure: null })}>
					<StrongholdMapPanel
						stronghold={this.props.game.stronghold}
						people={this.getPeople()}
						occupancy={{
							// The two buildings that hold something rather than charging up; both
							// are showing the limits that bound a save
							[StructureType.Barracks]: { used: this.props.game.heroes.length, capacity: GameLogic.maxHeroes },
							[StructureType.Warehouse]: { used: this.props.game.items.length, capacity: GameLogic.maxItems }
						}}
						selectedStructure={this.state.selectedStructure}
						onSelectStructure={structure => this.setState({ selectedStructure: structure })}
					/>
				</div>
				{this.getSidebar()}
				{this.getDialog()}
			</div>
		);
	};
}

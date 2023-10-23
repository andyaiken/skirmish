import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { StructureType } from '../../../../enums/structure-type';

import { GameLogic } from '../../../../logic/game-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';
import type { StructureModel } from '../../../../models/structure';

import { BoonCard, PlaceholderCard, StructureCard } from '../../../cards';
import { Box, CardList, Dialog, Expander, IconSize, IconType, IconValue, PlayingCard, StatValue, Text, TextType } from '../../../controls';
import { BuyStructureModal } from '../../../modals/buy-structure/buy-structure-modal';
import { StrongholdMapPanel } from '../../../panels';

import './stronghold-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyStructure: (structure: StructureModel, cost: number) => void;
	chargeStructure: (structure: StructureModel) => void;
	upgradeStructure: (structure: StructureModel) => void;
	useCharge: (type: StructureType, count: number) => void;
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
		const cost = this.state.addingStructure === 'free' ? 0 : 50;
		this.setState({
			addingStructure: ''
		}, () => {
			this.props.buyStructure(structure, cost);
		});
	};

	getStrongholdBenefits = () => {
		const heroRedraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Hall);
		const itemRedraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Quartermaster);
		const featureRedraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.TrainingGround);
		const actionRedraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Observatory);
		const magicRedraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WizardTower);
		const structureRedraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Forge);

		const redraws = heroRedraws + itemRedraws + featureRedraws + actionRedraws + magicRedraws + structureRedraws;

		const benefitMods = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Temple);
		const detrimentMods = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Intelligencer);
		const additionalActions = StrongholdLogic.getStructureCharges(this.props.game, StructureType.ThievesGuild);
		const additionalHeroes = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WarRoom);
		const encounters = benefitMods + detrimentMods + additionalActions;

		const heroXP = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Academy);
		const hero = heroXP;

		return (
			<Box label='Stronghold Benefits'>
				<StatValue label='Max Heroes' value={StrongholdLogic.getHeroLimit(this.props.game)} />
				{redraws > 0 ? <hr /> : null}
				{heroRedraws > 0 ? <StatValue label='Hero Card Redraws' value={<IconValue type={IconType.Redraw} value={heroRedraws} />} /> : null}
				{itemRedraws > 0 ? <StatValue label='Item Card Redraws' value={<IconValue type={IconType.Redraw} value={itemRedraws} />} /> : null}
				{featureRedraws > 0 ? <StatValue label='Feature Card Redraws' value={<IconValue type={IconType.Redraw} value={featureRedraws} />} /> : null}
				{actionRedraws > 0 ? <StatValue label='Action Card Redraws' value={<IconValue type={IconType.Redraw} value={actionRedraws} />} /> : null}
				{magicRedraws > 0 ? <StatValue label='Magic Item Card Redraws' value={<IconValue type={IconType.Redraw} value={magicRedraws} />} /> : null}
				{structureRedraws > 0 ? <StatValue label='Structure Card Redraws' value={<IconValue type={IconType.Redraw} value={structureRedraws} />} /> : null}
				{encounters > 0 ? <hr /> : null}
				{benefitMods > 0 ? <StatValue label='Encounter Benefits' value={benefitMods} /> : null}
				{detrimentMods > 0 ? <StatValue label='Encounter Detriments' value={detrimentMods} /> : null}
				{additionalActions > 0 ? <StatValue label='Additional Actions' value={additionalActions} /> : null}
				{additionalHeroes > 0 ? <StatValue label='Additional Heroes' value={additionalHeroes} /> : null}
				{hero > 0 ? <hr /> : null}
				{heroXP > 0 ? <StatValue label='Additional XP' value={heroXP} /> : null}
			</Box>
		);
	};

	getSidebar = () => {
		if (this.state.selectedStructure) {
			let charge = null;
			if (StrongholdLogic.canCharge(this.state.selectedStructure) && (this.props.game.money >= 100)) {
				charge = (
					<button disabled={this.state.selectedStructure.charges > 0} onClick={() => this.props.chargeStructure(this.state.selectedStructure as StructureModel)}>
						<div>Charge structure</div>
						<IconValue type={IconType.Money} value={100} size={IconSize.Button} />
					</button>
				);
			}

			let upgrade = null;
			const upgradeCost = this.state.selectedStructure.level * 50;
			if (this.props.game.money >= upgradeCost) {
				upgrade = (
					<button onClick={() => this.props.upgradeStructure(this.state.selectedStructure as StructureModel)}>
						<div>Upgrade structure</div>
						<IconValue type={IconType.Money} value={upgradeCost} size={IconSize.Button} />
					</button>
				);
			}

			return (
				<div key={this.state.selectedStructure.id} className='sidebar'>
					<div className='structure-details-card'>
						<StructureCard structure={this.state.selectedStructure} />
					</div>
					{!!charge || !!upgrade ? <hr /> : null}
					{charge}
					{upgrade}
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

		let slots = null;
		if (this.props.game.structureSlots > 0) {
			slots = (
				<div className='center'>
					<PlayingCard
						stack={true}
						front={
							<PlaceholderCard
								text='Free Structures Available'
								subtext='Click here to build a structure for free.'
								content={<div className='slots-count'>{this.props.game.structureSlots}</div>}
							/>
						}
						onClick={() => this.setState({ addingStructure: 'free' })}
					/>
				</div>
			);
		}

		let addSection = null;
		if ((GameLogic.getStructureDeck(this.props.options.packIDs).length > 0) && (this.props.game.money >= 50)) {
			addSection = (
				<button onClick={() => this.setState({ addingStructure: 'paid' })}>
					<div>Buy a Structure</div>
					<IconValue type={IconType.Money} value={50} size={IconSize.Button} />
				</button>
			);
		}

		return (
			<div key='map' className='sidebar'>
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
										<li>The Barracks allows you recruit more heroes.</li>
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
				<hr />
				{this.getStrongholdBenefits()}
				{boons !== null ? <hr /> : null}
				{boons}
				{slots !== null ? <hr /> : null}
				{slots}
				{addSection !== null ? <hr /> : null}
				{addSection}
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
							useCharge={this.props.useCharge}
						/>
					)}
				/>
			);
		}

		return null;
	};

	render = () => {
		try {
			return (
				<div className='stronghold-page'>
					<div className='map-content' onClick={() => this.setState({ selectedStructure: null })}>
						<StrongholdMapPanel
							stronghold={this.props.game.stronghold}
							selectedStructure={this.state.selectedStructure}
							onSelectStructure={structure => this.setState({ selectedStructure: structure })}
						/>
					</div>
					{this.getSidebar()}
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='stronghold-page render-error' />;
		}
	};
}

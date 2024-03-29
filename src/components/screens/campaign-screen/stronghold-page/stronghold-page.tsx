import { IconHexagon, IconHexagonFilled } from '@tabler/icons-react';
import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { OrientationType } from '../../../../enums/orientation-type';
import { PageType } from '../../../../enums/page-type';
import { StructureType } from '../../../../enums/structure-type';

import { GameLogic } from '../../../../logic/game-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

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

	sellStructure = (structure: StructureModel) => {
		this.setState({
			selectedStructure: null
		}, () => {
			this.props.sellStructure(structure);
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

		if (redraws + encounters + hero === 0) {
			return null;
		}

		return (
			<div className='sidebar-section'>
				<Box label='Stronghold Benefits'>
					{heroRedraws > 0 ? <StatValue label='Hero Card Redraws' value={heroRedraws} /> : null}
					{itemRedraws > 0 ? <StatValue label='Item Card Redraws' value={itemRedraws} /> : null}
					{featureRedraws > 0 ? <StatValue label='Feature Card Redraws' value={featureRedraws} /> : null}
					{actionRedraws > 0 ? <StatValue label='Action Card Redraws' value={actionRedraws} /> : null}
					{magicRedraws > 0 ? <StatValue label='Magic Item Card Redraws' value={magicRedraws} /> : null}
					{structureRedraws > 0 ? <StatValue label='Structure Card Redraws' value={structureRedraws} /> : null}
					{(redraws > 0) && (encounters + hero > 0) ? <hr /> : null}
					{benefitMods > 0 ? <StatValue label='Encounter Benefits' value={benefitMods} /> : null}
					{detrimentMods > 0 ? <StatValue label='Encounter Detriments' value={detrimentMods} /> : null}
					{additionalActions > 0 ? <StatValue label='Additional Actions' value={additionalActions} /> : null}
					{additionalHeroes > 0 ? <StatValue label='Additional Heroes' value={additionalHeroes} /> : null}
					{(hero > 0) && (redraws + encounters > 0) ? <hr /> : null}
					{heroXP > 0 ? <StatValue label='Additional XP' value={heroXP} /> : null}
				</Box>
			</div>
		);
	};

	getSidebar = () => {
		if (this.state.selectedStructure) {
			const upgradeCost = StrongholdLogic.getUpgradeCost(this.state.selectedStructure);

			let upgrade = null;
			let charge = null;
			if (StrongholdLogic.canCharge(this.state.selectedStructure)) {
				upgrade = (
					<div className='sidebar-section'>
						<div className='upgrade-section'>
							<StatValue orientation='vertical' label='Level' value={this.state.selectedStructure.level} />
							<button disabled={this.props.game.money < upgradeCost} onClick={() => this.props.upgradeStructure(this.state.selectedStructure as StructureModel)}>
								<div>Upgrade<br/>structure</div>
								<IconValue type={IconType.Money} value={upgradeCost} size={IconSize.Button} />
							</button>
						</div>
						<button onClick={() => this.sellStructure(this.state.selectedStructure as StructureModel)}>
							<div>Demolish structure</div>
							<IconValue type={IconType.Money} value={25} size={IconSize.Button} />
						</button>
						<button disabled={this.props.game.money < 100} onClick={() => this.props.chargeStructure(this.state.selectedStructure as StructureModel)}>
							<div>Recharge structure</div>
							<IconValue type={IconType.Money} value={100} size={IconSize.Button} />
						</button>
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

		let addSection = null;
		if (GameLogic.getStructureDeck(this.props.options.packIDs).length > 0) {
			addSection = (
				<button disabled={this.props.game.money < 50} onClick={() => this.setState({ addingStructure: 'paid' })}>
					<div>Build a Structure</div>
					<IconValue type={IconType.Money} value={50} size={IconSize.Button} />
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
				<div className={`stronghold-page ${this.props.orientation}`}>
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

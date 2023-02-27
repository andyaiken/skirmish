import { Component } from 'react';

import { EncounterState } from '../../../enums/encounter-state';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { RegionModel } from '../../../models/campaign-map';

import { CardList, Developer, Dialog, PlayingCard, Text, TextType } from '../../controls';
import { CharacterSheetPanel, EncounterMapPanel, InitiativeListPanel } from '../../panels';
import { CombatantControls } from './combatant-controls/combatant-controls';
import { ItemCard } from '../../cards';

import './encounter-screen.scss';

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	developer: boolean;
	rollInitiative: (encounter: EncounterModel) => void;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	kill: (encounter: EncounterModel, combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterState) => void;
}

interface State {
	mapSquareSize: number;
	selectedIDs: string[];
	manualEncounterState: EncounterState;
	detailsCombatant: CombatantModel | null;
	detailsLoot: LootPileModel | null;
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapSquareSize: 10,
			selectedIDs: [],
			manualEncounterState: EncounterState.Active,
			detailsCombatant: null,
			detailsLoot: null
		};
	}

	nudgeMapSize = (delta: number) => {
		const size = Math.max(this.state.mapSquareSize + delta, 5);
		this.setState({
			mapSquareSize: size
		});
	};

	selectCombatant = (combatant: CombatantModel | null) => {
		this.setState({
			selectedIDs: combatant ? [ combatant.id ] : []
		});
	};

	setManualEncounterState = (state: EncounterState) => {
		this.setState({
			manualEncounterState: state
		});
	};

	showDetailsCombatant = (combatant: CombatantModel | null) => {
		this.setState({
			detailsCombatant: combatant,
			detailsLoot: null
		});
	};

	showDetailsLoot = (loot: LootPileModel | null) => {
		this.setState({
			detailsCombatant: null,
			detailsLoot: loot
		});
	};

	render = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}

		let initiative = null;
		let controls = null;
		switch (state) {
			case EncounterState.Active: {
				const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;
				if (currentCombatant === null) {
					controls = (
						<div className='encounter-right-panel'>
							<Text type={TextType.SubHeading}>Round {this.props.encounter.round + 1}</Text>
							<button onClick={() => this.props.rollInitiative(this.props.encounter)}>Roll Initiative</button>
						</div>
					);
				} else {
					initiative = (
						<div className='encounter-left-panel'>
							<InitiativeListPanel
								encounter={this.props.encounter}
								selectedIDs={this.state.selectedIDs}
								onSelect={this.selectCombatant}
								onDetails={this.showDetailsCombatant}
							/>
						</div>
					);
					controls = (
						<div className='encounter-right-panel'>
							<CombatantControls
								combatant={currentCombatant}
								encounter={this.props.encounter}
								endTurn={this.props.endTurn}
								move={this.props.move}
								standUp={this.props.standUp}
								scan={this.props.scan}
								hide={this.props.hide}
								pickUpItem={this.props.pickUpItem}
								showCharacterSheet={this.showDetailsCombatant}
								kill={this.props.kill}
							/>
						</div>
					);
				}
				break;
			}
			case EncounterState.Victory: {
				const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as RegionModel;
				controls = (
					<div className='encounter-right-panel'>
						<Text type={TextType.Heading}>Victory</Text>
						<hr />
						<Text type={TextType.MinorHeading}>You won the encounter in {region.name}!</Text>
						<Text>Each surviving hero who took part in this encounter gains 1 XP.</Text>
						<Text>Any heroes who died have been lost.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Victory)}>OK</button>
					</div>
				);
				break;
			}
			case EncounterState.Defeat: {
				const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as RegionModel;
				controls = (
					<div className='encounter-right-panel'>
						<Text type={TextType.Heading}>Defeated</Text>
						<hr />
						<Text type={TextType.MinorHeading}>You lost the encounter in {region.name}.</Text>
						<Text>Those heroes who took part have been lost, along with all their equipment.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Defeat)}>OK</button>
					</div>
				);
				break;
			}
			case EncounterState.Retreat: {
				const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as RegionModel;
				controls = (
					<div className='encounter-right-panel empty'>
						<Text type={TextType.Heading}>Retreat</Text>
						<hr />
						<Text type={TextType.MinorHeading}>You retreated from the encounter in {region.name}.</Text>
						<Text>Any heroes who fell have been lost, along with all their equipment.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Retreat)}>OK</button>
					</div>
				);
				break;
			}
		}

		let dialog = null;
		if (this.state.detailsCombatant) {
			dialog = (
				<Dialog
					content={
						<CharacterSheetPanel
							hero={this.state.detailsCombatant}
							game={this.props.game}
							equipItem={this.props.equipItem}
							unequipItem={this.props.unequipItem}
							pickUpItem={this.props.pickUpItem}
							dropItem={this.props.dropItem}
							levelUp={() => null}
						/>
					}
					onClickOff={() => this.showDetailsCombatant(null)}
				/>
			);
		}
		if (this.state.detailsLoot) {
			dialog = (
				<Dialog
					content={
						<div>
							<Text type={TextType.Heading}>Treasure</Text>
							<CardList cards={this.state.detailsLoot.items.map(i => <PlayingCard key={i.id} front={<ItemCard item={i} />} />)} />
						</div>
					}
					onClickOff={() => this.showDetailsLoot(null)}
				/>
			);
		}

		return (
			<div className='encounter-screen'>
				{initiative}
				<div className='encounter-central-panel'>
					<EncounterMapPanel
						encounter={this.props.encounter}
						squareSize={this.state.mapSquareSize}
						selectedIDs={this.state.selectedIDs}
						onSelect={this.selectCombatant}
						onCombatantDetails={this.showDetailsCombatant}
						onLootDetails={this.showDetailsLoot}
					/>
					<div className='map-controls'>
						<div className='zoom'>
							<button disabled={this.state.mapSquareSize <= 5} className='zoom-btn' onClick={() => this.nudgeMapSize(-5)}>-</button>
							<button disabled={this.state.mapSquareSize >= 50} className='zoom-btn' onClick={() => this.nudgeMapSize(+5)}>+</button>
						</div>
						{this.props.developer ? <Developer><button className='finish-btn' onClick={() => this.setManualEncounterState(EncounterState.Victory)}>Victory</button></Developer> : null}
						<button className='finish-btn danger' onClick={() => this.setManualEncounterState(EncounterState.Retreat)}>Retreat</button>
						<button className='finish-btn danger' onClick={() => this.setManualEncounterState(EncounterState.Defeat)}>Surrender</button>
					</div>
				</div>
				{controls}
				{dialog}
			</div>
		);
	};
}

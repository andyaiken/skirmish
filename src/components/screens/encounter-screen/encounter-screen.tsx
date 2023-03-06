import { Component } from 'react';

import { ActionTargetType } from '../../../enums/action-target-type';
import { CardType } from '../../../enums/card-type';
import { EncounterState } from '../../../enums/encounter-state';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel } from '../../../models/action';
import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { RegionModel } from '../../../models/campaign-map';

import { CardList, Dialog, PlayingCard, Text, TextType } from '../../controls';
import { CharacterSheetPanel, EncounterMapPanel, InitiativeListPanel } from '../../panels';
import { CombatantControls } from './combatant-controls/combatant-controls';
import { ItemCard } from '../../cards';

import './encounter-screen.scss';

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	developer: boolean;
	rotateMap: (encounter: EncounterModel, dir: 'l' | 'r') => void;
	rollInitiative: (encounter: EncounterModel) => void;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	kill: (encounter: EncounterModel, combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterState) => void;
}

interface State {
	mapSquareSize: number;
	currentActionParameter: ActionParameterModel | null;
	selectableCombatantIDs: string[];
	selectableLootIDs: string[];
	selectableSquares: { x: number, y: number }[];
	selectedCombatantIDs: string[];
	selectedLootIDs: string[];
	selectedSquares: { x: number, y: number }[];
	manualEncounterState: EncounterState;
	detailsCombatant: CombatantModel | null;
	detailsLoot: LootPileModel | null;
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapSquareSize: 10,
			currentActionParameter: null,
			selectableCombatantIDs: [],
			selectableLootIDs: [],
			selectableSquares: [],
			selectedCombatantIDs: [],
			selectedLootIDs: [],
			selectedSquares: [],
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

	selectCombatant = (combatant: CombatantModel) => {
		let ids = this.state.selectedCombatantIDs;
		if (ids.includes(combatant.id)) {
			ids = ids.filter(id => id !== combatant.id);
		} else {
			ids.push(combatant.id);
		}

		const parameter = this.state.currentActionParameter;
		if (parameter) {
			let usesCombatantIDs = false;
			switch (parameter.name) {
				case 'targets': {
					const targetParam = parameter as ActionTargetParameterModel;
					if (targetParam.targets) {
						switch (targetParam.targets.type) {
							case ActionTargetType.Combatants:
							case ActionTargetType.Enemies:
							case ActionTargetType.Allies:
								usesCombatantIDs = true;
								break;
						}
					}
				}
			}
			if (usesCombatantIDs) {
				parameter.value = ids;
			}
		}

		this.setState({
			currentActionParameter: parameter,
			selectedCombatantIDs: ids
		});
	};

	selectLoot = (loot: LootPileModel) => {
		let ids = this.state.selectedLootIDs;
		if (ids.includes(loot.id)) {
			ids = ids.filter(id => id !== loot.id);
		} else {
			ids.push(loot.id);
		}

		this.setState({
			selectedLootIDs: ids
		});
	};

	selectSquare = (square: { x: number, y: number }) => {
		let squares = this.state.selectedSquares;
		if (squares.includes(square)) {
			squares = squares.filter(sq => sq !== square);
		} else {
			squares.push(square);
		}

		const parameter = this.state.currentActionParameter;
		if (parameter) {
			let usesSquares = false;
			switch (parameter.name) {
				case 'origin':
					usesSquares = true;
					break;
				case 'targets': {
					const targetParam = parameter as ActionTargetParameterModel;
					if (targetParam.targets) {
						switch (targetParam.targets.type) {
							case ActionTargetType.Squares:
							case ActionTargetType.Walls:
								usesSquares = true;
								break;
						}
					}
				}
			}
			if (usesSquares) {
				parameter.value = squares.map(sq => {
					return { x: sq.x, y: sq.y };
				});
			}
		}

		this.setState({
			currentActionParameter: parameter,
			selectedSquares: squares
		});
	};

	clearSelection = () => {
		if (this.state.currentActionParameter) {
			this.setState({
				currentActionParameter: null,
				selectableCombatantIDs: [],
				selectableLootIDs: [],
				selectableSquares: []
			});
		} else {
			this.setState({
				selectedCombatantIDs: [],
				selectedLootIDs: [],
				selectedSquares: []
			});
		}
	};

	setManualEncounterState = (state: EncounterState) => {
		this.setState({
			manualEncounterState: state
		});
	};

	showDetailsCombatant = (combatant: CombatantModel) => {
		this.setState({
			detailsCombatant: combatant,
			detailsLoot: null
		});
	};

	showDetailsLoot = (loot: LootPileModel) => {
		this.setState({
			detailsCombatant: null,
			detailsLoot: loot
		});
	};

	clearDetails = () => {
		this.setState({
			detailsCombatant: null,
			detailsLoot: null
		});
	};

	selectAction = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		this.setState({
			selectedCombatantIDs: [],
			selectedLootIDs: [],
			selectedSquares: []
		}, () => {
			this.props.selectAction(encounter, combatant, action);
		});
	};

	setActionParameter = (parameter: ActionParameterModel) => {
		let selectableCombatantIDs: string[] = [];
		let selectableSquares: { x: number, y: number }[] = [];
		let selectedCombatantIDs: string[] = [];
		let selectedSquares: { x: number, y: number }[] = [];

		switch (parameter.name) {
			case 'origin': {
				const originParam = parameter as ActionOriginParameterModel;
				selectableSquares = (originParam.candidates as { x: number, y: number }[]);
				selectedSquares = [ originParam.value as { x: number, y: number } ];
				break;
			}
			case 'targets': {
				const targetParam = parameter as ActionTargetParameterModel;
				if (targetParam.targets !== null) {
					switch (targetParam.targets.type) {
						case ActionTargetType.Combatants:
						case ActionTargetType.Enemies:
						case ActionTargetType.Allies:
							selectableCombatantIDs = targetParam.candidates as string[];
							selectedCombatantIDs = targetParam.value as string[];
							break;
						case ActionTargetType.Squares:
							selectableSquares = (targetParam.candidates as { x: number, y: number }[]);
							selectedSquares = [ targetParam.value as { x: number, y: number } ];
							break;
						case ActionTargetType.Walls:
							selectableSquares = (targetParam.candidates as { x: number, y: number }[]);
							selectedSquares = [ targetParam.value as { x: number, y: number } ];
							break;
					}
				}
				break;
			}
		}

		this.setState({
			currentActionParameter: parameter,
			selectableCombatantIDs: selectableCombatantIDs,
			selectableLootIDs: [],
			selectableSquares: selectableSquares,
			selectedCombatantIDs: selectedCombatantIDs,
			selectedLootIDs: [],
			selectedSquares: selectedSquares
		});
	};

	runAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		this.setState({
			currentActionParameter: null,
			selectableCombatantIDs: [],
			selectableLootIDs: [],
			selectableSquares: []
		}, () => {
			this.props.runAction(encounter, combatant);
		});
	};

	render = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}

		let initiative = (
			<div className='encounter-left-panel empty'>
			</div>
		);
		if ((state === EncounterState.Active) && (EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current))) {
			initiative = (
				<div className='encounter-left-panel'>
					<InitiativeListPanel
						encounter={this.props.encounter}
						selectedIDs={this.state.selectedCombatantIDs}
						onSelect={this.selectCombatant}
						onDetails={this.showDetailsCombatant}
					/>
				</div>
			);
		}

		let controls = null;
		let mapControls = null;
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
					controls = (
						<div className='encounter-right-panel'>
							<CombatantControls
								combatant={currentCombatant}
								encounter={this.props.encounter}
								currentActionParameter={this.state.currentActionParameter}
								developer={this.props.developer}
								endTurn={this.props.endTurn}
								move={this.props.move}
								addMovement={this.props.addMovement}
								standUp={this.props.standUp}
								scan={this.props.scan}
								hide={this.props.hide}
								selectAction={this.selectAction}
								setActionParameter={this.setActionParameter}
								setActionParameterValue={this.props.setActionParameterValue}
								runAction={this.runAction}
								pickUpItem={this.props.pickUpItem}
								showCharacterSheet={this.showDetailsCombatant}
								kill={this.props.kill}
							/>
						</div>
					);
				}
				mapControls = (
					<div className='map-controls'>
						<div className='zoom'>
							<button className='zoom-btn' onClick={() => this.props.rotateMap(this.props.encounter, 'l')}>L</button>
							<button className='zoom-btn' onClick={() => this.props.rotateMap(this.props.encounter, 'r')}>R</button>
						</div>
						<div className='zoom'>
							<button disabled={this.state.mapSquareSize <= 5} className='zoom-btn' onClick={() => this.nudgeMapSize(-5)}>-</button>
							<button disabled={this.state.mapSquareSize >= 50} className='zoom-btn' onClick={() => this.nudgeMapSize(+5)}>+</button>
						</div>
						<button className='finish-btn danger' onClick={() => this.setManualEncounterState(EncounterState.Retreat)}>Retreat</button>
						<button className='finish-btn danger' onClick={() => this.setManualEncounterState(EncounterState.Defeat)}>Surrender</button>
						{this.props.developer ? <button className='finish-btn developer' onClick={() => this.setManualEncounterState(EncounterState.Victory)}>Victory</button> : null}
					</div>
				);
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
					onClickOff={() => this.clearDetails()}
				/>
			);
		}
		if (this.state.detailsLoot) {
			dialog = (
				<Dialog
					content={
						<div>
							<Text type={TextType.Heading}>Treasure</Text>
							<CardList cards={this.state.detailsLoot.items.map(i => <PlayingCard key={i.id} type={CardType.Item} front={<ItemCard item={i} />} />)} />
						</div>
					}
					onClickOff={() => this.clearDetails()}
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
						selectableCombatantIDs={this.state.selectableCombatantIDs}
						selectableLootIDs={this.state.selectableLootIDs}
						selectableSquares={this.state.selectableSquares}
						selectedCombatantIDs={this.state.selectedCombatantIDs}
						selectedLootIDs={this.state.selectedLootIDs}
						selectedSquares={this.state.selectedSquares}
						onClickCombatant={this.selectCombatant}
						onClickLoot={this.selectLoot}
						onClickSquare={this.selectSquare}
						onClickOff={this.clearSelection}
						onDoubleClickCombatant={this.showDetailsCombatant}
						onDoubleClickLoot={this.showDetailsLoot}
					/>
					{mapControls}
				</div>
				{controls}
				{dialog}
			</div>
		);
	};
}

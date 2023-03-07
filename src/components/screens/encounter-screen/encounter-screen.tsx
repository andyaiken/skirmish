import { IconId, IconNotes, IconRotate2, IconRotateClockwise2, IconX, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { Component } from 'react';

import { ActionTargetType } from '../../../enums/action-target-type';
import { CardType } from '../../../enums/card-type';
import { EncounterState } from '../../../enums/encounter-state';
import { TraitType } from '../../../enums/trait-type';

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
		const parameter = this.state.currentActionParameter;
		if (parameter) {
			let usesCombatantIDs = false;
			let count = Number.MAX_VALUE;
			switch (parameter.name) {
				case 'targets': {
					const targetParam = parameter as ActionTargetParameterModel;
					if (targetParam.targets) {
						switch (targetParam.targets.type) {
							case ActionTargetType.Combatants:
							case ActionTargetType.Enemies:
							case ActionTargetType.Allies:
								usesCombatantIDs = true;
								count = targetParam.targets.count;
								break;
						}
					}
				}
			}

			if (usesCombatantIDs) {
				let ids = this.state.selectedCombatantIDs;
				if (ids.includes(combatant.id)) {
					ids = ids.filter(id => id !== combatant.id);
				} else {
					if (ids.length < count) {
						ids.push(combatant.id);
					}
				}

				parameter.value = ids;

				this.setState({
					currentActionParameter: parameter,
					selectedCombatantIDs: ids,
					selectedLootIDs: [],
					selectedSquares: []
				});
			}
		} else {
			this.setState({
				currentActionParameter: parameter,
				selectedCombatantIDs: [ combatant.id ],
				selectedLootIDs: [],
				selectedSquares: []
			});
		}
	};

	selectLoot = (loot: LootPileModel) => {
		this.setState({
			selectedCombatantIDs: [],
			selectedLootIDs: [ loot.id ],
			selectedSquares: []
		});
	};

	selectSquare = (square: { x: number, y: number }) => {
		const parameter = this.state.currentActionParameter;
		if (parameter) {
			let usesSquares = false;
			let count = Number.MAX_VALUE;
			switch (parameter.name) {
				case 'origin':
					usesSquares = true;
					count = 1;
					break;
				case 'targets': {
					const targetParam = parameter as ActionTargetParameterModel;
					if (targetParam.targets) {
						switch (targetParam.targets.type) {
							case ActionTargetType.Squares:
							case ActionTargetType.Walls:
								usesSquares = true;
								count = targetParam.targets.count;
								break;
						}
					}
				}
			}

			if (usesSquares) {
				let squares = this.state.selectedSquares;
				if (squares.includes(square)) {
					squares = squares.filter(sq => !((sq.x === square.x) && (sq.y === square.y)));
				} else {
					if (squares.length < count) {
						squares.push(square);
					}
				}

				parameter.value = squares;

				this.setState({
					currentActionParameter: parameter,
					selectedCombatantIDs: [],
					selectedLootIDs: [],
					selectedSquares: squares
				});
			}
		} else {
			this.setState({
				currentActionParameter: parameter,
				selectedCombatantIDs: [],
				selectedLootIDs: [],
				selectedSquares: [ square ]
			});
		}
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

	showDetailsCombatant = (combatant: CombatantModel)=> {
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
		if (this.state.currentActionParameter !== null) {
			this.setState({
				currentActionParameter: null,
				selectableCombatantIDs: [],
				selectableLootIDs: [],
				selectableSquares: []
			});
		} else {
			let selectableCombatantIDs: string[] = [];
			let selectableSquares: { x: number, y: number }[] = [];
			let selectedCombatantIDs: string[] = [];
			let selectedSquares: { x: number, y: number }[] = [];

			switch (parameter.name) {
				case 'origin': {
					const originParam = parameter as ActionOriginParameterModel;
					selectableSquares = originParam.candidates as { x: number, y: number }[];
					selectedSquares = originParam.value as { x: number, y: number }[];
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
								selectableSquares = targetParam.candidates as { x: number, y: number }[];
								selectedSquares = targetParam.value as { x: number, y: number }[];
								break;
							case ActionTargetType.Walls:
								selectableSquares = targetParam.candidates as { x: number, y: number }[];
								selectedSquares = targetParam.value as { x: number, y: number }[];
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
		}
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

	endTurn = (encounter: EncounterModel) => {
		this.setState({
			currentActionParameter: null,
			selectableSquares: [],
			selectedSquares: []
		}, () => {
			this.props.endTurn(encounter);
		});
	};

	getLeftControls = (state: EncounterState) => {
		if ((state === EncounterState.Active) && (EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current))) {
			return (
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

		return (
			<div className='encounter-left-panel empty'>
			</div>
		);
	};

	getBottomControls = (state: EncounterState) => {
		if (state !== EncounterState.Active) {
			return null;
		}

		if (this.state.selectedCombatantIDs.length === 1) {
			const combatant = EncounterLogic.getCombatant(this.props.encounter, this.state.selectedCombatantIDs[0]) as CombatantModel;
			return (
				<div className='encounter-bottom-panel'>
					<div className='section text'>
						<b>{combatant.name}</b>
					</div>
					<div className='section stack'>
						<div className='stack-label'>Endurance</div>
						<div className='stack-value'>{EncounterLogic.getTraitRank(this.props.encounter, combatant, TraitType.Endurance)}</div>
					</div>
					<div className='section stack'>
						<div className='stack-label'>Resolve</div>
						<div className='stack-value'>{EncounterLogic.getTraitRank(this.props.encounter, combatant, TraitType.Resolve)}</div>
					</div>
					<div className='section stack'>
						<div className='stack-label'>Speed</div>
						<div className='stack-value'>{EncounterLogic.getTraitRank(this.props.encounter, combatant, TraitType.Speed)}</div>
					</div>
					<div className='section stack'>
						<div className='stack-label'>Damage</div>
						<div className='stack-value'>{combatant.combat.damage}</div>
					</div>
					<div className='section stack'>
						<div className='stack-label'>Wounds</div>
						<div className='stack-value'>{combatant.combat.wounds} / {EncounterLogic.getTraitRank(this.props.encounter, combatant, TraitType.Resolve)}</div>
					</div>
					<div className='section compact'>
						<button className='icon-btn' title='Close' onClick={() => this.showDetailsCombatant(combatant)}>
							<IconId />
						</button>
					</div>
					<div className='section compact'>
						<button className='icon-btn' title='Close' onClick={() => this.clearSelection()}>
							<IconX />
						</button>
					</div>
				</div>
			);
		}

		if (this.state.selectedCombatantIDs.length > 1) {
			return (
				<div className='encounter-bottom-panel'>
					<div className='section text'>
						<b>{this.state.selectedCombatantIDs.length} combatants selected</b>
					</div>
					<div className='section compact'>
						<button className='icon-btn' title='Close' onClick={() => this.clearSelection()}>
							<IconX />
						</button>
					</div>
				</div>
			);
		}

		if (this.state.selectedLootIDs.length === 1) {
			const loot = EncounterLogic.getLoot(this.props.encounter, this.state.selectedLootIDs[0]) as LootPileModel;
			return (
				<div className='encounter-bottom-panel'>
					<div className='section text'>
						<b>{loot.items.map(item => item.name).join(', ')}</b>
					</div>
					<div className='section compact'>
						<button className='icon-btn' title='Close' onClick={() => this.showDetailsLoot(loot)}>
							<IconNotes />
						</button>
					</div>
					<div className='section compact'>
						<button className='icon-btn' title='Close' onClick={() => this.clearSelection()}>
							<IconX />
						</button>
					</div>
				</div>
			);
		}

		if (this.state.selectedLootIDs.length > 1) {
			return (
				<div className='encounter-bottom-panel'>
					<div className='section text'>
						<b>{this.state.selectedLootIDs.length} treasure piles selected</b>
					</div>
					<div className='section compact'>
						<button className='icon-btn' title='Close' onClick={() => this.clearSelection()}>
							<IconX />
						</button>
					</div>
				</div>
			);
		}

		return (
			<div className='encounter-bottom-panel'>
				<div className='section'>
					<button className='icon-btn' title='Rotate Left' onClick={() => this.props.rotateMap(this.props.encounter, 'l')}>
						<IconRotate2 />
					</button>
					<button className='icon-btn' title='Rotate Right' onClick={() => this.props.rotateMap(this.props.encounter, 'r')}>
						<IconRotateClockwise2 />
					</button>
				</div>
				<div className='section'>
					<button disabled={this.state.mapSquareSize <= 5} className='icon-btn' title='Zoom Out' onClick={() => this.nudgeMapSize(-5)}>
						<IconZoomOut />
					</button>
					<button disabled={this.state.mapSquareSize >= 50} className='icon-btn' title='Zoom In' onClick={() => this.nudgeMapSize(+5)}>
						<IconZoomIn />
					</button>
				</div>
				<div className='section'>
					<button className='danger' onClick={() => this.setManualEncounterState(EncounterState.Retreat)}>Retreat</button>
				</div>
				<div className='section'>
					<button className='danger' onClick={() => this.setManualEncounterState(EncounterState.Defeat)}>Surrender</button>
				</div>
				{this.props.developer ? <div className='section'><button className='developer' onClick={() => this.setManualEncounterState(EncounterState.Victory)}>Victory</button></div> : null}
			</div>
		);
	};

	getRightControls = (state: EncounterState) => {
		const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as RegionModel;

		switch (state) {
			case EncounterState.Victory:
				return (
					<div className='encounter-right-panel'>
						<Text type={TextType.Heading}>Victory</Text>
						<hr />
						<Text type={TextType.MinorHeading}>You won the encounter in {region.name}!</Text>
						<Text>Each surviving hero who took part in this encounter gains 1 XP.</Text>
						<Text>Any heroes who died have been lost.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Victory)}>OK</button>
					</div>
				);
			case EncounterState.Defeat:
				return (
					<div className='encounter-right-panel'>
						<Text type={TextType.Heading}>Defeated</Text>
						<hr />
						<Text type={TextType.MinorHeading}>You lost the encounter in {region.name}.</Text>
						<Text>Those heroes who took part have been lost, along with all their equipment.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Defeat)}>OK</button>
					</div>
				);
			case EncounterState.Retreat:
				return (
					<div className='encounter-right-panel empty'>
						<Text type={TextType.Heading}>Retreat</Text>
						<hr />
						<Text type={TextType.MinorHeading}>You retreated from the encounter in {region.name}.</Text>
						<Text>Any heroes who fell have been lost, along with all their equipment.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Retreat)}>OK</button>
					</div>
				);
		}

		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;
		if (currentCombatant === null) {
			return (
				<div className='encounter-right-panel'>
					<Text type={TextType.SubHeading}>Round {this.props.encounter.round + 1}</Text>
					<button onClick={() => this.props.rollInitiative(this.props.encounter)}>Roll Initiative</button>
				</div>
			);
		}

		return (
			<div className='encounter-right-panel'>
				<CombatantControls
					combatant={currentCombatant}
					encounter={this.props.encounter}
					currentActionParameter={this.state.currentActionParameter}
					developer={this.props.developer}
					endTurn={this.endTurn}
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
	};

	render = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
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
				{this.getLeftControls(state)}
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
					{this.getBottomControls(state)}
				</div>
				{this.getRightControls(state)}
				{dialog}
			</div>
		);
	};
}
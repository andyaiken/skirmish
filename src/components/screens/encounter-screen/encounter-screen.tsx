import { IconInfoCircle, IconRotate2, IconRotateClockwise2, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { Component } from 'react';

import { ActionTargetType } from '../../../enums/action-target-type';
import { CardType } from '../../../enums/card-type';
import { CombatantState } from '../../../enums/combatant-state';
import { CombatantType } from '../../../enums/combatant-type';
import { EncounterState } from '../../../enums/encounter-state';

import { ActionLogic } from '../../../logic/action-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel } from '../../../models/action';
import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { RegionModel } from '../../../models/region';

import { CardList, Dialog, PlayingCard, Text, TextType } from '../../controls';
import { CharacterSheetPanel, EncounterMapPanel, InitiativeListPanel, TurnLogPanel } from '../../panels';
import { CombatantAction } from './combatant-action/combatant-action';
import { CombatantHeader } from './combatant-header/combatant-header';
import { CombatantMonster } from './combatant-monster/combatant-monster';
import { CombatantMove } from './combatant-move/combatant-move';
import { CombatantOverview } from './combatant-overview/combatant-overview';
import { ItemCard } from '../../cards';

import './encounter-screen.scss';

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	developer: boolean;
	showHelp: (file: string) => void;
	rotateMap: (encounter: EncounterModel, dir: 'l' | 'r') => void;
	rollInitiative: (encounter: EncounterModel) => void;
	endTurn: (encounter: EncounterModel) => void;
	performIntents: (encounter: EncounterModel, combatant: CombatantModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterState) => void;
}

interface State {
	rightID: string;
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
			rightID: 'overview',
			mapSquareSize: 15,
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

	setRightID = (id: string) => {
		this.setState({
			rightID: id
		});
	};

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
			switch (parameter.id) {
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
				} else if (count === 1) {
					ids = [ combatant.id ];
				} else if (ids.length < count) {
					ids.push(combatant.id);
				}

				parameter.value = ids;

				this.setState({
					currentActionParameter: parameter,
					selectedCombatantIDs: ids,
					selectedLootIDs: [],
					selectedSquares: []
				}, () => {
					this.props.setActionParameterValue(parameter, ids);
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
			switch (parameter.id) {
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
				if (squares.find(s => (s.x === square.x) && (s.y === square.y))) {
					squares = squares.filter(sq => !((sq.x === square.x) && (sq.y === square.y)));
				} else if (count === 1) {
					squares = [ square ];
				} else if (squares.length < count) {
					squares.push(square);
				}

				parameter.value = squares;

				if (parameter.id === 'origin') {
					const combatant = this.props.encounter.combatants.find(c => c.combat.current) as CombatantModel;
					const action = combatant.combat.selectedAction ? combatant.combat.selectedAction.action : null;
					if (action) {
						const targetParam = action.parameters.find(a => a.id === 'targets') as ActionTargetParameterModel;
						ActionLogic.checkTargetParameter(targetParam, this.props.encounter, combatant, action, false);
					}
				}

				this.setState({
					currentActionParameter: parameter,
					selectedCombatantIDs: [],
					selectedLootIDs: [],
					selectedSquares: squares
				}, () => {
					this.props.setActionParameterValue(parameter, squares);
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

	move = (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => {
		this.setState({
			currentActionParameter: null,
			selectedSquares: []
		}, () => {
			this.props.move(encounter, combatant, dir, cost);
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

			switch (parameter.id) {
				case 'origin': {
					const originParam = parameter as ActionOriginParameterModel;
					selectableSquares = originParam.candidates as { x: number, y: number }[] ?? [];
					selectedSquares = originParam.value as { x: number, y: number }[] ?? [];
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
								selectableSquares = targetParam.candidates as { x: number, y: number }[] ?? [];
								selectedSquares = targetParam.value as { x: number, y: number }[] ?? [];
								break;
							case ActionTargetType.Walls:
								selectableSquares = targetParam.candidates as { x: number, y: number }[] ?? [];
								selectedSquares = targetParam.value as { x: number, y: number }[] ?? [];
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
			selectableSquares: [],
			selectedSquares: []
		}, () => {
			this.props.runAction(encounter, combatant);
		});
	};

	endTurn = (encounter: EncounterModel) => {
		this.setState({
			rightID: 'overview',
			currentActionParameter: null,
			selectableSquares: [],
			selectedSquares: []
		}, () => {
			this.props.endTurn(encounter);
		});
	};

	getLeftControls = () => {
		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;

		return (
			<div className='encounter-left-panel'>
				<div className='panel-content'>
					<InitiativeListPanel
						encounter={this.props.encounter}
						selectedIDs={this.state.selectedCombatantIDs}
						onSelect={this.selectCombatant}
						onDetails={this.showDetailsCombatant}
					/>
				</div>
				<div className='panel-footer'>
					{currentCombatant ? <TurnLogPanel combatant={currentCombatant} /> : null}
				</div>
			</div>
		);
	};

	getBottomControls = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}

		if (state !== EncounterState.Active) {
			return null;
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
				<div className='section compact'>
					<button className='icon-btn' title='Information' onClick={() => this.props.showHelp('encounters')}>
						<IconInfoCircle />
					</button>
				</div>
			</div>
		);
	};

	getRightControls = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}

		const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as RegionModel;

		switch (state) {
			case EncounterState.Victory:
				return (
					<div className='encounter-right-panel'>
						<div className='panel-header'>
							<Text type={TextType.Heading}>Victory</Text>
						</div>
						<div className='panel-content'>
							<Text type={TextType.MinorHeading}>You won the encounter in {region.name}!</Text>
							<Text>Each surviving hero who took part in this encounter gains 1 XP.</Text>
							<Text>Any heroes who died have been lost.</Text>
							<button onClick={() => this.props.finishEncounter(EncounterState.Victory)}>OK</button>
							{state !== EncounterLogic.getEncounterState(this.props.encounter) ? <button onClick={() => this.setManualEncounterState(EncounterState.Active)}>Cancel</button> : null}
						</div>
					</div>
				);
			case EncounterState.Defeat:
				return (
					<div className='encounter-right-panel'>
						<div className='panel-header'>
							<Text type={TextType.Heading}>Defeated</Text>
						</div>
						<div className='panel-content'>
							<Text type={TextType.MinorHeading}>You lost the encounter in {region.name}.</Text>
							<Text>Those heroes who took part have been lost, along with all their equipment.</Text>
							<button onClick={() => this.props.finishEncounter(EncounterState.Defeat)}>OK</button>
							{state !== EncounterLogic.getEncounterState(this.props.encounter) ? <button onClick={() => this.setManualEncounterState(EncounterState.Active)}>Cancel</button> : null}
						</div>
					</div>
				);
			case EncounterState.Retreat:
				return (
					<div className='encounter-right-panel empty'>
						<div className='panel-header'>
							<Text type={TextType.Heading}>Retreat</Text>
						</div>
						<div className='panel-content'>
							<Text type={TextType.MinorHeading}>You retreated from the encounter in {region.name}.</Text>
							<Text>Any heroes who fell have been lost, along with all their equipment.</Text>
							<button onClick={() => this.props.finishEncounter(EncounterState.Retreat)}>OK</button>
							{state !== EncounterLogic.getEncounterState(this.props.encounter) ? <button onClick={() => this.setManualEncounterState(EncounterState.Active)}>Cancel</button> : null}
						</div>
					</div>
				);
		}

		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;
		if (currentCombatant === null) {
			return (
				<div className='encounter-right-panel'>
					<div className='panel-header'>
						<Text type={TextType.Heading}>Round {this.props.encounter.round + 1}</Text>
					</div>
					<div className='panel-content'>
						<button onClick={() => this.props.rollInitiative(this.props.encounter)}>Roll Initiative</button>
					</div>
				</div>
			);
		}

		let content = null;
		let footer = null;
		if (currentCombatant.combat.state === CombatantState.Dead) {
			content = (
				<div>
					<Text type={TextType.Information}><b>{currentCombatant.name} is Dead.</b> They cannot spend movement points or take any actions.</Text>
				</div>
			);
			footer = (
				<div>
					<button onClick={() => this.endTurn(this.props.encounter)}>End Turn</button>
				</div>
			);
		} else if (currentCombatant.combat.state === CombatantState.Unconscious) {
			content = (
				<div>
					<Text type={TextType.Information}><b>{currentCombatant.name} is Unconscious.</b> They cannot spend movement points or take any actions until their wounds are healed.</Text>
				</div>
			);
			footer = (
				<div>
					<button onClick={() => this.endTurn(this.props.encounter)}>End Turn</button>
				</div>
			);
		} else if (currentCombatant.combat.stunned) {
			content = (
				<div>
					<Text type={TextType.Information}><b>{currentCombatant.name} is Stunned.</b> They cannot spend movement points or take any actions this round.</Text>
				</div>
			);
			footer = (
				<div>
					<button onClick={() => this.endTurn(this.props.encounter)}>End Turn</button>
				</div>
			);
		} else {
			if (currentCombatant.type === CombatantType.Monster) {
				content = (
					<CombatantMonster
						combatant={currentCombatant}
						developer={this.props.developer}
					/>
				);
				footer = (
					<div>
						<button onClick={() => this.props.performIntents(this.props.encounter, currentCombatant)}>
							{currentCombatant.combat.intents ? currentCombatant.combat.intents.description : 'End Turn'}
						</button>
					</div>
				);
			} else {
				switch (this.state.rightID) {
					case 'overview':
						content = (
							<CombatantOverview
								combatant={currentCombatant}
								encounter={this.props.encounter}
								developer={this.props.developer}
								inspire={this.props.inspire}
								scan={this.props.scan}
								hide={this.props.hide}
							/>
						);
						break;
					case 'move':
						content = (
							<CombatantMove
								combatant={currentCombatant}
								encounter={this.props.encounter}
								developer={this.props.developer}
								move={this.move}
								addMovement={this.props.addMovement}
								pickUpItem={this.props.pickUpItem}
							/>
						);
						break;
					case 'action':
						content = (
							<CombatantAction
								combatant={currentCombatant}
								encounter={this.props.encounter}
								currentActionParameter={this.state.currentActionParameter}
								developer={this.props.developer}
								drawActions={this.props.drawActions}
								selectAction={this.selectAction}
								deselectAction={this.props.deselectAction}
								setActionParameter={this.setActionParameter}
								setActionParameterValue={this.props.setActionParameterValue}
								runAction={this.runAction}
							/>
						);
						break;
				}

				footer = (
					<div>
						{
							(currentCombatant.combat.selectedAction && currentCombatant.combat.selectedAction.used) ? null :
								<Text type={TextType.Information}><b>You have not taken an action.</b> You probably want to take an action before you end your turn.</Text>
						}
						<button onClick={() => this.endTurn(this.props.encounter)}>End Turn</button>
					</div>
				);
			}
		}

		return (
			<div className='encounter-right-panel'>
				<div className='panel-header'>
					<CombatantHeader
						combatant={currentCombatant}
						developer={this.props.developer}
						tabID={this.state.rightID}
						onSelectTab={this.setRightID}
						showCharacterSheet={this.showDetailsCombatant}
					/>
				</div>
				<div className='panel-content'>
					{content}
				</div>
				<div className='panel-footer'>
					{footer}
				</div>
			</div>
		);
	};

	getEffect = () => {
		let effect = null;

		const combatant = this.props.encounter.combatants.find(c => c.combat.current);
		if (combatant) {
			if (combatant.combat.selectedAction && !combatant.combat.selectedAction.used) {
				const action = combatant.combat.selectedAction.action;

				const range = ActionLogic.getActionRange(action);
				const param = action.parameters.find(p => p.id === 'origin');
				if (param) {
					if (range > 0) {
						const originParam = param as ActionOriginParameterModel;
						const origin = (originParam.value as { x: number, y: number }[])[0];
						effect = {
							x: origin.x,
							y: origin.y,
							size: 1,
							radius: range
						};
					}
				} else {
					if (range > 1) {
						effect = {
							x: combatant.combat.position.x,
							y: combatant.combat.position.y,
							size: combatant.size,
							radius: range
						};
					}
				}
			}
		}

		return effect;
	};

	render = () => {
		let dialog = null;
		if (this.state.detailsCombatant) {
			dialog = (
				<Dialog
					content={
						<CharacterSheetPanel
							combatant={this.state.detailsCombatant}
							game={this.props.game}
							developer={this.props.developer}
							equipItem={this.props.equipItem}
							unequipItem={this.props.unequipItem}
							pickUpItem={this.props.pickUpItem}
							dropItem={this.props.dropItem}
							levelUp={() => null}
						/>
					}
					onClose={() => this.clearDetails()}
				/>
			);
		}
		if (this.state.detailsLoot) {
			dialog = (
				<Dialog
					content={
						<div>
							<Text type={TextType.Heading}>Treasure</Text>
							<CardList cards={this.state.detailsLoot.items.map(i => <PlayingCard key={i.id} type={CardType.Item} front={<ItemCard item={i} />} footer='Item' />)} />
						</div>
					}
					onClose={() => this.clearDetails()}
				/>
			);
		}

		return (
			<div className='encounter-screen'>
				{this.getLeftControls()}
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
						effect={this.getEffect()}
						onClickCombatant={this.selectCombatant}
						onClickLoot={this.selectLoot}
						onClickSquare={this.selectSquare}
						onClickOff={this.clearSelection}
						onDoubleClickCombatant={this.showDetailsCombatant}
						onDoubleClickLoot={this.showDetailsLoot}
					/>
					{this.getBottomControls()}
				</div>
				{this.getRightControls()}
				{dialog}
			</div>
		);
	};
}

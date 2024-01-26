import { Component, createRef } from 'react';
import {
	IconArrowBackUpDouble,
	IconCircleCheck,
	IconConfetti,
	IconDots,
	IconHelpCircle,
	IconHelpCircleFilled,
	IconLayoutBottombarCollapse,
	IconLayoutBottombarExpand,
	IconLayoutSidebarLeftCollapse,
	IconLayoutSidebarLeftExpand,
	IconLayoutSidebarRightCollapse,
	IconLayoutSidebarRightExpand,
	IconListDetails,
	IconNotes,
	IconRotate2,
	IconRotateClockwise2,
	IconZoomIn,
	IconZoomOut
} from '@tabler/icons-react';
import toast from 'react-hot-toast';

import { ActionTargetType } from '../../../enums/action-target-type';
import { CardType } from '../../../enums/card-type';
import { CombatantState } from '../../../enums/combatant-state';
import { CombatantType } from '../../../enums/combatant-type';
import { EncounterState } from '../../../enums/encounter-state';
import { OrientationType } from '../../../enums/orientation-type';
import { StructureType } from '../../../enums/structure-type';

import { ActionLogic } from '../../../logic/action-logic';
import { EncounterLogLogic } from '../../../logic/encounter-log-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel } from '../../../models/action';
import type { EncounterModel, LogMessageModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { CardList, Dialog, IconSize, IconType, IconValue, PlayingCard, StatValue, Tabs, Text, TextType } from '../../controls';
import { CombatantRowPanel, EncounterLogPanel, EncounterMapPanel, InitiativeListPanel, TreasureRowPanel } from '../../panels';
import { ItemCard, PlaceholderCard } from '../../cards';
import { ActionControls } from './action-controls/action-controls';
import { CharacterSheetModal } from '../../modals';
import { EncounterControls } from './encounter-controls/encounter-controls';
import { HeroControls } from './hero-controls/hero-controls';
import { InactiveControls } from './inactive-controls/inactive-controls';
import { MonsterControls } from './monster-controls/monster-controls';
import { RoundControls } from './round-controls/round-controls';

import './encounter-screen.scss';

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	options: OptionsModel;
	orientation: OrientationType;
	hasExceptions: boolean;
	showHelp: (file: string) => void;
	rotateMap: (encounter: EncounterModel, dir: 'l' | 'r') => void;
	rollInitiative: () => void;
	regenerateEncounterMap: () => void;
	addCombatantToEncounter: (encounter: EncounterModel, combatant: CombatantModel, useCharge: StructureType | null) => void;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel, useCharge: StructureType | null) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	runMonsterTurn: (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	useCharge: (type: StructureType, count: number) => void;
	levelUp: (combatant: CombatantModel) => void;
	switchAllegiance: (combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterState) => void;
}

interface State {
	mapSquareSize: number;
	showLeftPanel: boolean;
	showBottomPanel: boolean;
	showRightPanel: boolean;
	leftTab: string;
	selectedActionParameter: ActionParameterModel | null;
	selectableCombatantIDs: string[];
	selectableLootIDs: string[];
	selectableSquares: { x: number, y: number }[];
	selectedCombatantIDs: string[];
	selectedLootIDs: string[];
	selectedSquares: { x: number, y: number }[];
	manualEncounterState: EncounterState;
	detailsCombatant: CombatantModel | null;
	detailsLoot: LootPileModel | null;
	thinking: boolean;
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapSquareSize: 15,
			showLeftPanel: true,
			showBottomPanel: true,
			showRightPanel: true,
			leftTab: 'init',
			selectedActionParameter: null,
			selectableCombatantIDs: [],
			selectableLootIDs: [],
			selectableSquares: [],
			selectedCombatantIDs: [],
			selectedLootIDs: [],
			selectedSquares: [],
			manualEncounterState: EncounterState.Active,
			detailsCombatant: null,
			detailsLoot: null,
			thinking: false
		};
	}

	componentDidMount = () => {
		EncounterLogLogic.handleLogMessage = (messages: LogMessageModel[]) => {
			toast.custom(t => {
				setTimeout(() => {
					toast.dismiss(t.id);
				}, 5 * 1000);
				return (
					<div key={t.id} className='skirmish-notification' onClick={e => { e.stopPropagation(); toast.dismiss(t.id); }}>
						{messages.map((m, n) => <div key={n}>{EncounterLogLogic.getLogMessage(this.props.encounter, m)}</div>)}
					</div>
				);
			});
		};
	};

	componentWillUnmount = () => {
		EncounterLogLogic.handleLogMessage = null;
	};

	mapRef = createRef<EncounterMapPanel>();

	scrollToCombatant = (combatant: 'current' | 'selected') => {
		this.mapRef.current?.scrollToCombatant(combatant);
	};

	nudgeMapSize = (delta: number) => {
		const size = Math.max(this.state.mapSquareSize + delta, 5);
		this.setState({
			mapSquareSize: size
		});
	};

	toggleLeftPanel = () => {
		this.setState({
			showLeftPanel: !this.state.showLeftPanel
		});
	};

	toggleBottomPanel = () => {
		this.setState({
			showBottomPanel: !this.state.showBottomPanel
		});
	};

	toggleRightPanel = () => {
		this.setState({
			showRightPanel: !this.state.showRightPanel
		});
	};

	selectCombatant = (combatant: CombatantModel) => {
		const parameter = this.state.selectedActionParameter;
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
					selectedActionParameter: parameter,
					selectedCombatantIDs: ids,
					selectedLootIDs: [],
					selectedSquares: []
				}, () => {
					this.props.setActionParameterValue(parameter, ids);
				});
			}
		} else {
			this.setState({
				selectedActionParameter: parameter,
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
		const parameter = this.state.selectedActionParameter;
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
					selectedActionParameter: parameter,
					selectedCombatantIDs: [],
					selectedLootIDs: [],
					selectedSquares: squares
				}, () => {
					this.props.setActionParameterValue(parameter, squares);
				});
			}
		} else {
			this.setState({
				selectedActionParameter: parameter,
				selectedCombatantIDs: [],
				selectedLootIDs: [],
				selectedSquares: [ square ]
			});
		}
	};

	clearSelection = () => {
		if (this.state.selectedActionParameter) {
			this.setState({
				selectedActionParameter: null,
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
			selectedActionParameter: null,
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
		if (this.state.selectedActionParameter !== null) {
			this.setState({
				selectedActionParameter: null,
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
				selectedActionParameter: parameter,
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
			selectedActionParameter: null,
			selectableCombatantIDs: [],
			selectableLootIDs: [],
			selectableSquares: [],
			selectedSquares: []
		}, () => {
			this.props.runAction(encounter, combatant);
		});
	};

	endTurn = () => {
		this.setState({
			selectedActionParameter: null,
			selectableSquares: [],
			selectedSquares: []
		}, () => {
			this.props.endTurn(this.props.encounter);
		});
	};

	runMonsterTurn = () => {
		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;

		if (currentCombatant && (currentCombatant.faction === CombatantType.Monster)) {
			this.setState({
				thinking: true
			}, () => {
				this.props.runMonsterTurn(this.props.encounter, currentCombatant as CombatantModel, () => {
					this.setState({
						thinking: false
					});
				});
			});
		}
	};

	getTopControls = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}

		if (state !== EncounterState.Active) {
			return null;
		}

		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;

		let actionBtn = (
			<div className='action-container'>
				<button className='primary action' onClick={() => this.props.rollInitiative()}>Roll Initiative</button>
			</div>
		);
		if (currentCombatant) {
			if (currentCombatant.faction === CombatantType.Hero) {
				const actionTaken = currentCombatant.combat.selectedAction && currentCombatant.combat.selectedAction.used;
				actionBtn = (
					<div className='action-container'>
						<StatValue
							orientation='vertical'
							label='Movement'
							value={<IconValue value={currentCombatant.combat.movement} type={IconType.Movement} size={IconSize.Large} />}
						/>
						<StatValue
							orientation='vertical'
							label='Action'
							value={actionTaken ? <IconCircleCheck size={39} /> : <IconDots size={39} />}
						/>
						<button className={actionTaken ? 'primary action' : 'action'} onClick={() => this.endTurn()}>End My Turn</button>
					</div>
				);
			}
			if (currentCombatant.faction === CombatantType.Monster) {
				actionBtn = (
					<div className='action-container'>
						<button className='primary action' disabled={this.state.thinking} onClick={() => this.runMonsterTurn()}>Take Monster Turn</button>
					</div>
				);
			}
		}

		if (this.state.selectedCombatantIDs.length === 1) {
			const combatant = EncounterLogic.getCombatant(this.props.encounter, this.state.selectedCombatantIDs[0]);
			if (combatant) {
				return (
					<div className='encounter-top-panel'>
						<CombatantRowPanel
							mode='detailed'
							combatant={combatant}
							encounter={this.props.encounter}
							onTokenClick={() => this.scrollToCombatant('selected')}
							onDetails={this.showDetailsCombatant}
							onCancel={this.clearSelection}
						/>
						{actionBtn}
					</div>
				);
			}
		}

		if (this.state.selectedLootIDs.length === 1) {
			const loot = EncounterLogic.getLoot(this.props.encounter, this.state.selectedLootIDs[0]);
			if (loot) {
				return (
					<div className='encounter-top-panel'>
						<TreasureRowPanel
							loot={loot}
							onDetails={this.showDetailsLoot}
							onCancel={this.clearSelection}
						/>
						{actionBtn}
					</div>
				);
			}
		}

		return (
			<div className='encounter-top-panel'>
				<div className='encounter-toolbar'>
					<div className='icon-section'>
						<button className='icon-btn' title='Left Panel' onClick={() => this.toggleLeftPanel()}>
							{this.state.showLeftPanel ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
						</button>
						<button className='icon-btn' title='Bottom Panel' onClick={() => this.toggleBottomPanel()}>
							{this.state.showBottomPanel ? <IconLayoutBottombarCollapse /> : <IconLayoutBottombarExpand />}
						</button>
						<button className='icon-btn' title='Right Panal' onClick={() => this.toggleRightPanel()}>
							{this.state.showRightPanel ? <IconLayoutSidebarRightCollapse /> : <IconLayoutSidebarRightExpand />}
						</button>
					</div>
					<div className='icon-section'>
						<button className='icon-btn' title='Rotate Left' onClick={() => this.props.rotateMap(this.props.encounter, 'l')}>
							<IconRotate2 />
						</button>
						<button className='icon-btn' title='Rotate Right' onClick={() => this.props.rotateMap(this.props.encounter, 'r')}>
							<IconRotateClockwise2 />
						</button>
					</div>
					<div className='icon-section'>
						<button disabled={this.state.mapSquareSize <= 5} className='icon-btn' title='Zoom Out' onClick={() => this.nudgeMapSize(-5)}>
							<IconZoomOut />
						</button>
						<button disabled={this.state.mapSquareSize >= 50} className='icon-btn' title='Zoom In' onClick={() => this.nudgeMapSize(+5)}>
							<IconZoomIn />
						</button>
					</div>
					<div className='icon-section'>
						<button className='icon-btn' title='Retreat' onClick={() => this.setManualEncounterState(EncounterState.Retreat)}>
							<IconArrowBackUpDouble />
						</button>
						{
							this.props.options.developer ?
								<button className='icon-btn developer' title='Win' onClick={() => this.setManualEncounterState(EncounterState.Victory)}>
									<IconConfetti />
								</button>
								: null
						}
					</div>
					<div className='icon-section'>
						<button className='icon-btn' title='Help' onClick={() => this.props.showHelp('encounters')}>
							{this.props.options.developer && this.props.hasExceptions ? <IconHelpCircleFilled /> : <IconHelpCircle />}
						</button>
					</div>
				</div>
				{actionBtn}
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

		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;
		if (currentCombatant) {
			switch (currentCombatant.faction) {
				case CombatantType.Hero: {
					if (!currentCombatant.combat.stunned) {
						return (
							<div className='encounter-bottom-panel'>
								<ActionControls
									combatant={currentCombatant}
									encounter={this.props.encounter}
									game={this.props.game}
									developer={this.props.options.developer}
									currentActionParameter={this.state.selectedActionParameter}
									collapsed={!this.state.showBottomPanel}
									toggleCollapsed={() => this.setState({ showBottomPanel: !this.state.showBottomPanel })}
									drawActions={this.props.drawActions}
									selectAction={this.selectAction}
									deselectAction={this.props.deselectAction}
									setActionParameter={this.setActionParameter}
									setActionParameterValue={this.props.setActionParameterValue}
									setOriginParameterValue={(param, sq) => {
										param.value = [ sq ];
										const combatant = this.props.encounter.combatants.find(c => c.combat.current) as CombatantModel;
										const action = combatant.combat.selectedAction ? combatant.combat.selectedAction.action : null;
										if (action) {
											const targetParam = action.parameters.find(a => a.id === 'targets') as ActionTargetParameterModel;
											ActionLogic.checkTargetParameter(targetParam, this.props.encounter, combatant, action, false);
										}
										this.props.setActionParameterValue(param, [ sq ]);
									}}
									runAction={this.runAction}
								/>
							</div>
						);
					}
					break;
				}
				case CombatantType.Monster: {
					if (this.state.showBottomPanel) {
						return (
							<div className='encounter-bottom-panel'>
								<div className='bottom-message'>The current combatant is a <b>monster</b>.</div>
							</div>
						);
					}
					break;
				}
			}
		}

		return null;
	};

	getLeftControls = () => {
		if (this.state.showLeftPanel) {
			let content = null;
			switch (this.state.leftTab) {
				case 'init':
					content = (
						<InitiativeListPanel
							encounter={this.props.encounter}
							selectedIDs={this.state.selectedCombatantIDs}
							onSelect={this.selectCombatant}
						/>
					);
					break;
				case 'log':
					content = (
						<EncounterLogPanel
							encounter={this.props.encounter}
						/>
					);
					break;
			}

			return (
				<div className='encounter-left-column'>
					<Tabs
						options={[
							{ id: 'init', display: <IconListDetails /> },
							{ id: 'log', display: <IconNotes /> }
						]}
						selectedID={this.state.leftTab}
						onSelect={id => this.setState({ leftTab: id })}
					/>
					<div className='tab-content'>
						{content}
					</div>
				</div>
			);
		}

		return null;
	};

	getRightControls = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}
		if (state !== EncounterState.Active) {
			return (
				<div className='encounter-right-column'>
					<EncounterControls
						encounter={this.props.encounter}
						game={this.props.game}
						options={this.props.options}
						state={state}
						setEncounterState={this.setManualEncounterState}
						finishEncounter={this.props.finishEncounter}
					/>
				</div>
			);
		}

		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;
		if (currentCombatant === null) {
			return (
				<div className='encounter-right-column'>
					<RoundControls
						encounter={this.props.encounter}
						game={this.props.game}
						options={this.props.options}
						regenerateEncounterMap={this.props.regenerateEncounterMap}
						addCombatantToEncounter={this.props.addCombatantToEncounter}
					/>
				</div>
			);
		}

		if (this.state.showRightPanel) {
			const unconscious = currentCombatant.combat.state === CombatantState.Unconscious;
			const dead = currentCombatant.combat.state === CombatantState.Dead;
			const stunned = currentCombatant.combat.stunned;
			if (unconscious || dead || stunned) {
				return (
					<div className='encounter-right-column'>
						<InactiveControls
							combatant={currentCombatant}
							encounter={this.props.encounter}
							options={this.props.options}
							showToken={() => this.scrollToCombatant('current')}
							showCharacterSheet={this.showDetailsCombatant}
						/>
					</div>
				);
			}

			if (currentCombatant.faction === CombatantType.Monster) {
				return (
					<div className='encounter-right-column'>
						<MonsterControls
							combatant={currentCombatant}
							encounter={this.props.encounter}
							options={this.props.options}
							showToken={() => this.scrollToCombatant('current')}
							showCharacterSheet={this.showDetailsCombatant}
							levelUp={this.props.levelUp}
							switchAllegiance={this.props.switchAllegiance}
							skipTurn={this.endTurn}
						/>
					</div>
				);
			}

			return (
				<div className='encounter-right-column'>
					<HeroControls
						combatant={currentCombatant}
						encounter={this.props.encounter}
						options={this.props.options}
						showToken={() => this.scrollToCombatant('current')}
						showCharacterSheet={this.showDetailsCombatant}
						move={this.move}
						addMovement={this.props.addMovement}
						inspire={this.props.inspire}
						scan={this.props.scan}
						hide={this.props.hide}
						switchAllegiance={this.props.switchAllegiance}
						drinkPotion={this.props.drinkPotion}
					/>
				</div>
			);
		}

		return (
			<div className='encounter-right-column collapsed' onClick={() => this.toggleRightPanel()}>
				<CombatantRowPanel
					mode='column'
					combatant={currentCombatant}
					encounter={this.props.encounter}
					onTokenClick={() => this.scrollToCombatant('current')}
					onDetails={this.showDetailsCombatant}
				/>
			</div>
		);
	};

	getDialog = () => {
		if (this.state.detailsCombatant) {
			return (
				<Dialog
					content={
						<CharacterSheetModal
							combatant={this.state.detailsCombatant}
							game={this.props.game}
							developer={this.props.options.developer}
							equipItem={this.props.equipItem}
							unequipItem={this.props.unequipItem}
							pickUpItem={this.props.pickUpItem}
							dropItem={this.props.dropItem}
							levelUp={() => null}
							retireHero={() => null}
							useCharge={this.props.useCharge}
						/>
					}
					onClose={() => this.clearDetails()}
				/>
			);
		}

		if (this.state.detailsLoot) {
			const cards = this.state.detailsLoot.items.map(i => <ItemCard key={i.id} item={i} />);
			if (this.state.detailsLoot.money > 0) {
				cards.push(
					<PlayingCard
						type={CardType.Item}
						front={
							<PlaceholderCard
								content={
									<div className='treasure-money'>
										<IconValue
											type={IconType.Money}
											value={this.state.detailsLoot.money}
											size={IconSize.Large}
										/>
									</div>
								}
							/>
						}
						footerText='Money'
					/>
				);
			}
			return (
				<Dialog
					content={
						<div>
							<Text type={TextType.Heading}>Treasure</Text>
							<hr />
							<CardList cards={cards} />
						</div>
					}
					onClose={() => this.clearDetails()}
				/>
			);
		}

		return null;
	};

	render = () => {
		try {
			const top = this.getTopControls();
			const bottom = this.getBottomControls();
			const left = this.getLeftControls();
			const right = this.getRightControls();

			if (this.props.orientation === OrientationType.Portrait) {
				return (
					<div className={`encounter-screen ${this.props.orientation}`}>
						{top}
						<div className='encounter-main-panel'>
							<div className='encounter-central-column'>
								<div className='encounter-center-panel'>
									<EncounterMapPanel
										ref={this.mapRef}
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
									/>
								</div>
								{bottom}
							</div>
							{
								this.state.showLeftPanel || this.state.showRightPanel ?
									<div className='encounter-side-columns'>
										{left}
										{right}
									</div>
									: null
							}
						</div>
						{this.getDialog()}
					</div>
				);
			}

			return (
				<div className={`encounter-screen ${this.props.orientation}`}>
					{top}
					<div className='encounter-main-panel'>
						{left}
						<div className='encounter-central-column'>
							<div className='encounter-center-panel'>
								<EncounterMapPanel
									ref={this.mapRef}
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
								/>
							</div>
							{bottom}
						</div>
						{right}
					</div>
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='encounter-screen render-error' />;
		}
	};
}

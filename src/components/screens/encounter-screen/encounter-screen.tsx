import { Component, createRef } from 'react';
import {
	IconArrowBackUpDouble,
	IconCircleCheckFilled,
	IconConfetti,
	IconDots,
	IconHelpCircle,
	IconHelpCircleFilled,
	IconLayoutBottombarCollapseFilled,
	IconLayoutBottombarExpandFilled,
	IconLayoutSidebarLeftCollapseFilled,
	IconLayoutSidebarLeftExpandFilled,
	IconLayoutSidebarRightCollapseFilled,
	IconLayoutSidebarRightExpandFilled,
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
import { StructureType } from '../../../enums/structure-type';

import { ActionLogic } from '../../../logic/action/action-logic';
import { EncounterLogLogic } from '../../../logic/encounter-log/encounter-log-logic';
import { EncounterLogic } from '../../../logic/encounter/encounter-logic';
import { OrientationLogic } from '../../../logic/orientation/orientation-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel } from '../../../models/action';
import type { EncounterModel, LogMessageModel, LootPileModel, TrapModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { LayoutModel } from '../../../models/layout';
import type { OptionsModel } from '../../../models/options';

import { CardList, Dialog, IconSize, IconType, IconValue, PlayingCard, PreviewableCard, StatValue, Tabs, Text, TextType } from '../../controls';
import { CombatantRowPanel, EncounterLogPanel, EncounterMapPanel, InitiativeListPanel, LogoPanel, TrapRowPanel, TreasureRowPanel } from '../../panels';
import { ItemCard, PlaceholderCard } from '../../cards';
import { ActionControls } from './action-controls/action-controls';
import { CharacterSheetModal } from '../../modals';
import { EncounterControls } from './encounter-controls/encounter-controls';
import { HeroControls } from './hero-controls/hero-controls';
import { MiniToken } from '../../panels/encounter-map/mini-token/mini-token';
import { MonsterControls } from './monster-controls/monster-controls';
import { RoundControls } from './round-controls/round-controls';

import './encounter-screen.scss';

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	options: OptionsModel;
	layout: LayoutModel;
	hasExceptions: boolean;
	showHelp: (file: string) => void;
	rotateMap: (encounter: EncounterModel, dir: 'l' | 'r') => void;
	rollInitiative: () => void;
	regenerateEncounterMap: () => void;
	addCombatantToEncounter: (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => void;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	treatWounds: (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	runMonsterTurn: (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
	levelUp: (combatant: CombatantModel) => void;
	switchAllegiance: (combatant: CombatantModel) => void;
	stun: (combatant: CombatantModel) => void;
	knockout: (combatant: CombatantModel) => void;
	kill: (combatant: CombatantModel) => void;
	nudgeInitiative: (combatant: CombatantModel, delta: number) => void;
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
	selectableTrapIDs: string[];
	selectableSquares: { x: number, y: number }[];
	selectedCombatantIDs: string[];
	selectedLootIDs: string[];
	selectedTrapIDs: string[];
	selectedSquares: { x: number, y: number }[];
	manualEncounterState: EncounterState;
	detailsCombatant: CombatantModel | null;
	detailsLoot: LootPileModel | null;
	thinking: boolean;
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		// Where the panels go over the map rather than beside it, only one of them can be open at
		// a time, so none of them starts open and the map has the screen to itself. An encounter
		// still opens on something to do: the round controls show themselves whatever this says.
		const panelsOverMap = OrientationLogic.isSmall(props.layout.orientation);

		this.state = {
			mapSquareSize: 15,
			showLeftPanel: !panelsOverMap,
			showBottomPanel: !panelsOverMap,
			showRightPanel: !panelsOverMap,
			leftTab: 'init',
			selectedActionParameter: null,
			selectableCombatantIDs: [],
			selectableLootIDs: [],
			selectableTrapIDs: [],
			selectableSquares: [],
			selectedCombatantIDs: [],
			selectedLootIDs: [],
			selectedTrapIDs: [],
			selectedSquares: [],
			manualEncounterState: EncounterState.Active,
			detailsCombatant: null,
			detailsLoot: null,
			thinking: false
		};
	}

	// Monsters take their turns by themselves. This holds the combatant whose
	// turn is currently being played out: a turn produces a state update for each
	// intent it performs, and without this each of those updates would start the
	// same turn over again. It is an instance field rather than state because it
	// has to be set synchronously, before the next update can arrive.
	autoTurnCombatantID: string | null = null;

	componentDidMount = () => {
		this.checkMonsterTurn();

		EncounterLogLogic.handleLogMessage = (messages: LogMessageModel[]) => {
			toast.custom(t => {
				setTimeout(() => {
					toast.remove(t.id);
				}, 5 * 1000);
				return (
					<div key={t.id} className='skirmish-notification' onClick={e => { e.stopPropagation(); toast.remove(t.id); }}>
						{messages.map((m, n) => <div key={n}>{EncounterLogLogic.getLogMessage(this.props.encounter, m)}</div>)}
					</div>
				);
			});
		};
	};

	componentDidUpdate = () => {
		this.checkMonsterTurn();
		this.closeStackedPanels();
	};

	componentWillUnmount = () => {
		EncounterLogLogic.handleLogMessage = null;
		toast.remove();
	};

	checkMonsterTurn = () => {
		if (this.state.thinking) {
			return;
		}

		// In developer mode the turns are taken by hand instead, so that the AI can be watched a step at a time
		if (this.props.options.developer) {
			return;
		}

		if (this.state.manualEncounterState !== EncounterState.Active) {
			return;
		}
		if (EncounterLogic.getEncounterState(this.props.encounter) !== EncounterState.Active) {
			return;
		}

		const currentCombatant = this.props.encounter.combatants.find(c => c.combat.current) || null;
		if (!currentCombatant || (currentCombatant.faction !== CombatantType.Monster)) {
			// It's a hero's turn, so the next monster to come round should act
			this.autoTurnCombatantID = null;
			return;
		}

		if (this.autoTurnCombatantID === currentCombatant.id) {
			// Already taking this one's turn
			return;
		}

		this.autoTurnCombatantID = currentCombatant.id;
		this.runMonsterTurn();
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

	// Whether the panels go over the map rather than beside or below it. The orientation carries
	// the answer: it is a small one exactly when there is not room for the panels where that
	// orientation would otherwise put them, which is the same question asked once in LayoutLogic.
	panelsOverMap = () => {
		return OrientationLogic.isSmall(this.props.layout.orientation);
	};

	// Over the map the panels cover each other, so showing one puts the others away. Beside the
	// map they don't, and each is left as the player had it.
	showPanel = (panel: 'left' | 'bottom' | 'right', show: boolean) => {
		const putOthersAway = show && this.panelsOverMap();

		this.setState({
			showLeftPanel: panel === 'left' ? show : this.state.showLeftPanel && !putOthersAway,
			showBottomPanel: panel === 'bottom' ? show : this.state.showBottomPanel && !putOthersAway,
			showRightPanel: panel === 'right' ? show : this.state.showRightPanel && !putOthersAway
		});
	};

	// A window dragged narrow, or a device rotated, arrives at the layout where the panels go over
	// the map still carrying whatever was open while there was room for them side by side. They
	// would then sit on top of each other, so all but one are put away.
	closeStackedPanels = () => {
		if (!this.panelsOverMap()) {
			return;
		}

		const open = [ this.state.showLeftPanel, this.state.showBottomPanel, this.state.showRightPanel ].filter(shown => shown);
		if (open.length > 1) {
			// The right-hand one is the one kept, because that is where the current turn is played.
			const keep: 'left' | 'bottom' | 'right' = this.state.showRightPanel ? 'right' : (this.state.showBottomPanel ? 'bottom' : 'left');
			this.showPanel(keep, true);
		}
	};

	toggleLeftPanel = () => {
		this.showPanel('left', !this.state.showLeftPanel);
	};

	toggleBottomPanel = () => {
		this.showPanel('bottom', !this.state.showBottomPanel);
	};

	toggleRightPanel = () => {
		this.showPanel('right', !this.state.showRightPanel);
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
					selectedTrapIDs: [],
					selectedSquares: []
				}, () => {
					this.props.setActionParameterValue(parameter, ids);
				});
			}
		} else if (!combatant.combat.current) {
			this.setState({
				selectedActionParameter: parameter,
				selectedCombatantIDs: [ combatant.id ],
				selectedLootIDs: [],
				selectedTrapIDs: [],
				selectedSquares: []
			});
		} else {
			this.setState({
				selectedActionParameter: parameter,
				selectedCombatantIDs: [],
				selectedLootIDs: [],
				selectedTrapIDs: [],
				selectedSquares: []
			});
		}
	};

	selectLoot = (loot: LootPileModel) => {
		this.setState({
			selectedCombatantIDs: [],
			selectedLootIDs: [ loot.id ],
			selectedTrapIDs: [],
			selectedSquares: []
		});
	};

	selectTrap = (trap: TrapModel) => {
		const parameter = this.state.selectedActionParameter;
		if (parameter) {
			let usesTrapIDs = false;
			let count = Number.MAX_VALUE;
			if (parameter.id === 'targets') {
				const targetParam = parameter as ActionTargetParameterModel;
				if (targetParam.targets && (targetParam.targets.type === ActionTargetType.Traps)) {
					usesTrapIDs = true;
					count = targetParam.targets.count;
				}
			}

			if (usesTrapIDs) {
				let ids = this.state.selectedTrapIDs;
				if (ids.includes(trap.id)) {
					ids = ids.filter(id => id !== trap.id);
				} else if (count === 1) {
					ids = [ trap.id ];
				} else if (ids.length < count) {
					ids.push(trap.id);
				}

				parameter.value = ids;

				this.setState({
					selectedActionParameter: parameter,
					selectedCombatantIDs: [],
					selectedLootIDs: [],
					selectedTrapIDs: ids,
					selectedSquares: []
				}, () => {
					this.props.setActionParameterValue(parameter, ids);
				});

				return;
			}
		}

		this.setState({
			selectedCombatantIDs: [],
			selectedLootIDs: [],
			selectedTrapIDs: [ trap.id ],
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
					selectedTrapIDs: [],
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
				selectedTrapIDs: [],
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
				selectableTrapIDs: [],
				selectableSquares: []
			});
		} else {
			this.setState({
				selectedCombatantIDs: [],
				selectedLootIDs: [],
				selectedTrapIDs: [],
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
			selectedTrapIDs: [],
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
				selectableTrapIDs: [],
				selectableSquares: []
			});
		} else {
			let selectableCombatantIDs: string[] = [];
			let selectableTrapIDs: string[] = [];
			let selectableSquares: { x: number, y: number }[] = [];
			let selectedCombatantIDs: string[] = [];
			let selectedTrapIDs: string[] = [];
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
							case ActionTargetType.Traps:
								selectableTrapIDs = targetParam.candidates as string[];
								selectedTrapIDs = targetParam.value as string[];
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
				selectableTrapIDs: selectableTrapIDs,
				selectableSquares: selectableSquares,
				selectedCombatantIDs: selectedCombatantIDs,
				selectedLootIDs: [],
				selectedTrapIDs: selectedTrapIDs,
				selectedSquares: selectedSquares
			});
		}
	};

	runAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		this.setState({
			selectedActionParameter: null,
			selectableCombatantIDs: [],
			selectableLootIDs: [],
			selectableTrapIDs: [],
			selectableSquares: [],
			selectedSquares: []
		}, () => {
			this.props.runAction(encounter, combatant);
		});
	};

	deselectAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		this.setState({
			selectedActionParameter: null,
			selectableCombatantIDs: [],
			selectableLootIDs: [],
			selectableTrapIDs: [],
			selectableSquares: [],
			selectedSquares: []
		}, () => {
			this.props.deselectAction(encounter, combatant);
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
		const currentCombatant = this.props.encounter.combatants.find(c => c.combat.current) || null;

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

	// The encounter's state, with a manual one - a retreat, or a developer's win - taking
	// precedence over what the board says. Four things ask, and they have to get the same answer:
	// the toolbar buttons are drawn from this and the panels they open are built from it.
	getEncounterState = () => {
		if (this.state.manualEncounterState !== EncounterState.Active) {
			return this.state.manualEncounterState;
		}

		return EncounterLogic.getEncounterState(this.props.encounter);
	};

	// The right-hand panel shows the round controls, or the end-of-encounter ones, whether or not it
	// has been asked to - from either of those there is no other way on. Its toggle has nothing to
	// say while one of them is up.
	hasFixedRightControls = () => {
		if (this.getEncounterState() !== EncounterState.Active) {
			return true;
		}

		return !this.props.encounter.combatants.some(c => c.combat.current);
	};

	// The bottom panel holds the hand of whoever's turn it is, so there is nothing for it to hold on
	// a monster's turn, or a stunned hero's, or one who has played every card.
	hasBottomControls = () => {
		if (this.getEncounterState() !== EncounterState.Active) {
			return false;
		}

		const currentCombatant = this.props.encounter.combatants.find(c => c.combat.current) || null;
		if (!currentCombatant) {
			return false;
		}

		return (currentCombatant.faction === CombatantType.Hero) && !currentCombatant.combat.stunned && (currentCombatant.combat.actions.length > 0);
	};

	getTopControls = () => {
		if (this.getEncounterState() !== EncounterState.Active) {
			return (
				<div className='encounter-top-panel'>
					<LogoPanel size={36} />
				</div>
			);
		}

		let actionBtn = (
			<div className='action-container'>
				<button
					key='init-btn'
					className='primary action'
					onClick={() => this.props.rollInitiative()}
					onDoubleClick={e => e.stopPropagation()}
				>
					Roll Initiative
				</button>
			</div>
		);

		const currentCombatant = this.props.encounter.combatants.find(c => c.combat.current) || null;
		if (currentCombatant) {
			const canAct = !currentCombatant.combat.stunned && (currentCombatant.combat.state !== CombatantState.Unconscious) && (currentCombatant.combat.state !== CombatantState.Dead);
			if (currentCombatant.faction === CombatantType.Hero) {
				if (canAct) {
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
								value={actionTaken ? <IconCircleCheckFilled className='action-taken' size={39} /> : <IconDots size={39} />}
							/>
							<button
								key='hero-btn'
								className={actionTaken ? 'primary action' : 'action'}
								onClick={() => this.endTurn()}
								onDoubleClick={e => e.stopPropagation()}
							>
								End My Turn
							</button>
						</div>
					);
				} else {
					actionBtn = (
						<div className='action-container'>
							<button
								key='hero-btn'
								className='primary action'
								onClick={() => this.endTurn()}
								onDoubleClick={e => e.stopPropagation()}
							>
								Skip My Turn
							</button>
						</div>
					);
				}
			}
			if (currentCombatant.faction === CombatantType.Monster) {
				const label = canAct ? 'Take Monster Turn' : 'Skip Monster Turn';
				actionBtn = (
					<div className='action-container'>
						{
							this.props.options.developer ?
								<button
									key='monster-btn'
									className='primary action'
									disabled={this.state.thinking}
									onClick={() => this.runMonsterTurn()}
									onDoubleClick={e => e.stopPropagation()}
								>
									{this.state.thinking ? 'Thinking' : label}
								</button>
								:
								<button key='monster-btn' className='primary action' disabled={true}>
									Thinking
								</button>
						}
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
							options={this.props.options}
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

		if (this.state.selectedTrapIDs.length === 1) {
			const trap = EncounterLogic.getTrap(this.props.encounter, this.state.selectedTrapIDs[0]);
			if (trap) {
				return (
					<div className='encounter-top-panel'>
						<TrapRowPanel
							trap={trap}
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
							{this.state.showLeftPanel ? <IconLayoutSidebarLeftCollapseFilled /> : <IconLayoutSidebarLeftExpandFilled />}
						</button>
						<button disabled={!this.hasBottomControls()} className='icon-btn' title='Bottom Panel' onClick={() => this.toggleBottomPanel()}>
							{this.state.showBottomPanel && this.hasBottomControls() ? <IconLayoutBottombarCollapseFilled /> : <IconLayoutBottombarExpandFilled />}
						</button>
						<button disabled={this.hasFixedRightControls()} className='icon-btn' title='Right Panel' onClick={() => this.toggleRightPanel()}>
							{this.state.showRightPanel || this.hasFixedRightControls() ? <IconLayoutSidebarRightCollapseFilled /> : <IconLayoutSidebarRightExpandFilled />}
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
		if (!this.hasBottomControls()) {
			return null;
		}

		const currentCombatant = this.props.encounter.combatants.find(c => c.combat.current) as CombatantModel;

		return (
			<div className='encounter-bottom-panel'>
				<ActionControls
					combatant={currentCombatant}
					encounter={this.props.encounter}
					game={this.props.game}
					developer={this.props.options.developer}
					currentActionParameter={this.state.selectedActionParameter}
					collapsed={!this.state.showBottomPanel}
					toggleCollapsed={() => this.toggleBottomPanel()}
					drawActions={this.props.drawActions}
					selectAction={this.selectAction}
					deselectAction={this.deselectAction}
					setActionParameter={this.setActionParameter}
					setWeaponParameterValue={(param, weaponID) => {
						this.props.setActionParameterValue(param, weaponID);
					}}
					setOriginParameterValue={(param, sq) => {
						this.setState({
							selectedSquares: [ sq ]
						}, () => {
							param.value = [ sq ];
							const combatant = this.props.encounter.combatants.find(c => c.combat.current) as CombatantModel;
							const action = combatant.combat.selectedAction ? combatant.combat.selectedAction.action : null;
							if (action) {
								const targetParam = action.parameters.find(a => a.id === 'targets') as ActionTargetParameterModel;
								ActionLogic.checkTargetParameter(targetParam, this.props.encounter, combatant, action, false);
							}
							this.props.setActionParameterValue(param, [ sq ]);
						});
					}}
					setTargetParameterValue={(param, targetIDs) => {
						this.setState({
							selectedCombatantIDs: targetIDs
						}, () => {
							this.props.setActionParameterValue(param, targetIDs);
						});
					}}
					runAction={this.runAction}
				/>
			</div>
		);
	};

	getLeftControls = () => {
		if (this.state.showLeftPanel) {
			let content = null;
			switch (this.state.leftTab) {
				case 'init':
					content = (
						<InitiativeListPanel
							encounter={this.props.encounter}
							options={this.props.options}
							selectedIDs={this.state.selectedCombatantIDs}
							onSelect={this.selectCombatant}
							nudgeInitiative={this.props.nudgeInitiative}
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

		// Beside the map a closed panel leaves a strip behind rather than nothing, as the right-hand
		// one does: the turn order in tokens, which is the one thing in this panel worth keeping in
		// sight when it is shut - whose turn it is, who is next, who is down. The same combatants
		// the list holds, in the same order. Over the map there is no room for it, for the reason
		// in getRightControls.
		if (this.panelsOverMap()) {
			return null;
		}

		const combatants = [
			...EncounterLogic.getActiveCombatants(this.props.encounter),
			...EncounterLogic.getActedCombatants(this.props.encounter),
			...EncounterLogic.getDeadCombatants(this.props.encounter)
		];

		return (
			<div className='encounter-left-column collapsed' onClick={() => this.toggleLeftPanel()}>
				{
					combatants.map(combatant => (
						<MiniToken
							key={combatant.id}
							combatant={combatant}
							encounter={null}
							squareSize={40}
							mapDimensions={{ left: 0, top: 0 }}
							selectable={true}
							selected={this.state.selectedCombatantIDs.includes(combatant.id)}
							onClick={this.selectCombatant}
						/>
					))
				}
			</div>
		);
	};

	getRightControls = () => {
		const state = this.getEncounterState();
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

		const currentCombatant = this.props.encounter.combatants.find(c => c.combat.current) || null;
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
							stun={this.props.stun}
							knockout={this.props.knockout}
							kill={this.props.kill}
						/>
					</div>
				);
			}

			return (
				<div className='encounter-right-column'>
					<HeroControls
						combatant={currentCombatant}
						encounter={this.props.encounter}
						game={this.props.game}
						options={this.props.options}
						showToken={() => this.scrollToCombatant('current')}
						showCharacterSheet={this.showDetailsCombatant}
						move={this.move}
						addMovement={this.props.addMovement}
						inspire={this.props.inspire}
						scan={this.props.scan}
						treatWounds={this.props.treatWounds}
						hide={this.props.hide}
						levelUp={this.props.levelUp}
						switchAllegiance={this.props.switchAllegiance}
						stun={this.props.stun}
						knockout={this.props.knockout}
						kill={this.props.kill}
						drinkPotion={this.props.drinkPotion}
					/>
				</div>
			);
		}

		// Beside the map, a closed right panel leaves a strip behind showing whose turn it is. Over
		// the map there is nothing to leave it in: the map is the whole screen, and the toolbar
		// button is what brings the panel back.
		if (this.panelsOverMap()) {
			return null;
		}

		return (
			<div className='encounter-right-column collapsed' onClick={() => this.toggleRightPanel()}>
				<CombatantRowPanel
					mode='column'
					combatant={currentCombatant}
					encounter={this.props.encounter}
					options={this.props.options}
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
							spendCharge={this.props.spendCharge}
						/>
					}
					onClose={() => this.clearDetails()}
				/>
			);
		}

		if (this.state.detailsLoot) {
			const cards = this.state.detailsLoot.items.map(i => <PreviewableCard key={i.id} card={<ItemCard item={i} />} />);
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

	getMap = () => {
		return (
			<EncounterMapPanel
				ref={this.mapRef}
				encounter={this.props.encounter}
				squareSize={this.state.mapSquareSize}
				selectableCombatantIDs={this.state.selectableCombatantIDs}
				selectableLootIDs={this.state.selectableLootIDs}
				selectableTrapIDs={this.state.selectableTrapIDs}
				selectableSquares={this.state.selectableSquares}
				selectedCombatantIDs={this.state.selectedCombatantIDs}
				selectedLootIDs={this.state.selectedLootIDs}
				selectedTrapIDs={this.state.selectedTrapIDs}
				selectedSquares={this.state.selectedSquares}
				onClickCombatant={this.selectCombatant}
				onClickLoot={this.selectLoot}
				onClickTrap={this.selectTrap}
				onClickSquare={this.selectSquare}
				onClickOff={this.clearSelection}
			/>
		);
	};

	render = () => {
		const top = this.getTopControls();
		const bottom = this.getBottomControls();
		const left = this.getLeftControls();
		const right = this.getRightControls();

		const className = `encounter-screen ${OrientationLogic.getClassName(this.props.layout.orientation)}`;

		// There is not room for the panels beside or below the map, so they go over it instead and
		// the map keeps the whole screen underneath. Only one is over it at a time: the state says
		// so, except for the right-hand panel, which shows itself unasked when the round or the
		// encounter is waiting on the player. One the player opened wins over that, so opening a
		// panel is never a tap that appears to do nothing.
		if (this.panelsOverMap()) {
			let sheet = null;
			if (left) {
				sheet = <div className='encounter-sheet left'>{left}</div>;
			} else if (bottom && this.state.showBottomPanel) {
				sheet = <div className='encounter-sheet bottom'>{bottom}</div>;
			} else if (right) {
				sheet = <div className='encounter-sheet right'>{right}</div>;
			}

			return (
				<div className={className}>
					{top}
					<div className='encounter-main-panel'>
						<div className='encounter-central-column'>
							<div className='encounter-center-panel'>
								{this.getMap()}
							</div>
							{
								// Collapsed, the hand is a strip along the bottom of the map saying
								// it's there; expanded, it's the sheet above.
								this.state.showBottomPanel ? null : bottom
							}
						</div>
						{sheet}
					</div>
					{this.getDialog()}
				</div>
			);
		}

		if (OrientationLogic.isPortrait(this.props.layout.orientation)) {
			return (
				<div className={className}>
					{top}
					<div className='encounter-main-panel'>
						<div className='encounter-central-column'>
							<div className='encounter-center-panel'>
								{this.getMap()}
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
			<div className={className}>
				{top}
				<div className='encounter-main-panel'>
					{left}
					<div className='encounter-central-column'>
						<div className='encounter-center-panel'>
							{this.getMap()}
						</div>
						{bottom}
					</div>
					{right}
				</div>
				{this.getDialog()}
			</div>
		);
	};
}

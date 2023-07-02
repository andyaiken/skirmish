import { Component, createRef } from 'react';
import {
	IconArrowBackUpDouble,
	IconConfetti,
	IconInfoCircle,
	IconInfoCircleFilled,
	IconLayoutSidebarLeftCollapse,
	IconLayoutSidebarLeftExpand,
	IconRotate2,
	IconRotateClockwise2,
	IconZoomIn,
	IconZoomOut
} from '@tabler/icons-react';

import { ActionTargetType } from '../../../enums/action-target-type';
import { EncounterState } from '../../../enums/encounter-state';

import { ActionLogic } from '../../../logic/action-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel } from '../../../models/action';
import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { CardList, Dialog, Text, TextType } from '../../controls';
import { CharacterSheetPanel, CombatantRowPanel, EncounterMapPanel, InitiativeListPanel, TreasureRowPanel, TurnLogPanel } from '../../panels';
import { CombatantControls } from './combatant-controls/combatant-controls';
import { EncounterControls } from './encounter-controls/encounter-controls';
import { ItemCard } from '../../cards';
import { RoundControls } from './round-controls/round-controls';

import './encounter-screen.scss';

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	developer: boolean;
	hasExceptions: boolean;
	showHelp: (file: string) => void;
	rotateMap: (encounter: EncounterModel, dir: 'l' | 'r') => void;
	rollInitiative: (encounter: EncounterModel) => void;
	endTurn: (encounter: EncounterModel) => void;
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
	runMonsterTurn: (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterState) => void;
}

interface State {
	mapSquareSize: number;
	showInitiativeList: boolean;
	logExpanded: boolean;
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
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapSquareSize: 15,
			showInitiativeList: true,
			logExpanded: false,
			selectedActionParameter: null,
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

	toggleInitiativeList = () => {
		this.setState({
			showInitiativeList: !this.state.showInitiativeList
		});
	};

	toggleLogExpanded = () => {
		this.setState({
			logExpanded: !this.state.logExpanded
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
					logExpanded: false,
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
				logExpanded: false,
				selectedActionParameter: parameter,
				selectedCombatantIDs: [ combatant.id ],
				selectedLootIDs: [],
				selectedSquares: []
			});
		}
	};

	selectLoot = (loot: LootPileModel) => {
		this.setState({
			logExpanded: false,
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
				logExpanded: false,
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

	getTopControls = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}

		if (state !== EncounterState.Active) {
			return (
				<div className='encounter-bottom-panel' />
			);
		}

		return (
			<div className='encounter-top-panel'>
				<div className='section'>
					<button className='icon-btn' title='Left Sidebar' onClick={() => this.toggleInitiativeList()}>
						{this.state.showInitiativeList ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
					</button>
				</div>
				<div className='separator' />
				<div className='section'>
					<button className='icon-btn' title='Rotate Left' onClick={() => this.props.rotateMap(this.props.encounter, 'l')}>
						<IconRotate2 />
					</button>
				</div>
				<div className='section'>
					<button className='icon-btn' title='Rotate Right' onClick={() => this.props.rotateMap(this.props.encounter, 'r')}>
						<IconRotateClockwise2 />
					</button>
				</div>
				<div className='separator' />
				<div className='section'>
					<button disabled={this.state.mapSquareSize <= 5} className='icon-btn' title='Zoom Out' onClick={() => this.nudgeMapSize(-5)}>
						<IconZoomOut />
					</button>
				</div>
				<div className='section'>
					<button disabled={this.state.mapSquareSize >= 50} className='icon-btn' title='Zoom In' onClick={() => this.nudgeMapSize(+5)}>
						<IconZoomIn />
					</button>
				</div>
				<div className='separator' />
				<div className='section'>
					<button className='icon-btn' title='Retreat' onClick={() => this.setManualEncounterState(EncounterState.Retreat)}>
						<IconArrowBackUpDouble />
					</button>
				</div>
				{
					this.props.developer ?
						<div className='section'>
							<button className='icon-btn developer' title='Win' onClick={() => this.setManualEncounterState(EncounterState.Victory)}>
								<IconConfetti />
							</button>
						</div>
						: null
				}
				<div className='separator' />
				<div className='section'>
					<button className='icon-btn' title='Information' onClick={() => this.props.showHelp('encounters')}>
						{this.props.developer && this.props.hasExceptions ? <IconInfoCircleFilled /> : <IconInfoCircle />}
					</button>
				</div>
			</div>
		);
	};

	getBottomControls = () => {
		if (this.state.selectedCombatantIDs.length > 1) {
			return (
				<div className='encounter-bottom-panel'>
					Multiple combatants selected.
				</div>
			);
		}

		if (this.state.selectedCombatantIDs.length === 1) {
			const combatant = EncounterLogic.getCombatant(this.props.encounter, this.state.selectedCombatantIDs[0]);
			if (combatant) {
				return (
					<CombatantRowPanel
						mode='detailed'
						combatant={combatant}
						encounter={this.props.encounter}
						onTokenClick={() => this.scrollToCombatant('selected')}
						onDetails={this.showDetailsCombatant}
						onCancel={this.clearSelection}
					/>
				);
			}
		}

		if (this.state.selectedLootIDs.length > 1) {
			return (
				<div className='encounter-bottom-panel'>
					Multiple treasures selected.
				</div>
			);
		}

		if (this.state.selectedLootIDs.length === 1) {
			const loot = EncounterLogic.getLoot(this.props.encounter, this.state.selectedLootIDs[0]);
			if (loot) {
				return (
					<TreasureRowPanel loot={loot} onDetails={this.showDetailsLoot} onCancel={this.clearSelection} />
				);
			}
		}

		if (this.props.encounter.log.length > 0) {
			const className = this.state.logExpanded ? 'encounter-bottom-panel clickable scrollable expanded' : 'encounter-bottom-panel clickable scrollable';
			return (
				<div className={className} onClick={() => this.toggleLogExpanded()}>
					<TurnLogPanel encounter={this.props.encounter} />
				</div>
			);
		}

		return (
			<div className='encounter-bottom-panel'>
				<div className='logo-text inset-text'>Skirmish</div>
			</div>
		);
	};

	getRightControls = () => {
		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}
		if (state !== EncounterState.Active) {
			return (
				<EncounterControls
					encounter={this.props.encounter}
					game={this.props.game}
					state={state}
					setEncounterState={this.setManualEncounterState}
					finishEncounter={this.props.finishEncounter}
				/>
			);
		}

		const currentCombatant = EncounterLogic.getActiveCombatants(this.props.encounter).find(c => c.combat.current) || null;
		if (currentCombatant !== null) {
			return (
				<CombatantControls
					combatant={currentCombatant}
					encounter={this.props.encounter}
					developer={this.props.developer}
					selectedActionParameter={this.state.selectedActionParameter}
					showToken={() => this.scrollToCombatant('current')}
					showCharacterSheet={this.showDetailsCombatant}
					move={this.move}
					addMovement={this.props.addMovement}
					inspire={this.props.inspire}
					scan={this.props.scan}
					hide={this.props.hide}
					drawActions={this.props.drawActions}
					selectAction={this.selectAction}
					deselectAction={this.props.deselectAction}
					setActionParameter={this.setActionParameter}
					setActionParameterValue={this.setActionParameter}
					runAction={this.runAction}
					runMonsterTurn={this.props.runMonsterTurn}
					endTurn={this.endTurn}
				/>
			);
		}

		return (
			<RoundControls
				encounter={this.props.encounter}
				rollInitiative={this.props.rollInitiative}
			/>
		);
	};

	render = () => {
		try {
			let left = null;
			if (this.state.showInitiativeList) {
				left = (
					<div className='encounter-left-column'>
						<InitiativeListPanel
							encounter={this.props.encounter}
							selectedIDs={this.state.selectedCombatantIDs}
							onSelect={this.selectCombatant}
						/>
					</div>
				);
			}

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
								retireHero={() => null}
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
								<CardList cards={this.state.detailsLoot.items.map(i => <ItemCard key={i.id} item={i} />)} />
							</div>
						}
						onClose={() => this.clearDetails()}
					/>
				);
			}

			return (
				<div className='encounter-screen'>
					{left}
					<div className='encounter-central-column'>
						{this.getTopControls()}
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
						{this.getBottomControls()}
					</div>
					<div className='encounter-right-column'>
						{this.getRightControls()}
					</div>
					{dialog}
				</div>
			);
		} catch {
			return <div className='encounter-screen render-error' />;
		}
	};
}

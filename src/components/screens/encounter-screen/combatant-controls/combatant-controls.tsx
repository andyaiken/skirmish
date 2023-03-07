import { IconArrowUp, IconId, IconMapPin } from '@tabler/icons-react';
import { Component } from 'react';

import { ActionTargetType } from '../../../../enums/action-target-type';
import { CardType } from '../../../../enums/card-type';
import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import { ActionPrerequisites } from '../../../../logic/action-logic';
import { CombatantLogic } from '../../../../logic/combatant-logic';
import { ConditionLogic } from '../../../../logic/condition-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';
import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { Box, CardList, IconType, IconValue, PlayingCard, Selector, StatValue, Tag, Text, TextType } from '../../../controls';
import { ActionCard } from '../../../cards';
import { CombatStatsPanel } from '../../../panels/combat-stats/combat-stats-panel';
import { DirectionPanel } from '../../../panels';

import './combatant-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	currentActionParameter: ActionParameterModel | null;
	developer: boolean;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	setActionParameter: (parameter: ActionParameterModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	kill: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

interface State {
	controls: string;
}

export class CombatantControls extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			controls: 'overview'
		};
	}

	setControls = (controls: string) => {
		this.setState({
			controls: controls
		});
	};

	kill = () => {
		this.props.kill(this.props.encounter, this.props.combatant);
	};

	endTurn = () => {
		this.props.endTurn(this.props.encounter);
	};

	render = () => {
		const header = (
			<div className='header-row'>
				<div className='name'>
					<Text type={TextType.SubHeading}>{this.props.combatant.name}</Text>
					<div className='tags'>
						<Tag>{GameLogic.getSpecies(this.props.combatant.speciesID)?.name ?? 'Unknown species'}</Tag>
						<Tag>{GameLogic.getRole(this.props.combatant.roleID)?.name ?? 'Unknown role'}</Tag>
						<Tag>{GameLogic.getBackground(this.props.combatant.backgroundID)?.name ?? 'Unknown background'}</Tag>
						<Tag>Level {this.props.combatant.level}</Tag>
					</div>
				</div>
				<button className='character-sheet-btn' onClick={() => this.props.showCharacterSheet(this.props.combatant)}>
					<IconId size={40} />
				</button>
			</div>
		);

		const prone = this.props.combatant.combat.state === CombatantState.Prone;

		let controls = null;
		switch (this.state.controls) {
			case 'overview': {
				let auraSection = null;
				const auras = EncounterLogic.getAuraConditions(this.props.encounter, this.props.combatant);
				if (auras.length > 0) {
					auraSection = (
						<Box label='Affected by Auras'>
							{auras.map(c => <StatValue key={c.id} label={ConditionLogic.getConditionDescription(c)} value={c.rank} />)}
						</Box>
					);
				}

				controls = (
					<div className='overview'>
						<CombatStatsPanel
							combatant={this.props.combatant}
							encounter={this.props.encounter}
						/>
						{auraSection}
						<div className='quick-actions'>
							<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.scan(this.props.encounter, this.props.combatant)}>
								Scan<br/><IconValue value={4} type={IconType.Movement} iconSize={12} />
							</button>
							<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.hide(this.props.encounter, this.props.combatant)}>
								Hide<br/><IconValue value={4} type={IconType.Movement} iconSize={12} />
							</button>
							{
								this.props.combatant.combat.state === CombatantState.Prone ?
									<button disabled={this.props.combatant.combat.movement < 8} onClick={() => this.props.standUp(this.props.encounter, this.props.combatant)}>
										Stand Up<br/><IconValue value={8} type={IconType.Movement} iconSize={12} />
									</button>
									: null
							}
						</div>
					</div>
				);
				break;
			}
			case 'move': {
				const moveCosts: Record<string, number> = {};
				moveCosts.n = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'n');
				moveCosts.ne = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'ne');
				moveCosts.e = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'e');
				moveCosts.se = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'se');
				moveCosts.s = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 's');
				moveCosts.sw = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'sw');
				moveCosts.w = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'w');
				moveCosts.nw = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'nw');

				const canPickUp = (this.props.combatant.combat.movement >= 1) && (this.props.combatant.carried.length < 6);

				const adj = EncounterMapLogic.getAdjacentSquares(this.props.encounter.mapSquares, [ this.props.combatant.combat.position ]);
				const piles = this.props.encounter.loot.filter(lp => adj.find(sq => (sq.x === lp.position.x) && (sq.y === lp.position.y)));
				const items = Collections.distinct(piles.flatMap(pile => pile.items), i => i.id);
				const pickUpButtons = items.map(item => {
					const name = item.magic ? `${item.name} (${item.baseItem})` : item.name;
					return (
						<button key={item.id} disabled={!canPickUp} onClick={() => this.props.pickUpItem(item, this.props.combatant)}>
							Pick Up {name}<br/><IconValue value={1} type={IconType.Movement} />
						</button>
					);
				});

				controls = (
					<div className='movement'>
						<DirectionPanel combatant={this.props.combatant} costs={moveCosts} onMove={(dir, cost) => this.props.move(this.props.encounter, this.props.combatant, dir, cost)} />
						{this.props.developer ? <button className='developer' onClick={() => this.props.addMovement(this.props.encounter, this.props.combatant, 10)}>Add Movement</button> : null}
						{pickUpButtons.length > 0 ? <hr /> : null}
						{pickUpButtons}
					</div>
				);
				break;
			}
			case 'actions': {
				if (this.props.combatant.combat.actions.length === 0) {
					controls = (
						<div>
							<Text type={TextType.Information}>You have taken your action for this turn.</Text>
						</div>
					);
				} else if (this.props.combatant.combat.actions.length > 1) {
					const actionCards = this.props.combatant.combat.actions.map(a => {
						const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.encounter));
						return (
							<PlayingCard
								key={a.id}
								type={CardType.Action}
								front={<ActionCard action={a} encounter={this.props.encounter} />}
								footer={CombatantLogic.getCardSource(this.props.combatant, a.id, 'action')}
								footerType={CombatantLogic.getCardSourceType(this.props.combatant, a.id, 'action')}
								onClick={prerequisitesMet ? () => this.props.selectAction(this.props.encounter, this.props.combatant, a) : null}
							/>
						);
					});

					controls = (
						<div className='actions'>
							<CardList cards={actionCards} />
						</div>
					);
				} else {
					const action = this.props.combatant.combat.actions[0];

					let prerequisitesMet = true;
					const prerequisites: JSX.Element[] = [];
					action.prerequisites.forEach((prerequisite, n) => {
						if (!ActionPrerequisites.isSatisfied(prerequisite, this.props.encounter)) {
							prerequisitesMet = false;
							prerequisites.push(
								<div key={n} className='action-prerequisite'>{prerequisite.description}</div>
							);
						}
					});

					let parametersSet = true;
					const parameters: JSX.Element[] = [];
					action.parameters.forEach((parameter, n) => {
						if (!parametersSet) {
							// A previous parameter isn't finished yet
							return;
						}

						let description: JSX.Element[] | string = '';
						let changeButton = null;
						let changeControls = null;
						switch (parameter.name) {
							case'weapon': {
								const weaponParam = parameter as ActionWeaponParameterModel;
								if (weaponParam.value) {
									const item = parameter.value as ItemModel;
									description = item.name;
								} else {
									parametersSet = false;
									description = '[Not set]';
								}
								if (weaponParam.candidates.length > 1) {
									changeControls = (
										<Selector
											options={weaponParam.candidates.map(candidate => candidate as ItemModel).map(item => ({ id: item.id, display: item.name }))}
											selectedID={(weaponParam.value as ItemModel).id}
											onSelect={id => {
												const item = weaponParam.candidates.find(i => (i as ItemModel).id === id);
												this.props.setActionParameterValue(parameter, item);
											}}
										/>
									);
								}
								break;
							}
							case 'origin': {
								const originParam = parameter as ActionOriginParameterModel;
								if (originParam.value) {
									description = '[Map square]';
								} else {
									parametersSet = false;
									description = '[Not set]';
								}
								if (originParam.candidates.length > 1) {
									changeButton = (
										<button className='map-btn' title='Select Origin Square' onClick={() => this.props.setActionParameter(originParam)}>
											<IconMapPin />
										</button>
									);
								}
								break;
							}
							case 'targets': {
								const targetParam = parameter as ActionTargetParameterModel;
								if (targetParam.targets) {
									switch (targetParam.targets.type) {
										case ActionTargetType.Combatants:
										case ActionTargetType.Enemies:
										case ActionTargetType.Allies: {
											const list = targetParam.value as string[];
											if (list.length === 0) {
												parametersSet = false;
											}
											if (targetParam.targets.count === Number.MAX_VALUE) {
												// Targets all possible candidates
												description = `[${list.length} ${targetParam.targets.type.toLowerCase()}]`;
											} else {
												// Targets a specific number of candidates
												description = list
													.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
													.map(target => target.name)
													.join(', ') || '[None]';
												if (targetParam.candidates.length > targetParam.targets.count) {
													const title = `Select ${targetParam.targets.type.toLowerCase()}`;
													changeButton = (
														<button className='map-btn' title={title} onClick={() => this.props.setActionParameter(targetParam)}>
															<IconMapPin />
														</button>
													);
												}
											}
											break;
										}
										case ActionTargetType.Squares: {
											const list = targetParam.value as { x: number, y: number }[];
											if (list.length === 0) {
												parametersSet = false;
											}
											if (targetParam.targets.count === Number.MAX_VALUE) {
												// Targets all possible candidates
												description = `[${list.length} squares]`;
											} else {
												// Targets a specific number of candidates
												description = list
													.map(square => {
														const combatantSquares = EncounterLogic.getCombatantSquares(this.props.encounter, this.props.combatant);
														const distance = EncounterMapLogic.getDistanceAny(combatantSquares, [ square ]);
														const angle = EncounterMapLogic.getDirection(this.props.combatant.combat.position, square);
														return (
															<div key={`${square.x} ${square.y}`} className='square-indicator'>
																<IconArrowUp style={{ transform: `rotate(${angle}deg)` }} />
																<span>{distance}</span>
															</div>
														);
													});
												if (targetParam.candidates.length > targetParam.targets.count) {
													changeButton = (
														<button className='map-btn' title='Select Squares' onClick={() => this.props.setActionParameter(targetParam)}>
															<IconMapPin />
														</button>
													);
												}
											}
											break;
										}
										case ActionTargetType.Walls: {
											const list = targetParam.value as { x: number, y: number }[];
											if (list.length === 0) {
												parametersSet = false;
											}
											if (targetParam.targets.count === Number.MAX_VALUE) {
												// Targets all possible candidates
												description = `[${list.length} walls]`;
											} else {
												// Targets a specific number of candidates
												description = list
													.map(square => {
														const combatantSquares = EncounterLogic.getCombatantSquares(this.props.encounter, this.props.combatant);
														const distance = EncounterMapLogic.getDistanceAny(combatantSquares, [ square ]);
														const angle = EncounterMapLogic.getDirection(this.props.combatant.combat.position, square);
														return (
															<div key={`${square.x} ${square.y}`} className='square-indicator'>
																<IconArrowUp style={{ transform: `rotate(${angle}deg)` }} />
																<span>{distance}</span>
															</div>
														);
													});
												if (targetParam.candidates.length > targetParam.targets.count) {
													changeButton = (
														<button className='map-btn' title='Select Walls' onClick={() => this.props.setActionParameter(targetParam)}>
															<IconMapPin />
														</button>
													);
												}
											}
											break;
										}
									}
								} else {
									// Targets self
									description = '[Self]';
								}
								break;
							}
						}

						parameters.push(
							<div key={n} className={`action-parameter ${this.props.currentActionParameter === parameter ? 'current' : ''}`}>
								<div className='action-parameter-top-line'>
									<div className='action-parameter-name'>Select {parameter.name}</div>
									<div className='action-parameter-value'>{description}</div>
									{changeButton !== null ? <div className='action-parameter-change'>{changeButton}</div> : null}
								</div>
								{changeControls !== null ? <div className='action-parameter-change'>{changeControls}</div> : null}
							</div>
						);
					});

					controls = (
						<div>
							<div className='actions'>
								<PlayingCard
									key={action.id}
									type={CardType.Action}
									front={<ActionCard action={action} encounter={this.props.encounter} />}
									footer={CombatantLogic.getCardSource(this.props.combatant, action.id, 'action')}
									footerType={CombatantLogic.getCardSourceType(this.props.combatant, action.id, 'action')}
								/>
							</div>
							<div className='action-details'>
								{prerequisites}
								{parameters}
								<button
									disabled={!(prerequisitesMet && parametersSet && (this.props.currentActionParameter === null))}
									onClick={() => this.props.runAction(this.props.encounter, this.props.combatant)}
								>
									Run
								</button>
							</div>
						</div>
					);
				}
				break;
			}
		}

		switch (this.props.combatant.type) {
			case CombatantType.Hero: {
				if (this.props.combatant.combat.state === CombatantState.Unconscious) {
					return (
						<Text type={TextType.SubHeading}>
							{this.props.combatant.name} is <b>Unconscious</b>.
						</Text>
					);
				}

				if (this.props.combatant.combat.state === CombatantState.Dead) {
					return (
						<Text type={TextType.SubHeading}>
							{this.props.combatant.name} is <b>Dead</b>.
						</Text>
					);
				}

				const options = [ { id: 'overview', display: 'Overview' }, { id: 'move', display: 'Move' } ];
				if (this.props.developer) {
					options.push({ id: 'actions', display: 'Actions' });
				}

				return (
					<div className='combatant-controls'>
						{header}
						{prone ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and their moving costs are doubled.</Text> : null}
						{this.props.combatant.combat.hidden > 0 ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</Text> : null}
						<Selector
							options={options}
							selectedID={this.state.controls}
							onSelect={this.setControls}
						/>
						{controls}
						<hr />
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}
			case CombatantType.Monster: {
				return (
					<div className='combatant-controls'>
						{header}
						{prone ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and moving costs are doubled.</Text> : null}
						{this.props.combatant.combat.hidden > 0 ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</Text> : null}
						<hr />
						<button className='developer' onClick={this.kill}>Kill</button>
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}
		}
	};
}

import { IconArrowUp, IconViewfinder } from '@tabler/icons-react';
import { Component } from 'react';

import { ActionTargetType } from '../../../../enums/action-target-type';
import { CardType } from '../../../../enums/card-type';
import { StructureType } from '../../../../enums/structure-type';

import { ActionLogic, ActionPrerequisites } from '../../../../logic/action-logic';
import { CombatantLogic } from '../../../../logic/combatant-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { ActionCard, StrongholdBenefitCard } from '../../../cards';
import { Badge, Selector, Tag, Text, TextType } from '../../../controls';
import { DirectionPanel } from '../../../panels';

import './action-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	game: GameModel;
	developer: boolean;
	currentActionParameter: ActionParameterModel | null;
	collapsed: boolean;
	toggleCollapsed: () => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel, useCharge: StructureType | null) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameter: (parameter: ActionParameterModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	setOriginParameterValue: (parameter: ActionParameterModel, square: { x: number, y: number }) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

export class ActionControls extends Component<Props> {
	getNotSelected = () => {
		const actionCards: JSX.Element[] = [];
		const baseCards: JSX.Element[] = [];

		this.props.combatant.combat.actions
			.filter(a => CombatantLogic.getActionSourceType(this.props.combatant, a.id) !== CardType.Base)
			.sort((a, b) => a.name.localeCompare(b.name))
			.forEach(a => {
				const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.combatant));
				actionCards.push(
					<ActionCard
						key={a.id}
						action={a}
						footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
						footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						disabled={!prerequisitesMet}
						onClick={prerequisitesMet ? action => this.props.selectAction(this.props.encounter, this.props.combatant, action) : null}
					/>
				);
			});

		this.props.combatant.combat.actions
			.filter(a => CombatantLogic.getActionSourceType(this.props.combatant, a.id) === CardType.Base)
			.forEach(a => {
				const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.combatant));
				if (prerequisitesMet) {
					baseCards.push(
						<ActionCard
							key={a.id}
							action={a}
							footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							onClick={action => this.props.selectAction(this.props.encounter, this.props.combatant, action)}
						/>
					);
				}
			});

		let benefit = null;
		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Observatory);
		if ((redraws > 0) || this.props.developer) {
			benefit = (
				<StrongholdBenefitCard
					label='Redraw'
					available={redraws}
					developer={this.props.developer}
					onRedraw={() => this.props.drawActions(this.props.encounter, this.props.combatant, this.props.developer ? null : StructureType.Observatory)}
				/>
			);
		}

		return (
			<div key='not-selected' className='action-controls-content'>
				{actionCards}
				{benefit ? <div className='separator' /> : null}
				{benefit}
				{baseCards.length > 0 ? <div className='separator' /> : null}
				{baseCards}
			</div>
		);
	};

	getInProgress = (action: ActionModel) => {
		let prerequisitesMet = true;
		const prerequisites: JSX.Element[] = [];
		action.prerequisites.forEach((prerequisite, n) => {
			if (!ActionPrerequisites.isSatisfied(prerequisite, this.props.combatant)) {
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

			let parameterSet = true;
			if (parameter.value) {
				let showParameter = true;
				let description: JSX.Element[] | string = '';
				let changeButton = null;
				let changeControls = null;
				switch (parameter.id) {
					case 'weapon': {
						const weaponParam = parameter as ActionWeaponParameterModel;
						if (weaponParam.value) {
							const itemID = parameter.value as string;
							const item = this.props.combatant.items.find(i => i.id === itemID) as ItemModel;
							description = item.name;
						} else {
							parameterSet = false;
							description = '[Not set]';
						}
						if (weaponParam.candidates.length > 1) {
							changeControls = (
								<Selector
									options={
										weaponParam.candidates
											.map(candidate => candidate as string)
											.map(id => this.props.combatant.items.find(i => i.id === id) as ItemModel)
											.map(item => ({ id: item.id, display: item.name }))
									}
									selectedID={weaponParam.value as string}
									onSelect={id => this.props.setActionParameterValue(parameter, id)}
								/>
							);
						} else {
							showParameter = false;
						}
						break;
					}
					case 'origin': {
						const originParam = parameter as ActionOriginParameterModel;
						if (originParam.value) {
							const list = originParam.value as { x: number, y: number }[];
							if (list.length > 0) {
								const square = list[0];
								const combatantSquares = EncounterLogic.getCombatantSquares(this.props.encounter, this.props.combatant);
								const distance = EncounterMapLogic.getDistanceAny(combatantSquares, [ square ]);
								const angle = EncounterMapLogic.getDirection(this.props.combatant.combat.position, square);
								const candidates = originParam.candidates as { x: number, y: number }[];
								description = [
									<div key='origin-square' className='parameter-row'>
										<div className='square-indicator'>
											{distance > 0 ? <IconArrowUp style={{ transform: `rotate(${angle}deg)` }} /> : null}
											<span>{distance}</span>
										</div>
										<DirectionPanel
											mode='compact'
											movement={0}
											costs={{
												'n': candidates.find(s => (s.x === square.x) && (s.y === square.y - 1)) ? 0 : Number.MAX_VALUE,
												'ne': candidates.find(s => (s.x === square.x + 1) && (s.y === square.y - 1)) ? 0 : Number.MAX_VALUE,
												'e': candidates.find(s => (s.x === square.x + 1) && (s.y === square.y)) ? 0 : Number.MAX_VALUE,
												'se': candidates.find(s => (s.x === square.x + 1) && (s.y === square.y + 1)) ? 0 : Number.MAX_VALUE,
												's': candidates.find(s => (s.x === square.x) && (s.y === square.y + 1)) ? 0 : Number.MAX_VALUE,
												'sw': candidates.find(s => (s.x === square.x - 1) && (s.y === square.y + 1)) ? 0 : Number.MAX_VALUE,
												'w': candidates.find(s => (s.x === square.x - 1) && (s.y === square.y)) ? 0 : Number.MAX_VALUE,
												'nw': candidates.find(s => (s.x === square.x - 1) && (s.y === square.y - 1)) ? 0 : Number.MAX_VALUE
											}}
											onMove={(dir, cost) => {
												const sq = { x: square.x, y: square.y };
												switch (dir) {
													case 'n':
														sq.y -= 1;
														break;
													case 'ne':
														sq.x += 1;
														sq.y -= 1;
														break;
													case 'e':
														sq.x += 1;
														break;
													case 'se':
														sq.x += 1;
														sq.y += 1;
														break;
													case 's':
														sq.y += 1;
														break;
													case 'sw':
														sq.x -= 1;
														sq.y += 1;
														break;
													case 'w':
														sq.x -= 1;
														break;
													case 'nw':
														sq.x -= 1;
														sq.y -= 1;
														break;
												}
												this.props.setOriginParameterValue(originParam, sq);
											}}
										/>
									</div>
								];
							} else {
								parameterSet = false;
								description = '[Not set]';
							}
						} else {
							parameterSet = false;
							description = '[Not set]';
						}
						if (originParam.candidates.length > 1) {
							changeButton = (
								<button
									className={`icon-btn map-btn ${this.props.currentActionParameter === parameter ? 'checked' : ''}`}
									title='Select Origin Square'
									onClick={() => this.props.setActionParameter(originParam)}
								>
									<IconViewfinder />
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
									if (!list || (list.length === 0)) {
										parameterSet = false;
									}
									if (targetParam.targets.count === Number.MAX_VALUE) {
										// Targets all possible candidates
										description = list
											.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
											.map(target => <Tag key={target.id}>{target.name}</Tag>);
										if (list.length === 0) {
											description = '[None]';
										}
									} else {
										// Targets a specific number of candidates
										description = list
											.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
											.map(target => <Tag key={target.id}>{target.name}</Tag>);
										if (list.length === 0) {
											description = '[None]';
										}
										if (targetParam.candidates.length > targetParam.targets.count) {
											const title = `Select ${targetParam.targets.type.toLowerCase()}`;
											changeButton = (
												<button
													className={`icon-btn map-btn ${this.props.currentActionParameter === parameter ? 'checked' : ''}`}
													title={title}
													onClick={() => this.props.setActionParameter(targetParam)}
												>
													<IconViewfinder />
												</button>
											);
										}
									}
									break;
								}
								case ActionTargetType.Squares: {
									const list = targetParam.value as { x: number, y: number }[];
									if (list.length === 0) {
										parameterSet = false;
									}
									if (targetParam.targets.count === Number.MAX_VALUE) {
										// Targets all possible candidates
										description = list.length > 0 ? `[${list.length} squares]` : '[None]';
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
												<button
													className={`icon-btn map-btn ${this.props.currentActionParameter === parameter ? 'checked' : ''}`}
													title='Select Squares'
													onClick={() => this.props.setActionParameter(targetParam)}
												>
													<IconViewfinder />
												</button>
											);
										}
									}
									break;
								}
								case ActionTargetType.Walls: {
									const list = targetParam.value as { x: number, y: number }[];
									if (list.length === 0) {
										parameterSet = false;
									}
									if (targetParam.targets.count === Number.MAX_VALUE) {
										// Targets all possible candidates
										description = list.length > 0 ? `[${list.length} walls]` : '[None]';
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
												<button
													className={`icon-btn map-btn ${this.props.currentActionParameter === parameter ? 'checked' : ''}`}
													title='Select Walls'
													onClick={() => this.props.setActionParameter(targetParam)}
												>
													<IconViewfinder />
												</button>
											);
										}
									}
									break;
								}
							}
						} else {
							// Targets self
							showParameter = false;
						}
						break;
					}
				}

				if (showParameter) {
					parameters.push(
						<Badge key={n} value={parameterSet ? '' : '!'}>
							<div className='action-parameter'>
								<div className='action-parameter-top-line'>
									<div className='action-parameter-name'>
										{ActionLogic.getParameterDescription(parameter)}
									</div>
									<div className='action-parameter-value'>
										{description}
									</div>
									{changeButton !== null ? <div className='action-parameter-change'>{changeButton}</div> : null}
								</div>
								{
									this.props.currentActionParameter === parameter ?
										<Text type={TextType.Information}>
											<p>Select targets on the map, then press the <IconViewfinder size={13} /> button again to confirm your selection.</p>
										</Text>
										: null
								}
								{changeControls !== null ? <div className='action-parameter-change'>{changeControls}</div> : null}
							</div>
						</Badge>
					);
				}
			} else {
				parameterSet = false;
			}

			if (!parameterSet) {
				parametersSet = false;
			}
		});

		return (
			<div key={action.id} className='action-controls-content'>
				<ActionCard
					action={action}
					footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
					footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
					combatant={this.props.combatant}
					encounter={this.props.encounter}
				/>
				<div className='action-details'>
					{prerequisites}
					{parameters}
					<div className='button-row'>
						<button
							className='primary'
							disabled={!prerequisitesMet || !parametersSet || (this.props.currentActionParameter !== null)}
							onClick={() => this.props.runAction(this.props.encounter, this.props.combatant)}
						>
							Run this Action
						</button>
						<button
							disabled={this.props.currentActionParameter !== null}
							onClick={() => this.props.deselectAction(this.props.encounter, this.props.combatant)}
						>
							Choose Again
						</button>
					</div>
				</div>
			</div>
		);
	};

	getUsed = (action: ActionModel) => {
		let benefit = null;
		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.ThievesGuild);
		if ((redraws > 0) || this.props.developer) {
			benefit = (
				<StrongholdBenefitCard
					label='Act Again'
					available={redraws}
					developer={this.props.developer}
					onUse={() => this.props.drawActions(this.props.encounter, this.props.combatant, this.props.developer ? null : StructureType.ThievesGuild)}
				/>
			);
		}

		return (
			<div key={action.id + ' used'} className='action-controls-content'>
				<ActionCard
					action={action}
					footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
					footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
					combatant={this.props.combatant}
					encounter={this.props.encounter}
				/>
				{benefit}
				<div className='action-details'>
					<Text type={TextType.Information}>
						<p>You have used your action for this turn.</p>
						{this.props.combatant.combat.movement > 0 ? <p>You still have some movement points you can use.</p> : null }
					</Text>
				</div>
			</div>
		);
	};

	render = () => {
		try {
			let banner = null;
			let content = null;
			if (this.props.combatant.combat.selectedAction) {
				if (this.props.combatant.combat.selectedAction.used) {
					content = this.getUsed(this.props.combatant.combat.selectedAction.action);
				} else {
					content = this.getInProgress(this.props.combatant.combat.selectedAction.action);
				}
			} else {
				if (!this.props.collapsed) {
					banner = (
						<div className='banner'>
							Scroll left and right to see all the action cards in your hand.
						</div>
					);
				}
				content = this.getNotSelected();
			}

			return (
				<div
					key={this.props.combatant.id}
					className={`action-controls ${this.props.collapsed ? 'collapsed' : 'expanded'}`}
					onClick={() => {
						if (this.props.collapsed) {
							this.props.toggleCollapsed();
						}
					}}
				>
					{banner}
					{content}
				</div>
			);
		} catch {
			return <div className='action-controls render-error' />;
		}
	};
}

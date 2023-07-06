import { IconArrowUp, IconViewfinder } from '@tabler/icons-react';
import { Component } from 'react';

import { ActionTargetType } from '../../../../../enums/action-target-type';
import { CardType } from '../../../../../enums/card-type';

import { ActionLogic, ActionPrerequisites } from '../../../../../logic/action-logic';
import { CombatantLogic } from '../../../../../logic/combatant-logic';
import { EncounterLogic } from '../../../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../../../logic/encounter-map-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../../../models/action';
import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { ItemModel } from '../../../../../models/item';

import { CardList, Selector, Text, TextType } from '../../../../controls';
import { ActionCard } from '../../../../cards';

import './combatant-action.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	currentActionParameter: ActionParameterModel | null;
	developer: boolean;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameter: (parameter: ActionParameterModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

export class CombatantAction extends Component<Props> {
	getNotSelected = () => {
		const actionCards: JSX.Element[] = [];

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
						onSelect={action => prerequisitesMet ? this.props.selectAction(this.props.encounter, this.props.combatant, action) : null}
					/>
				);
			});

		this.props.combatant.combat.actions
			.filter(a => CombatantLogic.getActionSourceType(this.props.combatant, a.id) === CardType.Base)
			.forEach(a => {
				const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.combatant));
				if (prerequisitesMet) {
					actionCards.push(
						<ActionCard
							key={a.id}
							action={a}
							footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							onSelect={action => this.props.selectAction(this.props.encounter, this.props.combatant, action)}
						/>
					);
				}
			});

		return (
			<div className='combatant-action'>
				<Text type={TextType.Information}>
					<p>Choose one of these action cards.</p>
				</Text>
				{this.props.developer ? <button className='developer' onClick={() => this.props.drawActions(this.props.encounter, this.props.combatant)}>Draw Again</button> : null}
				<CardList cards={actionCards} />
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

			if (parameter.value) {
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
							parametersSet = false;
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
								description = [
									<div key={`${square.x} ${square.y}`} className='square-indicator'>
										<IconArrowUp style={{ transform: `rotate(${angle}deg)` }} />
										<span>{distance}</span>
									</div>
								];
							} else {
								parametersSet = false;
								description = '[Not set]';
							}
						} else {
							parametersSet = false;
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
										parametersSet = false;
									}
									if (targetParam.targets.count === Number.MAX_VALUE) {
										// Targets all possible candidates
										description = list
											.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
											.map(target => <Text key={target.id} type={TextType.ListItem}>{target.name}</Text>);
										if (list.length === 0) {
											description = '[None]';
										}
									} else {
										// Targets a specific number of candidates
										description = list
											.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
											.map(target => <Text key={target.id} type={TextType.ListItem}>{target.name}</Text>);
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
										parametersSet = false;
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
										parametersSet = false;
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
							description = '[Self]';
						}
						break;
					}
				}

				parameters.push(
					<div key={n} className='action-parameter'>
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
				);
			}
		});

		return (
			<div className='combatant-action'>
				<div className='action-selected-card'>
					<ActionCard
						action={action}
						footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
						footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
						combatant={this.props.combatant}
						encounter={this.props.encounter}
					/>
				</div>
				<div className='action-details'>
					{prerequisites}
					{parameters}
					<button
						disabled={!prerequisitesMet || !parametersSet || (this.props.currentActionParameter !== null)}
						onClick={() => this.props.runAction(this.props.encounter, this.props.combatant)}
					>
						Run this Action
					</button>
					<button
						disabled={this.props.currentActionParameter !== null}
						onClick={() => this.props.deselectAction(this.props.encounter, this.props.combatant)}
					>
						Cancel
					</button>
				</div>
			</div>
		);
	};

	getUsed = (action: ActionModel) => {
		return (
			<div className='combatant-action'>
				<div className='action-selected-card'>
					<ActionCard
						action={action}
						footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
						footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
						combatant={this.props.combatant}
						encounter={this.props.encounter}
					/>
				</div>
				{this.props.developer ? <button className='developer' onClick={() => this.props.drawActions(this.props.encounter, this.props.combatant)}>Act Again</button> : null}
			</div>
		);
	};

	render = () => {
		try {
			if (!this.props.combatant.combat.selectedAction) {
				return this.getNotSelected();
			} else {
				if (this.props.combatant.combat.selectedAction.used) {
					return this.getUsed(this.props.combatant.combat.selectedAction.action);
				} else {
					return this.getInProgress(this.props.combatant.combat.selectedAction.action);
				}
			}
		} catch {
			return <div className='combatant-action render-error' />;
		}
	};
}

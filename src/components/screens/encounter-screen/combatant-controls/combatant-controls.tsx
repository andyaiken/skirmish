import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { ConditionLogic } from '../../../../logic/condition-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';
import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel, ActionParameterValueModel } from '../../../../models/action';
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
	developer: boolean;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
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
							standUp={this.props.standUp}
							scan={this.props.scan}
							hide={this.props.hide}
						/>
						{auraSection}
						<div className='quick-actions'>
							<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.scan(this.props.encounter, this.props.combatant)}>
								Scan<br/><IconValue value={4} type={IconType.Movement} />
							</button>
							<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.hide(this.props.encounter, this.props.combatant)}>
								Hide<br/><IconValue value={4} type={IconType.Movement} />
							</button>
							{
								this.props.combatant.combat.state === CombatantState.Prone ?
									<button disabled={this.props.combatant.combat.movement < 8} onClick={() => this.props.standUp(this.props.encounter, this.props.combatant)}>
										Stand<br/><IconValue value={8} type={IconType.Movement} />
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
						const prerequisitesMet = a.prerequisites.every(p => p.isSatisfied(this.props.encounter));
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
						if (!prerequisite.isSatisfied(this.props.encounter)) {
							prerequisitesMet = false;
							prerequisites.push(
								<div key={n} className='action-prerequisite'>{prerequisite.description}</div>
							);
						}
					});

					let parametersSet = true;
					const parameters: JSX.Element[] = [];
					action.parameters.forEach((parameter, n) => {
						const param = this.props.combatant.combat.actionParameters.find(p => p.name === parameter.name) as ActionParameterValueModel;
						let description = '';
						if (param.value === null) {
							parametersSet = false;
							description = '[None]';
						} else {
							switch (param.name) {
								case 'targets': {
									// TODO: This could be {x, y}[] instead
									const list = param.value as string[];
									description = list
										.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
										.map(target => target.name)
										.join(', ');
									break;
								}
								case'weapon': {
									const item = param.value as ItemModel;
									description = item.name;
									break;
								}
							}
						}

						parameters.push(
							<div key={n} className='action-parameter'>
								<div className='action-parameter-name'>Select {param.name}</div>
								<div className='action-parameter-value'>{description}</div>
								{param.candidates.length > 1 ? <div className='action-parameter-change'>Change</div> : null}
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
								<button disabled={!(prerequisitesMet && parametersSet)} onClick={() => this.props.runAction(this.props.encounter, this.props.combatant)}>
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
						<Text type={TextType.SubHeading}>{this.props.combatant.name}</Text>
						<div className='tags'>
							<Tag>{GameLogic.getSpecies(this.props.combatant.speciesID)?.name ?? 'Unknown species'}</Tag>
							<Tag>{GameLogic.getRole(this.props.combatant.roleID)?.name ?? 'Unknown role'}</Tag>
							<Tag>{GameLogic.getBackground(this.props.combatant.backgroundID)?.name ?? 'Unknown background'}</Tag>
							<Tag>Level {this.props.combatant.level}</Tag>
						</div>
						{prone ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and their moving costs are doubled.</Text> : null}
						{this.props.combatant.combat.hidden > 0 ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</Text> : null}
						<Selector
							options={options}
							selectedID={this.state.controls}
							onSelect={this.setControls}
						/>
						{controls}
						<hr />
						<button onClick={() => this.props.showCharacterSheet(this.props.combatant)}>Character Sheet</button>
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}
			case CombatantType.Monster: {
				return (
					<div className='combatant-controls'>
						<Text type={TextType.SubHeading}>{this.props.combatant.name}</Text>
						<div className='tags'>
							<Tag>{GameLogic.getSpecies(this.props.combatant.speciesID)?.name ?? 'Unknown species'}</Tag>
							<Tag>{GameLogic.getRole(this.props.combatant.roleID)?.name ?? 'Unknown role'}</Tag>
							<Tag>{GameLogic.getBackground(this.props.combatant.backgroundID)?.name ?? 'Unknown background'}</Tag>
							<Tag>Level {this.props.combatant.level}</Tag>
						</div>
						{prone ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and moving costs are doubled.</Text> : null}
						{this.props.combatant.combat.hidden > 0 ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</Text> : null}
						<hr />
						<button onClick={() => this.props.showCharacterSheet(this.props.combatant)}>Character Sheet</button>
						<button className='developer' onClick={this.kill}>Kill</button>
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}
		}
	};
}

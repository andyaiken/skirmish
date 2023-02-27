import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';
import { GameLogic } from '../../../../logic/game-logic';

import { CombatantModel } from '../../../../models/combatant';
import { EncounterModel } from '../../../../models/encounter';
import { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { Box, CardList, Developer, IconType, IconValue, NotImplemented, PlayingCard, Selector, StatValue, Tag, Text, TextType } from '../../../controls';
import { ActionCard } from '../../../cards';
import { CombatStatsPanel } from '../../../panels/combat-stats/combat-stats-panel';
import { DirectionPanel } from '../../../panels';

import './combatant-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
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
							{auras.map(c => <StatValue key={c.id} label={GameLogic.getConditionDescription(c)} value={c.rank} />)}
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
				const actionCards = this.props.combatant.combat.actions.map(a => {
					const source = CombatantLogic.getCardSource(this.props.combatant, a.id, 'action');
					return (
						<PlayingCard
							key={a.id}
							front={<ActionCard action={a} />}
							footer={source}
							onClick={null}
						/>
					);
				});

				controls = (
					<NotImplemented>
						<div className='actions'>
							<CardList cards={actionCards} />
						</div>
					</NotImplemented>
				);
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
						<Selector
							options={[ { id: 'overview', display: 'Overview' }, { id: 'move', display: 'Move' }, { id: 'actions', display: 'Actions' } ]}
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
						<Developer><button onClick={this.kill}>Kill</button></Developer>
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}
		}
	};
}

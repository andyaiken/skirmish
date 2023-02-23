import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';
import { GameLogic } from '../../../../logic/game-logic';

import { CombatantModel } from '../../../../models/combatant';
import { EncounterModel } from '../../../../models/encounter';
import { ItemModel } from '../../../../models/item';

import { Box, CardList, IconType, IconValue, PlayingCard, Selector, StatValue, Tag, Text, TextType } from '../../../controls';
import { ActionCard } from '../../../cards';
import { CombatStatsPanel } from '../../../panels/combat-stats/combat-stats-panel';
import { DirectionPanel } from '../../../panels';
import { EncounterFinishState } from '../encounter-screen';

import './combatant-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterFinishState) => void;
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

				controls = (
					<div className='movement'>
						<DirectionPanel combatant={this.props.combatant} costs={moveCosts} onMove={(dir, cost) => this.props.move(this.props.encounter, this.props.combatant, dir, cost)} />
					</div>
				);
				break;
			}
			case 'actions': {
				const actionCards = this.props.combatant.combat.actions.map(a => {
					const source = CombatantLogic.getCardSource(this.props.combatant, a.id, 'action');
					return (
						<PlayingCard key={a.id} front={<ActionCard action={a} />} footer={source} />
					);
				});

				controls = (
					<div className='actions not-implemented'>
						<CardList cards={actionCards} />
					</div>
				);
				break;
			}
			case 'other': {
				controls = (
					<div>
						<button className='not-implemented' onClick={() => null}>Pick Up Item<br/><IconValue value={2} type={IconType.Movement} /></button>
						<hr />
						<button className='hack' onClick={() => this.props.finishEncounter(EncounterFinishState.Victory)}>Win</button>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Retreat)}>Retreat</button>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Defeat)}>Surrender</button>
					</div>
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
							options={[ { id: 'overview', display: 'Overview' }, { id: 'move', display: 'Move' }, { id: 'actions', display: 'Actions' }, { id: 'other', display: 'Other' } ]}
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
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}
		}
	};
}

import { Component } from 'react';

import { MonsterLogic } from '../../../../logic/monster-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { IntentModel } from '../../../../models/intent';

import { Text, TextType } from '../../../controls';

import './combatant-monster.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	performIntent: (encounter: EncounterModel, combatant: CombatantModel, intent: IntentModel) => IntentModel;
	showCharacterSheet: (combatant: CombatantModel) => void;
	kill: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

interface State {
	intent: IntentModel;
}

export class CombatantMonster extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			intent: MonsterLogic.getIntent()
		};
	}

	showCharacterSheet = () => {
		this.props.showCharacterSheet(this.props.combatant);
	};

	kill = () => {
		this.props.kill(this.props.encounter, this.props.combatant);
	};

	performIntent = () => {
		const intent = this.props.performIntent(this.props.encounter, this.props.combatant, this.state.intent);
		this.setState({
			intent: intent
		});
	};

	getLog = () => {
		if (this.props.combatant.combat.actionLog.length === 0) {
			return null;
		}

		return (
			<div className='action-log'>
				{this.props.combatant.combat.actionLog.map((msg, n) => <div key={n} className='action-log-item'>{msg}</div>)}
			</div>
		);
	};

	render = () => {
		return (
			<div className='combatant-monster'>
				<Text type={TextType.Information}><b>{this.props.combatant.name} is a monster.</b> You cannot control their actions.</Text>
				{this.getLog()}
				<button onClick={this.performIntent}>{this.state.intent.description}</button>
				{this.props.developer ? <button className='developer' onClick={this.showCharacterSheet}>Character Sheet</button> : null}
				{this.props.developer ? <button className='developer' onClick={this.kill}>Kill</button> : null}
			</div>
		);
	};
}

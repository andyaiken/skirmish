import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Text, TextType } from '../../../controls';

import './combatant-monster.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	performIntents: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

export class CombatantMonster extends Component<Props> {
	performIntents = () => {
		this.props.performIntents(this.props.encounter, this.props.combatant);
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
				<button onClick={this.performIntents}>{this.props.combatant.combat.intents?.description || 'End Turn'}</button>
			</div>
		);
	};
}

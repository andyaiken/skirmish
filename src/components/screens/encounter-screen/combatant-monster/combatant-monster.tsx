import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Text, TextType } from '../../../controls';

import './combatant-monster.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	showCharacterSheet: (combatant: CombatantModel) => void;
	kill: (encounter: EncounterModel, combatant: CombatantModel) => void;
	endTurn: (encounter: EncounterModel) => void;
}

export class CombatantMonster extends Component<Props> {
	showCharacterSheet = () => {
		this.props.showCharacterSheet(this.props.combatant);
	};

	kill = () => {
		this.props.kill(this.props.encounter, this.props.combatant);
	};

	endTurn = () => {
		this.props.endTurn(this.props.encounter);
	};

	render = () => {
		return (
			<div className='combatant-monster'>
				<Text type={TextType.Information}><b>{this.props.combatant.name} is a monster.</b> You cannot control their actions.</Text>
				{this.props.developer ? <button className='developer' onClick={this.showCharacterSheet}>Character Sheet</button> : null}
				{this.props.developer ? <button className='developer' onClick={this.kill}>Kill</button> : null}
				<button onClick={this.endTurn}>End Turn</button>
			</div>
		);
	};
}

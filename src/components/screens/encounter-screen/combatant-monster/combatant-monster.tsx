import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';

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
}

export class CombatantMonster extends Component<Props> {
	showCharacterSheet = () => {
		this.props.showCharacterSheet(this.props.combatant);
	};

	kill = () => {
		this.props.kill(this.props.encounter, this.props.combatant);
	};

	render = () => {
		const prone = this.props.combatant.combat.state === CombatantState.Prone;

		return (
			<div className='combatant-monster'>
				{prone ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and moving costs are doubled.</Text> : null}
				{this.props.combatant.combat.hidden > 0 ? <Text type={TextType.Information}><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</Text> : null}
				<hr />
				<Text type={TextType.Information}><b>{this.props.combatant.name} is a monster.</b> You cannot control their actions.</Text>
				<button className='developer' onClick={this.showCharacterSheet}>Character Sheet</button>
				<button className='developer' onClick={this.kill}>Kill</button>
			</div>
		);
	};
}

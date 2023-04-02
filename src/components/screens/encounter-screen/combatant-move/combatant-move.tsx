import { Component } from 'react';

import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { DirectionPanel } from '../../../panels';

import './combatant-move.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
}

export class CombatantMove extends Component<Props> {
	render = () => {
		const moveCosts: Record<string, number> = {};
		moveCosts.n = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 'n');
		moveCosts.ne = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 'ne');
		moveCosts.e = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 'e');
		moveCosts.se = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 'se');
		moveCosts.s = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 's');
		moveCosts.sw = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 'sw');
		moveCosts.w = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 'w');
		moveCosts.nw = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, 'nw');

		return (
			<div className='combatant-move'>
				<DirectionPanel combatant={this.props.combatant} costs={moveCosts} onMove={(dir, cost) => this.props.move(this.props.encounter, this.props.combatant, dir, cost)} />
				{this.props.developer ? <button className='developer' onClick={() => this.props.addMovement(this.props.encounter, this.props.combatant, 10)}>Add Movement</button> : null}
			</div>
		);
	};
}

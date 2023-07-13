import { Component } from 'react';

import { CombatantLogic } from '../../../../../logic/combatant-logic';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';

import { ActionCard } from '../../../../cards';

import './combatant-monster.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
}

export class CombatantMonster extends Component<Props> {
	render = () => {
		try {
			if (!this.props.combatant.combat.selectedAction) {
				return null;
			}

			return (
				<div className='combatant-monster'>
					<ActionCard
						action={this.props.combatant.combat.selectedAction.action}
						footer={CombatantLogic.getActionSource(this.props.combatant, this.props.combatant.combat.selectedAction.action.id)}
						footerType={CombatantLogic.getActionSourceType(this.props.combatant, this.props.combatant.combat.selectedAction.action.id)}
						combatant={this.props.combatant}
						encounter={this.props.encounter}
					/>
				</div>
			);
		} catch {
			return <div className='combatant-monster render-error' />;
		}
	};
}

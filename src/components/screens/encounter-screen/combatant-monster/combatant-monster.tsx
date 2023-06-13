import { Component } from 'react';

import { CombatantLogic } from '../../../../logic/combatant-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Text, TextType } from '../../../controls';
import { ActionCard } from '../../../cards';

import './combatant-monster.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
}

export class CombatantMonster extends Component<Props> {
	render = () => {
		try {
			let action = null;
			if (this.props.combatant.combat.selectedAction) {
				action = (
					<div className='actions'>
						<ActionCard
							action={this.props.combatant.combat.selectedAction.action}
							footer={CombatantLogic.getActionSource(this.props.combatant, this.props.combatant.combat.selectedAction.action.id)}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, this.props.combatant.combat.selectedAction.action.id)}
							combatant={this.props.combatant}
							encounter={this.props.encounter}
						/>
					</div>
				);
			}

			return (
				<div className='combatant-monster'>
					<Text type={TextType.Information}>
						<p><b>{this.props.combatant.name} is a monster.</b> You cannot control their actions.</p>
					</Text>
					{action ? <hr /> : null}
					{action}
				</div>
			);
		} catch {
			return <div className='combatant-monster render-error' />;
		}
	};
}

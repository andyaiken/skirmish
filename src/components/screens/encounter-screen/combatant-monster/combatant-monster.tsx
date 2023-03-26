import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';

import type { ActionModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';

import { PlayingCard, Text, TextType } from '../../../controls';
import { ActionCard } from '../../../cards';

import './combatant-monster.scss';

interface Props {
	combatant: CombatantModel;
	developer: boolean;
}

export class CombatantMonster extends Component<Props> {
	render = () => {
		let action = null;
		if (this.props.combatant.combat.selectedAction) {
			action = this.props.combatant.combat.selectedAction.action;
		} else {
			const intent = this.props.combatant.combat.intents ? this.props.combatant.combat.intents.intents.find(i => i.id === 'action') : null;
			if (intent) {
				action = intent.data as ActionModel;
			}
		}

		return (
			<div className='combatant-monster'>
				<Text type={TextType.Information}><b>{this.props.combatant.name} is a monster.</b> You cannot control their actions.</Text>
				{
					action ?
						<div className='actions'>
							<PlayingCard
								type={CardType.Action}
								front={<ActionCard action={action} />}
								footer={CombatantLogic.getCardSource(this.props.combatant, action.id, 'action')}
								footerType={CombatantLogic.getCardSourceType(this.props.combatant, action.id, 'action')} />
						</div>
						: null
				}
			</div>
		);
	};
}

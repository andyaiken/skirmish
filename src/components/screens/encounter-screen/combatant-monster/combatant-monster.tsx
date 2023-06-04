import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';

import type { ActionModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { ActionCard, PlaceholderCard } from '../../../cards';
import { PlayingCard, Text, TextType } from '../../../controls';

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
					<hr />
					<div className='actions'>
						{
							action ?
								<ActionCard
									action={action}
									footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
									footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
									combatant={this.props.combatant}
									encounter={this.props.encounter}
								/>
								:
								<PlayingCard
									type={CardType.Action}
									front={<PlaceholderCard text='' subtext={`${this.props.combatant.name} has not chosen an action this turn`} />}
								/>
						}
					</div>
				</div>
			);
		} catch {
			return <div className='combatant-monster render-error' />;
		}
	};
}

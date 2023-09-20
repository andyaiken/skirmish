import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import type { CombatantModel } from '../../../models/combatant';

import { Text, TextType } from '../../controls';

import './combatant-notices.scss';

interface Props {
	combatant: CombatantModel;
}

export class CombatantNotices extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='combatant-notices'>
					{
						this.props.combatant.combat.state === CombatantState.Prone ?
							<Text type={TextType.Information}>
								<p><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and moving costs are doubled.</p>
							</Text>
							: null
					}
					{
						this.props.combatant.combat.state === CombatantState.Unconscious ?
							<Text type={TextType.Information}>
								<p><b>{this.props.combatant.name} is Unconscious.</b> They cannot spend movement points or take any actions until their wounds are healed.</p>
							</Text>
							: null
					}
					{
						this.props.combatant.combat.state === CombatantState.Dead ?
							<Text type={TextType.Information}>
								<p><b>{this.props.combatant.name} is Dead.</b> They cannot spend movement points or take any actions.</p>
							</Text>
							: null
					}
					{
						this.props.combatant.combat.stunned ?
							<Text type={TextType.Information}>
								<p><b>{this.props.combatant.name} is Stunned.</b> They cannot spend movement points or take any actions this round.</p>
							</Text>
							: null
					}
					{
						this.props.combatant.combat.hidden > 0 ?
							<Text type={TextType.Information}>
								<p><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</p>
							</Text>
							: null
					}
				</div>
			);
		} catch {
			return <div className='combatant-notices render-error' />;
		}
	};
}

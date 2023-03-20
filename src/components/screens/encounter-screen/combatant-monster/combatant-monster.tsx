import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';

import { Text, TextType } from '../../../controls';

import './combatant-monster.scss';

interface Props {
	combatant: CombatantModel;
	developer: boolean;
}

export class CombatantMonster extends Component<Props> {
	render = () => {
		return (
			<div className='combatant-monster'>
				<Text type={TextType.Information}><b>{this.props.combatant.name} is a monster.</b> You cannot control their actions.</Text>
			</div>
		);
	};
}

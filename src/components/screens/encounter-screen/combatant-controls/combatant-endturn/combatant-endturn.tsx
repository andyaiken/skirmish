import { IconCircleCheckFilled, IconX } from '@tabler/icons-react';
import { Component } from 'react';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';

import { IconType, IconValue, StatValue } from '../../../../controls';

import './combatant-endturn.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	endTurn: () => void;
}

export class CombatantEndturn extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='combatant-endturn'>
					<StatValue orientation='vertical' label='Movement Left' value={<IconValue type={IconType.Movement} value={this.props.combatant.combat.movement} />} />
					{
						this.props.combatant.combat.selectedAction && this.props.combatant.combat.selectedAction.used ?
							<StatValue orientation='vertical' label='Action Taken' value={<IconCircleCheckFilled className='checked' size={40} />} />
							:
							<StatValue orientation='vertical' label='Action Taken' value={<IconX size={40} />} />
					}
					<button onClick={this.props.endTurn}>End Turn</button>
				</div>
			);
		} catch {
			return <div className='combatant-endturn render-error' />;
		}
	};
}

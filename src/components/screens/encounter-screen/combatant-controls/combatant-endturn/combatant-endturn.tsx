import { IconCircleCheckFilled, IconX } from '@tabler/icons-react';
import { Component } from 'react';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';

import { IconSize, IconType, IconValue, StatValue } from '../../../../controls';

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
					<div className='endturn-stats'>
						<StatValue
							orientation='vertical'
							label='Movement Left'
							value={<IconValue type={IconType.Movement} value={this.props.combatant.combat.movement} size={IconSize.Large} />}
						/>
						<StatValue
							orientation='vertical'
							label='Action Taken'
							value={
								this.props.combatant.combat.selectedAction && this.props.combatant.combat.selectedAction.used ?
									<IconCircleCheckFilled className='checked' size={50} />
									:
									<IconX size={50} />}
						/>
					</div>
					<button className='primary' onClick={this.props.endTurn}>End Turn</button>
				</div>
			);
		} catch {
			return <div className='combatant-endturn render-error' />;
		}
	};
}

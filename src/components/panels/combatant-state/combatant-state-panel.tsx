import { IconArrowsRightLeft, IconMoonStars, IconUser, IconUserDown, IconX } from '@tabler/icons-react';
import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import type { CombatantModel } from '../../../models/combatant';

import './combatant-state-panel.scss';

interface Props {
	combatant: CombatantModel;
}

export class CombatantStatePanel extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='combatant-state-panel'>
					<div className={this.props.combatant.combat.state === CombatantState.Standing ? 'state-box selected' : 'state-box'}>
						<IconUser />
						<div className='state-text'>Standing</div>
					</div>
					<IconArrowsRightLeft className='state-arrows' size={10} />
					<div className={this.props.combatant.combat.state === CombatantState.Prone ? 'state-box selected' : 'state-box'}>
						<IconUserDown />
						<div className='state-text'>Prone</div>
					</div>
					<IconArrowsRightLeft className='state-arrows' size={10} />
					<div className={this.props.combatant.combat.state === CombatantState.Unconscious ? 'state-box selected' : 'state-box'}>
						<IconMoonStars />
						<div className='state-text'>Unc.</div>
					</div>
					<IconArrowsRightLeft className='state-arrows' size={10} />
					<div className={this.props.combatant.combat.state === CombatantState.Dead ? 'state-box selected' : 'state-box'}>
						<IconX />
						<div className='state-text'>Dead</div>
					</div>
					{this.props.combatant.combat.stunned ? <div className='state-stunned'>Stunned</div> : null}
				</div>
			);
		} catch {
			return <div className='combatant-state-panel render-error' />;
		}
	};
}

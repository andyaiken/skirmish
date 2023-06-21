import { Component } from 'react';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';

import { IconType, IconValue } from '../../../../controls';
import { CombatStatsPanel } from '../../../../panels';

import './combatant-overview.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

export class CombatantOverview extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='combatant-overview'>
					<CombatStatsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
					<div className='quick-actions'>
						<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.inspire(this.props.encounter, this.props.combatant)}>
							Inspire<br /><IconValue value={4} type={IconType.Movement} iconSize={12} />
						</button>
						<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.scan(this.props.encounter, this.props.combatant)}>
							Scan<br /><IconValue value={4} type={IconType.Movement} iconSize={12} />
						</button>
						<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.hide(this.props.encounter, this.props.combatant)}>
							Hide<br /><IconValue value={4} type={IconType.Movement} iconSize={12} />
						</button>
					</div>
				</div>
			);
		} catch {
			return <div className='combatant-overview render-error' />;
		}
	};
}

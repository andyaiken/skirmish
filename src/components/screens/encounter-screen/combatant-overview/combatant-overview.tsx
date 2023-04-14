import { Component } from 'react';

import { ConditionLogic } from '../../../../logic/condition-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Box, IconType, IconValue, StatValue } from '../../../controls';
import { CombatStatsPanel } from '../../../panels';

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
		let auraSection = null;
		const auras = EncounterLogic.getAuraConditions(this.props.encounter, this.props.combatant);
		if (auras.length > 0) {
			auraSection = (
				<Box label='Affected by Auras'>
					{auras.map(c => <StatValue key={c.id} label={ConditionLogic.getConditionDescription(c)} value={c.rank} />)}
				</Box>
			);
		}

		return (
			<div className='combatant-overview'>
				<CombatStatsPanel
					combatant={this.props.combatant}
					encounter={this.props.encounter}
				/>
				{auraSection}
				<hr />
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
	};
}

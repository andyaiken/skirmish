import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';

import { ConditionLogic } from '../../../../logic/condition-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Box, IconType, IconValue, StatValue, Text, TextType } from '../../../controls';
import { CombatStatsPanel } from '../../../panels';

import './combatant-overview.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

export class CombatantOverview extends Component<Props> {
	render = () => {
		if (this.props.combatant.combat.state === CombatantState.Unconscious) {
			return (
				<Text type={TextType.Information}>
					{this.props.combatant.name} is <b>Unconscious</b>.
				</Text>
			);
		}

		if (this.props.combatant.combat.state === CombatantState.Dead) {
			return (
				<Text type={TextType.Information}>
					{this.props.combatant.name} is <b>Dead</b>.
				</Text>
			);
		}

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
				<div className='quick-actions'>
					<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.scan(this.props.encounter, this.props.combatant)}>
						Scan<br/><IconValue value={4} type={IconType.Movement} iconSize={12} />
					</button>
					<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.hide(this.props.encounter, this.props.combatant)}>
						Hide<br/><IconValue value={4} type={IconType.Movement} iconSize={12} />
					</button>
					{
						this.props.combatant.combat.state === CombatantState.Prone ?
							<button disabled={this.props.combatant.combat.movement < 8} onClick={() => this.props.standUp(this.props.encounter, this.props.combatant)}>
								Stand Up<br/><IconValue value={8} type={IconType.Movement} iconSize={12} />
							</button>
							: null
					}
				</div>
			</div>
		);
	};
}

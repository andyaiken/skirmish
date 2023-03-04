import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';

import { CombatantModel } from '../../../models/combatant';
import { ConditionModel } from '../../../models/condition';
import { EncounterModel } from '../../../models/encounter';

import { Box, IconType, IconValue, StatValue } from '../../controls';

import './combat-stats-panel.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	standUp: ((encounter: EncounterModel, combatant: CombatantModel) => void) | null;
	scan: ((encounter: EncounterModel, combatant: CombatantModel) => void) | null;
	hide: ((encounter: EncounterModel, combatant: CombatantModel) => void) | null;
}

export class CombatStatsPanel extends Component<Props> {
	scan = (combatant: CombatantModel) => {
		if (this.props.scan) {
			this.props.scan(this.props.encounter, combatant);
		}
	};

	hide = (combatant: CombatantModel) => {
		if (this.props.hide) {
			this.props.hide(this.props.encounter, combatant);
		}
	};

	standUp = (combatant: CombatantModel) => {
		if (this.props.standUp) {
			this.props.standUp(this.props.encounter, combatant);
		}
	};

	render = () => {
		const conditions = ([] as ConditionModel[])
			.concat(this.props.combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(this.props.encounter, this.props.combatant));

		let wounds = '';
		for (let n = 0; n < this.props.combatant.combat.wounds; ++n) {
			wounds += '♥︎';
		}
		while (wounds.length < CombatantLogic.getTraitValue(this.props.combatant, conditions, TraitType.Resolve)) {
			wounds += '♡';
		}
		const woundsPerRow = (wounds.length < 6) || (wounds.length > 8) ? 5 : 4;
		const woundsInRows: JSX.Element[] = [];
		while (wounds.length > woundsPerRow) {
			woundsInRows.push(<div key={woundsInRows.length}>{wounds.substring(0, woundsPerRow)}</div>);
			wounds = wounds.substring(woundsPerRow);
		}
		if (wounds !== '') {
			woundsInRows.push(<div key={woundsInRows.length}>{wounds}</div>);
		}

		return (
			<div className='combat-stats-panel'>
				<Box label='This Round'>
					<div className='stats-row'>
						<StatValue orientation='vertical' label='Movement' value={<IconValue value={this.props.combatant.combat.movement} type={IconType.Movement} />} />
						<StatValue orientation='vertical' label='Senses' value={this.props.combatant.combat.senses} />
						<StatValue orientation='vertical' label='Hidden' value={this.props.combatant.combat.hidden} />
					</div>
				</Box>
				<Box label='Health'>
					<div className='stats-row'>
						<StatValue orientation='vertical' label='Damage' value={this.props.combatant.combat.damage} />
						<StatValue orientation='vertical' label='Wounds' value={<div>{woundsInRows}</div>} />
					</div>
				</Box>
				<Box label='Traits and Conditions'>
					<div className='stats-row'>
						<div>
							<StatValue orientation='vertical' label='Endurance' value={CombatantLogic.getTraitValue(this.props.combatant, conditions, TraitType.Endurance)} />
							<div>{this.props.combatant.combat.conditions.filter(c => c.trait === TraitType.Endurance).map(c => c.type)}</div>
						</div>
						<div>
							<StatValue orientation='vertical' label='Resolve' value={CombatantLogic.getTraitValue(this.props.combatant, conditions, TraitType.Resolve)} />
							<div>{this.props.combatant.combat.conditions.filter(c => c.trait === TraitType.Resolve).map(c => c.type)}</div>
						</div>
						<div>
							<StatValue orientation='vertical' label='Speed' value={CombatantLogic.getTraitValue(this.props.combatant, conditions, TraitType.Speed)} />
							<div>{this.props.combatant.combat.conditions.filter(c => c.trait === TraitType.Speed).map(c => c.type)}</div>
						</div>
					</div>
				</Box>
			</div>
		);
	};
}

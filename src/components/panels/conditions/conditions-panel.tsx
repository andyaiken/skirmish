import { IconCircleMinus, IconCirclePlus } from '@tabler/icons-react';
import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { ConditionLogic } from '../../../logic/condition-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { Collections } from '../../../utils/collections';

import { Box, StatValue, Text, TextType } from '../../controls';

import './conditions-panel.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
}

export class ConditionsPanel extends Component<Props> {
	getConditions = (trait: TraitType) => {
		const conditions = this.props.combatant.combat.conditions.filter(c => c.trait === trait);
		return Collections.distinct(conditions, c => ConditionLogic.getConditionDescription(c))
			.map(c => {
				const set = this.props.combatant.combat.conditions.filter(con => ConditionLogic.getConditionDescription(con) === ConditionLogic.getConditionDescription(c));
				return (
					<div key={c.id} className='condition-row'>
						{ConditionLogic.getConditionIsBeneficial(c) ? <IconCirclePlus size={15} style={{ color: 'darkgreen' }} /> : <IconCircleMinus size={15} style={{ color: 'darkred' }} />}
						<div className='details'>
							<StatValue
								orientation='compact'
								label={ConditionLogic.getConditionDescription(c)}
								value={Collections.sum(set, c => c.rank)}
							/>
						</div>
					</div>
				);
			});
	};

	getAuras = () => {
		return EncounterLogic.getAuraConditions(this.props.encounter, this.props.combatant)
			.map(c => {
				return (
					<div key={c.id} className='condition-row'>
						{ConditionLogic.getConditionIsBeneficial(c) ? <IconCirclePlus size={15} style={{ color: 'darkgreen' }} /> : <IconCircleMinus size={15} style={{ color: 'darkred' }} />}
						<div className='details'>
							<StatValue
								orientation='compact'
								label={ConditionLogic.getConditionDescription(c)}
								value={c.rank}
							/>
						</div>
					</div>
				);
			});
	};

	render = () => {
		try {
			const endurance = this.getConditions(TraitType.Endurance);
			const resolve = this.getConditions(TraitType.Resolve);
			const speed = this.getConditions(TraitType.Speed);
			const auras = this.getAuras();

			let conditions = null;
			if (endurance.length + resolve.length + speed.length + auras.length > 0) {
				conditions = (
					<Box label='Conditions'>
						<div>
							{endurance.length > 0 ? <Text type={TextType.MinorHeading}>Endurance Conditions</Text> : null}
							{endurance}
							{resolve.length > 0 ? <Text type={TextType.MinorHeading}>Resolve Conditions</Text> : null}
							{resolve}
							{speed.length > 0 ? <Text type={TextType.MinorHeading}>Speed Conditions</Text> : null}
							{speed}
							{auras.length > 0 ? <Text type={TextType.MinorHeading}>Conditions from Auras</Text> : null}
							{auras}
						</div>
					</Box>
				);
			}

			return (
				<div className='conditions-panel'>
					{conditions}
				</div>
			);
		} catch {
			return <div className='conditions-panel render-error' />;
		}
	};
}

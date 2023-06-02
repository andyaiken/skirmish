import { IconHeartFilled, IconHeartOff } from '@tabler/icons-react';
import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { ConditionLogic } from '../../../logic/condition-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { Box, IconType, IconValue, StatValue, Text, TextType } from '../../controls';

import './combat-stats-panel.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
}

export class CombatStatsPanel extends Component<Props> {
	getConditions = (trait: TraitType) => {
		return this.props.combatant.combat.conditions
			.filter(c => c.trait === trait)
			.map(c => (
				<StatValue key={c.id} orientation='compact' label={ConditionLogic.getConditionDescription(c)} value={c.rank} />
			));
	};

	getAuras = () => {
		return EncounterLogic.getAuraConditions(this.props.encounter, this.props.combatant)
			.map(c => (
				<StatValue key={c.id} orientation='compact' label={ConditionLogic.getConditionDescription(c)} value={c.rank} />
			));
	};

	render = () => {
		try {
			let wounds: JSX.Element[] = [];
			for (let n = 0; n < this.props.combatant.combat.wounds; ++n) {
				wounds.push(<IconHeartOff key={n} />);
			}
			while (wounds.length < EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve)) {
				wounds.unshift(<IconHeartFilled key={wounds.length} className='heartbeat' />);
			}
			const woundsPerRow = (wounds.length === 4) ? 2 : 3;
			const woundsInRows: JSX.Element[] = [];
			while (wounds.length > woundsPerRow) {
				woundsInRows.push(<div key={woundsInRows.length} className='wounds'>{wounds.slice(0, woundsPerRow)}</div>);
				wounds = wounds.slice(woundsPerRow);
			}
			if (wounds.length !== 0) {
				woundsInRows.push(<div key={woundsInRows.length} className='wounds'>{wounds}</div>);
			}

			const endurance = this.getConditions(TraitType.Endurance);
			const resolve = this.getConditions(TraitType.Resolve);
			const speed = this.getConditions(TraitType.Speed);
			const auras = this.getAuras();

			let conditions = null;
			if (endurance.length + resolve.length + speed.length + auras.length > 0) {
				conditions = (
					<Box label='Conditions'>
						<div>
							{ endurance.length > 0 ? <Text type={TextType.MinorHeading}>Endurance Conditions</Text> : null }
							{endurance}
							{ resolve.length > 0 ? <Text type={TextType.MinorHeading}>Resolve Conditions</Text> : null }
							{resolve}
							{ speed.length > 0 ? <Text type={TextType.MinorHeading}>Speed Conditions</Text> : null }
							{speed}
							{ auras.length > 0 ? <Text type={TextType.MinorHeading}>In Auras</Text> : null }
							{auras}
						</div>
					</Box>
				);
			}

			return (
				<div className='combat-stats-panel'>
					<Box label='This Round'>
						<div className='combat-stats-row'>
							<StatValue orientation='vertical' label='Movement' value={<IconValue value={this.props.combatant.combat.movement} type={IconType.Movement} />} />
							<StatValue orientation='vertical' label='Senses' value={this.props.combatant.combat.senses} />
							<StatValue orientation='vertical' label='Hidden' value={this.props.combatant.combat.hidden} />
						</div>
					</Box>
					<Box label='Health'>
						<div className='combat-stats-row'>
							<StatValue orientation='vertical' label='Damage' value={this.props.combatant.combat.damage} />
							<StatValue orientation='vertical' label='Wounds' value={<div>{woundsInRows}</div>} />
						</div>
					</Box>
					{conditions}
				</div>
			);
		} catch {
			return <div className='combat-stats-panel render-error' />;
		}
	};
}

import { IconHeartFilled, IconHeartOff } from '@tabler/icons-react';
import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { ConditionLogic } from '../../../logic/condition-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';

import { CombatantModel } from '../../../models/combatant';
import { EncounterModel } from '../../../models/encounter';

import { Box, IconType, IconValue, StatValue } from '../../controls';

import './combat-stats-panel.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
}

export class CombatStatsPanel extends Component<Props> {
	getConditions = (trait: TraitType) => {
		return this.props.combatant.combat.conditions
			.filter(c => c.trait === trait)
			.map(c => {
				return (
					<div key={c.id} className='condition'>
						<StatValue label={ConditionLogic.getConditionDescription(c)} value={c.rank} />
					</div>
				);
			});
	};

	render = () => {
		let wounds: JSX.Element[] = [];
		for (let n = 0; n < this.props.combatant.combat.wounds; ++n) {
			wounds.push(<IconHeartOff key={n} />);
		}
		while (wounds.length < EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve)) {
			wounds.push(<IconHeartFilled key={wounds.length} className='heartbeat' />);
		}
		const woundsPerRow = (wounds.length < 6) || (wounds.length > 8) ? 5 : 4;
		const woundsInRows: JSX.Element[] = [];
		while (wounds.length > woundsPerRow) {
			woundsInRows.push(<div key={woundsInRows.length} className='wounds'>{wounds.slice(0, woundsPerRow)}</div>);
			wounds = wounds.slice(woundsPerRow);
		}
		if (wounds.length !== 0) {
			woundsInRows.push(<div key={woundsInRows.length} className='wounds'>{wounds}</div>);
		}

		return (
			<div className='combat-stats-panel'>
				<Box label='This Round'>
					<div className='stats-row align-bottom'>
						<StatValue orientation='vertical' label='Movement' value={<IconValue value={this.props.combatant.combat.movement} type={IconType.Movement} />} />
						<StatValue orientation='vertical' label='Senses' value={this.props.combatant.combat.senses} />
						<StatValue orientation='vertical' label='Hidden' value={this.props.combatant.combat.hidden} />
					</div>
				</Box>
				<Box label='Health'>
					<div className='stats-row align-bottom'>
						<StatValue orientation='vertical' label='Damage' value={this.props.combatant.combat.damage} />
						<StatValue orientation='vertical' label='Wounds' value={<div>{woundsInRows}</div>} />
					</div>
				</Box>
				<Box label='Traits and Conditions'>
					<div className='stats-row align-top'>
						<div>
							<StatValue orientation='vertical' label='Endurance' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Endurance)} />
							<div>{this.getConditions(TraitType.Endurance)}</div>
						</div>
						<div>
							<StatValue orientation='vertical' label='Resolve' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve)} />
							<div>{this.getConditions(TraitType.Resolve)}</div>
						</div>
						<div>
							<StatValue orientation='vertical' label='Speed' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Speed)} />
							<div>{this.getConditions(TraitType.Speed)}</div>
						</div>
					</div>
				</Box>
			</div>
		);
	};
}

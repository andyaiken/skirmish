import { IconHeartFilled, IconHeartOff } from '@tabler/icons-react';
import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { Box, IconSize, IconType, IconValue, StatValue } from '../../controls';
import { ConditionsPanel } from '../conditions/conditions-panel';

import './combat-stats-panel.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
}

export class CombatStatsPanel extends Component<Props> {
	render = () => {
		try {
			let wounds: JSX.Element[] = [];
			const resolveRank = EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve);
			for (let n = 0; n < resolveRank; ++n) {
				wounds.push(n < this.props.combatant.combat.wounds ? <IconHeartOff key={n} size={30} /> : <IconHeartFilled key={n} className='heartbeat' size={30} />);
			}
			wounds.reverse();

			const woundsPerRow = (wounds.length === 4) ? 2 : 3;
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
						<div className='combat-stats-row'>
							<StatValue orientation='vertical' label='Movement' value={<IconValue value={this.props.combatant.combat.movement} type={IconType.Movement} size={IconSize.Large} />} />
							<StatValue orientation='vertical' label='Senses' value={this.props.combatant.combat.senses} />
							<StatValue orientation='vertical' label='Hidden' value={this.props.combatant.combat.hidden} />
						</div>
					</Box>
					<Box label='Health'>
						<div className='combat-stats-row'>
							<StatValue orientation='vertical' label='Damage' value={this.props.combatant.combat.damage} />
							<StatValue orientation='vertical' label='Wounds' value={<div className='wounds-section'>{woundsInRows}</div>} />
						</div>
					</Box>
					<ConditionsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
				</div>
			);
		} catch {
			return <div className='combat-stats-panel render-error' />;
		}
	};
}

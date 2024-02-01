import { IconHeartFilled, IconHeartOff } from '@tabler/icons-react';
import { Component } from 'react';
import { QuirkType } from '../../../enums/quirk-type';

import { TraitType } from '../../../enums/trait-type';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { Box, StatValue } from '../../controls';
import { ConditionsPanel } from '../conditions/conditions-panel';

import './combat-stats-panel.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
}

export class CombatStatsPanel extends Component<Props> {
	getHealth = () => {
		if (this.props.combatant.quirks.includes(QuirkType.Drone)) {
			return null;
		}

		let wounds: JSX.Element[] = [];
		const resolveRank = EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve);
		for (let n = 0; n < resolveRank; ++n) {
			wounds.push(n < this.props.combatant.combat.wounds ? <IconHeartOff key={n} size={25} /> : <IconHeartFilled key={n} className='heartbeat' size={25} />);
		}
		wounds.reverse();

		const woundsPerRow = (wounds.length === 5) || (wounds.length === 6) ? 3 : 4;
		const woundsInRows: JSX.Element[] = [];
		while (wounds.length > woundsPerRow) {
			woundsInRows.push(<div key={woundsInRows.length} className='wounds'>{wounds.slice(0, woundsPerRow)}</div>);
			wounds = wounds.slice(woundsPerRow);
		}
		if (wounds.length !== 0) {
			woundsInRows.push(<div key={woundsInRows.length} className='wounds'>{wounds}</div>);
		}

		return (
			<div className='combat-stats-row'>
				<StatValue orientation='vertical' label='Damage' value={this.props.combatant.combat.damage} />
				<StatValue orientation='vertical' label='Wounds' value={<div className='wounds-section'>{woundsInRows}</div>} />
			</div>
		);
	};

	render = () => {
		try {
			const health = this.getHealth();

			return (
				<div className='combat-stats-panel'>
					<Box label='Stats'>
						<div className='combat-stats-row'>
							<StatValue orientation='vertical' label='Senses' value={this.props.combatant.combat.senses} />
							<StatValue orientation='vertical' label='Hidden' value={this.props.combatant.combat.hidden} />
						</div>
						{health ? <hr /> : null}
						{health}
					</Box>
					<ConditionsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
				</div>
			);
		} catch {
			return <div className='combat-stats-panel render-error' />;
		}
	};
}

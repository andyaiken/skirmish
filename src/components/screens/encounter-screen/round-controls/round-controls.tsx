import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import type { EncounterModel } from '../../../../models/encounter';
import type { OptionsModel } from '../../../../models/options';

import { Box, Expander, StatValue, Text, TextType } from '../../../controls';

import './round-controls.scss';

interface Props {
	encounter: EncounterModel;
	options: OptionsModel;
	rollInitiative: (encounter: EncounterModel) => void;
}

export class RoundControls extends Component<Props> {
	render = () => {
		try {
			const heroesActive = this.props.encounter.combatants
				.filter(c => c.type === CombatantType.Hero)
				.filter(c => (c.combat.state === CombatantState.Standing) || (c.combat.state === CombatantState.Prone)).length;
			const heroesUnconscious = this.props.encounter.combatants
				.filter(c => c.type === CombatantType.Hero)
				.filter(c => c.combat.state === CombatantState.Unconscious).length;
			const heroesDead = this.props.encounter.combatants
				.filter(c => c.type === CombatantType.Hero)
				.filter(c => c.combat.state === CombatantState.Dead).length;
			const monstersActive = this.props.encounter.combatants
				.filter(c => c.type === CombatantType.Monster)
				.filter(c => (c.combat.state === CombatantState.Standing) || (c.combat.state === CombatantState.Prone)).length;
			const monstersUnconscious = this.props.encounter.combatants
				.filter(c => c.type === CombatantType.Monster)
				.filter(c => c.combat.state === CombatantState.Unconscious).length;
			const monstersDead = this.props.encounter.combatants
				.filter(c => c.type === CombatantType.Monster)
				.filter(c => c.combat.state === CombatantState.Dead).length;

			return (
				<div className='round-controls'>
					<Text type={TextType.Heading}>Round {this.props.encounter.round + 1}</Text>
					<div className='encounter-stats'>
						<Box label='Heroes'>
							<StatValue orientation='vertical' label='Active' value={heroesActive} />
							<hr />
							<StatValue orientation='vertical' label='Unconscious' value={heroesUnconscious} />
							<hr />
							<StatValue orientation='vertical' label='Dead' value={heroesDead} />
						</Box>
						<Box label='Monsters'>
							<StatValue orientation='vertical' label='Active' value={monstersActive} />
							<hr />
							<StatValue orientation='vertical' label='Unconscious' value={monstersUnconscious} />
							<hr />
							<StatValue orientation='vertical' label='Dead' value={monstersDead} />
						</Box>
					</div>
					<hr />
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>At the start of each turn, each combatant rolls initiative.</Text>
								}
								content={
									<div>
										<p>This determines the order they will act in for this round - higher goes first.</p>
										<p>Initiative is calculated using a combatant&apos;s <b>Reactions</b> skill rank.</p>
									</div>
								}
							/>
							: null
					}
					<button className='primary' onClick={() => this.props.rollInitiative(this.props.encounter)}>Roll Initiative</button>
				</div>
			);
		} catch {
			return <div className='round-controls render-error' />;
		}
	};
}

import { Component } from 'react';

import { DamageType } from '../../../../enums/damage-type';
import { SkillType } from '../../../../enums/skill-type';
import { TraitType } from '../../../../enums/trait-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';
import { GameLogic } from '../../../../logic/game-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { ConditionModel } from '../../../../models/condition';
import type { EncounterModel } from '../../../../models/encounter';

import { Box, StatValue, Tag, Text } from '../../../controls';
import { CombatStatsPanel } from '../../combat-stats/combat-stats-panel';

import './stats.scss';

interface Props {
	hero: CombatantModel;
	encounter: EncounterModel | null;
}

export class Stats extends Component<Props> {
	public render() {
		let conditions: ConditionModel[] = [];
		if (this.props.encounter) {
			conditions = ([] as ConditionModel[])
				.concat(this.props.hero.combat.conditions)
				.concat(EncounterLogic.getAuraConditions(this.props.encounter, this.props.hero));
		}

		let traitsSection = null;
		if (this.props.encounter) {
			traitsSection = (
				<CombatStatsPanel combatant={this.props.hero} encounter={this.props.encounter} standUp={null} scan={null} hide={null} />
			);
		} else {
			traitsSection = (
				<Box label='Traits'>
					<div className='stats-row'>
						<StatValue orientation='vertical' label='Endure' value={CombatantLogic.getTraitValue(this.props.hero, conditions, TraitType.Endurance)}/>
						<StatValue orientation='vertical' label='Resolve' value={CombatantLogic.getTraitValue(this.props.hero, conditions, TraitType.Resolve)}/>
						<StatValue orientation='vertical' label='Speed' value={CombatantLogic.getTraitValue(this.props.hero, conditions, TraitType.Speed)}/>
					</div>
				</Box>
			);
		}

		let proficiencySection = null;
		const profs = CombatantLogic.getProficiencies(this.props.hero);
		if (profs.length > 0) {
			proficiencySection = (
				<div>
					{profs.map((p, n) => (<Tag key={n}>{p}</Tag>))}
				</div>
			);
		} else {
			proficiencySection = (
				<div>
					<Text>None</Text>
				</div>
			);
		}

		let auraSection = null;
		const auras = CombatantLogic.getAuras(this.props.hero);
		if (auras.length > 0) {
			auraSection = (
				<div>
					{auras.map(a => (<StatValue key={a.id} label={GameLogic.getConditionDescription(a)} value={a.rank} />))}
				</div>
			);
		} else {
			auraSection = (
				<div>
					<Text>None</Text>
				</div>
			);
		}

		return (
			<div className='stats'>
				<div className='column'>
					{traitsSection}
					<Box label='Skills'>
						<StatValue label='Brawl' value={CombatantLogic.getSkillValue(this.props.hero, conditions, SkillType.Brawl)}/>
						<StatValue label='Perception' value={CombatantLogic.getSkillValue(this.props.hero, conditions, SkillType.Perception)}/>
						<StatValue label='Reactions' value={CombatantLogic.getSkillValue(this.props.hero, conditions, SkillType.Reactions)}/>
						<StatValue label='Spellcasting' value={CombatantLogic.getSkillValue(this.props.hero, conditions, SkillType.Spellcasting)}/>
						<StatValue label='Stealth' value={CombatantLogic.getSkillValue(this.props.hero, conditions, SkillType.Stealth)}/>
						<StatValue label='Weapon' value={CombatantLogic.getSkillValue(this.props.hero, conditions, SkillType.Weapon)}/>
					</Box>
				</div>
				<div className='column'>
					<Box label='Proficiencies'>
						{proficiencySection}
					</Box>
					<Box label='Auras'>
						{auraSection}
					</Box>
					<Box label='XP'>
						<StatValue label='Earned' value={this.props.hero.xp} />
						<StatValue label={`Required for level ${this.props.hero.level + 1}`} value={this.props.hero.level} />
					</Box>
				</div>
				<div className='column'>
					<Box label='Damage Bonuses'>
						<StatValue label='Acid' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Acid)}/>
						<StatValue label='Edged' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Edged)}/>
						<StatValue label='Impact' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Impact)}/>
						<StatValue label='Piercing' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Cold)}/>
						<StatValue label='Electricity' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Electricity)}/>
						<StatValue label='Fire' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Fire)}/>
						<StatValue label='Light' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Light)}/>
						<StatValue label='Sonic' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Decay)}/>
						<StatValue label='Poison' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Poison)}/>
						<StatValue label='Psychic' value={CombatantLogic.getDamageBonusValue(this.props.hero, conditions, DamageType.Psychic)}/>
					</Box>
				</div>
				<div className='column'>
					<Box label='Resistances'>
						<StatValue label='Acid' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Acid)}/>
						<StatValue label='Edged' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Edged)}/>
						<StatValue label='Impact' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Impact)}/>
						<StatValue label='Piercing' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Cold)}/>
						<StatValue label='Electricity' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Electricity)}/>
						<StatValue label='Fire' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Fire)}/>
						<StatValue label='Light' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Light)}/>
						<StatValue label='Sonic' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Decay)}/>
						<StatValue label='Poison' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Poison)}/>
						<StatValue label='Psychic' value={CombatantLogic.getDamageResistanceValue(this.props.hero, conditions, DamageType.Psychic)}/>
					</Box>
				</div>
			</div>
		);
	}
}

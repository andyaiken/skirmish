import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';
import { DamageType } from '../../../../enums/damage-type';
import { SkillType } from '../../../../enums/skill-type';
import { TraitType } from '../../../../enums/trait-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { ConditionLogic } from '../../../../logic/condition-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Box, IconType, IconValue, StatValue, Tag, Text, TextType } from '../../../controls';
import { CombatStatsPanel } from '../../combat-stats/combat-stats-panel';

import './stats.scss';

interface Props {
	hero: CombatantModel;
	encounter: EncounterModel | null;
}

export class Stats extends Component<Props> {
	getSkillRank = (skill: SkillType) => {
		if (this.props.encounter) {
			return EncounterLogic.getSkillRank(this.props.encounter, this.props.hero, skill);
		}

		return CombatantLogic.getSkillRank(this.props.hero, [], skill);
	};

	getDamageBonusValue = (damage: DamageType) => {
		if (this.props.encounter) {
			return EncounterLogic.getDamageBonus(this.props.encounter, this.props.hero, damage);
		}

		return CombatantLogic.getDamageBonus(this.props.hero, [], damage);
	};

	getDamageResistanceValue = (damage: DamageType) => {
		if (this.props.encounter) {
			return EncounterLogic.getDamageResistance(this.props.encounter, this.props.hero, damage);
		}

		return CombatantLogic.getDamageResistance(this.props.hero, [], damage);
	};

	render = () => {
		let traitsSection = null;
		if (this.props.encounter) {
			traitsSection = (
				<CombatStatsPanel combatant={this.props.hero} encounter={this.props.encounter} />
			);
		} else {
			traitsSection = (
				<Box label='Traits'>
					<div className='stats-row'>
						<StatValue orientation='vertical' label='Endure' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Endurance)}/>
						<StatValue orientation='vertical' label='Resolve' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Resolve)}/>
						<StatValue orientation='vertical' label='Speed' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Speed)}/>
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
					{
						auras.map(aura => {
							const affects = ConditionLogic.getConditionIsBeneficial(aura) ? 'allies' : 'enemies';
							const desc = `${ConditionLogic.getConditionDescription(aura)} (affects ${affects})`;
							return <StatValue key={aura.id} label={desc} value={aura.rank} />;
						})
					}
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
					{
						this.props.encounter && (this.props.hero.combat.state !== CombatantState.Standing) ?
							<Text type={TextType.Information}>{this.props.hero.name} is <b>{this.props.hero.combat.state}</b>.</Text>
							: null
					}
					{traitsSection}
					<Box label='Auras'>
						{auraSection}
					</Box>
				</div>
				<div className='column'>
					<Box label='Skills'>
						<StatValue label='Brawl' value={this.getSkillRank(SkillType.Brawl)}/>
						<StatValue label='Perception' value={this.getSkillRank(SkillType.Perception)}/>
						<StatValue label='Reactions' value={this.getSkillRank(SkillType.Reactions)}/>
						<StatValue label='Spellcasting' value={this.getSkillRank(SkillType.Spellcasting)}/>
						<StatValue label='Stealth' value={this.getSkillRank(SkillType.Stealth)}/>
						<StatValue label='Weapon' value={this.getSkillRank(SkillType.Weapon)}/>
					</Box>
					<Box label='Proficiencies'>
						{proficiencySection}
					</Box>
					{this.props.hero.type === CombatantType.Hero ? <Box label='XP'>
						<StatValue label='Earned' value={<IconValue type={IconType.XP} value={this.props.hero.xp} iconSize={12} />} />
						<StatValue label={`Required for level ${this.props.hero.level + 1}`} value={<IconValue type={IconType.XP} value={this.props.hero.level} iconSize={12} />} />
					</Box> : null}
				</div>
				<div className='column'>
					<Box label='Damage Bonuses'>
						<StatValue label='Acid' value={this.getDamageBonusValue(DamageType.Acid)}/>
						<StatValue label='Edged' value={this.getDamageBonusValue(DamageType.Edged)}/>
						<StatValue label='Impact' value={this.getDamageBonusValue(DamageType.Impact)}/>
						<StatValue label='Piercing' value={this.getDamageBonusValue(DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={this.getDamageBonusValue(DamageType.Cold)}/>
						<StatValue label='Electricity' value={this.getDamageBonusValue(DamageType.Electricity)}/>
						<StatValue label='Fire' value={this.getDamageBonusValue(DamageType.Fire)}/>
						<StatValue label='Light' value={this.getDamageBonusValue(DamageType.Light)}/>
						<StatValue label='Sonic' value={this.getDamageBonusValue(DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={this.getDamageBonusValue(DamageType.Decay)}/>
						<StatValue label='Poison' value={this.getDamageBonusValue(DamageType.Poison)}/>
						<StatValue label='Psychic' value={this.getDamageBonusValue(DamageType.Psychic)}/>
					</Box>
				</div>
				<div className='column'>
					<Box label='Resistances'>
						<StatValue label='Acid' value={this.getDamageResistanceValue(DamageType.Acid)}/>
						<StatValue label='Edged' value={this.getDamageResistanceValue(DamageType.Edged)}/>
						<StatValue label='Impact' value={this.getDamageResistanceValue(DamageType.Impact)}/>
						<StatValue label='Piercing' value={this.getDamageResistanceValue(DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={this.getDamageResistanceValue(DamageType.Cold)}/>
						<StatValue label='Electricity' value={this.getDamageResistanceValue(DamageType.Electricity)}/>
						<StatValue label='Fire' value={this.getDamageResistanceValue(DamageType.Fire)}/>
						<StatValue label='Light' value={this.getDamageResistanceValue(DamageType.Light)}/>
						<StatValue label='Sonic' value={this.getDamageResistanceValue(DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={this.getDamageResistanceValue(DamageType.Decay)}/>
						<StatValue label='Poison' value={this.getDamageResistanceValue(DamageType.Poison)}/>
						<StatValue label='Psychic' value={this.getDamageResistanceValue(DamageType.Psychic)}/>
					</Box>
				</div>
			</div>
		);
	};
}

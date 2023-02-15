import { Component } from 'react';
import { Tag, Text } from '../../../../controls';
import { getAuraDescription } from '../../../../models/aura';
import { DamageType } from '../../../../models/damage';
import { CombatantModel, getAuras, getDamageBonusValue, getDamageResistanceValue, getProficiencies, getSkillValue, getTraitValue } from '../../../../models/combatant';
import { SkillType } from '../../../../models/skill';
import { TraitType } from '../../../../models/trait';
import { Box, StatValue } from '../../../utility';

import './stats.scss';

interface Props {
	hero: CombatantModel;
}

export class Stats extends Component<Props> {
	public render() {
		let proficiencySection = null;
		const profs = getProficiencies(this.props.hero);
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
		const auras = getAuras(this.props.hero);
		if (auras.length > 0) {
			auraSection = (
				<div>
					{auras.map(a => (<StatValue key={a.id} label={getAuraDescription(a)} value={a.rank} />))}
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
					<Box label='Traits'>
						<div className='stats-row'>
							<StatValue orientation='vertical' label='Endure' value={getTraitValue(this.props.hero, TraitType.Endurance)}/>
							<StatValue orientation='vertical' label='Resolve' value={getTraitValue(this.props.hero, TraitType.Resolve)}/>
							<StatValue orientation='vertical' label='Speed' value={getTraitValue(this.props.hero, TraitType.Speed)}/>
						</div>
					</Box>
					<Box label='Skills'>
						<StatValue label='Brawl' value={getSkillValue(this.props.hero, SkillType.Brawl)}/>
						<StatValue label='Perception' value={getSkillValue(this.props.hero, SkillType.Perception)}/>
						<StatValue label='Reactions' value={getSkillValue(this.props.hero, SkillType.Reactions)}/>
						<StatValue label='Spellcasting' value={getSkillValue(this.props.hero, SkillType.Spellcasting)}/>
						<StatValue label='Stealth' value={getSkillValue(this.props.hero, SkillType.Stealth)}/>
						<StatValue label='Weapon' value={getSkillValue(this.props.hero, SkillType.Weapon)}/>
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
						<StatValue label='Acid' value={getDamageBonusValue(this.props.hero, DamageType.Acid)}/>
						<StatValue label='Edged' value={getDamageBonusValue(this.props.hero, DamageType.Edged)}/>
						<StatValue label='Impact' value={getDamageBonusValue(this.props.hero, DamageType.Impact)}/>
						<StatValue label='Piercing' value={getDamageBonusValue(this.props.hero, DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={getDamageBonusValue(this.props.hero, DamageType.Cold)}/>
						<StatValue label='Electricity' value={getDamageBonusValue(this.props.hero, DamageType.Electricity)}/>
						<StatValue label='Fire' value={getDamageBonusValue(this.props.hero, DamageType.Fire)}/>
						<StatValue label='Light' value={getDamageBonusValue(this.props.hero, DamageType.Light)}/>
						<StatValue label='Sonic' value={getDamageBonusValue(this.props.hero, DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={getDamageBonusValue(this.props.hero, DamageType.Decay)}/>
						<StatValue label='Poison' value={getDamageBonusValue(this.props.hero, DamageType.Poison)}/>
						<StatValue label='Psychic' value={getDamageBonusValue(this.props.hero, DamageType.Psychic)}/>
					</Box>
				</div>
				<div className='column'>
					<Box label='Resistances'>
						<StatValue label='Acid' value={getDamageResistanceValue(this.props.hero, DamageType.Acid)}/>
						<StatValue label='Edged' value={getDamageResistanceValue(this.props.hero, DamageType.Edged)}/>
						<StatValue label='Impact' value={getDamageResistanceValue(this.props.hero, DamageType.Impact)}/>
						<StatValue label='Piercing' value={getDamageResistanceValue(this.props.hero, DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={getDamageResistanceValue(this.props.hero, DamageType.Cold)}/>
						<StatValue label='Electricity' value={getDamageResistanceValue(this.props.hero, DamageType.Electricity)}/>
						<StatValue label='Fire' value={getDamageResistanceValue(this.props.hero, DamageType.Fire)}/>
						<StatValue label='Light' value={getDamageResistanceValue(this.props.hero, DamageType.Light)}/>
						<StatValue label='Sonic' value={getDamageResistanceValue(this.props.hero, DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={getDamageResistanceValue(this.props.hero, DamageType.Decay)}/>
						<StatValue label='Poison' value={getDamageResistanceValue(this.props.hero, DamageType.Poison)}/>
						<StatValue label='Psychic' value={getDamageResistanceValue(this.props.hero, DamageType.Psychic)}/>
					</Box>
				</div>
			</div>
		);
	}
}

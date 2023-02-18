import { Component } from 'react';
import { Tag, Text } from '../../../../controls';
import type { CombatantModel } from '../../../../models/combatant';
import { TraitType, SkillType, DamageType } from '../../../../enums/enums';
import { CombatantUtils } from '../../../../logic/combatant-utils';
import { Box, StatValue } from '../../../utility';

import './stats.scss';
import { GameLogic } from '../../../../logic/game-logic';

interface Props {
	hero: CombatantModel;
}

export class Stats extends Component<Props> {
	public render() {
		let proficiencySection = null;
		const profs = CombatantUtils.getProficiencies(this.props.hero);
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
		const auras = CombatantUtils.getAuras(this.props.hero);
		if (auras.length > 0) {
			auraSection = (
				<div>
					{auras.map(a => (<StatValue key={a.id} label={GameLogic.getAuraDescription(a)} value={a.rank} />))}
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
							<StatValue orientation='vertical' label='Endure' value={CombatantUtils.getTraitValue(this.props.hero, TraitType.Endurance)}/>
							<StatValue orientation='vertical' label='Resolve' value={CombatantUtils.getTraitValue(this.props.hero, TraitType.Resolve)}/>
							<StatValue orientation='vertical' label='Speed' value={CombatantUtils.getTraitValue(this.props.hero, TraitType.Speed)}/>
						</div>
					</Box>
					<Box label='Skills'>
						<StatValue label='Brawl' value={CombatantUtils.getSkillValue(this.props.hero, SkillType.Brawl)}/>
						<StatValue label='Perception' value={CombatantUtils.getSkillValue(this.props.hero, SkillType.Perception)}/>
						<StatValue label='Reactions' value={CombatantUtils.getSkillValue(this.props.hero, SkillType.Reactions)}/>
						<StatValue label='Spellcasting' value={CombatantUtils.getSkillValue(this.props.hero, SkillType.Spellcasting)}/>
						<StatValue label='Stealth' value={CombatantUtils.getSkillValue(this.props.hero, SkillType.Stealth)}/>
						<StatValue label='Weapon' value={CombatantUtils.getSkillValue(this.props.hero, SkillType.Weapon)}/>
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
						<StatValue label='Acid' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Acid)}/>
						<StatValue label='Edged' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Edged)}/>
						<StatValue label='Impact' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Impact)}/>
						<StatValue label='Piercing' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Cold)}/>
						<StatValue label='Electricity' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Electricity)}/>
						<StatValue label='Fire' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Fire)}/>
						<StatValue label='Light' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Light)}/>
						<StatValue label='Sonic' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Decay)}/>
						<StatValue label='Poison' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Poison)}/>
						<StatValue label='Psychic' value={CombatantUtils.getDamageBonusValue(this.props.hero, DamageType.Psychic)}/>
					</Box>
				</div>
				<div className='column'>
					<Box label='Resistances'>
						<StatValue label='Acid' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Acid)}/>
						<StatValue label='Edged' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Edged)}/>
						<StatValue label='Impact' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Impact)}/>
						<StatValue label='Piercing' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Piercing)}/>
						<hr />
						<StatValue label='Cold' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Cold)}/>
						<StatValue label='Electricity' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Electricity)}/>
						<StatValue label='Fire' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Fire)}/>
						<StatValue label='Light' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Light)}/>
						<StatValue label='Sonic' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Sonic)}/>
						<hr />
						<StatValue label='Decay' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Decay)}/>
						<StatValue label='Poison' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Poison)}/>
						<StatValue label='Psychic' value={CombatantUtils.getDamageResistanceValue(this.props.hero, DamageType.Psychic)}/>
					</Box>
				</div>
			</div>
		);
	}
}

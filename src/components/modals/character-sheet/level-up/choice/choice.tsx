import { Component } from 'react';

import { DamageCategoryType } from '../../../../../enums/damage-category-type';
import { DamageType } from '../../../../../enums/damage-type';
import { FeatureType } from '../../../../../enums/feature-type';
import { ItemProficiencyType } from '../../../../../enums/item-proficiency-type';
import { SkillCategoryType } from '../../../../../enums/skill-category-type';
import { SkillType } from '../../../../../enums/skill-type';
import { TraitType } from '../../../../../enums/trait-type';

import { CombatantLogic } from '../../../../../logic/combatant-logic';

import type { CombatantModel } from '../../../../../models/combatant';
import type { FeatureModel } from '../../../../../models/feature';

import { IconValue, Selector, Text, TextType } from '../../../../controls';

import './choice.scss';

interface Props {
	feature: FeatureModel;
	hero: CombatantModel;
	onSelect: (feature: FeatureModel | null) => void;
}

interface State {
	feature: FeatureModel;
}

export class ChoicePanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const feature = JSON.parse(JSON.stringify(props.feature)) as FeatureModel;
		this.state = {
			feature: feature
		};
	}

	selectTrait = (trait: TraitType) => {
		const feature = this.state.feature;
		feature.trait = trait;
		this.setState({
			feature: feature
		}, () => {
			this.props.onSelect(this.state.feature);
		});
	};

	selectSkill = (skill: SkillType) => {
		const feature = this.state.feature;
		feature.skill = skill;
		this.setState({
			feature: feature
		}, () => {
			this.props.onSelect(this.state.feature);
		});
	};

	selectSkillCategory = (category: SkillCategoryType) => {
		const feature = this.state.feature;
		feature.skillCategory = category;
		this.setState({
			feature: feature
		}, () => {
			this.props.onSelect(this.state.feature);
		});
	};

	selectProficiency = (proficiency: ItemProficiencyType) => {
		const feature = this.state.feature;
		feature.proficiency = proficiency;
		this.setState({
			feature: feature
		}, () => {
			this.props.onSelect(this.state.feature);
		});
	};

	selectDamage = (damage: DamageType) => {
		const feature = this.state.feature;
		feature.damage = damage;
		this.setState({
			feature: feature
		}, () => {
			this.props.onSelect(this.state.feature);
		});
	};

	selectDamageCategoryType = (category: DamageCategoryType) => {
		const feature = this.state.feature;
		feature.damageCategory = category;
		this.setState({
			feature: feature
		}, () => {
			this.props.onSelect(this.state.feature);
		});
	};

	getTrait = (trait: TraitType, delta: number) => {
		const rank = CombatantLogic.getTraitRank(this.props.hero, [], trait);
		return (
			<div>
				<div>{trait}</div>
				<div className='rank-info'>{rank} =&gt; {rank + delta}</div>
			</div>
		);
	};

	getSkill = (skill: SkillType, delta: number) => {
		const rank = CombatantLogic.getSkillRank(this.props.hero, [], skill);
		return (
			<div>
				<div>{skill}</div>
				<div className='rank-info'>{rank} =&gt; {rank + delta}</div>
			</div>
		);
	};

	render = () => {
		let choice = null;
		switch (this.state.feature.type) {
			case FeatureType.Trait:
				choice = (
					<Selector
						options={[
							{ id: TraitType.Endurance, display: this.getTrait(TraitType.Endurance, this.state.feature.rank) },
							{ id: TraitType.Resolve, display: this.getTrait(TraitType.Resolve, this.state.feature.rank) },
							{ id: TraitType.Speed, display: this.getTrait(TraitType.Speed, this.state.feature.rank) }
						]}
						selectedID={this.state.feature.trait}
						onSelect={id => this.selectTrait(id as TraitType)}
					/>
				);
				break;
			case FeatureType.Skill:
				choice = (
					<Selector
						options={[
							{ id: SkillType.Brawl, display: this.getSkill(SkillType.Brawl, this.state.feature.rank) },
							{ id: SkillType.Perception, display: this.getSkill(SkillType.Perception, this.state.feature.rank) },
							{ id: SkillType.Presence, display: this.getSkill(SkillType.Presence, this.state.feature.rank) },
							{ id: SkillType.Reactions, display: this.getSkill(SkillType.Reactions, this.state.feature.rank) },
							{ id: SkillType.Spellcasting, display: this.getSkill(SkillType.Spellcasting, this.state.feature.rank) },
							{ id: SkillType.Stealth, display: this.getSkill(SkillType.Stealth, this.state.feature.rank) },
							{ id: SkillType.Weapon, display: this.getSkill(SkillType.Weapon, this.state.feature.rank) }
						]}
						columnCount={3}
						selectedID={this.state.feature.skill}
						onSelect={id => this.selectSkill(id as SkillType)}
					/>
				);
				break;
			case FeatureType.SkillCategory:
				choice = (
					<Selector
						options={[
							{ id: SkillCategoryType.Physical },
							{ id: SkillCategoryType.Mental }
						]}
						selectedID={this.state.feature.skillCategory}
						onSelect={id => this.selectSkillCategory(id as SkillCategoryType)}
					/>
				);
				break;
			case FeatureType.Proficiency:
				choice = (
					<Selector
						options={[
							{ id: ItemProficiencyType.MilitaryWeapons },
							{ id: ItemProficiencyType.LargeWeapons },
							{ id: ItemProficiencyType.PairedWeapons },
							{ id: ItemProficiencyType.RangedWeapons },
							{ id: ItemProficiencyType.PowderWeapons },
							{ id: ItemProficiencyType.Implements },
							{ id: ItemProficiencyType.LightArmor },
							{ id: ItemProficiencyType.HeavyArmor },
							{ id: ItemProficiencyType.Shields }
						].filter(o => !CombatantLogic.getProficiencies(this.props.hero).includes(o.id))}
						columnCount={3}
						selectedID={this.state.feature.proficiency}
						onSelect={id => this.selectProficiency(id as ItemProficiencyType)}
					/>
				);
				break;
			case FeatureType.DamageBonus:
			case FeatureType.DamageResist:
				choice = (
					<Selector
						options={[
							{ id: DamageType.Acid, display: <IconValue type={DamageType.Acid} value='Acid' /> },
							{ id: DamageType.Edged, display: <IconValue type={DamageType.Edged} value='Edged' /> },
							{ id: DamageType.Impact, display: <IconValue type={DamageType.Impact} value='Impact' /> },
							{ id: DamageType.Piercing, display: <IconValue type={DamageType.Piercing} value='Piercing' /> },
							{ id: DamageType.Cold, display: <IconValue type={DamageType.Cold} value='Cold' /> },
							{ id: DamageType.Electricity, display: <IconValue type={DamageType.Electricity} value='Electricity' /> },
							{ id: DamageType.Fire, display: <IconValue type={DamageType.Fire} value='Fire' /> },
							{ id: DamageType.Light, display: <IconValue type={DamageType.Light} value='Light' /> },
							{ id: DamageType.Sonic, display: <IconValue type={DamageType.Sonic} value='Sonic' /> },
							{ id: DamageType.Decay, display: <IconValue type={DamageType.Decay} value='Decay' /> },
							{ id: DamageType.Poison, display: <IconValue type={DamageType.Poison} value='Poison' /> },
							{ id: DamageType.Psychic, display: <IconValue type={DamageType.Psychic} value='Psychic' /> }
						]}
						columnCount={3}
						selectedID={this.state.feature.damage}
						onSelect={id => this.selectDamage(id as DamageType)}
					/>
				);
				break;
			case FeatureType.DamageCategoryBonus:
			case FeatureType.DamageCategoryResist:
				choice = (
					<Selector
						options={[
							{ id: DamageCategoryType.Physical },
							{ id: DamageCategoryType.Energy },
							{ id: DamageCategoryType.Corruption }
						]}
						selectedID={this.state.feature.damageCategory}
						onSelect={id => this.selectDamageCategoryType(id as DamageCategoryType)}
					/>
				);
				break;
		}

		return (
			<div className='choice-page'>
				<Text type={TextType.MinorHeading}>Choose one:</Text>
				{choice}
				<button onClick={() => this.props.onSelect(null)}>Choose Again</button>
			</div>
		);
	};
}

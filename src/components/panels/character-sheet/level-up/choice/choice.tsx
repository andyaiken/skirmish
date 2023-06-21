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

import { IconValue, Selector } from '../../../../controls';

import './choice.scss';

interface Props {
	feature: FeatureModel;
	hero: CombatantModel;
	onChange: (feature: FeatureModel) => void;
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
			this.props.onChange(this.state.feature);
		});
	};

	selectSkill = (skill: SkillType) => {
		const feature = this.state.feature;
		feature.skill = skill;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	};

	selectSkillCategory = (category: SkillCategoryType) => {
		const feature = this.state.feature;
		feature.skillCategory = category;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	};

	selectProficiency = (proficiency: ItemProficiencyType) => {
		const feature = this.state.feature;
		feature.proficiency = proficiency;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	};

	selectDamage = (damage: DamageType) => {
		const feature = this.state.feature;
		feature.damage = damage;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	};

	selectDamageCategoryType = (category: DamageCategoryType) => {
		const feature = this.state.feature;
		feature.damageCategory = category;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	};

	render = () => {
		let choice = null;
		switch (this.state.feature.type) {
			case FeatureType.Trait:
				choice = (
					<div>
						<Selector
							options={[
								{ id: TraitType.Endurance },
								{ id: TraitType.Resolve },
								{ id: TraitType.Speed }
							]}
							selectedID={this.state.feature.trait}
							onSelect={id => this.selectTrait(id as TraitType)}
						/>
					</div>
				);
				break;
			case FeatureType.Skill:
				choice = (
					<div>
						<Selector
							options={[
								{ id: SkillType.Brawl },
								{ id: SkillType.Perception },
								{ id: SkillType.Presence },
								{ id: SkillType.Reactions },
								{ id: SkillType.Spellcasting },
								{ id: SkillType.Stealth },
								{ id: SkillType.Weapon }
							]}
							columnCount={4}
							selectedID={this.state.feature.skill}
							onSelect={id => this.selectSkill(id as SkillType)}
						/>
					</div>
				);
				break;
			case FeatureType.SkillCategory:
				choice = (
					<div>
						<Selector
							options={[
								{ id: SkillCategoryType.Physical },
								{ id: SkillCategoryType.Mental }
							]}
							selectedID={this.state.feature.skillCategory}
							onSelect={id => this.selectSkillCategory(id as SkillCategoryType)}
						/>
					</div>
				);
				break;
			case FeatureType.Proficiency: {
				const got = CombatantLogic.getProficiencies(this.props.hero);
				choice = (
					<div>
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
							].filter(o => !got.includes(o.id))}
							columnCount={5}
							selectedID={this.state.feature.proficiency}
							onSelect={id => this.selectProficiency(id as ItemProficiencyType)}
						/>
					</div>
				);
				break;
			}
			case FeatureType.DamageBonus:
			case FeatureType.DamageResist:
				choice = (
					<div>
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
							columnCount={6}
							selectedID={this.state.feature.damage}
							onSelect={id => this.selectDamage(id as DamageType)}
						/>
					</div>
				);
				break;
			case FeatureType.DamageCategoryBonus:
			case FeatureType.DamageCategoryResist:
				choice = (
					<div>
						<Selector
							options={[
								{ id: DamageCategoryType.Physical },
								{ id: DamageCategoryType.Energy },
								{ id: DamageCategoryType.Corruption }
							]}
							selectedID={this.state.feature.damageCategory}
							onSelect={id => this.selectDamageCategoryType(id as DamageCategoryType)}
						/>
					</div>
				);
				break;
		}

		return (
			<div className='choice-page'>
				{choice}
			</div>
		);
	};
}
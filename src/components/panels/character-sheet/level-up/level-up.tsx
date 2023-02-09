import { Component } from 'react';
import { Selector, Text, TextType } from '../../../../controls';
import { DamageCategory, DamageType } from '../../../../models/damage';
import { FeatureModel, FeatureType, hasChoice } from '../../../../models/feature';
import { getProficiencies, HeroModel } from '../../../../models/hero';
import { ItemProficiency } from '../../../../models/item-proficiency';
import { Skill, SkillCategory } from '../../../../models/skill';
import { Trait } from '../../../../models/trait';
import { FeatureCard } from '../../../cards';
import { CardList, PlayingCard, PlayingCardSide } from '../../../utility';

import './level-up.scss';

interface Props {
	hero: HeroModel;
	features: FeatureModel[];
	levelUp: (feature: FeatureModel) => void;
}

interface State {
	selectedFeature: FeatureModel | null;
}

export class LevelUp extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedFeature: null
		};
	}

	setFeature = (feature: FeatureModel) => {
		this.setState({
			selectedFeature: feature
		});
	}

	levelUp = () => {
		const feature = this.state.selectedFeature as FeatureModel;

		this.setState({
			selectedFeature: null
		}, () => {
			this.props.levelUp(feature);
		});
	}

	public render() {
		const featureCards = this.props.features.map(feature => {
			return (
				<div key={feature.id}>
					<PlayingCard
						front={<FeatureCard feature={(this.state.selectedFeature !== null) && (this.state.selectedFeature.id === feature.id) ? this.state.selectedFeature : feature} />}
						back='Feature'
						display={(this.state.selectedFeature !== null) && (this.state.selectedFeature.id !== feature.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
						onClick={() => {
							if (this.state.selectedFeature === null) {
								this.setState({
									selectedFeature: feature
								});
							}
						}}
					/>
				</div>
			);
		});

		let choice = null;
		let canFinish = false;
		if (this.state.selectedFeature !== null) {
			choice = hasChoice(this.state.selectedFeature) ? <ChoicePanel feature={this.state.selectedFeature} hero={this.props.hero} onChange={this.setFeature} /> : null;
			canFinish = !hasChoice(this.state.selectedFeature);
		}

		return (
			<div className='level-up'>
				<div className='content'>
					<Text type={TextType.SubHeading}>Choose a feature for level {this.props.hero.level + 1}</Text>
					<CardList cards={featureCards} />
					{choice}
				</div>
				<div className='footer'>
					<button disabled={!canFinish} onClick={this.levelUp}>Level Up</button>
				</div>
			</div>
		);
	}
}

//#endregion

//#region Choice

interface ChoicePanelProps {
	feature: FeatureModel;
	hero: HeroModel;
	onChange: (feature: FeatureModel) => void;
}

interface ChoicePanelState {
	feature: FeatureModel;
}

class ChoicePanel extends Component<ChoicePanelProps, ChoicePanelState> {
	constructor(props: ChoicePanelProps) {
		super(props);

		const feature = JSON.parse(JSON.stringify(props.feature)) as FeatureModel;
		this.state = {
			feature: feature
		};
	}

	selectTrait = (trait: Trait) => {
		const feature = this.state.feature;
		feature.trait = trait;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	}

	selectSkill = (skill: Skill) => {
		const feature = this.state.feature;
		feature.skill = skill;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	}

	selectSkillCategory = (category: SkillCategory) => {
		const feature = this.state.feature;
		feature.skillCategory = category;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	}

	selectProficiency = (proficiency: ItemProficiency) => {
		const feature = this.state.feature;
		feature.proficiency = proficiency;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	}

	selectDamage = (damage: DamageType) => {
		const feature = this.state.feature;
		feature.damage = damage;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	}

	selectDamageCategory = (category: DamageCategory) => {
		const feature = this.state.feature;
		feature.damageCategory = category;
		this.setState({
			feature: feature
		}, () => {
			this.props.onChange(this.state.feature);
		});
	}

	render = () => {
		let choice = null;
		switch (this.state.feature.type) {
			case FeatureType.Trait:
				choice = (
					<div>
						<Selector
							options={[
								{ id: Trait.Endurance },
								{ id: Trait.Resolve },
								{ id: Trait.Speed }
							]}
							selectedID={this.state.feature.trait}
							onSelect={id => this.selectTrait(id as Trait)}
						/>
					</div>
				);
				break;
			case FeatureType.Skill:
				choice = (
					<div>
						<Selector
							options={[
								{ id: Skill.Athletics },
								{ id: Skill.Brawl },
								{ id: Skill.Perception },
								{ id: Skill.Reactions },
								{ id: Skill.Spellcasting },
								{ id: Skill.Stealth },
								{ id: Skill.Weapon }
							]}
							selectedID={this.state.feature.skill}
							onSelect={id => this.selectSkill(id as Skill)}
						/>
					</div>
				);
				break;
			case FeatureType.SkillCategory:
				choice = (
					<div>
						<Selector
							options={[
								{ id: SkillCategory.Physical },
								{ id: SkillCategory.Mental }
							]}
							selectedID={this.state.feature.skillCategory}
							onSelect={id => this.selectSkillCategory(id as SkillCategory)}
						/>
					</div>
				);
				break;
			case FeatureType.Proficiency: {
				const got = getProficiencies(this.props.hero);
				choice = (
					<div>
						<Selector
							options={[
								{ id: ItemProficiency.MilitaryWeapons },
								{ id: ItemProficiency.LargeWeapons },
								{ id: ItemProficiency.PairedWeapons },
								{ id: ItemProficiency.RangedWeapons },
								{ id: ItemProficiency.PowderWeapons },
								{ id: ItemProficiency.Implements },
								{ id: ItemProficiency.LightArmor },
								{ id: ItemProficiency.HeavyArmor },
								{ id: ItemProficiency.Shields }
							].filter(o => !got.includes(o.id))}
							selectedID={this.state.feature.proficiency}
							onSelect={id => this.selectProficiency(id as ItemProficiency)}
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
								{ id: DamageType.Acid },
								{ id: DamageType.Edged },
								{ id: DamageType.Impact },
								{ id: DamageType.Piercing },
								{ id: DamageType.Cold },
								{ id: DamageType.Electricity },
								{ id: DamageType.Fire },
								{ id: DamageType.Light },
								{ id: DamageType.Sonic },
								{ id: DamageType.Decay },
								{ id: DamageType.Poison },
								{ id: DamageType.Psychic }
							]}
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
								{ id: DamageCategory.Physical },
								{ id: DamageCategory.Energy },
								{ id: DamageCategory.Corruption }
							]}
							selectedID={this.state.feature.damageCategory}
							onSelect={id => this.selectDamageCategory(id as DamageCategory)}
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
	}
}

//#endregion

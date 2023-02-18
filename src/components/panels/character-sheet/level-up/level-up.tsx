import { Component } from 'react';
import { Selector, Text, TextType } from '../../../../controls';
import { TraitType, SkillType, SkillCategoryType, ItemProficiencyType, DamageType, DamageCategoryType, FeatureType } from '../../../../models/enums';
import { FeatureModel } from '../../../../models/feature';
import { CombatantModel } from '../../../../models/combatant';
import { FeatureCard, PlaceholderCard } from '../../../cards';
import { CardList, PlayingCard, PlayingCardSide } from '../../../utility';

import './level-up.scss';
import { FeatureUtils } from '../../../../logic/feature-utils';
import { CombatantUtils } from '../../../../logic/combatant-utils';

interface Props {
	hero: CombatantModel;
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
	};

	levelUp = () => {
		const feature = this.state.selectedFeature as FeatureModel;

		this.setState({
			selectedFeature: null
		}, () => {
			this.props.levelUp(feature);
		});
	};

	public render() {
		const featureCards = this.props.features.map(feature => {
			const source = CombatantUtils.getCardSource(this.props.hero, feature.id, 'feature');
			return (
				<div key={feature.id}>
					<PlayingCard
						front={<FeatureCard feature={(this.state.selectedFeature !== null) && (this.state.selectedFeature.id === feature.id) ? this.state.selectedFeature : feature} />}
						back={<PlaceholderCard text='Feature' />}
						footer={source}
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
			choice = FeatureUtils.hasChoice(this.state.selectedFeature) ? <ChoicePanel feature={this.state.selectedFeature} hero={this.props.hero} onChange={this.setFeature} /> : null;
			canFinish = !FeatureUtils.hasChoice(this.state.selectedFeature);
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
	hero: CombatantModel;
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
		feature.DamageCategoryType = category;
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
								{ id: SkillType.Reactions },
								{ id: SkillType.Spellcasting },
								{ id: SkillType.Stealth },
								{ id: SkillType.Weapon }
							]}
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
				const got = CombatantUtils.getProficiencies(this.props.hero);
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
			case FeatureType.DamageCategoryTypeBonus:
			case FeatureType.DamageCategoryTypeResist:
				choice = (
					<div>
						<Selector
							options={[
								{ id: DamageCategoryType.Physical },
								{ id: DamageCategoryType.Energy },
								{ id: DamageCategoryType.Corruption }
							]}
							selectedID={this.state.feature.DamageCategoryType}
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

//#endregion

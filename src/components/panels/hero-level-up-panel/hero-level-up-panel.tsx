import { Component } from 'react';
import { Selector } from '../../../controls';
import { DamageCategory, DamageType } from '../../../models/damage';
import { Feature, FeatureType, hasChoice } from '../../../models/feature';
import { featureDeck, Hero } from '../../../models/hero';
import { Proficiency } from '../../../models/proficiency';
import { Skill, SkillCategory } from '../../../models/skill';
import { Trait } from '../../../models/trait';
import { shuffle } from '../../../utils/collections';
import { FeatureCard } from '../../cards';
import { CardList, PlayingCard, PlayingCardSide, Text, TextType } from '../../utility';

import './hero-level-up-panel.scss';

interface Props {
	hero: Hero;
	finished: (trait: Trait, skill: Skill, feature: Feature) => void;
}

interface State {
	selectedTrait: Trait;
	selectedSkill: Skill;
	selectedFeature: Feature | null;
}

export class HeroLevelUpPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedTrait: Trait.Any,
			selectedSkill: Skill.Any,
			selectedFeature: null
		};
	}

	public render() {
		const traitOK = (this.state.selectedTrait !== Trait.Any);
		const skillOK = (this.state.selectedSkill !== Skill.Any);
		const featureOK = (this.state.selectedFeature !== null) && !hasChoice(this.state.selectedFeature);
		const canFinish = traitOK && skillOK && featureOK;

		return (
			<div>
				<Text type={TextType.Heading}>Level Up</Text>
				<Text>Choose a <b>trait</b> to increment:</Text>
				<SelectTraitPanel trait={this.state.selectedTrait} onSelect={trait => this.setState({ selectedTrait: trait })} />
				<Text>Choose a <b>skill</b> to increment:</Text>
				<SelectSkillPanel skill={this.state.selectedSkill} onSelect={skill => this.setState({ selectedSkill: skill })} />
				<Text>Choose a <b>feature</b>:</Text>
				<SelectFeaturePanel
					hero={this.props.hero}
					feature={this.state.selectedFeature}
					onSelect={feature => {
						if (this.state.selectedFeature === null) {
							this.setState({
								selectedFeature: feature
							});
						}
					}}
					onSelectDamageCategory={damageCategory => {
						const feature = this.state.selectedFeature;
						if (feature) {
							feature.damageCategory = damageCategory;
							this.setState({
								selectedFeature: feature
							});
						}
					}}
					onSelectDamageType={damage => {
						const feature = this.state.selectedFeature;
						if (feature) {
							feature.damage = damage;
							this.setState({
								selectedFeature: feature
							});
						}
					}}
					onSelectProficiency={proficiency => {
						const feature = this.state.selectedFeature;
						if (feature) {
							feature.proficiency = proficiency;
							this.setState({
								selectedFeature: feature
							});
						}
					}}
					onSelectSkill={skill => {
						const feature = this.state.selectedFeature;
						if (feature) {
							feature.skill = skill;
							this.setState({
								selectedFeature: feature
							});
						}
					}}
					onSelectSkillCategory={skillCategory => {
						const feature = this.state.selectedFeature;
						if (feature) {
							feature.skillCategory = skillCategory;
							this.setState({
								selectedFeature: feature
							});
						}
					}}
					onSelectTrait={trait => {
						const feature = this.state.selectedFeature;
						if (feature) {
							feature.trait = trait;
							this.setState({
								selectedFeature: feature
							});
						}
					}}
				/>
				<button disabled={!canFinish} onClick={() => this.props.finished(this.state.selectedTrait, this.state.selectedSkill, this.state.selectedFeature as Feature)}>
					OK
				</button>
			</div>
		);
	}
}

interface SelectTraitPanelProps {
	trait: Trait | undefined;
	onSelect: (trait: Trait) => void;
}

class SelectTraitPanel extends Component<SelectTraitPanelProps> {
	public static defaultProps = {
		trait: undefined
	};

	public render() {
		return (
			<div>
				<Selector
					options={[
						{ id: Trait.Endurance },
						{ id: Trait.Resolve },
						{ id: Trait.Speed }
					]}
					selectedID={this.props.trait}
					onSelect={id => this.props.onSelect(id as Trait)}
				/>
			</div>
		);
	}
}

interface SelectSkillPanelProps {
	skill: Skill;
	onSelect: (skill: Skill) => void;
}

class SelectSkillPanel extends Component<SelectSkillPanelProps> {
	public static defaultProps = {
		skill: undefined
	};

	public render() {
		return (
			<div>
				<Selector
					options={[
						{ id: Skill.Athletics },
						{ id: Skill.Brawl },
						{ id: Skill.Perception },
						{ id: Skill.Reactions },
						{ id: Skill.Spellcasting },
						{ id: Skill.Stealth },
						{ id: Skill.Weapon },
					]}
					selectedID={this.props.skill}
					onSelect={id => this.props.onSelect(id as Skill)}
				/>
			</div>
		);
	}
}

interface SelectSkillCategoryPanelProps {
	skillCategory: SkillCategory;
	onSelect: (skillCategory: SkillCategory) => void;
}

class SelectSkillCategoryPanel extends Component<SelectSkillCategoryPanelProps> {
	public static defaultProps = {
		skillCategory: undefined
	};

	public render() {
		return (
			<div>
				<Selector
					options={[
						{ id: SkillCategory.Physical },
						{ id: SkillCategory.Mental }
					]}
					selectedID={this.props.skillCategory}
					onSelect={id => this.props.onSelect(id as SkillCategory)}
				/>
			</div>
		);
	}
}

interface SelectProficiencyPanelProps {
	proficiency: Proficiency;
	onSelect: (proficiency: Proficiency) => void;
}

class SelectProficiencyPanel extends Component<SelectProficiencyPanelProps> {
	public static defaultProps = {
		proficiency: undefined
	};

	public render() {
		return (
			<div>
				<Selector
					options={[
						{ id: Proficiency.MilitaryWeapons },
						{ id: Proficiency.LargeWeapons },
						{ id: Proficiency.PairedWeapons },
						{ id: Proficiency.RangedWeapons },
						{ id: Proficiency.PowderWeapons },
						{ id: Proficiency.Implements },
						{ id: Proficiency.LightArmor },
						{ id: Proficiency.HeavyArmor },
						{ id: Proficiency.Shields }
					]}
					selectedID={this.props.proficiency}
					onSelect={id => this.props.onSelect(id as Proficiency)}
				/>
			</div>
		);
	}
}

interface SelectDamagePanelProps {
	damage: DamageType;
	onSelect: (damage: DamageType) => void;
}

class SelectDamagePanel extends Component<SelectDamagePanelProps> {
	public static defaultProps = {
		damage: undefined
	};

	public render() {
		return (
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
					selectedID={this.props.damage}
					onSelect={id => this.props.onSelect(id as DamageType)}
				/>
			</div>
		);
	}
}

interface SelectDamageCategoryPanelProps {
	damageCategory: DamageCategory;
	onSelect: (damageCategory: DamageCategory) => void;
}

class SelectDamageCategoryPanel extends Component<SelectDamageCategoryPanelProps> {
	public static defaultProps = {
		damageCategory: undefined
	};

	public render() {
		return (
			<div>
				<Selector
					options={[
						{ id: DamageCategory.Physical },
						{ id: DamageCategory.Energy },
						{ id: DamageCategory.Corruption }
					]}
					selectedID={this.props.damageCategory}
					onSelect={id => this.props.onSelect(id as DamageCategory)}
				/>
			</div>
		);
	}
}

interface SelectFeaturePanelProps {
	hero: Hero;
	feature: Feature | null;
	onSelect: (feature: Feature) => void;
	onSelectDamageType: (damageType: DamageType) => void;
	onSelectDamageCategory: (damageCategory: DamageCategory) => void;
	onSelectProficiency: (proficiency: Proficiency) => void;
	onSelectSkill: (skill: Skill) => void;
	onSelectSkillCategory: (skillCategory: SkillCategory) => void;
	onSelectTrait: (trait: Trait) => void;
}

interface SelectFeaturePanelState {
	features: Feature[];
}

class SelectFeaturePanel extends Component<SelectFeaturePanelProps, SelectFeaturePanelState> {
	constructor(props: SelectFeaturePanelProps) {
		super(props);

		const features = shuffle(featureDeck(props.hero)).splice(0, 3);
		this.state = {
			features: features
		};
	}

	public render() {
		let extra: JSX.Element | null = null;
		if (this.props.feature) {
			switch (this.props.feature.type) {
				case FeatureType.DamageBonus:
				case FeatureType.DamageResist:
					if (this.props.feature.damage === DamageType.Any) {
						extra = (
							<SelectDamagePanel onSelect={d => this.props.onSelectDamageType(d)} />
						);
					}
					break;
				case FeatureType.DamageCategoryBonus:
				case FeatureType.DamageCategoryResist:
					if (this.props.feature.damageCategory === DamageCategory.Any) {
						extra = (
							<SelectDamageCategoryPanel onSelect={dc => this.props.onSelectDamageCategory(dc)} />
						);
					}
					break;
				case FeatureType.Proficiency:
					if (this.props.feature.proficiency === Proficiency.Any) {
						extra = (
							<SelectProficiencyPanel onSelect={p => this.props.onSelectProficiency(p)} />
						);
					}
					break;
				case FeatureType.Skill:
					if (this.props.feature.skill === Skill.Any) {
						extra = (
							<SelectSkillPanel onSelect={s => this.props.onSelectSkill(s)} />
						);
					}
					break;
				case FeatureType.SkillCategory:
					if (this.props.feature.skillCategory === SkillCategory.Any) {
						extra = (
							<SelectSkillCategoryPanel onSelect={sc => this.props.onSelectSkillCategory(sc)} />
						);
					}
					break;
				case FeatureType.Trait:
					if (this.props.feature.trait === Trait.Any) {
						extra = (
							<SelectTraitPanel onSelect={t => this.props.onSelectTrait(t)} />
						);
					}
					break;
			}
		}

		const featureCards = this.state.features.map(feature => {
			return (
				<div key={feature.id}>
					<PlayingCard
						front={(extra !== null) && (this.props.feature !== null) && (feature.id === this.props.feature.id) ? extra : <FeatureCard feature={feature} />}
						back='Feature'
						display={(this.props.feature !== null) && (this.props.feature.id !== feature.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
						onClick={() => this.props.onSelect(feature)}
					/>
				</div>
			);
		});

		return (
			<div className='hero-level-up-panel'>
				<CardList cards={featureCards} />
			</div>
		);
	}
}

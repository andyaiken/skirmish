import { Button, Col, Divider, Radio, Row, Typography } from 'antd';
import React from 'react';
import { DamageCategory, DamageType } from '../../models/damage';
import { Feature, FeatureHelper, FeatureType } from '../../models/feature';
import { Hero, HeroHelper } from '../../models/hero';
import { Proficiency } from '../../models/proficiency';
import { Skill, SkillCategory } from '../../models/skill';
import { Trait } from '../../models/trait';
import { Utils } from '../../utils/utils';
import { Align } from '../utility/align';
import { PlayingCard } from '../utility/playing-card';

interface Props {
	hero: Hero;
	finished: (trait: Trait, skill: Skill, feature: Feature) => void;
}

interface State {
	selectedTrait: Trait;
	selectedSkill: Skill;
	selectedFeature: Feature | null;
}

export class HeroLevelUpPanel extends React.Component<Props, State> {
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
		const featureOK = (this.state.selectedFeature !== null) && !FeatureHelper.hasChoice(this.state.selectedFeature);
		const canFinish = traitOK && skillOK && featureOK;

		return (
			<div>
				<Typography.Paragraph>
					Choose a <b>trait</b> to increment:
				</Typography.Paragraph>
				<SelectTraitPanel onSelect={trait => this.setState({ selectedTrait: trait })} />
				<Divider/>
				<Typography.Paragraph>
					Choose a <b>skill</b> to increment:
				</Typography.Paragraph>
				<SelectSkillPanel onSelect={skill => this.setState({ selectedSkill: skill })} />
				<Divider/>
				<Typography.Paragraph>
					Choose a <b>feature</b>:
				</Typography.Paragraph>
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
				<Divider/>
				<Button block={true} type='primary' disabled={!canFinish} onClick={() => this.props.finished(this.state.selectedTrait, this.state.selectedSkill, this.state.selectedFeature as Feature)}>
					OK
				</Button>
			</div>
		);
	}
}

interface SelectTraitPanelProps {
	onSelect: (trait: Trait) => void;
}

class SelectTraitPanel extends React.Component<SelectTraitPanelProps> {
	public render() {
		return (
			<div>
				<Radio.Group buttonStyle='solid' onChange={e => this.props.onSelect(e.target.value)}>
					<Radio.Button value={Trait.Endurance}>Endurance</Radio.Button>
					<Radio.Button value={Trait.Resolve}>Resolve</Radio.Button>
					<Radio.Button value={Trait.Speed}>Speed</Radio.Button>
				</Radio.Group>
			</div>
		);
	}
}

interface SelectSkillPanelProps {
	onSelect: (skill: Skill) => void;
}

class SelectSkillPanel extends React.Component<SelectSkillPanelProps> {
	public render() {
		return (
			<div>
				<Radio.Group buttonStyle='solid' onChange={e => this.props.onSelect(e.target.value)}>
					<Radio.Button value={Skill.Athletics}>Athletics</Radio.Button>
					<Radio.Button value={Skill.Brawl}>Brawl</Radio.Button>
					<Radio.Button value={Skill.Perception}>Perception</Radio.Button>
					<Radio.Button value={Skill.Reactions}>Reactions</Radio.Button>
					<Radio.Button value={Skill.Spellcasting}>Spellcasting</Radio.Button>
					<Radio.Button value={Skill.Stealth}>Stealth</Radio.Button>
					<Radio.Button value={Skill.Weapon}>Weapon</Radio.Button>
				</Radio.Group>
			</div>
		);
	}
}

interface SelectSkillCategoryPanelProps {
	onSelect: (skillCategory: SkillCategory) => void;
}

class SelectSkillCategoryPanel extends React.Component<SelectSkillCategoryPanelProps> {
	public render() {
		return (
			<div>
				<Radio.Group buttonStyle='solid' onChange={e => this.props.onSelect(e.target.value)}>
					<Radio.Button value={SkillCategory.Physical}>Physical skills</Radio.Button>
					<Radio.Button value={SkillCategory.Mental}>Mental skills</Radio.Button>
				</Radio.Group>
			</div>
		);
	}
}

interface SelectProficiencyPanelProps {
	onSelect: (proficiency: Proficiency) => void;
}

class SelectProficiencyPanel extends React.Component<SelectProficiencyPanelProps> {
	public render() {
		return (
			<div>
				<Radio.Group buttonStyle='solid' onChange={e => this.props.onSelect(e.target.value)}>
					<Radio.Button value={Proficiency.MilitaryWeapons}>Military weapons</Radio.Button>
					<Radio.Button value={Proficiency.LargeWeapons}>Large weapons</Radio.Button>
					<Radio.Button value={Proficiency.PairedWeapons}>Paired weapons</Radio.Button>
					<Radio.Button value={Proficiency.RangedWeapons}>Ranged weapons</Radio.Button>
					<Radio.Button value={Proficiency.PowderWeapons}>Powder weapons</Radio.Button>
					<Radio.Button value={Proficiency.Implements}>Implements</Radio.Button>
					<Radio.Button value={Proficiency.LightArmor}>Light armor</Radio.Button>
					<Radio.Button value={Proficiency.HeavyArmor}>Heavy armor</Radio.Button>
					<Radio.Button value={Proficiency.Shields}>Shields</Radio.Button>
				</Radio.Group>
			</div>
		);
	}
}

interface SelectDamagePanelProps {
	onSelect: (damage: DamageType) => void;
}

class SelectDamagePanel extends React.Component<SelectDamagePanelProps> {
	public render() {
		return (
			<div>
				<Radio.Group buttonStyle='solid' onChange={e => this.props.onSelect(e.target.value)}>
					<Radio.Button value={DamageType.Acid}>Acid</Radio.Button>
					<Radio.Button value={DamageType.Edged}>Edged</Radio.Button>
					<Radio.Button value={DamageType.Impact}>Impact</Radio.Button>
					<Radio.Button value={DamageType.Piercing}>Piercing</Radio.Button>
					<Radio.Button value={DamageType.Cold}>Cold</Radio.Button>
					<Radio.Button value={DamageType.Electricity}>Electricity</Radio.Button>
					<Radio.Button value={DamageType.Fire}>Fire</Radio.Button>
					<Radio.Button value={DamageType.Light}>Light</Radio.Button>
					<Radio.Button value={DamageType.Sonic}>Sonic</Radio.Button>
					<Radio.Button value={DamageType.Decay}>Decay</Radio.Button>
					<Radio.Button value={DamageType.Poison}>Poison</Radio.Button>
					<Radio.Button value={DamageType.Psychic}>Psychic</Radio.Button>
				</Radio.Group>
			</div>
		);
	}
}

interface SelectDamageCategoryPanelProps {
	onSelect: (damageCategory: DamageCategory) => void;
}

class SelectDamageCategoryPanel extends React.Component<SelectDamageCategoryPanelProps> {
	public render() {
		return (
			<div>
				<Radio.Group buttonStyle='solid' onChange={e => this.props.onSelect(e.target.value)}>
					<Radio.Button value={DamageCategory.Physical}>Physical damage</Radio.Button>
					<Radio.Button value={DamageCategory.Energy}>Energy damage</Radio.Button>
					<Radio.Button value={DamageCategory.Corruption}>Corruption damage</Radio.Button>
				</Radio.Group>
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

class SelectFeaturePanel extends React.Component<SelectFeaturePanelProps, SelectFeaturePanelState> {
	constructor(props: SelectFeaturePanelProps) {
		super(props);
		this.state = {
			features: Utils.shuffle(HeroHelper.featureDeck(props.hero)).splice(0, 3)
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
				<Col span={8} key={feature.id}>
					<PlayingCard
						back='Feature'
						display={(this.props.feature !== null) && (this.props.feature.id !== feature.id) ? 'back' : 'front'}
						onClick={() => this.props.onSelect(feature)}
					>
						<Align>
							{(extra !== null) && (this.props.feature !== null) && (feature.id === this.props.feature.id) ? extra : FeatureHelper.getName(feature)}
						</Align>
					</PlayingCard>
				</Col>
			);
		});

		return (
			<div className='hero-level-up'>
				<Row gutter={10}>
					{featureCards}
				</Row>
			</div>
		);
	}
}

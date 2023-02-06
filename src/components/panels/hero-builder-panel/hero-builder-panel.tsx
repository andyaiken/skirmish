import { Component } from 'react';
import { Selector, Tag } from '../../../controls';
import { getBackground, getBackgroundDeck } from '../../../models/background';
import { DamageCategory, DamageType } from '../../../models/damage';
import { createProficiencyFeature, createSkillFeature, createTraitFeature, Feature, FeatureType, getFeatureDescription, getFeatureTitle, hasChoice } from '../../../models/feature';
import { Game } from '../../../models/game';
import { getFeatureDeck, getProficiencies, Hero } from '../../../models/hero';
import { getItem, getItems, Item } from '../../../models/item';
import { Proficiency } from '../../../models/proficiency';
import { getRole, getRoleDeck } from '../../../models/role';
import { Skill, SkillCategory } from '../../../models/skill';
import { getSpecies, getSpeciesDeck } from '../../../models/species';
import { Trait } from '../../../models/trait';
import { shuffle } from '../../../utils/collections';
import { generateName } from '../../../utils/name-generator';
import { BackgroundCard, FeatureCard, ItemCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, PlayingCard, PlayingCardSide, Text, TextType } from '../../utility';

import './hero-builder-panel.scss';

interface Props {
	hero: Hero;
	game: Game;
	finished: (hero: Hero) => void;
}

interface State {
	hero: Hero;
	mode: 'create' | 'level up';
}

export class HeroBuilderPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const hero = JSON.parse(JSON.stringify(props.hero)) as Hero;
		if (hero.name === '') {
			hero.name = generateName();
		}

		this.state = {
			hero: hero,
			mode: (props.hero.name === '') ? 'create' : 'level up'
		};
	}

	selectCards = (speciesID: string, roleID: string, backgroundID: string) => {
		const hero = this.state.hero;

		const species = getSpecies(speciesID);
		if (species) {
			hero.speciesID = species.id;
			species.traits.forEach(t => hero.features.push(createTraitFeature(t, 1)));
		}

		const role = getRole(roleID);
		if (role) {
			hero.roleID = role.id;
			role.traits.forEach(t => hero.features.push(createTraitFeature(t, 1)));
			role.skills.forEach(s => hero.features.push(createSkillFeature(s, 2)));
			role.proficiencies.forEach(p => hero.features.push(createProficiencyFeature(p)));
		}

		const background = getBackground(backgroundID);
		if (background) {
			hero.backgroundID = background.id;
		}

		this.setState({
			hero: hero
		});
	}

	levelUp = (trait: Trait, skill: Skill, feature: Feature) => {
		const hero = this.state.hero;
		hero.level += 1;
		hero.xp = 0;
		hero.features.push(createTraitFeature(trait, 1));
		hero.features.push(createSkillFeature(skill, 1));
		hero.features.push(JSON.parse(JSON.stringify(feature)) as Feature);
		this.setState({
			hero: hero
		});
	}

	makeChoices = (features: Feature[]) => {
		const hero = this.state.hero;
		features.forEach(feature => {
			const n = hero.features.findIndex(f => f.id === feature.id);
			if (n !== -1) {
				hero.features[n] = feature;
			}
		});
		this.setState({
			hero: hero
		});
	}

	addItems = (items: Item[]) => {
		const hero = this.state.hero;
		hero.items = items;
		this.setState({
			hero: hero
		});
	}

	rename = () => {
		const hero = this.state.hero;
		hero.name = generateName();
		this.setState({
			hero: hero
		});
	}

	finished = () => {
		this.props.finished(this.state.hero);
	}

	public render() {
		let content = null;
		if ((this.state.hero.speciesID === '') && (this.state.hero.roleID === '') && (this.state.hero.backgroundID === '')) {
			// Initial card selection
			content = (
				<CardSelector
					game={this.props.game}
					select={this.selectCards}
				/>
			);
		} else if (this.state.hero.xp === this.state.hero.level) {
			// Level up
			content = (
				<LevelUpPanel
					hero={this.state.hero}
					finished={this.levelUp}
				/>
			);
		} else {
			const choices = this.state.hero.features.filter(f => hasChoice(f));
			if (choices.length > 0) {
				// Choices
				content = (
					<ChoicesPanel
						features={choices}
						finished={this.makeChoices}
					/>
				);
			} else if ((this.state.hero.level === 1) && getProficiencies(this.state.hero).length !== this.state.hero.items.length) {
				// Choose initial equipment
				content = (
					<EquipmentSelector
						hero={this.state.hero}
						addItems={this.addItems}
					/>
				);
			} else if (this.state.hero.level === 1) {
				// Finalise character creation
				content = (
					<div>
						<button onClick={this.rename}>Rename this hero</button>
						<button onClick={this.finished}>Finished</button>
					</div>
				);
			} else {
				// Finalise level up
				content = (
					<div>
						<button onClick={this.finished}>Finished</button>
					</div>
				);
			}
		}

		let info = null;
		if ((this.state.hero.speciesID !== '') && (this.state.hero.roleID !== '') && (this.state.hero.backgroundID !== '')) {
			const species = getSpecies(this.state.hero.speciesID);
			const role = getRole(this.state.hero.roleID);
			const background = getBackground(this.state.hero.backgroundID);
			info = (
				<div>
					<Text><b>{this.state.hero.name}</b>: <Tag>{species?.name ?? ''}</Tag> <Tag>{role?.name ?? ''}</Tag> <Tag>{background?.name ?? ''}</Tag></Text>
				</div>
			);
		}

		return (
			<div className='hero-builder-panel'>
				<Text type={TextType.Heading}>
					{this.state.mode === 'create' ? 'Recruit a Hero' : `Level Up ${this.state.hero.name}`}
				</Text>
				{info}
				{content}
			</div>
		);
	}
}

//#region Card selector

interface CardSelectorProps {
	game: Game;
	select: (speciesID: string, roleID: string, backgroundID: string) => void;
}

interface CardSelectorState {
	speciesIDs: string[];
	roleIDs: string[];
	backgroundIDs: string[];
	selectedSpeciesID: string;
	selectedRoleID: string;
	selectedBackgroundID: string;
}

class CardSelector extends Component<CardSelectorProps, CardSelectorState> {
	constructor(props: CardSelectorProps) {
		super(props);
		this.state = {
			speciesIDs: shuffle(getSpeciesDeck(this.props.game)).splice(0, 3),
			roleIDs: shuffle(getRoleDeck(this.props.game)).splice(0, 3),
			backgroundIDs: shuffle(getBackgroundDeck(this.props.game)).splice(0, 3),
			selectedSpeciesID: '',
			selectedRoleID: '',
			selectedBackgroundID: ''
		};
	}

	private selectSpecies(id: string) {
		if (this.state.selectedSpeciesID === '') {
			this.setState({
				selectedSpeciesID: id
			});
		}
	}

	private selectRole(id: string) {
		if (this.state.selectedRoleID === '') {
			this.setState({
				selectedRoleID: id
			});
		}
	}

	private selectBackground(id: string) {
		if (this.state.selectedBackgroundID === '') {
			this.setState({
				selectedBackgroundID: id
			});
		}
	}

	private select() {
		this.props.select(this.state.selectedSpeciesID, this.state.selectedRoleID, this.state.selectedBackgroundID);
	}

	public render() {
		const speciesCards = this.state.speciesIDs.map(id => {
			const species = getSpecies(id);
			if (species) {
				return (
					<div key={species.id}>
						<PlayingCard
							front={<SpeciesCard species={species} />}
							back='Species'
							display={(this.state.selectedSpeciesID !== '') && (this.state.selectedSpeciesID !== species.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={() => this.selectSpecies(species.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const roleCards = this.state.roleIDs.map(id => {
			const role = getRole(id);
			if (role) {
				return (
					<div key={role.id}>
						<PlayingCard
							front={<RoleCard role={role} />}
							back='Role'
							display={(this.state.selectedRoleID !== '') && (this.state.selectedRoleID !== role.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={() => this.selectRole(role.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const backgroundCards = this.state.backgroundIDs.map(id => {
			const background = getBackground(id);
			if (background) {
				return (
					<div key={background.id}>
						<PlayingCard
							front={<BackgroundCard background={background} />}
							back='Background'
							display={(this.state.selectedBackgroundID !== '') && (this.state.selectedBackgroundID !== background.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={() => this.selectBackground(background.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const canSelect = (this.state.selectedSpeciesID !== '') && (this.state.selectedRoleID !== '') && (this.state.selectedBackgroundID !== '');

		return (
			<div>
				<Text>Select one of these <b>species</b> cards:</Text>
				<CardList cards={speciesCards} />
				<Text>Select one of these <b>role</b> cards:</Text>
				<CardList cards={roleCards} />
				<Text>Select one of these <b>background</b> cards:</Text>
				<CardList cards={backgroundCards} />
				<button disabled={!canSelect} onClick={() => this.select()}>Select these cards</button>
			</div>
		);
	}
}

//#endregion

//#region Level up

interface LevelUpPanelProps {
	hero: Hero;
	finished: (trait: Trait, skill: Skill, feature: Feature) => void;
}

interface LevelUpPanelState {
	features: Feature[];
	selectedTrait: Trait;
	selectedSkill: Skill;
	selectedFeature: Feature | null;
}

class LevelUpPanel extends Component<LevelUpPanelProps, LevelUpPanelState> {
	constructor(props: LevelUpPanelProps) {
		super(props);
		this.state = {
			features: shuffle(getFeatureDeck(props.hero)).splice(0, 3),
			selectedTrait: Trait.Any,
			selectedSkill: Skill.Any,
			selectedFeature: null
		};
	}

	public render() {
		const featureCards = this.state.features.map(feature => {
			return (
				<div key={feature.id}>
					<PlayingCard
						front={<FeatureCard feature={feature} />}
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

		const canFinish = (this.state.selectedTrait !== Trait.Any) && (this.state.selectedSkill !== Skill.Any) && (this.state.selectedFeature !== null);

		return (
			<div>
				<Text>Choose a <b>trait</b> to increment:</Text>
				<Selector
					options={[
						{ id: Trait.Endurance },
						{ id: Trait.Resolve },
						{ id: Trait.Speed }
					]}
					selectedID={this.state.selectedTrait}
					onSelect={id => this.setState({ selectedTrait: id as Trait })}
				/>
				<Text>Choose a <b>skill</b> to increment:</Text>
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
					selectedID={this.state.selectedSkill}
					onSelect={id => this.setState({ selectedSkill: id as Skill })}
				/>
				<Text>Choose a <b>feature</b>:</Text>
				<CardList cards={featureCards} />
				<button disabled={!canFinish} onClick={() => this.props.finished(this.state.selectedTrait, this.state.selectedSkill, this.state.selectedFeature as Feature)}>
					Level Up
				</button>
			</div>
		);
	}
}

//#endregion

//#region Choices

interface ChoicesPanelProps {
	features: Feature[];
	finished: (features: Feature[]) => void;
}

interface ChoicesPanelState {
	features: Feature[];
}

class ChoicesPanel extends Component<ChoicesPanelProps, ChoicesPanelState> {
	constructor(props: ChoicesPanelProps) {
		super(props);

		const features = props.features.map(f => JSON.parse(JSON.stringify(f)) as Feature);
		this.state = {
			features: features
		};
	}

	selectTrait = (feature: Feature, trait: Trait) => {
		feature.trait = trait;
		const features = this.state.features;
		this.setState({
			features: features
		});
	}

	selectSkill = (feature: Feature, skill: Skill) => {
		feature.skill = skill;
		const features = this.state.features;
		this.setState({
			features: features
		});
	}

	selectSkillCategory = (feature: Feature, category: SkillCategory) => {
		feature.skillCategory = category;
		const features = this.state.features;
		this.setState({
			features: features
		});
	}

	selectProficiency = (feature: Feature, proficiency: Proficiency) => {
		feature.proficiency = proficiency;
		const features = this.state.features;
		this.setState({
			features: features
		});
	}

	selectDamage = (feature: Feature, damage: DamageType) => {
		feature.damage = damage;
		const features = this.state.features;
		this.setState({
			features: features
		});
	}

	selectDamageCategory = (feature: Feature, category: DamageCategory) => {
		feature.damageCategory = category;
		const features = this.state.features;
		this.setState({
			features: features
		});
	}

	render = () => {
		const choices = this.state.features.map(f => {
			switch (f.type) {
				case FeatureType.Trait:
					return (
						<div key={f.id}>
							<Text><b></b>{getFeatureTitle(f)}: {getFeatureDescription(f)}</Text>
							<Selector
								options={[
									{ id: Trait.Endurance },
									{ id: Trait.Resolve },
									{ id: Trait.Speed }
								]}
								selectedID={f.trait}
								onSelect={id => this.selectTrait(f, id as Trait)}
							/>
						</div>
					);
				case FeatureType.Skill:
					return (
						<div key={f.id}>
							<Text>{getFeatureTitle(f)}: {getFeatureDescription(f)}</Text>
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
								selectedID={f.skill}
								onSelect={id => this.selectSkill(f, id as Skill)}
							/>
						</div>
					);
				case FeatureType.SkillCategory:
					return (
						<div key={f.id}>
							<Text>{getFeatureTitle(f)}: {getFeatureDescription(f)}</Text>
							<Selector
								options={[
									{ id: SkillCategory.Physical },
									{ id: SkillCategory.Mental }
								]}
								selectedID={f.skillCategory}
								onSelect={id => this.selectSkillCategory(f, id as SkillCategory)}
							/>
						</div>
					);
				case FeatureType.Proficiency:
					return (
						<div key={f.id}>
							<Text>{getFeatureTitle(f)}: {getFeatureDescription(f)}</Text>
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
								selectedID={f.proficiency}
								onSelect={id => this.selectProficiency(f, id as Proficiency)}
							/>
						</div>
					);
				case FeatureType.DamageBonus:
				case FeatureType.DamageResist:
					return (
						<div key={f.id}>
							<Text>{getFeatureTitle(f)}: {getFeatureDescription(f)}</Text>
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
								selectedID={f.damage}
								onSelect={id => this.selectDamage(f, id as DamageType)}
							/>
						</div>
					);
				case FeatureType.DamageCategoryBonus:
				case FeatureType.DamageCategoryResist:
					return (
						<div key={f.id}>
							<Text>{getFeatureTitle(f)}: {getFeatureDescription(f)}</Text>
							<Selector
								options={[
									{ id: DamageCategory.Physical },
									{ id: DamageCategory.Energy },
									{ id: DamageCategory.Corruption }
								]}
								selectedID={f.damageCategory}
								onSelect={id => this.selectDamageCategory(f, id as DamageCategory)}
							/>
						</div>
					);
				default:
					return null;
			}
		});

		return (
			<div>
				<Text>You have some choices to make:</Text>
				{choices}
				<button onClick={() => this.props.finished(this.state.features)}>OK</button>
			</div>
		);
	}
}

//#endregion

//#region Equipment selector

interface EquipmentSelectorProps {
	hero: Hero;
	addItems: (items: Item[]) => void;
}

interface EquipmentSelectorState {
	items: Item[];
}

class EquipmentSelector extends Component<EquipmentSelectorProps, EquipmentSelectorState> {
	constructor(props: EquipmentSelectorProps) {
		super(props);
		this.state = {
			items: []
		};
	}

	private selectItem(id: string) {
		const item = getItem(id);
		if (item) {
			const slotFilled = this.state.items.find(i => i.proficiency === item.proficiency);
			if (!slotFilled) {
				const items = this.state.items;
				items.push(item);
				this.setState({
					items: items
				});
			}
		}
	}

	public render() {
		const role = getRole(this.props.hero.roleID);
		if (!role) {
			return null;
		}

		const slots = role.proficiencies.map((prof, n) => {
			const currentItemIDs = this.state.items
				.filter(item => item.proficiency === prof)
				.map(item => item.id);

			const items = getItems(prof).map(item => (
				<div key={item.id}>
					<PlayingCard
						front={<ItemCard item={item} />}
						back='Item'
						display={(currentItemIDs.length !== 0) && (!currentItemIDs.includes(item.id)) ? PlayingCardSide.Back : PlayingCardSide.Front}
						onClick={() => this.selectItem(item.id)}
					/>
				</div>
			));

			return (
				<div key={n}>
					<Text>Choose an item for <b>{prof}</b>:</Text>
					<CardList cards={items} />
				</div>
			);
		});

		const canSelect = (this.state.items.length === role.proficiencies.length);

		return (
			<div>
				{slots}
				<button disabled={!canSelect} onClick={() => this.props.addItems(this.state.items)}>Select these items</button>
			</div>
		);
	}
}

//#endregion

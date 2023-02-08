import { Component } from 'react';
import { Selector, Tag, Text, TextType } from '../../../controls';
import { getBackground, getBackgroundDeck } from '../../../models/background';
import { DamageCategory, DamageType } from '../../../models/damage';
import { createProficiencyFeature, createSkillFeature, createTraitFeature, FeatureModel, FeatureType, hasChoice } from '../../../models/feature';
import { GameModel } from '../../../models/game';
import { getFeatureDeck, getProficiencies, HeroModel } from '../../../models/hero';
import { getItem, getItems, ItemModel } from '../../../models/item';
import { ItemProficiency } from '../../../models/item-proficiency';
import { getRole, getRoleDeck } from '../../../models/role';
import { Skill, SkillCategory } from '../../../models/skill';
import { getSpecies, getSpeciesDeck } from '../../../models/species';
import { Trait } from '../../../models/trait';
import { shuffle } from '../../../utils/collections';
import { generateName } from '../../../utils/name-generator';
import { guid } from '../../../utils/utils';
import { BackgroundCard, FeatureCard, ItemCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, PlayingCard, PlayingCardSide } from '../../utility';

import './hero-builder-panel.scss';

interface Props {
	hero: HeroModel;
	game: GameModel;
	finished: (hero: HeroModel) => void;
}

interface State {
	hero: HeroModel;
	mode: 'create' | 'level up';
}

export class HeroBuilderPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const hero = JSON.parse(JSON.stringify(props.hero)) as HeroModel;
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

	levelUp = (feature: FeatureModel) => {
		const hero = this.state.hero;
		hero.xp -= hero.level;
		hero.level += 1;
		hero.features.push(feature);
		this.setState({
			hero: hero
		});
	}

	makeChoices = (features: FeatureModel[]) => {
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

	addItems = (items: ItemModel[]) => {
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

		const header = (
			<div className='header'>
				<Text type={TextType.Heading}>
					{this.state.mode === 'create' ? 'Recruit a Hero' : `Level Up ${this.state.hero.name}`}
				</Text>
				{info}
			</div>
		);

		let content = null;
		if ((this.state.hero.speciesID === '') && (this.state.hero.roleID === '') && (this.state.hero.backgroundID === '')) {
			// Initial card selection
			content = (
				<CardSelector
					game={this.props.game}
					header={header}
					select={this.selectCards}
				/>
			);
		} else if (this.state.hero.xp >= this.state.hero.level) {
			// Level up
			const features = shuffle(getFeatureDeck(this.state.hero))
				.splice(0, 3)
				.map(f => {
					const copy = JSON.parse(JSON.stringify(f)) as FeatureModel;
					copy.id = guid();
					return copy;
				});
			content = (
				<LevelUpPanel
					hero={this.state.hero}
					features={features}
					header={header}
					finished={this.levelUp}
				/>
			);
		} else {
			if ((this.state.hero.level === 1) && getProficiencies(this.state.hero).length !== this.state.hero.items.length) {
				// Choose initial equipment
				content = (
					<EquipmentSelector
						hero={this.state.hero}
						header={header}
						addItems={this.addItems}
					/>
				);
			} else if (this.state.hero.level === 1) {
				// Finalise character creation
				content = (
					<div className='finish-page'>
						{header}
						<div className='content'>
							<button onClick={this.rename}>Rename this hero</button>
						</div>
						<div className='footer'>
							<button onClick={this.finished}>Finished</button>
						</div>
					</div>
				);
			} else {
				// Finalise level up
				content = (
					<div className='finish-page'>
						{header}
						<div className='content'>
						</div>
						<div className='footer'>
							<button onClick={this.finished}>Finished</button>
						</div>
					</div>
				);
			}
		}

		return (
			<div className='hero-builder-panel'>
				{content}
			</div>
		);
	}
}

//#region Card selector

interface CardSelectorProps {
	game: GameModel;
	header: JSX.Element;
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
			<div className='card-selector-page'>
				{this.props.header}
				<div className='content'>
					<Text>Select one of these <b>species</b> cards:</Text>
					<CardList cards={speciesCards} />
					<Text>Select one of these <b>role</b> cards:</Text>
					<CardList cards={roleCards} />
					<Text>Select one of these <b>background</b> cards:</Text>
					<CardList cards={backgroundCards} />
				</div>
				<div className='footer'>
					<button disabled={!canSelect} onClick={() => this.select()}>Select these cards</button>
				</div>
			</div>
		);
	}
}

//#endregion

//#region Level up

interface LevelUpPanelProps {
	hero: HeroModel;
	features: FeatureModel[];
	header: JSX.Element;
	finished: (feature: FeatureModel) => void;
}

interface LevelUpPanelState {
	selectedFeature: FeatureModel | null;
}

class LevelUpPanel extends Component<LevelUpPanelProps, LevelUpPanelState> {
	constructor(props: LevelUpPanelProps) {
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
			this.props.finished(feature);
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
			choice = hasChoice(this.state.selectedFeature) ? <ChoicePanel feature={this.state.selectedFeature} onChange={this.setFeature} /> : null;
			canFinish = !hasChoice(this.state.selectedFeature);
		}

		return (
			<div className='level-up-page'>
				{this.props.header}
				<div className='content'>
					<Text type={TextType.SubHeading}>Level {this.props.hero.level + 1}</Text>
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
			case FeatureType.Proficiency:
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
							]}
							selectedID={this.state.feature.proficiency}
							onSelect={id => this.selectProficiency(id as ItemProficiency)}
						/>
					</div>
				);
				break;
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

//#region Equipment selector

interface EquipmentSelectorProps {
	hero: HeroModel;
	header: JSX.Element;
	addItems: (items: ItemModel[]) => void;
}

interface EquipmentSelectorState {
	items: ItemModel[];
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
			<div className='equipment-page'>
				{this.props.header}
				<div className='content'>
					{slots}
				</div>
				<div className='footer'>
					<button disabled={!canSelect} onClick={() => this.props.addItems(this.state.items)}>Select these items</button>
				</div>
			</div>
		);
	}
}

//#endregion

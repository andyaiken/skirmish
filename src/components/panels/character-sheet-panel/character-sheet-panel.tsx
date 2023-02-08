import { Component } from 'react';
import { Dialog, Selector, Tag, Text, TextType } from '../../../controls';
import { getAuraDescription } from '../../../models/aura';
import { getBackground } from '../../../models/background';
import { DamageType } from '../../../models/damage';
import { GameModel } from '../../../models/game';
import { getActionDeck, getAuras, getDamageBonusValue, getDamageResistanceValue, getFeatureDeck, getProficiencies, getSkillValue, getTraitValue, HeroModel } from '../../../models/hero';
import { ItemModel } from '../../../models/item';
import { ItemLocation } from '../../../models/item-location';
import { ItemProficiency } from '../../../models/item-proficiency';
import { getRole } from '../../../models/role';
import { Skill } from '../../../models/skill';
import { getSpecies } from '../../../models/species';
import { Trait } from '../../../models/trait';
import { ActionCard, FeatureCard, ItemCard } from '../../cards';
import { CardList, PlayingCard, StatValue } from '../../utility';

import './character-sheet-panel.scss';

type ViewType = 'stats' | 'items' | 'features' | 'actions';

interface Props {
	hero: HeroModel;
	game: GameModel;
	equipItem: (item: ItemModel, hero: HeroModel) => void;
	unequipItem: (item: ItemModel, hero: HeroModel) => void;
}

interface State {
	view: ViewType;
}

export class CharacterSheetPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'stats'
		};
	}

	public render() {
		let content = null;
		switch (this.state.view) {
			case 'stats':
				content = <StatsPage hero={this.props.hero} />;
				break;
			case 'items':
				content = (
					<ItemsPage
						hero={this.props.hero}
						game={this.props.game}
						equipItem={item => this.props.equipItem(item, this.props.hero)}
						unequipItem={item => this.props.unequipItem(item, this.props.hero)}
					/>
				);
				break;
			case 'features':
				content = <FeaturesPage hero={this.props.hero} />;
				break;
			case 'actions':
				content = <ActionsPage hero={this.props.hero} />;
				break;
		}

		return (
			<div className='character-sheet-panel'>
				<div className='header'>
					<Text type={TextType.Heading}>{this.props.hero.name || 'unnamed hero'}</Text>
					<div className='tags'>
						<Tag>{getSpecies(this.props.hero.speciesID)?.name ?? 'Unknown species'}</Tag>
						<Tag>{getRole(this.props.hero.roleID)?.name ?? 'Unknown role'}</Tag>
						<Tag>{getBackground(this.props.hero.backgroundID)?.name ?? 'Unknown background'}</Tag>
						<Tag>Level {this.props.hero.level}</Tag>
					</div>
					<Selector
						selectedID={this.state.view}
						options={[
							{ id: 'stats', display: 'Statistics' },
							{ id: 'items', display: 'Equipment' },
							{ id: 'features', display: 'Feature Deck' },
							{ id: 'actions', display: 'Action Deck' }
						]}
						onSelect={id => this.setState({ view: id as ViewType })}
					/>
				</div>
				<div className='content'>
					{content}
				</div>
			</div>
		);
	}
}

interface StatsPageProps {
	hero: HeroModel;
}

class StatsPage extends Component<StatsPageProps> {
	public render() {
		let proficiencySection = null;
		const profs = getProficiencies(this.props.hero);
		if (profs.length > 0 ) {
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

		const damageBonuses = (
			<div className='damage-bonuses'>
				<StatValue label='Acid' value={getDamageBonusValue(this.props.hero, DamageType.Acid)}/>
				<StatValue label='Cold' value={getDamageBonusValue(this.props.hero, DamageType.Cold)}/>
				<StatValue label='Decay' value={getDamageBonusValue(this.props.hero, DamageType.Decay)}/>
				<StatValue label='Edged' value={getDamageBonusValue(this.props.hero, DamageType.Edged)}/>
				<StatValue label='Electricity' value={getDamageBonusValue(this.props.hero, DamageType.Electricity)}/>
				<StatValue label='Fire' value={getDamageBonusValue(this.props.hero, DamageType.Fire)}/>
				<StatValue label='Impact' value={getDamageBonusValue(this.props.hero, DamageType.Impact)}/>
				<StatValue label='Light' value={getDamageBonusValue(this.props.hero, DamageType.Light)}/>
				<StatValue label='Piercing' value={getDamageBonusValue(this.props.hero, DamageType.Piercing)}/>
				<StatValue label='Poison' value={getDamageBonusValue(this.props.hero, DamageType.Poison)}/>
				<StatValue label='Psychic' value={getDamageBonusValue(this.props.hero, DamageType.Psychic)}/>
				<StatValue label='Sonic' value={getDamageBonusValue(this.props.hero, DamageType.Sonic)}/>
			</div>
		);

		const damageResistances = (
			<div className='damage-resistances'>
				<StatValue label='Acid' value={getDamageResistanceValue(this.props.hero, DamageType.Acid)}/>
				<StatValue label='Cold' value={getDamageResistanceValue(this.props.hero, DamageType.Cold)}/>
				<StatValue label='Decay' value={getDamageResistanceValue(this.props.hero, DamageType.Decay)}/>
				<StatValue label='Edged' value={getDamageResistanceValue(this.props.hero, DamageType.Edged)}/>
				<StatValue label='Electricity' value={getDamageResistanceValue(this.props.hero, DamageType.Electricity)}/>
				<StatValue label='Fire' value={getDamageResistanceValue(this.props.hero, DamageType.Fire)}/>
				<StatValue label='Impact' value={getDamageResistanceValue(this.props.hero, DamageType.Impact)}/>
				<StatValue label='Light' value={getDamageResistanceValue(this.props.hero, DamageType.Light)}/>
				<StatValue label='Piercing' value={getDamageResistanceValue(this.props.hero, DamageType.Piercing)}/>
				<StatValue label='Poison' value={getDamageResistanceValue(this.props.hero, DamageType.Poison)}/>
				<StatValue label='Psychic' value={getDamageResistanceValue(this.props.hero, DamageType.Psychic)}/>
				<StatValue label='Sonic' value={getDamageResistanceValue(this.props.hero, DamageType.Sonic)}/>
			</div>
		);

		return (
			<div className='stats-page'>
				<div className='column'>
					<Text type={TextType.SubHeading}>Traits</Text>
					<div className='traits'>
						<StatValue orientation='vertical' label='Endurance' value={getTraitValue(this.props.hero, Trait.Endurance)}/>
						<StatValue orientation='vertical' label='Resolve' value={getTraitValue(this.props.hero, Trait.Resolve)}/>
						<StatValue orientation='vertical' label='Speed' value={getTraitValue(this.props.hero, Trait.Speed)}/>
					</div>
					<hr />
					<Text type={TextType.SubHeading}>Skills</Text>
					<div className='skills'>
						<StatValue label='Athletics' value={getSkillValue(this.props.hero, Skill.Athletics)}/>
						<StatValue label='Brawl' value={getSkillValue(this.props.hero, Skill.Brawl)}/>
						<StatValue label='Perception' value={getSkillValue(this.props.hero, Skill.Perception)}/>
						<StatValue label='Reactions' value={getSkillValue(this.props.hero, Skill.Reactions)}/>
						<StatValue label='Spellcasting' value={getSkillValue(this.props.hero, Skill.Spellcasting)}/>
						<StatValue label='Stealth' value={getSkillValue(this.props.hero, Skill.Stealth)}/>
						<StatValue label='Weapon' value={getSkillValue(this.props.hero, Skill.Weapon)}/>
					</div>
				</div>
				<div className='column'>
					<Text type={TextType.SubHeading}>Damage Bonuses</Text>
					{damageBonuses}
				</div>
				<div className='column'>
					<Text type={TextType.SubHeading}>Resistances</Text>
					{damageResistances}
				</div>
				<div className='column'>
					<Text type={TextType.SubHeading}>Proficiencies</Text>
					{proficiencySection}
					<hr />
					<Text type={TextType.SubHeading}>Auras</Text>
					{auraSection}
					<hr />
					<Text type={TextType.SubHeading}>XP</Text>
					{this.props.hero.xp} of {this.props.hero.level} XP required for level {this.props.hero.level + 1}
				</div>
			</div>
		);
	}
}

interface ItemsPageProps {
	hero: HeroModel;
	game: GameModel;
	equipItem: (item: ItemModel) => void;
	unequipItem: (item: ItemModel) => void;
}

interface ItemsPageState {
	selectedItem: ItemModel | null;
	selectedLocation: ItemLocation;
}

class ItemsPage extends Component<ItemsPageProps, ItemsPageState> {
	constructor(props: ItemsPageProps) {
		super(props);
		this.state = {
			selectedItem: null,
			selectedLocation: ItemLocation.None
		};
	}

	private getItemCards(location: ItemLocation, name: string, slots = 1) {
		const items = this.props.hero.items.filter(item => location === item.location);
		const used = items.map(item => item.slots).reduce((sum, current) => sum + current, 0);

		const cards = items.map(item => (
			<div key={item.id} className='item'>
				<PlayingCard
					front={<ItemCard item={item} />}
					onClick={() => this.setState({ selectedItem: item })}
				/>
			</div>
		));

		const remaining = slots - used;
		if (remaining > 0) {
			const equippableItemsExist = this.props.game.items.some(item => item.location === location);
			for (let n = 0; n !== remaining; ++n) {
				cards.push(
					<div key={n} className='item'>
						<button disabled={!equippableItemsExist} onClick={() => this.setState({ selectedLocation: location })}>
							No Item
						</button>
					</div>
				);
			}
		}

		return cards;
	}

	private equip(item: ItemModel) {
		this.setState({
			selectedLocation: ItemLocation.None
		}, () => {
			this.props.equipItem(item);
		});
	}

	private unequip() {
		if (this.state.selectedItem !== null) {
			const item = this.state.selectedItem;
			this.setState({
				selectedItem: null
			}, () => {
				this.props.unequipItem(item);
			});
		}
	}

	public render() {
		let dialogContent = null;
		if (this.state.selectedItem !== null) {
			dialogContent = (
				<div>
					<PlayingCard front={<ItemCard item={this.state.selectedItem} />} />
					<button onClick={() => this.unequip()}>Unequip</button>
				</div>
			);
		}
		if (this.state.selectedLocation !== ItemLocation.None) {
			// Find items that fit this location that we can use
			const campaignItemCards = this.props.game.items
				.filter(item => item.location === this.state.selectedLocation)
				.filter(item => (item.proficiency === ItemProficiency.None) || (getProficiencies(this.props.hero).includes(item.proficiency)))
				.map(item => (
					<div key={item.id}>
						<PlayingCard
							front={<ItemCard item={item} />}
							onClick={() => this.equip(item)}
						/>
					</div>
				));

			if (campaignItemCards.length === 0) {
				campaignItemCards.push(
					<div key='empty'>
						No items
					</div>
				);
			}

			dialogContent = (
				<div>
					{campaignItemCards}
				</div>
			);
		}

		return (
			<div className='items-page'>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Hands</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocation.Hand, 'Hand', 2)}
					</div>
				</div>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Body</Text>
						</div>
						<div className='item'>
							<Text type={TextType.SubHeading}>Feet</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocation.Body, 'Body')}
						{this.getItemCards(ItemLocation.Feet, 'Feet')}
					</div>
				</div>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Head</Text>
						</div>
						<div className='item'>
							<Text type={TextType.SubHeading}>Neck</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocation.Head, 'Head')}
						{this.getItemCards(ItemLocation.Neck, 'Neck')}
					</div>
				</div>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Rings</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocation.Ring, 'Ring', 2)}
					</div>
				</div>
				{dialogContent ? <Dialog content={dialogContent} onClickOff={() => this.setState({ selectedItem: null, selectedLocation: ItemLocation.None })} /> : null}
			</div>
		);
	}
}

interface FeaturesPageProps {
	hero: HeroModel;
}

class FeaturesPage extends Component<FeaturesPageProps> {
	public render() {
		const featureCards = getFeatureDeck(this.props.hero).map(feature => {
			return (
				<PlayingCard key={feature.id} front={<FeatureCard feature={feature} />} />
			);
		});

		return (
			<div className='features-page'>
				<div className='column'>
					<Text>Each time {this.props.hero.name} levels up, they get to choose one of these features.</Text>
					<CardList cards={featureCards} />
				</div>
			</div>
		);
	}
}

interface ActionsPageProps {
	hero: HeroModel;
}

class ActionsPage extends Component<ActionsPageProps> {
	public render() {
		const actionCards = getActionDeck(this.props.hero).map(action => {
			return (
				<PlayingCard key={action.id} front={<ActionCard action={action} />} />
			);
		});

		return (
			<div className='actions-page'>
				<div className='column'>
					<Text>In an encounter, {this.props.hero.name} will be able to choose from these actions.</Text>
					<CardList cards={actionCards} />
				</div>
			</div>
		);
	}
}

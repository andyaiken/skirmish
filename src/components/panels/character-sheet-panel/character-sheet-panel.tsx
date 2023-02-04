import { Component } from 'react';
import { Selector, Tag } from '../../../controls';
import { getBackground } from '../../../models/background';
import { Game } from '../../../models/game';
import { actionDeck, featureDeck, Hero, proficiencies, skill, trait } from '../../../models/hero';
import { Item } from '../../../models/item';
import { ItemLocation } from '../../../models/item-location';
import { getRole } from '../../../models/role';
import { Skill } from '../../../models/skill';
import { getSpecies } from '../../../models/species';
import { Trait } from '../../../models/trait';
import { ActionCard,FeatureCard, ItemCard } from '../../cards';
import { CardList, PlayingCard, StatValue, Text, TextType } from '../../utility';

import './character-sheet-panel.scss';

type ViewType = 'stats' | 'items' | 'features' | 'actions';

interface Props {
	hero: Hero;
	game: Game;
	equipItem: (item: Item, hero: Hero) => void;
	unequipItem: (item: Item, hero: Hero) => void;
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
				<Text type={TextType.Heading}>{this.props.hero.name || 'unnamed hero'}</Text>
				<div className='tags'>
					<Tag>{getSpecies(this.props.hero.speciesID)?.name ?? 'Unknown species'}</Tag>
					<Tag>{getRole(this.props.hero.roleID)?.name ?? 'Unknown role'}</Tag>
					<Tag>{getBackground(this.props.hero.backgroundID)?.name ?? 'Unknown background'}</Tag>
				</div>
				<Text>Level {this.props.hero.level}</Text>
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
				{content}
			</div>
		);
	}
}

interface StatsPageProps {
	hero: Hero;
}

class StatsPage extends Component<StatsPageProps> {
	public render() {
		const traits = (
			<div>
				<StatValue label='Endurance' value={trait(this.props.hero, Trait.Endurance)}/>
				<StatValue label='Resolve' value={trait(this.props.hero, Trait.Resolve)}/>
				<StatValue label='Speed' value={trait(this.props.hero, Trait.Speed)}/>
			</div>
		);

		const skills = (
			<div>
				<StatValue label='Athletics' value={skill(this.props.hero, Skill.Athletics)}/>
				<StatValue label='Brawl' value={skill(this.props.hero, Skill.Brawl)}/>
				<StatValue label='Perception' value={skill(this.props.hero, Skill.Perception)}/>
				<StatValue label='Reactions' value={skill(this.props.hero, Skill.Reactions)}/>
				<StatValue label='Spellcasting' value={skill(this.props.hero, Skill.Spellcasting)}/>
				<StatValue label='Stealth' value={skill(this.props.hero, Skill.Stealth)}/>
				<StatValue label='Weapon' value={skill(this.props.hero, Skill.Weapon)}/>
			</div>
		);

		const profs = (
			<div>
				{proficiencies(this.props.hero).map(p => (<div key={p}>{p}</div>))}
			</div>
		);

		return (
			<div>
				<Text type={TextType.SubHeading}>Traits</Text>
				{traits}
				<Text type={TextType.SubHeading}>Skills</Text>
				{skills}
				<Text type={TextType.SubHeading}>Proficiencies</Text>
				{profs}
				<Text type={TextType.SubHeading}>More</Text>
				<div>TODO: DAMAGE BONUSES</div>
				<div>TODO: DAMAGE RESISTANCES</div>
				<Text type={TextType.SubHeading}>XP</Text>
				{this.props.hero.xp} of {this.props.hero.level} XP required for level {this.props.hero.level + 1}
			</div>
		);
	}
}

interface ItemsPageProps {
	hero: Hero;
	game: Game;
	equipItem: (item: Item) => void;
	unequipItem: (item: Item) => void;
}

interface ItemsPageState {
	selectedItem: Item | null;
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
			<div key={item.id}>
				<PlayingCard
					front={<ItemCard item={item} />}
					onClick={() => this.setState({ selectedItem: item })}
				/>
			</div>
		));

		const remaining = slots - used;
		if (remaining > 0) {
			const campaignItemsExist = this.props.game.items.some(item => item.location === location);
			for (let n = 0; n !== remaining; ++n) {
				cards.push(
					<div key={n}>
						<button disabled={!campaignItemsExist} onClick={() => this.setState({ selectedLocation: location })}>
							{name}: no item
						</button>
					</div>
				);
			}
		}

		return cards;
	}

	private equip(item: Item) {
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
		let drawerContent = null;
		if (this.state.selectedItem !== null) {
			drawerContent = (
				<div>
					<PlayingCard front={<ItemCard item={this.state.selectedItem} />} />
					<button onClick={() => this.unequip()}>Unequip</button>
				</div>
			);
		}
		if (this.state.selectedLocation !== ItemLocation.None) {
			const campaignItemCards = this.props.game.items
				.filter(item => item.location === this.state.selectedLocation)
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

			drawerContent = (
				<div>
					{campaignItemCards}
				</div>
			);
		}

		return (
			<div>
				<Text>Hands</Text>
				{this.getItemCards(ItemLocation.Hand, 'Hand', 2)}
				<Text>Head</Text>
				{this.getItemCards(ItemLocation.Head, 'Head')}
				<Text>Neck</Text>
				{this.getItemCards(ItemLocation.Neck, 'Neck')}
				<Text>Body</Text>
				{this.getItemCards(ItemLocation.Body, 'Body')}
				<Text>Feet</Text>
				{this.getItemCards(ItemLocation.Feet, 'Feet')}
				<Text>Rings</Text>
				{this.getItemCards(ItemLocation.Ring, 'Ring', 2)}
				{drawerContent}
			</div>
		);
	}
}

interface FeaturesPageProps {
	hero: Hero;
}

class FeaturesPage extends Component<FeaturesPageProps> {
	public render() {
		const featureCards = featureDeck(this.props.hero).map(feature => {
			return (
				<PlayingCard key={feature.id} front={<FeatureCard feature={feature} />} />
			);
		});

		return (
			<CardList cards={featureCards} />
		);
	}
}

interface ActionsPageProps {
	hero: Hero;
}

class ActionsPage extends Component<ActionsPageProps> {
	public render() {
		const actionCards = actionDeck(this.props.hero).map(action => {
			return (
				<PlayingCard key={action.id} front={<ActionCard action={action} />} />
			);
		});

		return (
			<CardList cards={actionCards} />
		);
	}
}

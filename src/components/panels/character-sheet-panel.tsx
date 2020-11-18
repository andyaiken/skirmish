import { Button, Col, Divider, Drawer, Progress, Radio, Row, Typography } from 'antd';
import React from 'react';
import { BackgroundHelper } from '../../models/background';
import { Game } from '../../models/game';
import { Hero, HeroHelper } from '../../models/hero';
import { Item } from '../../models/item';
import { ItemLocation } from '../../models/item-location';
import { RoleHelper } from '../../models/role';
import { Skill } from '../../models/skill';
import { SpeciesHelper } from '../../models/species';
import { Trait } from '../../models/trait';
import { ActionCard } from '../cards/action-card';
import { FeatureCard } from '../cards/feature-card';
import { ItemCard } from '../cards/item-card';
import { Align } from '../utility/align';
import { Heading } from '../utility/heading';
import { Padding } from '../utility/padding';
import { PlayingCard } from '../utility/playing-card';

interface Props {
	hero: Hero;
	game: Game;
	equipItem: (item: Item, hero: Hero) => void;
	unequipItem: (item: Item, hero: Hero) => void;
}

interface State {
	view: 'stats' | 'items' | 'features' | 'actions';
}

export class CharacterSheetPanel extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'stats'
		};
	}

	public render() {
		const species = SpeciesHelper.getSpecies(this.props.hero.speciesID)?.name || 'Unknown species';
		const role = RoleHelper.getRole(this.props.hero.roleID)?.name || 'Unknown role';
		const background = BackgroundHelper.getBackground(this.props.hero.backgroundID)?.name || 'Unknown background';

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
			<div className='character-sheet character-sheet-full'>
				<Align>
					<Heading>
						{this.props.hero.name || 'unnamed hero'}
					</Heading>
				</Align>
				<Align>
					{species + ' | ' + role + ' |  ' + background + ' | Level ' + this.props.hero.level}
				</Align>
				<Divider>
					<Radio.Group buttonStyle='solid' value={this.state.view} onChange={e => this.setState({ view: e.target.value })}>
						<Radio.Button value='stats'>Statistics</Radio.Button>
						<Radio.Button value='items'>Equipment</Radio.Button>
						<Radio.Button value='features'>Feature Deck</Radio.Button>
						<Radio.Button value='actions'>Action Deck</Radio.Button>
					</Radio.Group>
				</Divider>
				{content}
			</div>
		);
	}
}

interface StatsPageProps {
	hero: Hero;
}

class StatsPage extends React.Component<StatsPageProps> {
	public render() {
		const traits = (
			<div>
				<Typography.Paragraph>
					Endurance {HeroHelper.trait(this.props.hero, Trait.Endurance)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Resolve {HeroHelper.trait(this.props.hero, Trait.Resolve)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Speed {HeroHelper.trait(this.props.hero, Trait.Speed)}
				</Typography.Paragraph>
			</div>
		);

		const skills = (
			<div>
				<Typography.Paragraph>
					Athletics {HeroHelper.skill(this.props.hero, Skill.Athletics)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Brawl {HeroHelper.skill(this.props.hero, Skill.Brawl)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Perception {HeroHelper.skill(this.props.hero, Skill.Perception)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Reactions {HeroHelper.skill(this.props.hero, Skill.Reactions)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Spellcasting {HeroHelper.skill(this.props.hero, Skill.Spellcasting)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Stealth {HeroHelper.skill(this.props.hero, Skill.Stealth)}
				</Typography.Paragraph>
				<Typography.Paragraph>
					Weapon {HeroHelper.skill(this.props.hero, Skill.Weapon)}
				</Typography.Paragraph>
			</div>
		);

		const profs = (
			<div>
				<Typography.Paragraph>
					{HeroHelper.proficiencies(this.props.hero).join(', ') || 'None'}
				</Typography.Paragraph>
			</div>
		);

		return (
			<div>
				<Row gutter={10}>
					<Col span={12}>
						<Divider>Traits</Divider>
						{traits}
						<Divider>Proficiencies</Divider>
						{profs}
					</Col>
					<Col span={12}>
						<Divider>Skills</Divider>
						{skills}
					</Col>
				</Row>
				<Divider>More</Divider>
				<div>DAMAGE BONUSES</div>
				<div>DAMAGE RESISTANCES</div>
				<Divider>XP</Divider>
				<Progress
					percent={100 * this.props.hero.xp / this.props.hero.level}
					showInfo={false}
				/>
				<Typography.Paragraph>
					{this.props.hero.xp} of {this.props.hero.level} XP required for level {this.props.hero.level + 1}
				</Typography.Paragraph>
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

class ItemsPage extends React.Component<ItemsPageProps, ItemsPageState> {
	constructor(props: ItemsPageProps) {
		super(props);
		this.state = {
			selectedItem: null,
			selectedLocation: ItemLocation.None
		};
	}

	private getItemCards(location: ItemLocation, name: string, slots: number = 1) {
		const items = this.props.hero.items.filter(item => location === item.location);
		const used = items.map(item => item.slots).reduce((sum, current) => sum + current, 0);

		const cards = items.map(item => (
			<Col span={slots === 1 ? 12 : 6} key={item.id}>
				<PlayingCard onClick={() => this.setState({ selectedItem: item })}>
					<ItemCard item={item} />
				</PlayingCard>
			</Col>
		));

		const remaining = slots - used;
		if (remaining > 0) {
			const campaignItemsExist = this.props.game.items.some(item => item.location === location);
			for (let n = 0; n !== remaining; ++n) {
				cards.push(
					<Col span={slots === 1 ? 12 : 6} key={n}>
						<Button block={true} disabled={!campaignItemsExist} onClick={() => this.setState({ selectedLocation: location })}>
							{name}: no item
						</Button>
					</Col>
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
		let drawerTitle = '';
		let drawerContent = null;
		if (this.state.selectedItem !== null) {
			drawerTitle = 'Item';
			drawerContent = (
				<div>
					<PlayingCard>
						<ItemCard item={this.state.selectedItem} />
					</PlayingCard>
					<Divider/>
					<Button block={true} onClick={() => this.unequip()}>Unequip</Button>
				</div>
			);
		}
		if (this.state.selectedLocation !== ItemLocation.None) {
			const campaignItemCards = this.props.game.items
				.filter(item => item.location === this.state.selectedLocation)
				.map(item => (
					<Padding key={item.id}>
						<PlayingCard onClick={() => this.equip(item)}>
							<ItemCard item={item} />
						</PlayingCard>
					</Padding>
				));

			if (campaignItemCards.length === 0) {
				campaignItemCards.push(
					<div key='empty'>
						No items
					</div>
				);
			}

			drawerTitle = this.state.selectedLocation + ' Items';
			drawerContent = (
				<div>
					{campaignItemCards}
				</div>
			);
		}

		return (
			<div>
				<Divider>Hands</Divider>
				<Row gutter={10} justify='space-around' align='middle'>
					{this.getItemCards(ItemLocation.Hand, 'Hand', 2)}
				</Row>
				<Row gutter={10}>
					<Col span={12}>
						<Divider>Head</Divider>
						<Row gutter={10} justify='space-around' align='middle'>
							{this.getItemCards(ItemLocation.Head, 'Head')}
						</Row>
					</Col>
					<Col span={12}>
						<Divider>Neck</Divider>
						<Row gutter={10} justify='space-around' align='middle'>
							{this.getItemCards(ItemLocation.Neck, 'Neck')}
						</Row>
					</Col>
				</Row>
				<Row gutter={10}>
					<Col span={12}>
						<Divider>Body</Divider>
						<Row gutter={10} justify='space-around' align='middle'>
							{this.getItemCards(ItemLocation.Body, 'Body')}
						</Row>
					</Col>
					<Col span={12}>
						<Divider>Feet</Divider>
						<Row gutter={10} justify='space-around' align='middle'>
							{this.getItemCards(ItemLocation.Feet, 'Feet')}
						</Row>
					</Col>
				</Row>
				<Divider>Rings</Divider>
				<Row gutter={10} justify='space-around' align='middle'>
					{this.getItemCards(ItemLocation.Ring, 'Ring', 2)}
				</Row>
				<Drawer
					title={drawerTitle}
					width='25%'
					visible={drawerContent !== null}
					closable={true}
					maskClosable={true}
					onClose={() => this.setState({ selectedItem: null, selectedLocation: ItemLocation.None })}
				>
					{drawerContent}
				</Drawer>
			</div>
		);
	}
}

interface FeaturesPageProps {
	hero: Hero;
}

class FeaturesPage extends React.Component<FeaturesPageProps> {
	public render() {
		const featureCards = HeroHelper.featureDeck(this.props.hero).map(feature => {
			return (
				<Col span={6} key={feature.id}>
					<Padding>
						<PlayingCard>
							<FeatureCard feature={feature} />
						</PlayingCard>
					</Padding>
				</Col>
			);
		});

		return (
			<Row>
				{featureCards}
			</Row>
		);
	}
}

interface ActionsPageProps {
	hero: Hero;
}

class ActionsPage extends React.Component<ActionsPageProps> {
	public render() {
		const actionCards = HeroHelper.actionDeck(this.props.hero).map(action => {
			return (
				<Col span={6} key={action.id}>
					<Padding>
						<PlayingCard>
							<ActionCard action={action} />
						</PlayingCard>
					</Padding>
				</Col>
			);
		});

		return (
			<Row>
				{actionCards}
			</Row>
		);
	}
}

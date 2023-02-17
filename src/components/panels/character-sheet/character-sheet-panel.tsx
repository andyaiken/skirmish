import { Component } from 'react';
import { Selector, Tag, Text, TextType } from '../../../controls';
import { getBackground } from '../../../models/background';
import { FeatureModel } from '../../../models/feature';
import { GameModel } from '../../../models/game';
import { CombatantModel, getActionDeck, getCardSource, getFeatureDeck } from '../../../models/combatant';
import { ItemModel } from '../../../models/item';
import { getRole } from '../../../models/role';
import { getSpecies } from '../../../models/species';
import { shuffle } from '../../../utils/collections';
import { guid } from '../../../utils/utils';
import { ActionCard, FeatureCard } from '../../cards';
import { CardList, PlayingCard } from '../../utility';
import { Stats } from './stats/stats';
import { Items } from './items/items';
import { LevelUp } from './level-up/level-up';

import './character-sheet-panel.scss';

type ViewType = 'actions' | 'features' | 'items' | 'stats';

interface Props {
	hero: CombatantModel;
	game: GameModel;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
}

interface State {
	view: ViewType;
	features: FeatureModel[];
}

export class CharacterSheetPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'stats',
			features: this.drawFeatures(props.hero)
		};
	}

	drawFeatures = (hero: CombatantModel) => {
		return shuffle(getFeatureDeck(hero))
			.splice(0, 3)
			.map(f => {
				const copy = JSON.parse(JSON.stringify(f)) as FeatureModel;
				copy.id = guid();
				return copy;
			});
	};

	equipItem = (item: ItemModel) => {
		this.props.equipItem(item, this.props.hero);
	};

	unequipItem = (item: ItemModel) => {
		this.props.unequipItem(item, this.props.hero);
	};

	levelUp = (feature: FeatureModel) => {
		this.setState({
			features: this.drawFeatures(this.props.hero)
		}, () => {
			this.props.levelUp(feature, this.props.hero);
		});
	};

	public render() {
		let content = null;
		switch (this.state.view) {
			case 'stats':
				content = <Stats hero={this.props.hero} />;
				break;
			case 'items':
				content = (
					<Items
						hero={this.props.hero}
						game={this.props.game}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
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

		let sidebar = null;
		if (this.props.hero.xp >= this.props.hero.level) {
			sidebar = (
				<div className='sidebar-section'>
					<LevelUp hero={this.props.hero} features={this.state.features} levelUp={this.levelUp} />
				</div>
			);
		}

		return (
			<div className='character-sheet-panel'>
				<div className='main-section'>
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
				{sidebar}
			</div>
		);
	}
}

interface FeaturesPageProps {
	hero: CombatantModel;
}

class FeaturesPage extends Component<FeaturesPageProps> {
	public render() {
		const featureCards = getFeatureDeck(this.props.hero).map(feature => {
			const source = getCardSource(this.props.hero, feature.id, 'feature');
			return (
				<PlayingCard key={feature.id} front={<FeatureCard feature={feature} />} footer={source} />
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
	hero: CombatantModel;
}

class ActionsPage extends Component<ActionsPageProps> {
	public render() {
		const actionCards = getActionDeck(this.props.hero).map(action => {
			const source = getCardSource(this.props.hero, action.id, 'action');
			return (
				<PlayingCard key={action.id} front={<ActionCard action={action} />} footer={source} />
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

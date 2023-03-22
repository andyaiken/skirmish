import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';
import { FeatureType } from '../../../enums/feature-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { Collections } from '../../../utils/collections';
import { Utils } from '../../../utils/utils';

import { ActionCard, FeatureCard } from '../../cards';
import { CardList, PlayingCard, Tabs, Tag, Text, TextType } from '../../controls';
import { Items } from './items/items';
import { LevelUp } from './level-up/level-up';
import { Stats } from './stats/stats';

import './character-sheet-panel.scss';

type ViewType = 'actions' | 'features' | 'items' | 'stats';

interface Props {
	combatant: CombatantModel;
	game: GameModel;
	developer: boolean;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, combatant: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	levelUp: (feature: FeatureModel, combatant: CombatantModel) => void;
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
			features: this.drawFeatures(props.combatant)
		};
	}

	drawFeatures = (combatant: CombatantModel) => {
		const features = CombatantLogic.getFeatureDeck(combatant)
			.filter(feature => {
				// Make sure we can select this feature
				if (feature.type === FeatureType.Proficiency) {
					const profs = CombatantLogic.getProficiencies(combatant);
					if (profs.length <= 9) {
						// We already have all proficiencies
						return false;
					}
					if (profs.includes(feature.proficiency)) {
						// We already have this proficiency
						return false;
					}
				}
				return true;
			});
		return Collections.shuffle(features).splice(0, 3);
	};

	equipItem = (item: ItemModel) => {
		this.props.equipItem(item, this.props.combatant);
	};

	unequipItem = (item: ItemModel) => {
		this.props.unequipItem(item, this.props.combatant);
	};

	dropItem = (item: ItemModel) => {
		this.props.dropItem(item, this.props.combatant);
	};

	pickUpItem = (item: ItemModel) => {
		this.props.pickUpItem(item, this.props.combatant);
	};

	levelUp = (feature: FeatureModel) => {
		this.setState({
			features: this.drawFeatures(this.props.combatant)
		}, () => {
			const copy = JSON.parse(JSON.stringify(feature)) as FeatureModel;
			copy.id = Utils.guid();
			this.props.levelUp(copy, this.props.combatant);
		});
	};

	render = () => {
		const cutDown = (this.props.combatant.type === CombatantType.Monster) && !this.props.developer;

		const options = [
			{ id: 'stats', display: 'Statistics' },
			{ id: 'items', display: 'Equipment' }
		];
		if (!cutDown) {
			options.push({ id: 'features', display: 'Feature Deck' });
			options.push({ id: 'actions', display: 'Action Deck' });
		}

		let content = null;
		switch (this.state.view) {
			case 'stats':
				content = (
					<Stats
						combatant={this.props.combatant}
						encounter={this.props.game.encounter}
						developer={this.props.developer}
					/>
				);
				break;
			case 'items':
				content = (
					<Items
						combatant={this.props.combatant}
						game={this.props.game}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
					/>
				);
				break;
			case 'features':
				content = <FeaturesPage combatant={this.props.combatant} />;
				break;
			case 'actions':
				content = <ActionsPage combatant={this.props.combatant} />;
				break;
		}

		let selector = null;
		let sidebar = null;
		if (this.props.combatant.xp >= this.props.combatant.level) {
			sidebar = (
				<div className='sidebar-section'>
					<LevelUp combatant={this.props.combatant} features={this.state.features} levelUp={this.levelUp} />
				</div>
			);
		} else {
			selector = (
				<Tabs
					options={options}
					selectedID={this.state.view}
					onSelect={id => this.setState({ view: id as ViewType })}
				/>
			);
		}

		return (
			<div className='character-sheet-panel'>
				<div className='main-section'>
					<div className='header'>
						<Text type={TextType.Heading}>{this.props.combatant.name || 'unnamed hero'}</Text>
						<div className='tags'>
							<Tag>{GameLogic.getSpecies(this.props.combatant.speciesID)?.name ?? 'Unknown species'}</Tag>
							<Tag>{GameLogic.getRole(this.props.combatant.roleID)?.name ?? 'Unknown role'}</Tag>
							<Tag>{GameLogic.getBackground(this.props.combatant.backgroundID)?.name ?? 'Unknown background'}</Tag>
							<Tag>Level {this.props.combatant.level}</Tag>
						</div>
					</div>
					{selector}
					<div className='content'>
						{content}
					</div>
				</div>
				{sidebar}
			</div>
		);
	};
}

interface FeaturesPageProps {
	combatant: CombatantModel;
}

class FeaturesPage extends Component<FeaturesPageProps> {
	render = () => {
		const featureCards = CombatantLogic.getFeatureDeck(this.props.combatant).map(feature => {
			return (
				<PlayingCard
					key={feature.id}
					type={CardType.Feature}
					front={<FeatureCard feature={feature} />}
					footer={CombatantLogic.getCardSource(this.props.combatant, feature.id, 'feature')}
					footerType={CombatantLogic.getCardSourceType(this.props.combatant, feature.id, 'feature')}
				/>
			);
		});

		return (
			<div className='features-page'>
				<div className='column'>
					<Text>Each time {this.props.combatant.name} levels up, they get to choose one of these features.</Text>
					<CardList cards={featureCards} />
				</div>
			</div>
		);
	};
}

interface ActionsPageProps {
	combatant: CombatantModel;
}

class ActionsPage extends Component<ActionsPageProps> {
	render = () => {
		const actionCards = CombatantLogic.getActionDeck(this.props.combatant).map(action => {
			return (
				<PlayingCard
					key={action.id}
					type={CardType.Action}
					front={<ActionCard action={action} />}
					footer={CombatantLogic.getCardSource(this.props.combatant, action.id, 'action')}
					footerType={CombatantLogic.getCardSourceType(this.props.combatant, action.id, 'action')}
				/>
			);
		});

		return (
			<div className='actions-page'>
				<div className='column'>
					<Text>In an encounter, {this.props.combatant.name} will be able to choose from these actions.</Text>
					<CardList cards={actionCards} />
				</div>
			</div>
		);
	};
}

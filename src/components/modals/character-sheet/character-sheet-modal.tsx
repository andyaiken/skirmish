import { Component } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';

import { BaseData } from '../../../data/base-data';

import { CombatantType } from '../../../enums/combatant-type';
import { FeatureType } from '../../../enums/feature-type';
import { QuirkType } from '../../../enums/quirk-type';
import { StructureType } from '../../../enums/structure-type';

import { CombatantLogic } from '../../../logic/combatant/combatant-logic';
import { GameLogic } from '../../../logic/game/game-logic';
import { ThoughtLogic } from '../../../logic/thought/thought-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { ThoughtModel } from '../../../models/thought';

import { Collections } from '../../../utils/collections/collections';
import { Utils } from '../../../utils/utils/utils';

import { ActionCard, FeatureCard } from '../../cards';
import { CardList, Dialog, PreviewableCard, Tabs, Tag, Text, TextType } from '../../controls';
import { Items } from './items/items';
import { LevelUp } from './level-up/level-up';
import { Personality } from './personality/personality';
import { Stats } from './stats/stats';

import './character-sheet-modal.scss';

interface Props {
	combatant: CombatantModel;
	game: GameModel;
	developer: boolean;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, combatant: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	levelUp: (feature: FeatureModel, combatant: CombatantModel) => void;
	retireHero: (combatant: CombatantModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
	packIDs?: string[];
}

interface State {
	view: string;
	features: FeatureModel[];
	thought: ThoughtModel | null;
	personalityOpen: boolean;
}

export class CharacterSheetModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: (props.game.encounter === null) && (props.combatant.xp >= props.combatant.level) ? 'levelup' : 'stats',
			features: this.drawFeatures(props.combatant),
			thought: this.think(),
			personalityOpen: false
		};
	}

	think = () => {
		const hero = this.props.combatant;
		const inGame = this.props.game.heroes.some(h => h.id === hero.id) || !!this.props.game.encounter?.combatants.some(c => c.id === hero.id);
		if (!this.props.packIDs || !inGame || (hero.type !== CombatantType.Hero)) {
			return null;
		}
		return ThoughtLogic.getStableThought(this.props.game, hero, this.props.packIDs);
	};

	drawFeatures = (combatant: CombatantModel) => {
		let features: FeatureModel[] = [];
		features.push(...CombatantLogic.getFeatureDeck(combatant));
		features.push(...BaseData.getBaseFeatures());

		features = features.filter(feature => {
			// Make sure we can select this feature
			if (feature.type === FeatureType.Proficiency) {
				const profs = CombatantLogic.getProficiencies(combatant);
				if (profs.length >= 9) {
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
		const canLevelUpAgain = (this.props.combatant.xp - this.props.combatant.level) >= (this.props.combatant.level + 1);
		this.setState({
			view: canLevelUpAgain ? 'levelup' : 'stats',
			features: this.drawFeatures(this.props.combatant)
		}, () => {
			const copy = JSON.parse(JSON.stringify(feature)) as FeatureModel;
			copy.id = Utils.guid();
			this.props.levelUp(copy, this.props.combatant);
		});
	};

	render = () => {
		let options = [
			{ id: 'stats', display: 'Statistics' },
			{ id: 'items', display: 'Equipment' },
			{ id: 'features', display: 'Features' },
			{ id: 'actions', display: 'Actions' }
		];

		if (this.props.combatant.quirks.includes(QuirkType.Beast)) {
			options = options.filter(o => o.id !== 'items');
		}

		if ((this.props.game.encounter === null) && (this.props.combatant.xp >= this.props.combatant.level)) {
			options.unshift({ id: 'levelup', display: 'Level Up' });
		}

		let content = null;
		switch (this.state.view) {
			case 'levelup':
				content = (
					<LevelUp
						combatant={this.props.combatant}
						game={this.props.game}
						developer={this.props.developer}
						level={this.props.combatant.level + 1}
						features={this.state.features}
						spendCharge={this.props.spendCharge}
						levelUp={this.levelUp}
						redrawFeatures={spendCharge => {
							this.setState({
								features: this.drawFeatures(this.props.combatant)
							}, () => {
								if (spendCharge) {
									this.props.spendCharge(StructureType.TrainingGround, 1);
								}
							});
						}}
					/>
				);
				break;
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
			case 'features': {
				const cards = CombatantLogic.getFeatureDeck(this.props.combatant).map(f => (
					<PreviewableCard
						key={f.id}
						card={(
							<FeatureCard
								feature={f}
								footer={CombatantLogic.getFeatureSource(this.props.combatant, f.id)}
								footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, f.id)}
							/>
						)}
					/>
				));
				content = (
					<CardList cards={cards} />
				);
				break;
			}
			case 'actions':{
				const cards = CombatantLogic.getActionDeck(this.props.combatant).map(a => (
					<PreviewableCard
						key={a.id}
						card={(
							<ActionCard
								action={a}
								footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
								footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
							/>
						)}
					/>
				));
				content = (
					<CardList cards={cards} />
				);
				break;
			}
		}

		const species = GameLogic.getSpecies(this.props.combatant.speciesID);
		const role = GameLogic.getRole(this.props.combatant.roleID);
		const background = GameLogic.getBackground(this.props.combatant.backgroundID);

		return (
			<>
				<div className='character-sheet-modal'>
					<div className='main-section'>
						<div className='header'>
							<Text type={TextType.Heading}>{this.props.combatant.name || 'unnamed hero'}</Text>
							<div className='tags'>
								{species ? <Tag>{species.name}</Tag> : null}
								{role ? <Tag>{role.name}</Tag> : null}
								{background ? <Tag>{background.name}</Tag> : null}
								<Tag>Level {this.props.combatant.level}</Tag>
								{this.props.combatant.quirks.map((q, n) => (<Tag key={n}>{q}</Tag>))}
							</div>
							<div className='thought-row'>
								{this.state.thought
									? <Text type={TextType.Information}><p>“{this.state.thought.text}”</p></Text>
									: null}
								{this.props.combatant.type === CombatantType.Hero
									? <button
										type='button'
										className='personality-button'
										aria-label='View personality'
										aria-haspopup='dialog'
										title='View personality'
										onClick={() => this.setState({ personalityOpen: true })}
									>
										<IconInfoCircle />
									</button>
									: null}
							</div>
						</div>
						<Tabs
							options={options}
							selectedID={this.state.view}
							onSelect={id => this.setState({ view: id })}
						/>
						<div className='content'>
							{content}
						</div>
					</div>
				</div>
				{this.state.personalityOpen
					? <Dialog content={<Personality combatant={this.props.combatant} />} level={2} onClose={() => this.setState({ personalityOpen: false })} />
					: null}
			</>
		);
	};
}

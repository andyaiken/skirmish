import { Component } from 'react';

import { QuirkType } from '../../../enums/quirk-type';
import { StructureType } from '../../../enums/structure-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';
import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { Utils } from '../../../utils/utils';

import { ActionCard, FeatureCard, StrongholdBenefitCard } from '../../cards';
import { Badge, CardList, Tabs, Tag, Text, TextType } from '../../controls';
import { Items } from './items/items';
import { LevelUp } from './level-up/level-up';
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
	addXP: (combatant: CombatantModel, useCharge: StructureType | null) => void;
	useCharge: (type: StructureType, count: number) => void;
}

interface State {
	view: string;
}

export class CharacterSheetModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'stats'
		};
	}

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
		const copy = JSON.parse(JSON.stringify(feature)) as FeatureModel;
		copy.id = Utils.guid();
		this.props.levelUp(copy, this.props.combatant);
	};

	render = () => {
		try {
			let view = this.state.view;
			let selector = null;
			if (this.props.combatant.quirks.includes(QuirkType.Beast)) {
				selector = null;
			} else {
				const options = [
					{ id: 'stats', display: 'Statistics' },
					{ id: 'items', display: 'Equipment' },
					{ id: 'features', display: 'Feature Cards' },
					{ id: 'actions', display: 'Action Cards' }
				];

				const hasXP = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Academy) > 0;
				if ((this.props.game.encounter === null) && (hasXP || this.props.developer)) {
					options.push({
						id: 'benefits',
						display: 'Benefits'
					});
				} else {
					if (view === 'benefits') {
						view = 'stats';
					}
				}

				selector = (
					<Tabs
						options={options}
						selectedID={view}
						onSelect={id => this.setState({ view: id })}
					/>
				);
			}

			let content = null;
			switch (view) {
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
						<FeatureCard
							key={f.id}
							feature={f}
							footer={CombatantLogic.getFeatureSource(this.props.combatant, f.id)}
							footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, f.id)}
						/>
					));
					content = (
						<CardList cards={cards} />
					);
					break;
				}
				case 'actions':{
					const cards = CombatantLogic.getActionDeck(this.props.combatant).map(a => (
						<ActionCard
							key={a.id}
							action={a}
							footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
						/>
					));
					content = (
						<CardList cards={cards} />
					);
					break;
				}
				case 'benefits': {
					const cards = [];

					const xp = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Academy);
					if ((xp > 0) || this.props.developer) {
						cards.push(
							<StrongholdBenefitCard
								key='xp'
								label='Bonus XP'
								available={xp}
								developer={this.props.developer}
								onUse={() => this.props.addXP(this.props.combatant, this.props.developer ? null : StructureType.Academy)}
							/>

						);
					}

					content = (
						<CardList cards={cards} />
					);
					break;
				}
			}

			let levelUp = null;
			if ((this.props.game.encounter === null) && (this.props.combatant.xp >= this.props.combatant.level)) {
				levelUp = (
					<Badge value={`Choose a feature for level ${this.props.combatant.level + 1}`}>
						<LevelUp
							combatant={this.props.combatant}
							game={this.props.game}
							developer={this.props.developer}
							useCharge={this.props.useCharge}
							levelUp={this.levelUp}
						/>
					</Badge>
				);
			}

			const species = GameLogic.getSpecies(this.props.combatant.speciesID);
			const role = GameLogic.getRole(this.props.combatant.roleID);
			const background = GameLogic.getBackground(this.props.combatant.backgroundID);

			return (
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
						</div>
						{selector}
						<div className='content'>
							{content}
						</div>
					</div>
					{levelUp}
				</div>
			);
		} catch {
			return <div className='character-sheet-modal render-error' />;
		}
	};
}

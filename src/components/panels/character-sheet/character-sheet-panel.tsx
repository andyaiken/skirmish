import { Component } from 'react';

import { QuirkType } from '../../../enums/quirk-type';

import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { Utils } from '../../../utils/utils';

import { Tabs, Tag, Text, TextType } from '../../controls';
import { Items } from './items/items';
import { LevelUp } from './level-up/level-up';
import { Stats } from './stats/stats';

import './character-sheet-panel.scss';

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
}

interface State {
	view: string;
}

export class CharacterSheetPanel extends Component<Props, State> {
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
			}

			let selector = null;
			let sidebar = null;
			if (this.props.combatant.xp >= this.props.combatant.level) {
				sidebar = (
					<div className='sidebar-section'>
						<LevelUp combatant={this.props.combatant} developer={this.props.developer} levelUp={this.levelUp} />
					</div>
				);
			} else {
				const options = [
					{ id: 'stats', display: 'Statistics' },
					{ id: 'items', display: 'Equipment' }
				];
				selector = (
					<Tabs
						options={options}
						selectedID={this.state.view}
						onSelect={id => this.setState({ view: id })}
					/>
				);
			}

			const species = GameLogic.getSpecies(this.props.combatant.speciesID);
			const role = GameLogic.getRole(this.props.combatant.roleID);
			const background = GameLogic.getBackground(this.props.combatant.backgroundID);

			if (this.props.combatant.quirks.includes(QuirkType.Beast)) {
				selector = null;
			}

			return (
				<div className='character-sheet-panel'>
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
					{sidebar}
				</div>
			);
		} catch {
			return <div className='character-sheet-panel render-error' />;
		}
	};
}

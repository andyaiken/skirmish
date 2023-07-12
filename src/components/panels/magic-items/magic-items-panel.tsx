import { Component } from 'react';

import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { MagicItemGenerator } from '../../../generators/magic-item-generator';

import { CombatantLogic } from '../../../logic/combatant-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { CardList, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './magic-items-panel.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyItem: (item: ItemModel) => void;
}

interface State {
	magicItems: ItemModel[];
}

export class MagicItemsPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			magicItems: this.getItems()
		};
	}

	getItems = () => {
		const items: ItemModel[] = [];

		while (items.length < 3) {
			const item = MagicItemGenerator.generateRandomMagicItem(this.props.options.packIDs);

			let ok = true;

			// Make sure at least one hero can use this item
			const heroes = this.props.game.heroes
				.filter(h => (item.proficiency === ItemProficiencyType.None) || CombatantLogic.getProficiencies(h).includes(item.proficiency));
			if (heroes.length === 0) {
				ok = false;
			}

			// Make sure we don't suggest more than one weapon
			if (item.weapon) {
				if (items.filter(i => i.weapon).length > 0) {
					ok = false;
				}
			}

			// Make sure we don't suggest more than one armor
			if (item.armor) {
				if (items.filter(i => i.armor).length > 0) {
					ok = false;
				}
			}

			if (ok) {
				items.push(item);
			}
		}

		items.sort((a, b) => a.name.localeCompare(b.name));

		return items;
	};

	redraw = () => {
		this.setState({
			magicItems: this.getItems()
		});
	};

	render = () => {
		try {
			const cards = this.state.magicItems.map(item => (
				<ItemCard key={item.id} item={item} onSelect={this.props.buyItem} />
			));

			return (
				<div className='magic-items-panel'>
					<Text type={TextType.Heading}>Choose a Magic Item</Text>
					{this.props.options.developer ? <button className='developer' onClick={() => this.redraw()}>Redraw</button> : null}
					<div className='card-selection-row'>
						<CardList cards={cards} />
					</div>
				</div>
			);
		} catch {
			return <div className='magic-items-panel render-error' />;
		}
	};
}

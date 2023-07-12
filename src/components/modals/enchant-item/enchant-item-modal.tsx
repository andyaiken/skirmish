import { Component } from 'react';

import { MagicItemGenerator } from '../../../generators/magic-item-generator';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { CardList, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './enchant-item-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	enchantItem: (item: ItemModel, newItem: ItemModel) => void;
}

interface State {
	selectedItem: ItemModel | null;
	magicItems: ItemModel[];
}

export class EnchantItemModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			selectedItem: null,
			magicItems: []
		};
	}

	selectItem = (item: ItemModel) => {
		this.setState({
			selectedItem: item,
			magicItems: this.getItems(item)
		});
	};

	getItems = (baseItem: ItemModel) => {
		const items: ItemModel[] = [];

		while (items.length < 3) {
			items.push(MagicItemGenerator.generateMagicItem(baseItem, this.props.options.packIDs));
		}

		items.sort((a, b) => a.name.localeCompare(b.name));

		return items;
	};

	render = () => {
		try {
			if (this.state.selectedItem) {
				const cards = this.state.magicItems.map(item => (
					<div key={item.id}>
						<ItemCard item={item} onSelect={item => this.props.enchantItem(this.state.selectedItem as ItemModel, item)} />
					</div>
				));

				return (
					<div className='enchant-item-modal'>
						<Text type={TextType.Heading}>Choose an Enchantment</Text>
						{this.props.options.developer ? <button className='developer' onClick={() => this.selectItem(this.state.selectedItem as ItemModel)}>Redraw</button> : null}
						<div className='card-selection-row'>
							<CardList cards={cards} />
						</div>
					</div>
				);
			} else {
				const heroes = this.props.game.heroes.map(h => {
					const items = ([] as ItemModel[]).concat(h.items).concat(h.carried);
					if (items.length > 0) {
						const cards = items.map(item => (
							<div key={item.id}>
								<ItemCard item={item} onSelect={this.selectItem} />
							</div>
						));

						return (
							<div key={h.id} className='card-selection-row'>
								<Text type={TextType.MinorHeading}>{h.name}</Text>
								<CardList cards={cards} />
							</div>
						);
					}

					return null;
				});

				let other = null;
				if (this.props.game.items.length > 0) {
					const cards = this.props.game.items.map(item => (
						<div key={item.id}>
							<ItemCard item={item} onSelect={this.selectItem} />
						</div>
					));

					other = (
						<div className='card-selection-row'>
							<Text type={TextType.MinorHeading}>Other Items</Text>
							<CardList cards={cards} />
						</div>
					);
				}

				return (
					<div className='enchant-item-modal'>
						<Text type={TextType.Heading}>Choose an Item</Text>
						{heroes}
						{other}
					</div>
				);
			}

		} catch {
			return <div className='enchant-item-modal render-error' />;
		}
	};
}

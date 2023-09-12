import { Component } from 'react';

import { GameLogic } from '../../../logic/game-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';
import { Utils } from '../../../utils/utils';

import { CardList, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './buy-potion-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyItem: (item: ItemModel) => void;
}

interface State {
	potions: ItemModel[];
}

export class BuyPotionModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			potions: this.getItems()
		};
	}

	getItems = () => {
		const items: ItemModel[] = [];

		while (items.length < 3) {
			const potions = GameLogic.getPotionDeck(this.props.options.packIDs);
			const item = Collections.draw(potions);
			if (!items.map(i => i.name).includes(item.name)) {
				item.id = Utils.guid();
				items.push(item);
			}
		}

		items.sort((a, b) => a.name.localeCompare(b.name));

		return items;
	};

	redraw = () => {
		this.setState({
			potions: this.getItems()
		});
	};

	render = () => {
		try {
			const cards = this.state.potions.map(item => (
				<ItemCard key={item.id} item={item} onClick={this.props.buyItem} />
			));

			return (
				<div className='buy-potion-modal'>
					<Text type={TextType.Heading}>Choose a Potion</Text>
					<hr />
					{this.props.options.developer ? <button className='developer' onClick={() => this.redraw()}>Redraw</button> : null}
					<div className='card-selection-row'>
						<CardList cards={cards} />
					</div>
				</div>
			);
		} catch {
			return <div className='buy-potion-modal render-error' />;
		}
	};
}

import { Component } from 'react';

import type { GameModel } from '../../../../models/game';

import { CardList, PlayingCard, Text, TextType } from '../../../controls';
import { ItemCard } from '../../../cards';

import './items-page.scss';

interface Props {
	game: GameModel;
}

export class ItemsPage extends Component<Props> {
	public render() {
		let magicItems = null;
		if (this.props.game.items.filter(i => i.magic).length > 0) {
			const cards = this.props.game.items.filter(i => i.magic).map((i, n) => (<PlayingCard key={n} front={<ItemCard item={i} />} />));
			magicItems = (
				<div>
					<Text type={TextType.SubHeading}>Magic Items ({cards.length})</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let mundaneItems = null;
		if (this.props.game.items.filter(i => !i.magic).length > 0) {
			const cards = this.props.game.items.filter(i => !i.magic).map((i, n) => (<PlayingCard key={n} front={<ItemCard item={i} />} />));
			mundaneItems = (
				<div>
					<Text type={TextType.SubHeading}>Mundane Items ({cards.length})</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		return (
			<div className='items-page'>
				{magicItems}
				{mundaneItems}
			</div>
		);
	}
}

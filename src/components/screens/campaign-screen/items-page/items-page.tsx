import { Component } from 'react';

import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { CardList, PlayingCard, Text, TextType } from '../../../controls';
import { ItemCard } from '../../../cards';

import './items-page.scss';

interface Props {
	game: GameModel;
}

export class ItemsPage extends Component<Props> {
	public render() {
		if (this.props.game.items.length === 0) {
			return (
				<div className='items-page'>
					<Text type={TextType.Information}>You have no unequipped items.</Text>
				</div>
			);
		}

		const magicItems = this.props.game.items.filter(i => i.magic).sort((a, b) => a.name.localeCompare(b.name));
		const mundaneItems = this.props.game.items.filter(i => !i.magic).sort((a, b) => a.name.localeCompare(b.name));

		let magicItemSection = null;
		if (magicItems.length > 0) {
			const cards = magicItems.map(item => (<PlayingCard key={item.id} front={<ItemCard item={item} />} />));
			magicItemSection = (
				<div>
					<Text type={TextType.SubHeading}>Magic Items ({magicItems.length})</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let mundaneItemSection = null;
		if (mundaneItems.length > 0) {
			const cards = Collections.distinct(mundaneItems, i => i.name).map(item => {
				const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
				const count = mundaneItems.filter(i => i.id === item.id).length;
				copy.name = count > 1 ? `${copy.name} (${count})` : copy.name;

				return (
					<PlayingCard key={copy.id} front={<ItemCard item={copy} />} />
				);
			});
			mundaneItemSection = (
				<div>
					<Text type={TextType.SubHeading}>Items ({mundaneItems.length})</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		return (
			<div className='items-page'>
				{magicItemSection}
				{mundaneItemSection}
			</div>
		);
	}
}

import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { MagicItemGenerator } from '../../../../logic/magic-item-generator';

import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { CardList, Dialog, IconType, IconValue, PlayingCard, StatValue, Text, TextType } from '../../../controls';
import { ItemCard } from '../../../cards';

import './items-page.scss';

interface Props {
	game: GameModel;
	developer: boolean;
	buyItem: (item: ItemModel) => void;
	sellItem: (item: ItemModel, all: boolean) => void;
	addMoney: () => void;
}

interface State {
	magicItems: ItemModel[];
}

export class ItemsPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			magicItems: []
		};
	}

	showMarket = () => {
		const items = [
			MagicItemGenerator.generateMagicItem(),
			MagicItemGenerator.generateMagicItem(),
			MagicItemGenerator.generateMagicItem()
		];

		this.setState({
			magicItems: items
		});
	};

	buyItem = (item: ItemModel) => {
		this.setState({
			magicItems: []
		}, () => {
			this.props.buyItem(item);
		});
	};

	render = () => {
		const magicItems = this.props.game.items.filter(i => i.magic).sort((a, b) => a.name.localeCompare(b.name));
		const mundaneItems = this.props.game.items.filter(i => !i.magic).sort((a, b) => a.name.localeCompare(b.name));

		let magicItemSection = null;
		if (magicItems.length > 0) {
			const cards = magicItems.map(item => {
				return (
					<PlayingCard
						key={item.id}
						type={CardType.Item}
						front={<ItemCard item={item} />}
						footer={<button onClick={() => this.props.sellItem(item, true)}>Sell</button>}
					/>
				);
			});
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
				const count = mundaneItems.filter(i => i.name === item.name).length;

				let footer = (
					<button onClick={() => this.props.sellItem(item, true)}>Sell</button>
				);

				if (count > 1) {
					footer = (
						<div>
							<button onClick={() => this.props.sellItem(item, false)}>Sell One</button>
							<button onClick={() => this.props.sellItem(item, true)}>Sell All ({count})</button>
						</div>
					);
				}

				return (
					<PlayingCard
						key={item.id}
						type={CardType.Item}
						front={<ItemCard item={item} />}
						footer={footer}
					/>
				);
			});
			mundaneItemSection = (
				<div>
					<Text type={TextType.SubHeading}>Items ({mundaneItems.length})</Text>
					<CardList cards={cards} />
				</div>
			);
		} else {
			mundaneItemSection = (
				<div>
					<Text type={TextType.SubHeading}>Items ({mundaneItems.length})</Text>
					<Text type={TextType.Information}>You have no unequipped items.</Text>
				</div>
			);
		}

		const moneySection = (
			<div>
				<StatValue orientation='vertical' label='Money' value={<IconValue type={IconType.Money} value={this.props.game.money} />} />
				<button disabled={this.props.game.money < 100} onClick={() => this.showMarket()}>
					Buy a magic item<br/><IconValue type={IconType.Money} value={100} iconSize={12} />
				</button>
				{this.props.developer ? <button className='developer' onClick={() => this.props.addMoney()}>Add money</button> : null}
			</div>
		);

		let dialog = null;
		if (this.state.magicItems.length > 0) {
			const cards = this.state.magicItems.map(item => (
				<PlayingCard
					key={item.id}
					type={CardType.Item}
					front={<ItemCard item={item} />}
					onClick={() => this.buyItem(item)}
				/>
			));

			dialog = (
				<Dialog
					content={(
						<div>
							<Text type={TextType.Heading}>Choose a Magic Item</Text>
							<div className='card-selection-row'>
								<CardList cards={cards} />
							</div>
						</div>
					)}
				/>
			);
		}

		return (
			<div className='items-page'>
				<div className='items-column'>
					{magicItemSection}
					{mundaneItemSection}
				</div>
				<div className='divider' />
				<div className='wealth-column'>
					{moneySection}
				</div>
				{dialog}
			</div>
		);
	};
}

import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
import { GameLogic } from '../../../../logic/game-logic';

import { MagicItemGenerator } from '../../../../generators/magic-item-generator';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { BoonCard, ItemCard, PlaceholderCard } from '../../../cards';
import { CardList, Dialog, IconType, IconValue, PlayingCard, StatValue, Text, TextType } from '../../../controls';

import './items-page.scss';

interface Props {
	game: GameModel;
	developer: boolean;
	buyItem: (item: ItemModel) => void;
	sellItem: (item: ItemModel, all: boolean) => void;
	redeemBoon: (boon: BoonModel, combatant: CombatantModel | null) => void;
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
		let boons = null;
		if (this.props.game.boons.filter(boon => !GameLogic.getBoonIsHeroType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => !GameLogic.getBoonIsHeroType(boon))
				.map(b => (<PlayingCard key={b.id} type={CardType.Boon} front={<BoonCard boon={b} />} footer='Reward' onClick={() => this.props.redeemBoon(b, null)} />));
			boons = (
				<div>
					<Text type={TextType.SubHeading}>Rewards</Text>
					<Text type={TextType.Information}><b>You have won these rewards.</b> Select a card to redeem a reward.</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let magicItemSection = null;
		const magicItems = this.props.game.items.filter(i => i.magic).sort((a, b) => a.name.localeCompare(b.name));
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
		const mundaneItems = this.props.game.items.filter(i => !i.magic).sort((a, b) => a.name.localeCompare(b.name));
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

		const controlLand = this.props.game.map.squares.some(sq => sq.regionID === '');
		const moneySection = (
			<div>
				<Text type={TextType.SubHeading}>Money</Text>
				<StatValue orientation='vertical' label='Money' value={<IconValue type={IconType.Money} value={this.props.game.money} />} />
				{!controlLand ? <Text type={TextType.Information}>You can&apos;t buy anything until you control part of the island.</Text> : null}
				{this.props.developer ? <button className='developer' onClick={() => this.props.addMoney()}>Add money</button> : null}
			</div>
		);

		const enoughMoney = (this.props.game.money >= 100);
		let itemSection = null;
		if (controlLand && enoughMoney) {
			const count = Math.floor(this.props.game.money / 100);
			const text = count === 1 ? 'a magic item' : `${count} magic items`;
			itemSection = (
				<div>
					<Text type={TextType.SubHeading}>Magic Items</Text>
					<Text type={TextType.Information}><b>You have enough money to buy {text}.</b> Click the item deck below to choose an item.</Text>
					<div className='center'>
						<PlayingCard
							stack={true}
							front={<PlaceholderCard text='Magic Items' subtext={<IconValue type={IconType.Money} value={100} iconSize={15} />} />}
							onClick={() => this.showMarket()}
						/>
					</div>
				</div>
			);
		}

		let dialog = null;
		if (this.state.magicItems.length > 0) {
			const cards = this.state.magicItems.map(item => (
				<PlayingCard
					key={item.id}
					type={CardType.Item}
					front={<ItemCard item={item} />}
					footer='Item'
					onClick={() => this.buyItem(item)}
				/>
			));

			dialog = (
				<Dialog
					content={(
						<div>
							<Text type={TextType.Heading}>Choose a Magic Item</Text>
							{this.props.developer ? <button className='developer' onClick={this.showMarket}>Redraw</button> : null}
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
				<div className='items-content'>
					{magicItemSection}
					{mundaneItemSection}
				</div>
				<div className='sidebar'>
					<Text type={TextType.SubHeading}>Your Items</Text>
					<Text>This page lists the items that your heroes aren&apos;t currently using.</Text>
					<hr />
					{moneySection}
					{boons !== null ? <hr /> : null}
					{boons}
					{itemSection !== null ? <hr /> : null}
					{itemSection}
				</div>
				{dialog}
			</div>
		);
	};
}

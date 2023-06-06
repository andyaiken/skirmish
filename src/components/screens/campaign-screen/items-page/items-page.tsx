import { Component } from 'react';

import { ItemProficiencyType } from '../../../../enums/item-proficiency-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { GameLogic } from '../../../../logic/game-logic';

import { MagicItemGenerator } from '../../../../generators/magic-item-generator';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { BoonCard, ItemCard, PlaceholderCard } from '../../../cards';
import { CardList, Dialog, IconType, IconValue, PlayingCard, StatValue, Text, TextType } from '../../../controls';
import { ListItemPanel } from '../../../panels';

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
		const items: ItemModel[] = [];
		while (items.length < 3) {
			const item = MagicItemGenerator.generateMagicItem();

			const heroes = this.props.game.heroes
				.filter(h => h.name !== '')
				.filter(h => (item.proficiency === ItemProficiencyType.None) || CombatantLogic.getProficiencies(h).includes(item.proficiency));

			if (heroes.length > 0) {
				items.push(item);
			}
		}

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

	getSidebar = () => {
		const controlLand = this.props.game.map.squares.some(sq => sq.regionID === '');
		const enoughMoney = (this.props.game.money >= 100);

		const moneySection = (
			<div>
				<StatValue orientation='vertical' label='Money' value={<IconValue type={IconType.Money} value={this.props.game.money} />} />
				{(this.props.game.money > 0) && !controlLand ? <Text type={TextType.Information}><p>You can&apos;t buy anything until you control part of the island.</p></Text> : null}
				{this.props.developer ? <button className='developer' onClick={() => this.props.addMoney()}>Add money</button> : null}
			</div>
		);

		let boons = null;
		if (this.props.game.boons.filter(boon => !GameLogic.getBoonIsHeroType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => !GameLogic.getBoonIsHeroType(boon))
				.map(b => <BoonCard key={b.id} boon={b} onSelect={boon => this.props.redeemBoon(boon, null)} />);
			boons = (
				<div>
					<Text type={TextType.Information}><p><b>You have won these rewards.</b> Select a card to redeem a reward.</p></Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let itemSection = null;
		if (controlLand && enoughMoney) {
			const count = Math.floor(this.props.game.money / 100);
			const text = count === 1 ? 'a magic item' : `${count} magic items`;
			itemSection = (
				<div>
					<Text type={TextType.Information}><p><b>You have enough money to buy {text}.</b> Click the item deck below to choose an item.</p></Text>
					<div className='center'>
						<PlayingCard
							stack={true}
							front={
								<PlaceholderCard
									text='Magic Items'
									content={<IconValue type={IconType.Money} value={100} iconSize={15} />}
									onClick={() => this.showMarket()}
								/>
							}
						/>
					</div>
				</div>
			);
		}

		return (
			<div className='sidebar'>
				<Text type={TextType.SubHeading}>Your Equipment</Text>
				<Text>This page lists the items that your heroes aren&apos;t currently using.</Text>
				<hr />
				{moneySection}
				{boons !== null ? <hr /> : null}
				{boons}
				{itemSection !== null ? <hr /> : null}
				{itemSection}
			</div>
		);
	};

	getDialog = () => {
		if (this.state.magicItems.length === 0) {
			return null;
		}

		const cards = this.state.magicItems.map(item => {
			const heroes = this.props.game.heroes
				.filter(h => h.name !== '')
				.filter(h => (item.proficiency === ItemProficiencyType.None) || CombatantLogic.getProficiencies(h).includes(item.proficiency))
				.map(h => <ListItemPanel key={h.id} item={h.name} />);

			if (heroes.length === 0) {
				heroes.push(
					<Text key='empty' type={TextType.Small}>(none of your current heroes)</Text>
				);
			}

			return (
				<div key={item.id}>
					<ItemCard item={item} onSelect={this.buyItem} />
					<div className='usable-by'>
						Can be used by:
					</div>
					{heroes}
				</div>
			);
		});

		return (
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
	};

	render = () => {
		try {
			let magicItemSection = null;
			const magicItems = this.props.game.items.filter(i => i.magic).sort((a, b) => a.name.localeCompare(b.name));
			if (magicItems.length > 0) {
				const cards = magicItems.map(item => {
					const heroes = this.props.game.heroes
						.filter(h => h.name !== '')
						.filter(h => (item.proficiency === ItemProficiencyType.None) || CombatantLogic.getProficiencies(h).includes(item.proficiency))
						.map(h => <ListItemPanel key={h.id} item={h.name} />);

					if (heroes.length === 0) {
						heroes.push(
							<Text key='empty' type={TextType.Small}>(none of your current heroes)</Text>
						);
					}

					return (
						<div key={item.id}>
							<ItemCard item={item} />
							<div>
								<button onClick={() => this.props.sellItem(item, true)}>Sell</button>
							</div>
							<div className='usable-by'>
								Can be used by:
							</div>
							{heroes}
						</div>
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
						<div key={item.id}>
							<ItemCard item={item} />
							{footer}
						</div>
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
						<Text type={TextType.SubHeading}>Items (0)</Text>
						<Text type={TextType.Information}><p>You have no unequipped items.</p></Text>
					</div>
				);
			}

			return (
				<div className='items-page'>
					<div className='items-content'>
						{magicItemSection}
						{mundaneItemSection}
					</div>
					{this.getSidebar()}
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='items-page render-error' />;
		}
	};
}

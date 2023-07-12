import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { Collections } from '../../../../utils/collections';
import { Utils } from '../../../../utils/utils';

import { BoonCard, ItemCard } from '../../../cards';
import { BuyEquipmentModal, BuyMagicItemModal, BuyPotionModal, EnchantItemModal, MagicItemInfoModal } from '../../../modals';
import { CardList, Dialog, IconType, IconValue, StatValue, Text, TextType } from '../../../controls';

import './items-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyItem: (item: ItemModel) => void;
	sellItem: (item: ItemModel, all: boolean) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, combatant: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => void;
	addMoney: () => void;
}

interface State {
	showMarket: 'magical' | 'potion' | 'mundane' | null;
	showEnchant: boolean;
	selectedMagicItem: ItemModel | null;
	selectedBoon: BoonModel | null;
}

export class ItemsPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showMarket: null,
			showEnchant: false,
			selectedMagicItem: null,
			selectedBoon: null
		};
	}

	selectBoon = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.ExtraHero:
			case BoonType.MagicItem:
			case BoonType.Money: {
				this.props.redeemBoon(boon, null, null, null, 0);
				break;
			}
			case BoonType.ExtraXP:
			case BoonType.LevelUp:
			case BoonType.EnchantItem: {
				this.setState({
					selectedBoon: boon
				});
				break;
			}
		}
	};

	showMarket = (market: 'magical' | 'potion' | 'mundane' | null) => {
		this.setState({
			showMarket: market
		});
	};

	showEnchant = (show: boolean) => {
		this.setState({
			showEnchant: show
		});
	};

	buyItem = (item: ItemModel) => {
		this.setState({
			showMarket: null
		}, () => {
			this.props.buyItem(item);
		});
	};

	enchantItem = (item: ItemModel, newItem: ItemModel) => {
		let boon = this.state.selectedBoon;
		let cost = 0;
		if (!boon) {
			boon = {
				id: Utils.guid(),
				type: BoonType.EnchantItem,
				data: null
			};
			cost = 100;
		}

		this.setState({
			selectedBoon: null,
			showEnchant: false
		}, () => {
			this.props.redeemBoon(boon as BoonModel, null, item, newItem, cost);
		});
	};

	equipItem = (item: ItemModel, hero: CombatantModel) => {
		this.setState({
			selectedMagicItem: null
		}, () => {
			this.props.equipItem(item, hero);
		});
	};

	getSidebar = () => {
		const controlLand = this.props.game.map.squares.some(sq => sq.regionID === '');

		const moneySection = (
			<div>
				<StatValue orientation='vertical' label='Money' value={<IconValue type={IconType.Money} value={this.props.game.money} />} />
				{this.props.options.developer ? <button className='developer' onClick={() => this.props.addMoney()}>Add money</button> : null}
			</div>
		);

		let boons = null;
		if (this.props.game.boons.filter(boon => !GameLogic.getBoonIsHeroType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => !GameLogic.getBoonIsHeroType(boon))
				.map(b => <BoonCard key={b.id} boon={b} onSelect={boon => this.selectBoon(boon)} />);
			boons = (
				<div>
					<Text type={TextType.Information}><p><b>You have won these rewards.</b> Select a card to redeem a reward.</p></Text>
					<CardList cards={cards} />
				</div>
			);
		}

		const buySection = [];
		if (controlLand) {
			if (this.props.game.money >= 2) {
				buySection.push(
					<button key='mundane' onClick={() => this.showMarket('mundane')}>
						<div>Buy equipment</div>
						<IconValue type={IconType.Money} value={2} iconSize={12} />
					</button>
				);
			}
			if (this.props.game.money >= 20) {
				buySection.push(
					<button key='potion' onClick={() => this.showMarket('potion')}>
						<div>Buy a potion</div>
						<IconValue type={IconType.Money} value={20} iconSize={12} />
					</button>
				);
			}
			if (this.props.game.money >= 100) {
				buySection.push(
					<button key='magical' onClick={() => this.showMarket('magical')}>
						<div>Buy a magic item</div>
						<IconValue type={IconType.Money} value={100} iconSize={12} />
					</button>
				);
			}
		} else if (this.props.game.money > 0) {
			buySection.push(
				<Text key='cannot-buy' type={TextType.Information}>
					<p>You can&apos;t buy anything until you control part of the island.</p>
				</Text>
			);
		}

		let enchantSection = null;
		if (this.props.game.money >= 100) {
			enchantSection = (
				<button onClick={() => this.showEnchant(true)}>
					<div>Enchant an item</div>
					<IconValue type={IconType.Money} value={100} iconSize={12} />
				</button>
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
				{buySection.length !== 0 ? <hr /> : null}
				{buySection}
				{enchantSection !== null ? <hr /> : null}
				{enchantSection}
			</div>
		);
	};

	getDialog = () => {
		if (this.state.showMarket === 'magical') {
			return (
				<Dialog
					content={(
						<BuyMagicItemModal
							game={this.props.game}
							options={this.props.options}
							buyItem={this.buyItem}
						/>
					)}
				/>
			);
		}

		if (this.state.showMarket === 'potion') {
			return (
				<Dialog
					content={(
						<BuyPotionModal
							game={this.props.game}
							options={this.props.options}
							buyItem={this.buyItem}
						/>
					)}
				/>
			);
		}

		if (this.state.showMarket === 'mundane') {
			return (
				<Dialog
					content={(
						<BuyEquipmentModal
							game={this.props.game}
							options={this.props.options}
							buyItem={this.buyItem}
						/>
					)}
					onClose={() => this.showMarket(null)}
				/>
			);
		}

		if (this.state.selectedMagicItem) {
			return (
				<Dialog
					content={(
						<MagicItemInfoModal
							item={this.state.selectedMagicItem}
							game={this.props.game}
							equipItem={this.equipItem}
							dropItem={this.props.dropItem}
						/>
					)}
					onClose={() => this.setState({ selectedMagicItem: null })}
				/>
			);
		}

		if (this.state.showEnchant || (this.state.selectedBoon && (this.state.selectedBoon.type === BoonType.EnchantItem))) {
			return (
				<Dialog
					content={(
						<EnchantItemModal
							game={this.props.game}
							options={this.props.options}
							enchantItem={this.enchantItem}
						/>
					)}
					onClose={() => this.showEnchant(false)}
				/>
			);
		}

		return null;
	};

	render = () => {
		try {
			let magicItemSection = null;
			const magicItems = this.props.game.items.filter(i => i.magic).sort((a, b) => a.name.localeCompare(b.name));
			if (magicItems.length > 0) {
				const cards = magicItems.map(item => (
					<div key={item.id}>
						<ItemCard item={item} onSelect={i => this.setState({ selectedMagicItem: i })} />
						<div>
							<button onClick={() => this.props.sellItem(item, false)}>
								Sell<br /><IconValue type={IconType.Money} value={50} iconSize={12} />
							</button>
						</div>
					</div>
				));
				magicItemSection = (
					<div>
						<CardList cards={cards} />
					</div>
				);
			}

			let potionSection = null;
			const potions = this.props.game.items.filter(i => !i.magic && i.potion).sort((a, b) => a.name.localeCompare(b.name));
			if (potions.length > 0) {
				const cards = Collections.distinct(potions, i => i.name).map(item => {
					const count = potions.filter(i => i.name === item.name).length;

					let footer = (
						<button onClick={() => this.props.sellItem(item, true)}>
							Sell<br /><IconValue type={IconType.Money} value={10} iconSize={12} />
						</button>
					);

					if (count > 1) {
						footer = (
							<div>
								<button onClick={() => this.props.sellItem(item, false)}>
									Sell One<br /><IconValue type={IconType.Money} value={10} iconSize={12} />
								</button>
								<button onClick={() => this.props.sellItem(item, true)}>
									Sell All ({count})<br /><IconValue type={IconType.Money} value={10 * count} iconSize={12} />
								</button>
							</div>
						);
					}

					return (
						<div key={item.id}>
							<ItemCard item={item} count={count} />
							{footer}
						</div>
					);
				});
				potionSection = (
					<div>
						<CardList cards={cards} />
					</div>
				);
			}

			let mundaneItemSection = null;
			const mundaneItems = this.props.game.items.filter(i => !i.magic && !i.potion).sort((a, b) => a.name.localeCompare(b.name));
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
							<ItemCard item={item} count={count} />
							{footer}
						</div>
					);
				});
				mundaneItemSection = (
					<div>
						<CardList cards={cards} />
					</div>
				);
			}

			let empty = null;
			if (this.props.game.items.length === 0) {
				empty = (
					<Text type={TextType.Information}>
						<p>You have no unequipped items.</p>
					</Text>
				);
			}

			return (
				<div className='items-page'>
					<div className='items-content'>
						{magicItemSection ? <Text type={TextType.SubHeading}>Magic Items</Text> : null}
						{magicItemSection}
						{potionSection ? <Text type={TextType.SubHeading}>Potions</Text> : null}
						{potionSection}
						{mundaneItemSection ? <Text type={TextType.SubHeading}>Non-Magic Items</Text> : null}
						{mundaneItemSection}
						{empty}
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

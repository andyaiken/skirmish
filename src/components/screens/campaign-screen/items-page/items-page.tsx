import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { OrientationType } from '../../../../enums/orientation-type';
import { StructureType } from '../../../../enums/structure-type';

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
import { CardList, Dialog, IconSize, IconType, IconValue, Text, TextType } from '../../../controls';

import './items-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	orientation: OrientationType;
	buyItem: (item: ItemModel) => void;
	sellItem: (item: ItemModel, all: boolean) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, combatant: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => void;
	useCharge: (type: StructureType, count: number) => void;
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
			showEnchant: show,
			selectedBoon: null
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

	sellMagicItem = (item: ItemModel) => {
		this.setState({
			selectedMagicItem: null
		}, () => {
			this.props.sellItem(item, false);
		});
	};

	getSidebar = () => {
		let boons = null;
		if (this.props.game.boons.filter(boon => GameLogic.getBoonIsItemType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => GameLogic.getBoonIsItemType(boon))
				.map(b => <BoonCard key={b.id} boon={b} onClick={boon => this.selectBoon(boon)} />);
			boons = (
				<div>
					<Text type={TextType.Information}><p><b>You have won these rewards.</b> Select a card to redeem a reward.</p></Text>
					<CardList cards={cards} />
				</div>
			);
		}

		const buySection = [];
		if (GameLogic.getItemDeck(this.props.options.packIDs).length > 0) {
			buySection.push(
				<button key='mundane' disabled={this.props.game.money < 2} onClick={() => this.showMarket('mundane')}>
					<div>Buy equipment</div>
					<IconValue type={IconType.Money} value={2} size={IconSize.Button} />
				</button>
			);
		}
		if (GameLogic.getPotionDeck(this.props.options.packIDs).length > 0) {
			buySection.push(
				<button key='potion' disabled={this.props.game.money < 20} onClick={() => this.showMarket('potion')}>
					<div>Buy a potion</div>
					<IconValue type={IconType.Money} value={20} size={IconSize.Button} />
				</button>
			);
		}
		if (GameLogic.getItemDeck(this.props.options.packIDs).length > 0) {
			buySection.push(
				<button key='magical' disabled={this.props.game.money < 100} onClick={() => this.showMarket('magical')}>
					<div>Buy a magic item</div>
					<IconValue type={IconType.Money} value={100} size={IconSize.Button} />
				</button>
			);
		}

		return (
			<div className='sidebar'>
				<div className='sidebar-section'>
					<Text type={TextType.SubHeading}>Your Equipment</Text>
					<Text>This page lists the items that your heroes aren&apos;t currently using.</Text>
				</div>
				{
					boons !== null ?
						<div className='sidebar-section'>
							{boons}
						</div>
						: null
				}
				<div className='sidebar-section'>
					{buySection}
					<button disabled={this.props.game.money < 100} onClick={() => this.showEnchant(true)}>
						<div>Enchant an item</div>
						<IconValue type={IconType.Money} value={100} size={IconSize.Button} />
					</button>
				</div>
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
							useCharge={this.props.useCharge}
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
							useCharge={this.props.useCharge}
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
							options={this.props.options}
							equipItem={this.equipItem}
							dropItem={this.props.dropItem}
							sellItem={this.sellMagicItem}
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
							useCharge={this.props.useCharge}
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
			const magicItems = Collections.sort(this.props.game.items.filter(i => i.magic), n => n.name);
			if (magicItems.length > 0) {
				const cards = magicItems.map(item => (
					<div key={item.id}>
						<ItemCard item={item} onClick={i => this.setState({ selectedMagicItem: i })} />
					</div>
				));
				magicItemSection = (
					<div>
						<CardList cards={cards} />
					</div>
				);
			}

			let potionSection = null;
			const potions = Collections.sort(this.props.game.items.filter(i => !i.magic && i.potion), n => n.name);
			if (potions.length > 0) {
				const cards = Collections.distinct(potions, i => i.name).map(item => {
					const count = potions.filter(i => i.name === item.name).length;

					let footer = (
						<button onClick={() => this.props.sellItem(item, true)}>
							Sell<br /><IconValue type={IconType.Money} value={10} size={IconSize.Button} />
						</button>
					);

					if (count > 1) {
						footer = (
							<div>
								<button onClick={() => this.props.sellItem(item, false)}>
									Sell One<br /><IconValue type={IconType.Money} value={10} size={IconSize.Button} />
								</button>
								<button onClick={() => this.props.sellItem(item, true)}>
									Sell All ({count})<br /><IconValue type={IconType.Money} value={10 * count} size={IconSize.Button} />
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
			const mundaneItems = Collections.sort(this.props.game.items.filter(i => !i.magic && !i.potion), n => n.name);
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
					<Text type={TextType.Empty}>
						You have no unequipped items.
					</Text>
				);
			}

			return (
				<div className={`items-page ${this.props.orientation}`}>
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

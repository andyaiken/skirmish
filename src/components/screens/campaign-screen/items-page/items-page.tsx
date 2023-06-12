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
import { CardList, ConfirmButton, Dialog, IconType, IconValue, PlayingCard, StatValue, Switch, Text, TextType } from '../../../controls';
import { MagicItemInfoPanel } from '../../../panels';

import './items-page.scss';

interface Props {
	game: GameModel;
	developer: boolean;
	buyItem: (item: ItemModel) => void;
	sellItem: (item: ItemModel, all: boolean) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	buyAndEquipItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, combatant: CombatantModel | null) => void;
	addMoney: () => void;
}

interface State {
	showUsable: boolean;
	magicItems: ItemModel[];
}

export class ItemsPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showUsable: false,
			magicItems: []
		};
	}

	showMarket = () => {
		const items: ItemModel[] = [];
		while (items.length < 3) {
			const item = MagicItemGenerator.generateMagicItem();

			const heroes = this.props.game.heroes
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

	buyAndEquipItem = (item: ItemModel, hero: CombatantModel) => {
		this.setState({
			magicItems: []
		}, () => {
			this.props.buyAndEquipItem(item, hero);
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
									content={<div><IconValue type={IconType.Money} value={100} iconSize={15} /></div>}
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
				{this.props.game.items.some(i => i.magic) ? <Switch label='Magic Item Usability' checked={this.state.showUsable} onChange={value => this.setState({ showUsable: value })} /> : null}
				{this.props.game.items.some(i => i.magic) ? <hr /> : null}
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

		const cards = this.state.magicItems.map(item => (
			<div key={item.id}>
				<ItemCard item={item} onSelect={this.buyItem} />
				<MagicItemInfoPanel item={item} game={this.props.game} isInsideDialog={true} equipItem={this.buyAndEquipItem} dropItem={this.props.dropItem} />
			</div>
		));

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
				const cards = magicItems.map(item => (
					<div key={item.id}>
						<ItemCard item={item} />
						<div>
							<ConfirmButton label='Sell (50)' onClick={() => this.props.sellItem(item, false)} />
						</div>
						{
							this.state.showUsable ?
								<MagicItemInfoPanel item={item} game={this.props.game} isInsideDialog={false} equipItem={this.props.equipItem} dropItem={this.props.dropItem} />
								: null
						}
					</div>
				));
				magicItemSection = (
					<div>
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
						{magicItemSection && mundaneItemSection ? <Text type={TextType.SubHeading}>Magic Items</Text> : null}
						{magicItemSection}
						{magicItemSection && mundaneItemSection ? <hr /> : null}
						{magicItemSection && mundaneItemSection ? <Text type={TextType.SubHeading}>Non-Magic Items</Text> : null}
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

import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
import { ItemLocationType } from '../../../../enums/item-location-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { Box, CardList, Dialog, IconType, IconValue, PlayingCard, Text, TextType } from '../../../controls';
import { ItemCard, PlaceholderCard } from '../../../cards';

import './items.scss';

interface Props {
	hero: CombatantModel;
	game: GameModel;
	equipItem: (item: ItemModel) => void;
	unequipItem: (item: ItemModel) => void;
	pickUpItem: (item: ItemModel) => void;
	dropItem: (item: ItemModel) => void;
}

interface State {
	selectedLocation: ItemLocationType;
}

export class Items extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedLocation: ItemLocationType.None
		};
	}

	equipItem = (item: ItemModel) => {
		this.setState({
			selectedLocation: ItemLocationType.None
		}, () => {
			this.props.equipItem(item);
		});
	};

	pickUpItem = (item: ItemModel) => {
		this.setState({
			selectedLocation: ItemLocationType.None
		}, () => {
			this.props.pickUpItem(item);
		});
	};

	getLocationSection = (location: ItemLocationType) => {
		let className = 'location-section';
		switch (location) {
			case ItemLocationType.Hand:
			case ItemLocationType.Ring:
				className += ' double';
		}

		const cards = this.props.hero.items
			.filter(item => location === item.location)
			.map(item => {
				let unequip: JSX.Element | string = 'Carry';
				if (this.props.game.encounter) {
					unequip = (
						<div>Carry<br/><IconValue type={IconType.Movement} value={1} iconSize={12} /></div>
					);
				}

				let footer: JSX.Element | null = (
					<div>
						<button disabled={this.props.hero.carried.length >= 6} onClick={() => this.props.unequipItem(item)}>{unequip}</button>
						<button onClick={() => this.props.dropItem(item)}>Drop</button>
					</div>
				);
				if (!!this.props.game.encounter && !this.props.hero.combat.current) {
					footer = null;
				}

				return (
					<div key={item.id} className='item'>
						<PlayingCard type={CardType.Item} front={<ItemCard item={item} />} footer={footer} />
					</div>
				);
			});

		if (this.props.game.encounter && !this.props.hero.combat.current) {
			if (cards.length === 0) {
				cards.push(
					<div key='empty' className='item'>
						<PlayingCard front={<PlaceholderCard>No items</PlaceholderCard>} />
					</div>
				);
			}
		} else {
			let slotsTotal = 1;
			switch (location) {
				case ItemLocationType.Hand:
				case ItemLocationType.Ring:
					slotsTotal = 2;
					break;
			}

			const slotsUsed = this.props.hero.items
				.filter(i => i.location === location)
				.map(i => i.slots)
				.reduce((sum, value) => sum + value, 0);

			const slotsAvailable = slotsTotal - slotsUsed;
			if (slotsAvailable > 0) {
				cards.push(
					<div key='add' className='item'>
						<PlayingCard front={<PlaceholderCard>Choose an Item</PlaceholderCard>} onClick={() => this.setState({ selectedLocation: location })} />
					</div>
				);
			}
		}

		return (
			<div className={className}>
				<Box label={location}>
					<div className='cards'>
						{cards}
					</div>
				</Box>
			</div>
		);
	};

	getCarriedItemSection = () => {
		const cards = this.props.hero.carried
			.map(item => {
				let equip: JSX.Element | string = 'Equip';
				if (this.props.game.encounter) {
					equip = (
						<div>Equip<br/><IconValue type={IconType.Movement} value={1} iconSize={12} /></div>
					);
				}

				let footer: JSX.Element | null = (
					<div className='item-options'>
						<button disabled={!CombatantLogic.canEquip(this.props.hero, item)} onClick={() => this.props.equipItem(item)}>{equip}</button>
						<button onClick={() => this.props.dropItem(item)}>Drop</button>
					</div>
				);
				if (!!this.props.game.encounter && !this.props.hero.combat.current) {
					footer = null;
				}

				return (
					<div key={item.id} className='item'>
						<PlayingCard type={CardType.Item} front={<ItemCard item={item} />} footer={footer} />
					</div>
				);
			});

		if (this.props.game.encounter) {
			if (this.props.hero.carried.length === 0) {
				cards.push(
					<div key='empty' className='item'>
						<PlayingCard front={<PlaceholderCard>No Items</PlaceholderCard>} />
					</div>
				);
			}
		} else if (this.props.hero.carried.length < 6) {
			cards.push(
				<div key='add' className='item'>
					<PlayingCard front={<PlaceholderCard>Choose an Item</PlaceholderCard>} onClick={() => this.setState({ selectedLocation: ItemLocationType.Carried })} />
				</div>
			);
		}

		return (
			<CardList cards={cards} />
		);
	};

	getDialogContent = () => {
		if (this.state.selectedLocation === ItemLocationType.None) {
			return null;
		}

		let items: ItemModel[] = [];
		if (this.props.game.encounter) {
			// Get items we're carrying
			items = items.concat(this.props.hero.carried);
		} else {
			// Get game items
			items = items.concat(this.props.game.items);
		}

		if (this.state.selectedLocation !== ItemLocationType.Carried) {
			// We only want items for this location
			items = items.filter(item => item.location === this.state.selectedLocation);

			// Ignore items we can't equip
			items = items.filter(item => CombatantLogic.canEquip(this.props.hero, item));
		}

		if (items.length === 0) {
			return (
				<Text type={TextType.Information}>No available items.</Text>
			);
		}

		items.sort((a, b) => a.name.localeCompare(b.name));
		const magicItems = items.filter(i => i.magic);
		const mundaneItems = items.filter(i => !i.magic);

		let magic = null;
		if (magicItems.length > 0) {
			const magicCards = magicItems.map(item => {
				return (
					<PlayingCard
						key={item.id}
						type={CardType.Item}
						front={<ItemCard item={item} />}
						onClick={() => this.pickUpItem(item)}
					/>
				);
			});

			magic = (
				<div>
					<Text type={TextType.SubHeading}>Magic Items</Text>
					<CardList cards={magicCards} />
				</div>
			);
		}

		let mundane = null;
		if (mundaneItems.length > 0) {
			const mundaneCards = Collections.distinct(mundaneItems, i => i.name).map(item => {
				const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
				const count = items.filter(i => i.id === item.id).length;
				copy.name = count > 1 ? `${copy.name} (${count})` : copy.name;

				return (
					<PlayingCard
						key={item.id}
						type={CardType.Item}
						front={<ItemCard item={copy} />}
						onClick={() => this.pickUpItem(item)}
					/>
				);
			});

			mundane = (
				<div>
					<Text type={TextType.SubHeading}>Items</Text>
					<CardList cards={mundaneCards} />
				</div>
			);
		}

		return (
			<div>
				{magic}
				{mundane}
			</div>
		);
	};

	render = () => {
		const dialogContent = this.getDialogContent();

		return (
			<div className='items'>
				<Text type={TextType.SubHeading}>Equipped</Text>
				<div className='equipped'>
					<div className='grid-cell'>
						{this.getLocationSection(ItemLocationType.Hand)}
					</div>
					<div className='grid-cell'>
						{this.getLocationSection(ItemLocationType.Body)}
						{this.getLocationSection(ItemLocationType.Feet)}
					</div>
					<div className='grid-cell'>
						{this.getLocationSection(ItemLocationType.Head)}
						{this.getLocationSection(ItemLocationType.Neck)}
					</div>
					<div className='grid-cell'>
						{this.getLocationSection(ItemLocationType.Ring)}
					</div>
				</div>
				<hr />
				<Text type={TextType.SubHeading}>Carried ({this.props.hero.carried.length} / 6)</Text>
				{this.getCarriedItemSection()}
				{dialogContent ? <Dialog content={dialogContent} onClickOff={() => this.setState({ selectedLocation: ItemLocationType.None })} /> : null}
			</div>
		);
	};
}

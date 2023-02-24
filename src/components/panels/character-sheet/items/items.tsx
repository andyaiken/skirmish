import { Component } from 'react';

import { ItemLocationType } from '../../../../enums/item-location-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Box, CardList, Dialog, IconType, IconValue, PlayingCard, Text, TextType } from '../../../controls';
import { ItemCard } from '../../../cards';

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

	private equipItem = (item: ItemModel) => {
		this.setState({
			selectedLocation: ItemLocationType.None
		}, () => {
			this.props.equipItem(item);
		});
	};

	private pickUpItem = (item: ItemModel) => {
		this.setState({
			selectedLocation: ItemLocationType.None
		}, () => {
			this.props.pickUpItem(item);
		});
	};

	private getLocationSection = (location: ItemLocationType) => {
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
						<div>Carry<br/><IconValue type={IconType.Movement} value={1} /></div>
					);
				}

				return (
					<div key={item.id} className='item'>
						<PlayingCard front={<ItemCard item={item} />} />
						<button disabled={this.props.hero.carried.length >= 6} onClick={() => this.props.unequipItem(item)}>{unequip}</button>
						<button onClick={() => this.props.dropItem(item)}>Drop</button>
					</div>
				);
			});

		if (cards.length === 0) {
			cards.push(<div key='empty'>No items</div>);
		}

		return (
			<div className={className}>
				<Box label={location}>
					<div className='cards'>
						{cards}
					</div>
					<button disabled={this.getEquippableItems(ItemLocationType.Body).length === 0} onClick={() => this.setState({ selectedLocation: ItemLocationType.Body })}>
						Choose an Item
					</button>
				</Box>
			</div>
		);
	};

	private getCarriedItemCards = () => {
		const cards = this.props.hero.carried
			.map(item => {
				let equip: JSX.Element | string = 'Equip';
				if (this.props.game.encounter) {
					equip = (
						<div>Equip<br/><IconValue type={IconType.Movement} value={1} /></div>
					);
				}

				return (
					<div key={item.id} className='item'>
						<PlayingCard front={<ItemCard item={item} />} />
						<button disabled={!CombatantLogic.canEquip(this.props.hero, item)} onClick={() => this.props.equipItem(item)}>{equip}</button>
						<button onClick={() => this.props.dropItem(item)}>Drop</button>
					</div>
				);
			});

		if (cards.length === 0) {
			cards.push(<div key='empty'>No items</div>);
		}

		return cards;
	};

	private getEquippableItems = (location: ItemLocationType) => {
		// Get all game items and items carried by other heroes
		let items = ([] as ItemModel[]).concat(this.props.game.items);
		this.props.game.heroes
			.filter(h => h.id !== this.props.hero.id)
			.forEach(h => items.push(...h.carried));

		if (location !== ItemLocationType.Carried) {
			// We only want items for this location
			items = items.filter(item => item.location === location);

			// Ignore items we can't equip
			items = items.filter(item => CombatantLogic.canEquip(this.props.hero, item));
		}

		return items;
	};

	public render() {
		let dialogContent = null;
		if (this.state.selectedLocation !== ItemLocationType.None) {
			const items = this.getEquippableItems(this.state.selectedLocation);
			const campaignItemCards = items
				.map(item => (
					<div key={item.id}>
						<PlayingCard
							front={<ItemCard item={item} />}
							onClick={() => this.state.selectedLocation === ItemLocationType.Carried ? this.pickUpItem(item) : this.equipItem(item)}
						/>
					</div>
				));

			if (campaignItemCards.length === 0) {
				campaignItemCards.push(
					<div key='empty'>
						No items
					</div>
				);
			}

			dialogContent = (
				<CardList cards={campaignItemCards} />
			);
		}

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
				<Text type={TextType.SubHeading}>Carried</Text>
				<div className='carried'>
					{this.getCarriedItemCards()}
					<button disabled={this.props.hero.carried.length >= 6} onClick={() => this.setState({ selectedLocation: ItemLocationType.Carried })}>
						Choose an Item
					</button>
				</div>
				{dialogContent ? <Dialog content={dialogContent} onClickOff={() => this.setState({ selectedLocation: ItemLocationType.None })} /> : null}
			</div>
		);
	}
}

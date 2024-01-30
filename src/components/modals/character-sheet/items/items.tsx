import { IconSquare, IconSquareFilled } from '@tabler/icons-react';
import { Component } from 'react';

import { CombatantType } from '../../../../enums/combatant-type';
import { ItemLocationType } from '../../../../enums/item-location-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { CardList, IconSize, IconType, IconValue, PlayingCard, Selector, StatValue, Text, TextType } from '../../../controls';
import { ItemCard, PlaceholderCard } from '../../../cards';

import './items.scss';

interface Props {
	combatant: CombatantModel;
	game: GameModel;
	equipItem: (item: ItemModel) => void;
	unequipItem: (item: ItemModel) => void;
	pickUpItem: (item: ItemModel) => void;
	dropItem: (item: ItemModel) => void;
}

interface State {
	view: ItemLocationType;
}

export class Items extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: ItemLocationType.Hand
		};
	}

	getLocationSlots = (location: ItemLocationType) => {
		let maxSlots = 1;
		switch (location) {
			case ItemLocationType.Hand:
			case ItemLocationType.Ring:
				maxSlots = 2;
				break;
		}

		const slots = [];
		this.props.combatant.items
			.filter(item => location === item.location)
			.forEach(i => {
				for (let n = 0; n < i.slots; ++n) {
					slots.push(<IconSquareFilled key={`${i.id} ${n}`} />);
				}
			});

		while (slots.length < maxSlots) {
			slots.push(<IconSquare key={slots.length} />);
		}

		return (
			<StatValue
				label={`${location}${maxSlots > 1 ? 's' : ''}`}
				value={
					<div className='slot-icons'>
						{slots}
					</div>
				}
			/>
		);
	};

	getLocationSection = () => {
		let maxSlots = 1;
		switch (this.state.view) {
			case ItemLocationType.Hand:
			case ItemLocationType.Ring:
				maxSlots = 2;
				break;
		}

		const items = this.props.combatant.items.filter(item => this.state.view === item.location);
		const usedSlots = Collections.sum(items, i => i.slots);

		const cards = items.map(item => this.getItemCard(item, 'equipped'));

		const emptySlots = maxSlots - usedSlots;
		for (let n = 0; n < emptySlots; ++n) {
			cards.push(
				<div key={`empty ${n}`} className='item'>
					<PlayingCard front={<PlaceholderCard subtext='No item' />} />
					<div className='item-options' />
				</div>
			);
		}

		if (cards.length === 0) {
			cards.push(
				<div key='empty' className='item'>
					<PlayingCard front={<PlaceholderCard subtext='No item' />} />
					<div className='item-options' />
				</div>
			);
		}

		return (
			<div className='location-section'>
				<div className='location-sidebar'>
					<Selector
						options={[
							ItemLocationType.Hand,
							ItemLocationType.Body,
							ItemLocationType.Head,
							ItemLocationType.Feet,
							ItemLocationType.Neck,
							ItemLocationType.Ring
						].map(loc => {
							return {
								id: loc,
								display: this.getLocationSlots(loc)
							};
						})}
						selectedID={this.state.view}
						columnCount={1}
						onSelect={id => this.setState({ view: id as ItemLocationType })}
					/>
				</div>
				<div className='location-details'>
					<CardList cards={cards} />
				</div>
			</div>
		);
	};

	getCarriedItemSection = () => {
		if (this.props.combatant.carried.length === 0) {
			return (
				<Text type={TextType.Empty}>No carried items</Text>
			);
		}

		const cards = this.props.combatant.carried
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(item => this.getItemCard(item, 'carried'));

		return (
			<CardList cards={cards} />
		);
	};

	getPartyItemSection = () => {
		if (this.props.game.encounter !== null) {
			return null;
		}

		if (this.props.combatant.faction !== CombatantType.Hero) {
			return null;
		}

		if (this.props.game.items.length === 0) {
			return null;
		}

		const cards = Collections.distinct(this.props.game.items, i => i.name)
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(item => this.getItemCard(item, 'party', this.props.game.items.filter(i => i.name === item.name).length));

		return (
			<CardList cards={cards} />
		);
	};

	getNearbyItemSection = () => {
		if (this.props.game.encounter === null) {
			return null;
		}

		if (!this.props.combatant.combat.current) {
			return null;
		}

		if (this.props.combatant.faction !== CombatantType.Hero) {
			return null;
		}

		const adj = EncounterMapLogic.getAdjacentSquares(this.props.game.encounter.mapSquares, [ this.props.combatant.combat.position ]);
		const piles = this.props.game.encounter.loot.filter(lp => adj.find(sq => (sq.x === lp.position.x) && (sq.y === lp.position.y)));
		const items = Collections.sort(Collections.distinct(piles.flatMap(pile => pile.items), i => i.name), i => i.name);

		if (items.length === 0) {
			return null;
		}

		const cards = items.map(item => this.getItemCard(item, 'nearby'));

		return (
			<CardList cards={cards} />
		);
	};

	getItemCard = (item: ItemModel, section: 'equipped' | 'carried' | 'party' | 'nearby', count = 1) => {
		let options: JSX.Element | null = null;
		if ((this.props.combatant.type === CombatantType.Hero) && (this.props.combatant.faction === CombatantType.Hero)) {
			if (this.props.game.encounter && !this.props.combatant.combat.current) {
				// It's an encounter, and this is not the current combatant
				// Can't change equipment
			} else if (this.props.game.encounter && this.props.combatant.combat.stunned) {
				// It's an encounter, and this combatant is stunned
				// Can't change equipment
			} else {
				let equip = null;
				if ((section === 'carried') || (section === 'party')) {
					let equipLabel: JSX.Element | string = 'Equip';
					if (this.props.game.encounter) {
						equipLabel = (
							<div>
								Equip
								<br />
								<IconValue type={IconType.Movement} value={1} size={IconSize.Button} />
							</div>
						);
					}
					equip = (
						<button disabled={!CombatantLogic.canEquip(this.props.combatant, item)} onClick={() => this.props.equipItem(item)}>
							{equipLabel}
						</button>
					);
				}

				let unequip = null;
				if (section === 'equipped') {
					let unequipLabel: JSX.Element | string = 'Carry';
					if (this.props.game.encounter) {
						unequipLabel = (
							<div>
								Carry
								<br />
								<IconValue type={IconType.Movement} value={1} size={IconSize.Button} />
							</div>
						);
					}
					unequip = (
						<button disabled={this.props.combatant.carried.length >= CombatantLogic.CARRY_CAPACITY} onClick={() => this.props.unequipItem(item)}>
							{unequipLabel}
						</button>
					);
				}

				let pickUp = null;
				if ((section === 'party') || (section === 'nearby')) {
					let pickUpLabel: JSX.Element | string = 'Pick Up';
					if (this.props.game.encounter) {
						pickUpLabel = (
							<div>
								Pick Up
								<br />
								<IconValue type={IconType.Movement} value={1} size={IconSize.Button} />
							</div>
						);
					}
					pickUp = (
						<button disabled={this.props.combatant.carried.length >= CombatantLogic.CARRY_CAPACITY} onClick={() => this.props.equipItem(item)}>
							{pickUpLabel}
						</button>
					);
				}

				let drop = null;
				if ((section === 'equipped') || (section === 'carried')) {
					let dropLabel: JSX.Element | string = 'Drop';
					if (this.props.game.encounter) {
						dropLabel = (
							<div>
								Drop
								<br />
								<IconValue type={IconType.Movement} value={0} size={IconSize.Button} />
							</div>
						);
					}
					drop = (
						<button onClick={() => this.props.dropItem(item)}>
							{dropLabel}
						</button>
					);
				}

				options = (
					<div className='item-options'>
						{equip}
						{unequip}
						{pickUp}
						{drop}
					</div>
				);
			}
		} else {
			// Not a hero
			// Can't change equipment
		}

		return (
			<div key={item.id} className='item'>
				<ItemCard item={item} count={count} />
				{options}
			</div>
		);
	};

	render = () => {
		try {
			let label = this.state.view.toString();
			switch (this.state.view) {
				case ItemLocationType.Hand:
				case ItemLocationType.Ring:
					label += 's (2 slots)';
					break;
			}

			const carried = this.getCarriedItemSection();
			const party = this.getPartyItemSection();
			const nearby = this.getNearbyItemSection();

			return (
				<div className='items'>
					<Text type={TextType.SubHeading}>Equipped Items - {label}</Text>
					{this.getLocationSection()}
					{carried !== null ? <hr /> : null}
					{carried !== null ? <Text type={TextType.SubHeading}>Carried Items ({this.props.combatant.carried.length} of {CombatantLogic.CARRY_CAPACITY})</Text> : null}
					{carried}
					{party !== null ? <hr /> : null}
					{party !== null ? <Text type={TextType.SubHeading}>Party Items</Text> : null}
					{party}
					{nearby !== null ? <hr /> : null}
					{nearby !== null ? <Text type={TextType.SubHeading}>Nearby Items</Text> : null}
					{nearby}
				</div>
			);
		} catch {
			return <div className='items render-error' />;
		}
	};
}

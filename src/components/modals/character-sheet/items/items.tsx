import { Component } from 'react';

import { CombatantType } from '../../../../enums/combatant-type';
import { ItemLocationType } from '../../../../enums/item-location-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { CardList, IconSize, IconType, IconValue, PlayingCard, Selector, Text, TextType } from '../../../controls';
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

	getLocationSection = (location: ItemLocationType) => {
		let label = location.toString();
		let maxSlots = 0;
		switch (location) {
			case ItemLocationType.Hand:
			case ItemLocationType.Ring:
				label += 's';
				maxSlots = 2;
				break;
		}

		const items = this.props.combatant.items.filter(item => location === item.location);
		const usedSlots = Collections.sum(items, i => i.slots);

		const cards = items.map(item => {
			let unequip: JSX.Element | string = 'Carry';
			if (this.props.game.encounter && (this.props.combatant.faction === CombatantType.Hero)) {
				unequip = (
					<div>Carry<br /><IconValue type={IconType.Movement} value={1} size={IconSize.Button} /></div>
				);
			}

			let drop: JSX.Element | string = 'Drop';
			if (this.props.game.encounter && (this.props.combatant.faction === CombatantType.Hero)) {
				drop = (
					<div>Drop<br /><IconValue type={IconType.Movement} value={0} size={IconSize.Button} /></div>
				);
			}

			let options: JSX.Element | null = (
				<div className='item-options'>
					<button disabled={this.props.combatant.carried.length >= CombatantLogic.CARRY_CAPACITY} onClick={() => this.props.unequipItem(item)}>
						{unequip}
					</button>
					<button onClick={() => this.props.dropItem(item)}>
						{drop}
					</button>
				</div>
			);
			if (this.props.combatant.faction !== CombatantType.Hero) {
				options = null;
			}
			if (!!this.props.game.encounter && !this.props.combatant.combat.current) {
				options = null;
			}

			return (
				<div key={item.id} className='item'>
					<ItemCard item={item} />
					{options}
				</div>
			);
		});

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
			<div>
				<Text type={TextType.SubHeading}>{label}</Text>
				<div className='cards'>
					{cards}
				</div>
			</div>
		);
	};

	getCarriedItemSection = () => {
		const cards = this.props.combatant.carried
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(item => {
				let equip: JSX.Element | string = 'Equip';
				if (this.props.game.encounter && (this.props.combatant.faction === CombatantType.Hero)) {
					equip = (
						<div>Equip<br /><IconValue type={IconType.Movement} value={1} size={IconSize.Button} /></div>
					);
				}

				let drop: JSX.Element | string = 'Drop';
				if (this.props.game.encounter && (this.props.combatant.faction === CombatantType.Hero)) {
					drop = (
						<div>Drop<br /><IconValue type={IconType.Movement} value={0} size={IconSize.Button} /></div>
					);
				}

				let options: JSX.Element | null = (
					<div className='item-options'>
						<button disabled={!CombatantLogic.canEquip(this.props.combatant, item)} onClick={() => this.props.equipItem(item)}>
							{equip}
						</button>
						<button onClick={() => this.props.dropItem(item)}>
							{drop}
						</button>
					</div>
				);
				if (this.props.combatant.faction !== CombatantType.Hero) {
					options = null;
				}
				if (!!this.props.game.encounter && !this.props.combatant.combat.current) {
					options = null;
				}

				return (
					<div key={item.id} className='item'>
						<ItemCard item={item} />
						{options}
					</div>
				);
			});

		if (this.props.combatant.carried.length === 0) {
			cards.push(
				<div key='empty' className='item'>
					<PlayingCard front={<PlaceholderCard subtext='No Item' />} />
					<div className='item-options' />
				</div>
			);
		}

		return (
			<div className='cards'>
				<CardList cards={cards} />
			</div>
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
			.map(item => {
				const count = this.props.game.items.filter(i => i.name === item.name).length;

				const options = (
					<div className='item-options'>
						<button disabled={!CombatantLogic.canEquip(this.props.combatant, item)} onClick={() => this.props.equipItem(item)}>
							Equip
						</button>
						<button disabled={this.props.combatant.carried.length >= CombatantLogic.CARRY_CAPACITY} onClick={() => this.props.pickUpItem(item)}>
							Pick Up
						</button>
					</div>
				);

				return (
					<div key={item.id} className='item'>
						<ItemCard item={item} count={count} />
						{options}
					</div>
				);
			});

		return (
			<div className='cards'>
				<CardList cards={cards} />
			</div>
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

		const cards = items
			.map(item => {
				const options = (
					<div className='item-options'>
						<button disabled={this.props.combatant.carried.length >= CombatantLogic.CARRY_CAPACITY} onClick={() => this.props.pickUpItem(item)}>
							<div>Pick Up<br /><IconValue type={IconType.Movement} value={1} size={IconSize.Button} /></div>
						</button>
					</div>
				);

				return (
					<div key={item.id} className='item'>
						<ItemCard item={item} />
						{options}
					</div>
				);
			});

		return (
			<div className='cards'>
				<CardList cards={cards} />
			</div>
		);
	};

	getSidebar = () => {
		return (
			<div className='items-sidebar'>
				<Selector
					options={[
						{
							id: ItemLocationType.Hand,
							display: 'Hands'
						},
						{
							id: ItemLocationType.Body,
							display: 'Body'
						},
						{
							id: ItemLocationType.Head,
							display: 'Head'
						},
						{
							id: ItemLocationType.Feet,
							display: 'Feet'
						},
						{
							id: ItemLocationType.Neck,
							display: 'Neck'
						},
						{
							id: ItemLocationType.Ring,
							display: 'Rings'
						}
					]}
					selectedID={this.state.view}
					columnCount={1}
					onSelect={id => this.setState({ view: id as ItemLocationType })}
				/>
			</div>
		);
	};

	getContent = () => {
		const carried = this.getCarriedItemSection();
		const party = this.getPartyItemSection();
		const nearby = this.getNearbyItemSection();

		return (
			<div className='items-details'>
				{this.getLocationSection(this.state.view)}
				{carried !== null ? <hr /> : null}
				{carried !== null ? <Text type={TextType.SubHeading}>Carried Items</Text> : null}
				{carried}
				{party !== null ? <hr /> : null}
				{party !== null ? <Text type={TextType.SubHeading}>Party Items</Text> : null}
				{party}
				{nearby !== null ? <hr /> : null}
				{nearby !== null ? <Text type={TextType.SubHeading}>Nearby Items</Text> : null}
				{nearby}
			</div>
		);
	};

	render = () => {
		try {
			return (
				<div className='items'>
					{this.getSidebar()}
					{this.getContent()}
				</div>
			);
		} catch {
			return <div className='items render-error' />;
		}
	};
}

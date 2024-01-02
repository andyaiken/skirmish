import { Component } from 'react';

import { CombatantType } from '../../../../enums/combatant-type';
import { ItemLocationType } from '../../../../enums/item-location-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { Box, CardList, IconSize, IconType, IconValue, PlayingCard, Text, TextType } from '../../../controls';
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

export class Items extends Component<Props> {
	getLocationSection = (location: ItemLocationType) => {
		let className = 'location-section';
		let label = location.toString();
		switch (location) {
			case ItemLocationType.Hand:
			case ItemLocationType.Ring:
				className += ' double';
				label += 's';
		}

		const cards = this.props.combatant.items
			.filter(item => location === item.location)
			.map(item => {
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

		if (cards.length === 0) {
			cards.push(
				<div key='empty' className='item'>
					<PlayingCard front={<PlaceholderCard subtext='No item' />} />
					<div className='item-options' />
				</div>
			);
		}

		return (
			<div className={className}>
				<Box label={label}>
					<div className='cards'>
						{cards}
					</div>
				</Box>
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
			<CardList cards={cards} />
		);
	};

	render = () => {
		try {
			const carried = this.getCarriedItemSection();
			const party = this.getPartyItemSection();
			const nearby = this.getNearbyItemSection();

			return (
				<div className='items'>
					<Text type={TextType.SubHeading}>Equipped Items</Text>
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
					<Text type={TextType.SubHeading}>Carried Items ({this.props.combatant.carried.length} / {CombatantLogic.CARRY_CAPACITY})</Text>
					{carried}
					<hr />
					{party !== null ? <Text type={TextType.SubHeading}>Party Items</Text> : null}
					{nearby !== null ? <Text type={TextType.SubHeading}>Nearby Items</Text> : null}
					{party}
					{nearby}
				</div>
			);
		} catch {
			return <div className='items render-error' />;
		}
	};
}

import { Component } from 'react';

import { ItemLocationType } from '../../../enums/item-location-type';
import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { CombatantLogic } from '../../../logic/combatant-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { Collections } from '../../../utils/collections';

import { Dialog, IconSize, IconType, IconValue, PlayingCard, Text, TextType } from '../../controls';
import { ItemCard, PlaceholderCard } from '../../cards';
import { CombatantRowPanel } from '../../panels';

import './magic-item-info-modal.scss';

interface Props {
	item: ItemModel;
	game: GameModel;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	sellItem: (item: ItemModel) => void;
}

interface State {
	hero: CombatantModel | null;
}

export class MagicItemInfoModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hero: null
		};
	}

	setComparison = (hero: CombatantModel | null) => {
		this.setState({
			hero: hero
		});
	};

	getIsEquippable = (hero: CombatantModel, item: ItemModel) => {
		let slotsTotal = 1;
		switch (item.location) {
			case ItemLocationType.Hand:
			case ItemLocationType.Ring:
				slotsTotal = 2;
				break;
		}
		const equipped = hero.items.filter(i => i.location === item.location);
		const slotsUsed = Collections.sum(equipped, i => i.slots);
		const slotsAvailable = slotsTotal - slotsUsed;
		return item.slots <= slotsAvailable;
	};

	getDialog = () => {
		if (this.state.hero === null) {
			return null;
		}

		const current = this.state.hero.items.filter(i => i.location === this.props.item.location).map(i => (
			<div key={i.id} className='card-container'>
				<ItemCard item={i} />
				<button onClick={() => this.props.dropItem(i, this.state.hero as CombatantModel)}>Drop</button>
			</div>
		));
		if (current.length === 0) {
			current.push(
				<div key='empty' className='card-container'>
					<PlayingCard
						front={
							<PlaceholderCard
								content={
									<Text type={TextType.Small}>Nothing</Text>
								}
							/>
						}
						disabled={true}
					/>
				</div>
			);
		}

		const equippable = this.getIsEquippable(this.state.hero, this.props.item);

		return (
			<Dialog
				level={2}
				content={
					<div className='item-comparer-dialog'>
						<Text type={TextType.Heading}>{this.state.hero.name}</Text>
						<hr />
						<div className='item-columns'>
							<div className='item-column'>
								<Text type={TextType.SubHeading}>Currently Equipped</Text>
								{current}
							</div>
							<div className='item-column'>
								<Text type={TextType.SubHeading}>New Item</Text>
								<div className='card-container'>
									<ItemCard item={this.props.item} />
									{equippable ? <button onClick={() => { this.props.equipItem(this.props.item, this.state.hero as CombatantModel); this.setComparison(null); }}>Equip</button> : null}
								</div>
							</div>
						</div>
					</div>
				}
				onClose={() => this.setComparison(null)}
			/>
		);
	};

	render = () => {
		try {
			const canEquip: JSX.Element[] = [];
			const canReplace: JSX.Element[] = [];

			this.props.game.heroes
				.filter(hero => (this.props.item.proficiency === ItemProficiencyType.None) || CombatantLogic.getProficiencies(hero).includes(this.props.item.proficiency))
				.forEach(hero => {
					const equippable = this.getIsEquippable(hero, this.props.item);
					if (equippable) {
						canEquip.push(
							<CombatantRowPanel key={hero.id} combatant={hero} onClick={combatant => this.props.equipItem(this.props.item, combatant)} />
						);
					} else {
						canReplace.push(
							<CombatantRowPanel key={hero.id} combatant={hero} onClick={combatant => this.setComparison(combatant)} />
						);
					}
				});

			let content = null;
			if (canEquip.length + canReplace.length === 0) {
				content = (
					<div className='hero-list'>
						<Text type={TextType.Empty}>Usable by none of your current heroes.</Text>
					</div>
				);
			} else {
				content = (
					<div className='hero-list'>
						{
							canEquip.length > 0 ?
								<Text type={TextType.Information}>
									<p>These heroes can equip this item. Click on one of them to equip it.</p>
								</Text>
								: null
						}
						{canEquip}
						{
							canReplace.length > 0 ?
								<Text type={TextType.Information}>
									<p>These heroes can equip this item, but already have an item in this location. Click on one of them to compare items.</p>
								</Text>
								: null
						}
						{canReplace}
					</div>
				);
			}

			return (
				<div className='magic-item-info-modal'>
					<Text type={TextType.Heading}>Magic Item</Text>
					<hr />
					<div className='magic-item-info-content'>
						<div className='card'>
							<ItemCard item={this.props.item} />
							<button onClick={() => this.props.sellItem(this.props.item)}>
								Sell<br /><IconValue type={IconType.Money} value={50} size={IconSize.Button} />
							</button>
						</div>
						{content}
					</div>
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='magic-item-modal render-error' />;
		}
	};
}

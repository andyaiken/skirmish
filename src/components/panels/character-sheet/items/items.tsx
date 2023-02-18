import { Component } from 'react';

import { Dialog, Text, TextType } from '../../../../controls';
import { ItemLocationType, ItemProficiencyType } from '../../../../models/enums';
import { GameModel } from '../../../../models/game';
import { CombatantModel } from '../../../../models/combatant';
import { ItemModel } from '../../../../models/item';
import { ItemCard } from '../../../cards';
import { PlayingCard } from '../../../utility';

import './items.scss';
import { CombatantUtils } from '../../../../logic/combatant-utils';

interface Props {
	hero: CombatantModel;
	game: GameModel;
	equipItem: (item: ItemModel) => void;
	unequipItem: (item: ItemModel) => void;
}

interface State {
	selectedItem: ItemModel | null;
	selectedLocation: ItemLocationType;
}

export class Items extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedItem: null,
			selectedLocation: ItemLocationType.None
		};
	}

	private getItemCards(location: ItemLocationType, name: string, slots = 1) {
		const items = this.props.hero.items.filter(item => location === item.location);
		const used = items.map(item => item.slots).reduce((sum, current) => sum + current, 0);

		const cards = items.map(item => (
			<div key={item.id} className='item'>
				<PlayingCard
					front={<ItemCard item={item} />}
					onClick={() => this.setState({ selectedItem: item })}
				/>
			</div>
		));

		const remaining = slots - used;
		if (remaining > 0) {
			const equippableItemsExist = this.props.game.items.some(item => item.location === location);
			for (let n = 0; n !== remaining; ++n) {
				cards.push(
					<div key={n} className='item'>
						<button disabled={!equippableItemsExist} onClick={() => this.setState({ selectedLocation: location })}>
							No Item
						</button>
					</div>
				);
			}
		}

		return cards;
	}

	private equip(item: ItemModel) {
		this.setState({
			selectedLocation: ItemLocationType.None
		}, () => {
			this.props.equipItem(item);
		});
	}

	private unequip() {
		if (this.state.selectedItem !== null) {
			const item = this.state.selectedItem;
			this.setState({
				selectedItem: null
			}, () => {
				this.props.unequipItem(item);
			});
		}
	}

	public render() {
		let dialogContent = null;
		if (this.state.selectedItem !== null) {
			dialogContent = (
				<div>
					<PlayingCard front={<ItemCard item={this.state.selectedItem} />} />
					<button onClick={() => this.unequip()}>Unequip</button>
				</div>
			);
		}
		if (this.state.selectedLocation !== ItemLocationType.None) {
			// Find items that fit this location that we can use
			const campaignItemCards = this.props.game.items
				.filter(item => item.location === this.state.selectedLocation)
				.filter(item => (item.proficiency === ItemProficiencyType.None) || (CombatantUtils.getProficiencies(this.props.hero).includes(item.proficiency)))
				.map(item => (
					<div key={item.id}>
						<PlayingCard
							front={<ItemCard item={item} />}
							onClick={() => this.equip(item)}
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
				<div>
					{campaignItemCards}
				</div>
			);
		}

		return (
			<div className='items'>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Hands</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocationType.Hand, 'Hand', 2)}
					</div>
				</div>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Body</Text>
						</div>
						<div className='item'>
							<Text type={TextType.SubHeading}>Feet</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocationType.Body, 'Body')}
						{this.getItemCards(ItemLocationType.Feet, 'Feet')}
					</div>
				</div>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Head</Text>
						</div>
						<div className='item'>
							<Text type={TextType.SubHeading}>Neck</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocationType.Head, 'Head')}
						{this.getItemCards(ItemLocationType.Neck, 'Neck')}
					</div>
				</div>
				<div className='section'>
					<div className='item-row'>
						<div className='item'>
							<Text type={TextType.SubHeading}>Rings</Text>
						</div>
					</div>
					<div className='item-row'>
						{this.getItemCards(ItemLocationType.Ring, 'Ring', 2)}
					</div>
				</div>
				{dialogContent ? <Dialog content={dialogContent} onClickOff={() => this.setState({ selectedItem: null, selectedLocation: ItemLocationType.None })} /> : null}
			</div>
		);
	}
}

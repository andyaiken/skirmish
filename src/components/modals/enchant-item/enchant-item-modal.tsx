import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { MagicItemGenerator } from '../../../generators/magic-item-generator';

import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';

import { CardList, Dialog, Text, TextType } from '../../controls';
import { ItemCard, StrongholdBenefitCard } from '../../cards';

import './enchant-item-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	enchantItem: (item: ItemModel, newItem: ItemModel) => void;
	useCharge: (type: StructureType, count: number) => void;
}

interface State {
	selectedItem: ItemModel | null;
	magicItems: ItemModel[];
}

export class EnchantItemModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			selectedItem: null,
			magicItems: []
		};
	}

	selectItem = (item: ItemModel) => {
		this.setState({
			selectedItem: item,
			magicItems: this.getItems(item)
		});
	};

	getItems = (baseItem: ItemModel) => {
		const items: ItemModel[] = [];

		while (items.length < 3) {
			items.push(MagicItemGenerator.generateMagicItem(baseItem, this.props.options.packIDs));
		}

		return Collections.sort(items, n => n.name);
	};

	redraw = () => {
		this.setState({
			magicItems: this.getItems(this.state.selectedItem as ItemModel)
		}, () => {
			if (!this.props.options.developer) {
				this.props.useCharge(StructureType.WizardTower, 1);
			}
		});
	};

	render = () => {
		try {
			let dialog = null;
			if (this.state.selectedItem) {
				const cards = this.state.magicItems.map(item => (
					<div key={item.id}>
						<ItemCard item={item} onClick={item => this.props.enchantItem(this.state.selectedItem as ItemModel, item)} />
					</div>
				));

				const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WizardTower);
				if ((redraws > 0) || this.props.options.developer) {
					cards.push(
						<StrongholdBenefitCard
							key='redraw'
							label='Redraw'
							available={redraws}
							developer={this.props.options.developer}
							onRedraw={this.redraw}
						/>
					);
				}

				dialog = (
					<Dialog
						content={
							<div className='enchant-item-modal'>
								<Text type={TextType.Heading}>Choose an Enchantment</Text>
								<hr />
								<div className='card-selection-row'>
									<CardList cards={cards} />
								</div>
							</div>
						}
					/>
				);
			}

			const heroes = this.props.game.heroes.map(h => {
				const items = ([] as ItemModel[]).concat(h.items).concat(h.carried).filter(i => !i.potion);
				if (items.length > 0) {
					const cards = items.map(item => (
						<div key={item.id}>
							<ItemCard item={item} onClick={this.selectItem} />
						</div>
					));

					return (
						<div key={h.id} className='card-selection-row'>
							<Text type={TextType.SubHeading}>{h.name}</Text>
							<CardList cards={cards} />
						</div>
					);
				}

				return null;
			});

			let other = null;
			if (this.props.game.items.length > 0) {
				const cards = this.props.game.items.filter(i => !i.potion).map(item => (
					<div key={item.id}>
						<ItemCard item={item} onClick={this.selectItem} />
					</div>
				));

				other = (
					<div className='card-selection-row'>
						<Text type={TextType.SubHeading}>Other Items</Text>
						<CardList cards={cards} />
					</div>
				);
			}

			return (
				<div className='enchant-item-modal'>
					<Text type={TextType.Heading}>Choose an Item</Text>
					<hr />
					{heroes}
					{other}
					{dialog}
				</div>
			);
		} catch {
			return <div className='enchant-item-modal render-error' />;
		}
	};
}

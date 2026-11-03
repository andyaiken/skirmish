import { IconCircleMinus, IconCirclePlus } from '@tabler/icons-react';
import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { MagicItemGenerator } from '../../../generators/magic-item/magic-item-generator';

import { FeatureLogic } from '../../../logic/feature/feature-logic';
import { StrongholdLogic } from '../../../logic/stronghold/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections/collections';

import { CardChoice, CardList, Dialog, IconSize, IconType, IconValue, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './enchant-item-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	enchantItem: (item: ItemModel, newItem: ItemModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
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
			items.push(MagicItemGenerator.generateMagicItem(baseItem, this.props.options.packIDs, Math.random));
		}

		return Collections.sort(items, n => n.name);
	};

	getChanges = (oldItem: ItemModel, newItem: ItemModel) => {
		const changes: { description: string; delta: number }[] = [];

		const describeWeapon = (item: ItemModel) => {
			const lines: string[] = [];
			if (item.weapon) {
				lines.push(`Range: ${item.weapon.range}`);
				lines.push(`Unreliable: ${item.weapon.unreliable}`);
			}
			return lines;
		};

		const lists = (item: ItemModel) => ({
			weapon: describeWeapon(item),
			features: FeatureLogic.collateFeatures(item.features.concat(item.armor ? item.armor.features : [])),
			actions: item.actions.map(a => a.name)
		});

		const before = lists(oldItem);
		const after = lists(newItem);

		const oldDamage = oldItem.weapon?.damage ?? [];
		const newDamage = newItem.weapon?.damage ?? [];
		const damageTypes = new Set([ ...oldDamage, ...newDamage ].map(d => d.type));
		damageTypes.forEach(type => {
			const oldRank = oldDamage.reduce((rank, d) => rank + (d.type === type ? d.rank : 0), 0);
			const newRank = newDamage.reduce((rank, d) => rank + (d.type === type ? d.rank : 0), 0);
			const delta = newRank - oldRank;
			if (delta !== 0) {
				changes.push({ description: `Damage: ${type} ${Math.abs(delta)}`, delta });
			}
		});

		after.weapon.filter(l => !before.weapon.includes(l)).forEach(l => changes.push({ description: l, delta: 1 }));

		const featureChanges = before.features.map(f => ({ feature: f, delta: -f.rank }));
		after.features.forEach(f => {
			const existing = featureChanges.find(c => FeatureLogic.featuresAreEquivalent(c.feature, f));
			if (existing) {
				existing.delta += f.rank;
			} else {
				featureChanges.push({ feature: f, delta: f.rank });
			}
		});
		featureChanges.filter(c => c.delta !== 0).forEach(c => {
			const description = FeatureLogic.getFeatureDescription({ ...c.feature, rank: Math.abs(c.delta) });
			changes.push({ description, delta: c.delta });
		});
		before.actions.filter(l => !after.actions.includes(l)).forEach(l => changes.push({ description: `Action: ${l}`, delta: -1 }));
		after.actions.filter(l => !before.actions.includes(l)).forEach(l => changes.push({ description: `Action: ${l}`, delta: 1 }));

		return changes;
	};

	redraw = () => {
		this.setState({
			magicItems: this.getItems(this.state.selectedItem as ItemModel)
		}, () => {
			if (!this.props.options.developer) {
				this.props.spendCharge(StructureType.WizardTower, 1);
			}
		});
	};

	render = () => {
		let dialog = null;
		if (this.state.selectedItem) {
			const cards = this.state.magicItems.map(item => (
				<div key={item.id}>
					<CardChoice
						card={<ItemCard item={item} />}
						details={
							<ul className='enchant-changes'>
								{(this.getChanges(this.state.selectedItem as ItemModel, item)).map((c, n) => (
									<li key={n}>
										{c.delta > 0 ? <IconCirclePlus className='gained' size={16} /> : <IconCircleMinus className='lost' size={16} />}
										{c.description}
									</li>
								))}
							</ul>
						}
						label='Choose this enchantment'
						onSelect={() => this.props.enchantItem(this.state.selectedItem as ItemModel, item)}
					/>
				</div>
			));

			const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WizardTower);

			dialog = (
				<Dialog
					content={
						<div className='enchant-item-modal enchantment-selection'>
							<Text type={TextType.Heading}>Choose an Enchantment</Text>
							<hr />
							<Text type={TextType.Information}>
								<p>Here are three ways in which this item can be enchanted. Choose one of them.</p>
							</Text>
							<div className='card-selection-row'>
								<CardList cards={cards} />
								{
									(redraws > 0) || this.props.options.developer ?
										<button className={this.props.options.developer ? 'developer' : ''} onClick={() => this.redraw()}>
											Redraw Magic Item Cards
											<br />
											<IconValue type={IconType.Redraw} value={redraws} size={IconSize.Button} />
										</button>
										: null
								}
							</div>
						</div>
					}
					level={2}
				/>
			);
		}

		const heroes = this.props.game.heroes.map(h => {
			const items = ([] as ItemModel[]).concat(h.items).concat(h.carried).filter(i => !i.potion && !i.scroll);
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
			const cards = this.props.game.items.filter(i => !i.potion && !i.scroll).map(item => (
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
				<Text type={TextType.Information}>
					<p>Select one of the following items to be enchanted.</p>
				</Text>
				{heroes}
				{other}
				{dialog}
			</div>
		);
	};
}

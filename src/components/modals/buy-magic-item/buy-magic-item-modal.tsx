import { Component } from 'react';

import { ItemProficiencyType } from '../../../enums/item-proficiency-type';
import { StructureType } from '../../../enums/structure-type';

import { MagicItemGenerator } from '../../../generators/magic-item-generator';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';

import { CardList, IconSize, IconType, IconValue, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './buy-magic-item-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyItem: (item: ItemModel) => void;
	useCharge: (type: StructureType, count: number) => void;
}

interface State {
	magicItems: ItemModel[];
}

export class BuyMagicItemModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			magicItems: this.getItems()
		};
	}

	getItems = () => {
		const items: ItemModel[] = [];

		let fails = 0;
		while ((items.length < 3) && (fails < 1000)) {
			const item = MagicItemGenerator.generateRandomMagicItem(this.props.options.packIDs);

			let ok = true;

			// Make sure at least one hero can use this item
			if (this.props.game.heroes.length > 0) {
				const heroes = this.props.game.heroes
					.filter(h => (item.proficiency === ItemProficiencyType.None) || CombatantLogic.getProficiencies(h).includes(item.proficiency));
				if (heroes.length === 0) {
					ok = false;
				}
			}

			// Make sure we don't suggest more than one weapon
			if (item.weapon) {
				if (items.filter(i => i.weapon).length > 0) {
					ok = false;
				}
			}

			// Make sure we don't suggest more than one armor
			if (item.armor) {
				if (items.filter(i => i.armor).length > 0) {
					ok = false;
				}
			}

			if (ok) {
				items.push(item);
			} else {
				fails += 1;
			}
		}

		return Collections.sort(items, n => n.name);
	};

	redraw = () => {
		this.setState({
			magicItems: this.getItems()
		}, () => {
			if (!this.props.options.developer) {
				this.props.useCharge(StructureType.WizardTower, 1);
			}
		});
	};

	render = () => {
		try {
			const cards = this.state.magicItems.map(item => (
				<ItemCard key={item.id} item={item} onClick={this.props.buyItem} />
			));

			const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WizardTower);

			return (
				<div className='buy-magic-item-modal'>
					<Text type={TextType.Heading}>Choose a Magic Item</Text>
					<hr />
					<Text type={TextType.Information}>
						<p>Three magic items have been drawn for you. Choose one card to buy that item.</p>
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
			);
		} catch {
			return <div className='buy-magic-item-modal render-error' />;
		}
	};
}

import { Component } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';

import { ItemProficiencyType } from '../../../enums/item-proficiency-type';
import { StructureType } from '../../../enums/structure-type';

import { MagicItemGenerator } from '../../../generators/magic-item/magic-item-generator';

import { CombatantLogic } from '../../../logic/combatant/combatant-logic';
import { PurchaseAdviceLogic } from '../../../logic/thought/purchase-advice';
import { StrongholdLogic } from '../../../logic/stronghold/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections/collections';

import { CardChoice, CardList, HeroQuote, IconSize, IconType, IconValue, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import '../purchase-options-modal.scss';
import './buy-magic-item-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyItem: (item: ItemModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
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
			const item = MagicItemGenerator.generateRandomMagicItem(this.props.options.packIDs, Math.random);

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
				this.props.spendCharge(StructureType.WizardTower, 1);
			}
		});
	};

	render = () => {
		const cards = this.state.magicItems.map(item => (
			<CardChoice
				key={item.id}
				card={<ItemCard item={item} />}
				label='Buy this item'
				onSelect={() => this.props.buyItem(item)}
			/>
		));

		const advice = PurchaseAdviceLogic.getItemAdvice(this.props.game, this.state.magicItems);
		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WizardTower);

		return (
			<div className='purchase-options-modal buy-magic-item-modal'>
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
				{advice
					? <HeroQuote
						hero={advice.hero}
						text={advice.message}
						action={
							<button className='icon-btn' title={`Choose ${advice.choice}`} onClick={() => {
								const choice = this.state.magicItems.find(x => x.id === advice.choiceID);
								if (choice) {
									this.props.buyItem(choice);
								}
							}}>
								<IconCircleCheck size={28} />
							</button>
						}
					/>
					: null}
			</div>
		);
	};
}

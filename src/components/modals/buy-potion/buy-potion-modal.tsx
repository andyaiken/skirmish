import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { GameLogic } from '../../../logic/game-logic';
import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';
import { Utils } from '../../../utils/utils';

import { CardList, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';
import { RedrawButton } from '../../panels';

import './buy-potion-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyItem: (item: ItemModel) => void;
	useCharge: (type: StructureType, count: number) => void;
}

interface State {
	potions: ItemModel[];
}

export class BuyPotionModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			potions: this.getItems()
		};
	}

	getItems = () => {
		const items: ItemModel[] = [];

		while (items.length < 3) {
			const potions = GameLogic.getPotionDeck(this.props.options.packIDs);
			const item = Collections.draw(potions);
			if (!items.map(i => i.name).includes(item.name)) {
				item.id = Utils.guid();
				items.push(item);
			}
		}

		items.sort((a, b) => a.name.localeCompare(b.name));

		return items;
	};

	redraw = () => {
		this.setState({
			potions: this.getItems()
		}, () => {
			if (!this.props.options.developer) {
				this.props.useCharge(StructureType.WizardTower, 1);
			}
		});
	};

	render = () => {
		try {
			const cards = this.state.potions.map(item => (
				<ItemCard key={item.id} item={item} onClick={this.props.buyItem} />
			));

			const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WizardTower);
			if ((redraws > 0) || this.props.options.developer) {
				cards.push(
					<RedrawButton
						key='redraw'
						value={redraws}
						developer={this.props.options.developer}
						onClick={() => this.redraw()}
					/>
				);
			}

			return (
				<div className='buy-potion-modal'>
					<Text type={TextType.Heading}>Choose a Potion</Text>
					<hr />
					<div className='card-selection-row'>
						<CardList cards={cards} />
					</div>
				</div>
			);
		} catch {
			return <div className='buy-potion-modal render-error' />;
		}
	};
}

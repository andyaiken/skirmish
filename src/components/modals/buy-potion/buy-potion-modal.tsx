import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { GameLogic } from '../../../logic/game-logic';
import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';
import { Utils } from '../../../utils/utils';

import { CardList, IconSize, IconType, IconValue, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

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

		return Collections.sort(items, n => n.name);
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

			return (
				<div className='buy-potion-modal'>
					<Text type={TextType.Heading}>Choose a Potion</Text>
					<hr />
					<Text type={TextType.Information}>
						<p>Three potion cards have been drawn for you. Choose one card to buy that potion.</p>
					</Text>
					<div className='card-selection-row'>
						<CardList mode='row' cards={cards} />
						{
							(redraws > 0) || this.props.options.developer ?
								<button className={this.props.options.developer ? 'developer' : ''} onClick={() => this.redraw()}>
									Redraw Potion Cards
									<br />
									<IconValue type={IconType.Redraw} value={redraws} size={IconSize.Button} />
								</button>
								: null
						}
					</div>
				</div>
			);
		} catch {
			return <div className='buy-potion-modal render-error' />;
		}
	};
}

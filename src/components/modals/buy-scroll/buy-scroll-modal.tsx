import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { GameLogic } from '../../../logic/game/game-logic';
import { StrongholdLogic } from '../../../logic/stronghold/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections/collections';
import { Utils } from '../../../utils/utils/utils';

import { CardList, IconSize, IconType, IconValue, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './buy-scroll-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	free: boolean;
	buyItem: (item: ItemModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
}

interface State {
	scrolls: ItemModel[];
}

export class BuyScrollModal extends Component<Props, State> {
	static defaultProps = {
		free: false
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			scrolls: this.getItems()
		};
	}

	getItems = () => {
		const items: ItemModel[] = [];

		const deck = GameLogic.getScrollDeck(this.props.options.packIDs);
		const count = Math.min(3, Collections.distinct(deck, i => i.name).length);
		while (items.length < count) {
			const drawn = Collections.draw(GameLogic.getScrollDeck(this.props.options.packIDs));
			if (!items.map(i => i.name).includes(drawn.name)) {
				// The deck hands back the pack's own card, which is shared
				const item = JSON.parse(JSON.stringify(drawn)) as ItemModel;
				item.id = Utils.guid();
				items.push(item);
			}
		}

		return Collections.sort(items, n => n.name);
	};

	redraw = () => {
		this.setState({
			scrolls: this.getItems()
		}, () => {
			if (!this.props.options.developer) {
				this.props.spendCharge(StructureType.WizardTower, 1);
			}
		});
	};

	render = () => {
		const cards = this.state.scrolls.map(item => (
			<ItemCard key={item.id} item={item} onClick={this.props.buyItem} />
		));

		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WizardTower);

		return (
			<div className='buy-scroll-modal'>
				<Text type={TextType.Heading}>Choose a Scroll</Text>
				<hr />
				<Text type={TextType.Information}>
					<p>{cards.length === 1 ? 'A scroll card has' : `${cards.length} scroll cards have`} been drawn for you. Choose one card to {this.props.free ? 'take' : 'buy'} that scroll.</p>
				</Text>
				<div className='card-selection-row'>
					<CardList cards={cards} />
					{
						(redraws > 0) || this.props.options.developer ?
							<button className={this.props.options.developer ? 'developer' : ''} onClick={() => this.redraw()}>
								Redraw Scroll Cards
								<br />
								<IconValue type={IconType.Redraw} value={redraws} size={IconSize.Button} />
							</button>
							: null
					}
				</div>
			</div>
		);
	};
}

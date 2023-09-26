import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { GameLogic } from '../../../logic/game-logic';
import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';
import type { StructureModel } from '../../../models/structure';

import { Collections } from '../../../utils/collections';

import { CardList, Text, TextType } from '../../controls';
import { RedrawButton } from '../../panels';
import { StructureCard } from '../../cards';

import './buy-structure-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyStructure: (structure: StructureModel) => void;
	useCharge: (type: StructureType, count: number) => void;
}

interface State {
	structures: StructureModel[];
}

export class BuyStructureModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			structures: this.getStructures()
		};
	}

	getStructures = () => {
		const structures: StructureModel[] = [];

		while (structures.length < 3) {
			const deck = GameLogic.getStructureDeck(this.props.options.packIDs);
			structures.push(Collections.draw(deck));
		}

		structures.sort((a, b) => a.name.localeCompare(b.name));

		return structures;
	};

	redraw = () => {
		this.setState({
			structures: this.getStructures()
		}, () => {
			if (!this.props.options.developer) {
				this.props.useCharge(StructureType.Stockpile, 1);
			}
		});
	};

	render = () => {
		try {
			const cards = this.state.structures.map(s => (
				<StructureCard key={s.id} structure={s} onClick={this.props.buyStructure} />
			));

			const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Stockpile);
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
				<div className='buy-structure-modal'>
					<Text type={TextType.Heading}>Choose a Structure</Text>
					<hr />
					<div className='card-selection-row'>
						<CardList cards={cards} />
					</div>
				</div>
			);
		} catch {
			return <div className='buy-structure-modal render-error' />;
		}
	};
}

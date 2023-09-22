import { Component } from 'react';

import { GameLogic } from '../../../logic/game-logic';

import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';
import type { StructureModel } from '../../../models/structure';

import { Collections } from '../../../utils/collections';

import { CardList, Text, TextType } from '../../controls';
import { StructureCard } from '../../cards';

import './buy-structure-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyStructure: (structure: StructureModel) => void;
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
		});
	};

	render = () => {
		try {
			const cards = this.state.structures.map(s => (
				<StructureCard key={s.id} structure={s} onClick={this.props.buyStructure} />
			));

			return (
				<div className='buy-structure-modal'>
					<Text type={TextType.Heading}>Choose a Structure</Text>
					<hr />
					{this.props.options.developer ? <button className='developer' onClick={() => this.redraw()}>Redraw</button> : null}
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

import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { GameLogic } from '../../../logic/game/game-logic';
import { StrongholdLogic } from '../../../logic/stronghold/stronghold-logic';

import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';
import type { StructureModel } from '../../../models/structure';

import { Collections } from '../../../utils/collections/collections';

import { CardList, IconSize, IconType, IconValue, Text, TextType } from '../../controls';
import { StructureCard } from '../../cards';

import './buy-structure-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyStructure: (structure: StructureModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
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
			const deck = GameLogic.getStructureDeck(this.props.options.packIDs).filter(s => StrongholdLogic.canBuild(s));
			structures.push(Collections.draw(deck));
		}

		return Collections.sort(structures, n => n.name);
	};

	redraw = () => {
		this.setState({
			structures: this.getStructures()
		}, () => {
			if (!this.props.options.developer) {
				this.props.spendCharge(StructureType.Forge, 1);
			}
		});
	};

	render = () => {
		const cards = this.state.structures.map(s => (
			<StructureCard key={s.id} structure={s} onClick={this.props.buyStructure} />
		));

		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Forge);

		return (
			<div className='buy-structure-modal'>
				<Text type={TextType.Heading}>Choose a Structure</Text>
				<hr />
				<Text type={TextType.Information}>
					<p>Three structure cards have been drawn for you. Choose one card to add it to your stronghold.</p>
				</Text>
				<div className='card-selection-row'>
					<CardList cards={cards} />
					{
						(redraws > 0) || this.props.options.developer ?
							<button className={this.props.options.developer ? 'developer' : ''} onClick={() => this.redraw()}>
								Redraw Structure Cards
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

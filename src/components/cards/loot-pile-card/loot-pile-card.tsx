import { Component, MouseEvent } from 'react';
import { IconCheck } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import type { LootPileModel } from '../../../models/encounter';

import { PlayingCard, Text, TextType } from '../../controls';

import { ListItemPanel } from '../../panels';

import './loot-pile-card.scss';

interface Props {
	loot: LootPileModel;
	onSelect: ((loot: LootPileModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class LootPileCard extends Component<Props, State> {
	static defaultProps = {
		onSelect: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	onFlip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			flipped: !this.state.flipped
		});
	};

	onSelect = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onSelect) {
			this.props.onSelect(this.props.loot);
		}
	};

	render = () => {
		let itemSection = null;
		if (this.props.loot.items.length > 0) {
			itemSection = (
				<div className='items'>
					{this.props.loot.items.map(i => (<ListItemPanel key={i.id} item={i.name} />))}
				</div>
			);
		}

		const buttons: JSX.Element[] = [];
		if (this.props.onSelect && (buttons.length > 0)) {
			buttons.push(
				<button key='select' className='icon-btn' onClick={this.onSelect}><IconCheck /></button>
			);
		}

		return (
			<PlayingCard
				type={CardType.Item}
				front={(
					<div className='loot-pile-card'>
						<Text type={TextType.SubHeading}>Treasure</Text>
						<hr />
						{itemSection}
					</div>
				)}
				footerText='Item'
				footerContent={buttons}
				flipped={this.state.flipped}
				onClick={this.props.onSelect ? this.onSelect : null}
			/>
		);
	};
}

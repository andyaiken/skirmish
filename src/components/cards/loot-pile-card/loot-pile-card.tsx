import { Component, MouseEvent } from 'react';

import { CardType } from '../../../enums/card-type';

import type { LootPileModel } from '../../../models/encounter';

import { PlayingCard, Text, TextType } from '../../controls';

import { ListItemPanel } from '../../panels';

import './loot-pile-card.scss';

interface Props {
	loot: LootPileModel;
	disabled: boolean;
	onClick: ((loot: LootPileModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class LootPileCard extends Component<Props, State> {
	static defaultProps = {
		disabled: false,
		onClick: null
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

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.loot);
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

		return (
			<PlayingCard
				type={CardType.Item}
				front={(
					<div className='loot-pile-card-front'>
						<Text type={TextType.SubHeading}>Treasure</Text>
						<hr />
						{itemSection}
					</div>
				)}
				footerText='Item'
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}

import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import type { LootPileModel } from '../../../../models/encounter';

import { ItemCard, LootPileCard } from '../../../cards';
import { PlayingCard } from '../../../controls';

import './loot-token.scss';

interface Props {
	loot: LootPileModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (loot: LootPileModel) => void;
	onDoubleClick: (loot: LootPileModel) => void;
}

interface State {
	mouseOver: boolean;
}

export class LootToken extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mouseOver: false
		};
	}

	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.loot);
		}
	};

	onDoubleClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onDoubleClick(this.props.loot);
		}
	};

	setMouseOver = (value: boolean) => {
		this.setState({
			mouseOver: value
		});
	};

	getPopover = () => {
		let content = <LootPileCard loot={this.props.loot} />;
		if (this.props.loot.items.length === 1) {
			const item = this.props.loot.items[0];
			content = <ItemCard item={item} />;
		}

		return (
			<div
				className={this.state.mouseOver ? 'token-popover shown' : 'token-popover'}
				style={{
					left: `-${100 - (this.props.squareSize / 2)}px`,
					top: `${this.props.squareSize}px`
				}}
			>
				<PlayingCard type={CardType.Item} front={content} footer='Item' />
			</div>
		);
	};

	render = () => {
		try {
			const className = `encounter-map-loot-token ${this.props.selected ? 'selected' : ''} ${this.props.selectable ? 'selectable' : ''}`;
			return (
				<div
					className={className}
					style={{
						width: `${this.props.squareSize}px`,
						left: `${((this.props.loot.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
						top: `${((this.props.loot.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
					}}
					title='Treasure'
					onClick={e => this.onClick(e)}
					onDoubleClick={e => this.onDoubleClick(e)}
					onMouseEnter={() => this.setMouseOver(true)}
					onMouseLeave={() => this.setMouseOver(false)}
				>
					<div className='loot-token-face' />
					{this.getPopover()}
				</div>
			);
		} catch {
			return <div className='encounter-map-loot-token render-error' />;
		}
	};
}

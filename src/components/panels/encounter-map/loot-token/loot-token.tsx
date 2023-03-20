import { Component } from 'react';

import type { LootPileModel } from '../../../../models/encounter';

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

export class LootToken extends Component<Props> {
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

	render = () => {
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
			>
				<div className='loot-token-face' />
			</div>
		);
	};
}

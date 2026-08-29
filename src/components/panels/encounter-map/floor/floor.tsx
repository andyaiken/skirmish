import { Component } from 'react';

import type { EncounterMapSquareModel } from '../../../../models/encounter';

import './floor.scss';

interface Props {
	square: EncounterMapSquareModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (square: { x: number, y: number }) => void;
}

export class Floor extends Component<Props> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.square);
		}
	};

	render = () => {
		const type = this.props.square.type.toLowerCase();
		const selectable = this.props.selectable ? 'selectable' : '';
		const selected = this.props.selected ? 'selected' : '';
		const className = `encounter-map-floor ${type} ${selectable} ${selected}`;

		return (
			<div
				key={`square ${this.props.square.x} ${this.props.square.y}`}
				className={className}
				style={{
					width: `${this.props.squareSize}px`,
					left: `${((this.props.square.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.square.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
				onClick={e => this.onClick(e)}
			/>
		);
	};
}

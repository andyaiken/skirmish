import { PureComponent } from 'react';

import type { EncounterMapSquareType } from '../../../../enums/encounter-map-square-type';

import type { EncounterMapSquareModel } from '../../../../models/encounter';

import './floor.scss';

interface Props {
	square: EncounterMapSquareModel;
	// The square's type is passed separately as well as on the square itself.
	// Terrain-creating actions change the type on the square in place, which a
	// pure component can't see; given its own prop, the change is visible.
	type: EncounterMapSquareType;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (square: { x: number, y: number }) => void;
}

// There is one of these for every square of the map - several hundred of
// them - so it only redraws when something about its own square changes,
// rather than every time anything on the map does
export class Floor extends PureComponent<Props> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.square);
		}
	};

	render = () => {
		const type = this.props.type.toLowerCase();
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

import { PureComponent } from 'react';

import type { EncounterMapSquareModel } from '../../../../models/encounter';

import './fog.scss';

interface Props {
	square: EncounterMapSquareModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

// There is one of these for every square the current combatant can't see, so
// it only redraws when something about its own square changes, rather than
// every time anything on the map does
export class Fog extends PureComponent<Props> {
	render = () => {
		return (
			<div
				key={`square ${this.props.square.x} ${this.props.square.y}`}
				className='encounter-map-fog'
				style={{
					width: `${this.props.squareSize}px`,
					left: `${((this.props.square.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.square.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
			/>
		);
	};
}

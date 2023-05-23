import { Component } from 'react';

import type { EncounterMapSquareModel } from '../../../../models/encounter';

import './fog.scss';

interface Props {
	square: EncounterMapSquareModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

export class Fog extends Component<Props> {
	render = () => {
		try {
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
		} catch {
			return <div className='encounter-map-fog render-error' />;
		}
	};
}

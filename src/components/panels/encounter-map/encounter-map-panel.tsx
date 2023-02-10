import { Component } from 'react';
import { EncounterModel } from '../../../models/encounter';
import { getEncounterMapDimensions } from '../../../models/encounter-map';

import './encounter-map-panel.scss';

interface Props {
	encounter: EncounterModel;
}

export class EncounterMapPanel extends Component<Props> {
	public render() {
		// Get dimensions, adding a 1-square border
		const dims = getEncounterMapDimensions(this.props.encounter.map);
		dims.left -= 1;
		dims.top -= 1;
		dims.right += 1;
		dims.bottom += 1;

		// Determine the percentage width and height of a square
		const width = 1 + (dims.right - dims.left);
		const height = 1 + (dims.bottom - dims.top);
		const squareWidthPC = 100 / width;
		const squareHeightPC = 100 / height;

		const squares = this.props.encounter.map.squares.map(square => {
			return (
				<div
					key={square.id}
					className='encounter-map-square'
					style={{
						width: `${squareWidthPC}%`,
						height: `${squareWidthPC}%`,
						left: `${((square.x - dims.left) * squareWidthPC)}%`,
						top: `${((square.y - dims.top) * squareHeightPC)}%`,
						backgroundColor: 'white'
					}}
				/>
			);
		});

		return (
			<div className='encounter-map'>
				<div className='encounter-map-inner'>
					<div className='encounter-map-square-container'>
						{squares}
					</div>
				</div>
			</div>
		);
	}
}

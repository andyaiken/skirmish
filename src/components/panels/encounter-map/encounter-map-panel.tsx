import { Component } from 'react';
import { CombatantModel } from '../../../models/combatant';
import { EncounterModel, getCombatant } from '../../../models/encounter';
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

		const squares = this.props.encounter.map.squares.map(sq => {
			return (
				<div
					key={`${sq.x} ${sq.y}`}
					className='encounter-map-square'
					style={{
						width: `${squareWidthPC}%`,
						height: `${squareWidthPC}%`,
						left: `${((sq.x - dims.left) * squareWidthPC)}%`,
						top: `${((sq.y - dims.top) * squareHeightPC)}%`,
						backgroundColor: 'white'
					}}
				/>
			);
		});

		const tokens = this.props.encounter.combatData.map(cd => {
			const combatant = getCombatant(this.props.encounter, cd.id) as CombatantModel;
			return (
				<div
					key={cd.id}
					className={`encounter-map-token ${cd.type.toLowerCase()}`}
					style={{
						width: `${squareWidthPC * combatant.size}%`,
						height: `${squareWidthPC * combatant.size}%`,
						left: `${((cd.position.x - dims.left) * squareWidthPC)}%`,
						top: `${((cd.position.y - dims.top) * squareHeightPC)}%`
					}}
					title={combatant.name}
				>
					{combatant.name[0]}
				</div>
			)
		});

		return (
			<div className='encounter-map'>
				<div className='encounter-map-inner'>
					<div className='encounter-map-square-container'>
						{squares}
						{tokens}
					</div>
				</div>
			</div>
		);
	}
}

import { Component, MouseEvent } from 'react';
import { CombatantModel } from '../../../models/combatant';
import { EncounterModel } from '../../../models/encounter';
import { EncounterMapUtils } from '../../../utils/encounter-map-utils';
import { getCombatant } from '../../../utils/game-logic';

import './encounter-map-panel.scss';

interface Props {
	encounter: EncounterModel;
	currentID: string | null;
	selectedIDs: string[];
	onSelect: (combatant: CombatantModel | null) => void;
}

export class EncounterMapPanel extends Component<Props> {
	onSelectCombatant = (e: MouseEvent, combatant: CombatantModel | null) => {
		e.stopPropagation();
		this.props.onSelect(combatant);
	};

	public render() {
		// Get dimensions
		const dims = EncounterMapUtils.getEncounterMapDimensions(this.props.encounter.map);

		// Determine the percentage width and height of a square
		const width = 1 + (dims.right - dims.left);
		const height = 1 + (dims.bottom - dims.top);
		const squareSizePC = 100 / Math.max(width, height);

		const squares = this.props.encounter.map.squares.map(sq => {
			const className = `encounter-map-square ${sq.type.toLowerCase()}`;
			return (
				<div
					key={`${sq.x} ${sq.y}`}
					className={className}
					style={{
						width: `${squareSizePC}%`,
						height: `${squareSizePC}%`,
						left: `${((sq.x - dims.left) * squareSizePC)}%`,
						top: `${((sq.y - dims.top) * squareSizePC)}%`
					}}
				/>
			);
		});

		const tokens = this.props.encounter.combatData.map(cd => {
			const combatant = getCombatant(this.props.encounter, cd.id) as CombatantModel;
			const current = this.props.currentID === combatant.id;
			const selected = this.props.selectedIDs.includes(combatant.id);
			const className = `encounter-map-token ${cd.type.toLowerCase()} ${current ? 'current' : ''} ${selected ? 'selected' : ''}`;
			return (
				<div
					key={cd.id}
					className={className}
					style={{
						width: `${squareSizePC * combatant.size}%`,
						height: `${squareSizePC * combatant.size}%`,
						left: `${((cd.position.x - dims.left) * squareSizePC)}%`,
						top: `${((cd.position.y - dims.top) * squareSizePC)}%`
					}}
					title={combatant.name}
					onClick={e => this.onSelectCombatant(e, combatant)}
				>
					{combatant.name[0]}
				</div>
			);
		});

		return (
			<div className='encounter-map'>
				<div className='encounter-map-inner'>
					<div className='encounter-map-square-container' onClick={e => this.onSelectCombatant(e, null)}>
						{squares}
						{tokens}
					</div>
				</div>
			</div>
		);
	}
}

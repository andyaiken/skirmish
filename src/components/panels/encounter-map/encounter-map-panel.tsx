import { Component } from 'react';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../logic/encounter-map-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import './encounter-map-panel.scss';

interface Props {
	encounter: EncounterModel;
	squareSize: number;
	currentID: string | null;
	selectedIDs: string[];
	onSelect: (combatant: CombatantModel | null) => void;
}

export class EncounterMapPanel extends Component<Props> {
	onSelectCombatant = (e: React.MouseEvent, combatant: CombatantModel | null) => {
		e.stopPropagation();
		this.props.onSelect(combatant);
	};

	public render() {
		// Get dimensions
		const dims = EncounterMapLogic.getEncounterMapDimensions(this.props.encounter.map);

		const squares = this.props.encounter.map.squares.map(sq => {
			const className = `encounter-map-square ${sq.type.toLowerCase()}`;
			return (
				<div
					key={`${sq.x} ${sq.y}`}
					className={className}
					style={{
						width: `${this.props.squareSize}px`,
						height: `${this.props.squareSize}px`,
						left: `${((sq.x - dims.left) * this.props.squareSize)}px`,
						top: `${((sq.y - dims.top) * this.props.squareSize)}px`
					}}
				/>
			);
		});

		const auras = this.props.encounter.combatData.map(cd => {
			const combatant = EncounterLogic.getCombatant(this.props.encounter, cd.id) as CombatantModel;
			if (CombatantLogic.getAuras(combatant).length > 0) {
				return (
					<div
						key={cd.id}
						className='encounter-map-aura'
						style={{
							width: `${this.props.squareSize * (combatant.size + 2)}px`,
							height: `${this.props.squareSize * (combatant.size + 2)}px`,
							left: `${((cd.position.x - dims.left - 1) * this.props.squareSize)}px`,
							top: `${((cd.position.y - dims.top - 1) * this.props.squareSize)}px`
						}}
					>
					</div>
				);
			}

			return null;
		});

		const tokens = this.props.encounter.combatData.map(cd => {
			const combatant = EncounterLogic.getCombatant(this.props.encounter, cd.id) as CombatantModel;
			const current = this.props.currentID === combatant.id;
			const selected = this.props.selectedIDs.includes(combatant.id);
			const className = `encounter-map-token ${cd.type.toLowerCase()} ${current ? 'current' : ''} ${selected ? 'selected' : ''}`;
			return (
				<div
					key={cd.id}
					className={className}
					style={{
						width: `${this.props.squareSize * combatant.size}px`,
						height: `${this.props.squareSize * combatant.size}px`,
						left: `${((cd.position.x - dims.left) * this.props.squareSize)}px`,
						top: `${((cd.position.y - dims.top) * this.props.squareSize)}px`,
						fontSize: `${this.props.squareSize * 0.8}px`
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
				<div className='encounter-map-square-container' onClick={e => this.onSelectCombatant(e, null)}>
					{squares}
					{auras}
					{tokens}
				</div>
			</div>
		);
	}
}

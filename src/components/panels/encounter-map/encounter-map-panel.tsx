import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import { CombatantLogic } from '../../../logic/combatant-logic';
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
		// Get dimensions, adding a 1-square border
		const dims = EncounterMapLogic.getEncounterMapDimensions(this.props.encounter.map);
		dims.left -= 1;
		dims.top -= 1;
		dims.right += 1;
		dims.bottom += 1;

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

		const loot = this.props.encounter.map.loot
			.map(lp => {
				return (
					<div
						key={lp.id}
						className='encounter-map-loot'
						style={{
							width: `${this.props.squareSize}px`,
							height: `${this.props.squareSize}px`,
							left: `${((lp.position.x - dims.left) * this.props.squareSize)}px`,
							top: `${((lp.position.y - dims.top) * this.props.squareSize)}px`
						}}
					>
					</div>
				);
			});

		const auras = this.props.encounter.combatants
			.filter(combatant => combatant.combat.state !== CombatantState.Dead)
			.map(combatant => {
				if (CombatantLogic.getAuras(combatant).length > 0) {
					return (
						<div
							key={combatant.id}
							className='encounter-map-aura'
							style={{
								width: `${this.props.squareSize * (combatant.size + 2)}px`,
								height: `${this.props.squareSize * (combatant.size + 2)}px`,
								left: `${((combatant.combat.position.x - dims.left - 1) * this.props.squareSize)}px`,
								top: `${((combatant.combat.position.y - dims.top - 1) * this.props.squareSize)}px`
							}}
						>
						</div>
					);
				}

				return null;
			});

		const tokens = this.props.encounter.combatants
			.filter(combatant => combatant.combat.state !== CombatantState.Dead)
			.map(combatant => {
				const current = this.props.currentID === combatant.id;
				const selected = this.props.selectedIDs.includes(combatant.id);
				const className = `encounter-map-token ${combatant.type.toLowerCase()} ${current ? 'current' : ''} ${selected ? 'selected' : ''}`;
				return (
					<div
						key={combatant.id}
						className={className}
						style={{
							width: `${this.props.squareSize * combatant.size}px`,
							height: `${this.props.squareSize * combatant.size}px`,
							left: `${((combatant.combat.position.x - dims.left) * this.props.squareSize)}px`,
							top: `${((combatant.combat.position.y - dims.top) * this.props.squareSize)}px`,
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
					{loot}
					{auras}
					{tokens}
				</div>
			</div>
		);
	}
}

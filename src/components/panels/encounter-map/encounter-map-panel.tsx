import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../logic/encounter-map-logic';

import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';

import { Collections } from '../../../utils/collections';

import { AuraToken } from './aura-token/aura-token';
import { Fog } from './fog/fog';
import { LootToken } from './loot-token/loot-token';
import { MiniToken } from './mini-token/mini-token';
import { Square } from './floor/floor';
import { TrailToken } from './trail-token/trail-token';
import { Wall } from './wall/wall';

import './encounter-map-panel.scss';

interface Props {
	encounter: EncounterModel;
	squareSize: number;
	selectableCombatantIDs: string[];
	selectableLootIDs: string[];
	selectableSquares: { x: number, y: number }[];
	selectedCombatantIDs: string[];
	selectedLootIDs: string[];
	selectedSquares: { x: number, y: number }[];
	onClickCombatant: (combatant: CombatantModel) => void;
	onClickLoot: (loot: LootPileModel) => void;
	onClickSquare: (square: { x: number, y: number }) => void;
	onClickOff: () => void;
	onDoubleClickCombatant: (combatant: CombatantModel) => void;
	onDoubleClickLoot: (loot: LootPileModel) => void;
}

export class EncounterMapPanel extends Component<Props> {
	render = () => {
		// Get dimensions, adding a 1-square border
		const dims = EncounterMapLogic.getDimensions(this.props.encounter.mapSquares);
		dims.left -= 1;
		dims.top -= 1;
		dims.right += 1;
		dims.bottom += 1;

		let combatants = this.props.encounter.combatants.filter(combatant => combatant.combat.state !== CombatantState.Dead);
		const current = combatants.find(c => c.combat.current);
		if (current) {
			combatants = combatants.filter(c => (c === current) || (c.combat.senses >= c.combat.hidden));
		}

		const walls = Collections.distinct(EncounterMapLogic.getAdjacentWalls(this.props.encounter.mapSquares, this.props.encounter.mapSquares), sq => `${sq.x} ${sq.y}`).map(wall => {
			return (
				<Wall
					key={`wall ${wall.x} ${wall.y}`}
					wall={wall}
					squareSize={this.props.squareSize}
					mapDimensions={dims}
					selectable={!!this.props.selectableSquares.find(s => (s.x === wall.x) && (s.y === wall.y))}
					selected={!!this.props.selectedSquares.find(s => (s.x === wall.x) && (s.y === wall.y))}
					onClick={this.props.onClickSquare}
				/>
			);
		});

		const squares = Collections.distinct(this.props.encounter.mapSquares, sq => `${sq.x} ${sq.y}`).map(sq => {
			return (
				<Square
					key={`square ${sq.x} ${sq.y}`}
					square={sq}
					squareSize={this.props.squareSize}
					mapDimensions={dims}
					selectable={!!this.props.selectableSquares.find(s => (s.x === sq.x) && (s.y === sq.y))}
					selected={!!this.props.selectedSquares.find(s => (s.x === sq.x) && (s.y === sq.y))}
					onClick={this.props.onClickSquare}
				/>
			);
		});

		const loot = this.props.encounter.loot.map(lp => {
			return (
				<LootToken
					key={lp.id}
					loot={lp}
					squareSize={this.props.squareSize}
					mapDimensions={dims}
					selectable={(this.props.selectableLootIDs.length === 0) || this.props.selectableLootIDs.includes(lp.id)}
					selected={this.props.selectedLootIDs.includes(lp.id)}
					onClick={this.props.onClickLoot}
					onDoubleClick={this.props.onDoubleClickLoot}
				/>
			);
		});

		const auras = combatants.map(combatant => {
			if (CombatantLogic.getAuras(combatant).length > 0) {
				return (
					<AuraToken
						key={combatant.id}
						combatant={combatant}
						squareSize={this.props.squareSize}
						mapDimensions={dims}
					/>
				);
			}

			return null;
		});

		const trails = combatants.flatMap(combatant => {
			return combatant.combat.trail.map((pos, n) => {
				return (
					<TrailToken
						key={`trail ${combatant.id} ${n}`}
						position={pos}
						size={combatant.size}
						squareSize={this.props.squareSize}
						mapDimensions={dims}
					/>
				);
			});
		});

		const minis = combatants.map(combatant => {
			return (
				<MiniToken
					key={combatant.id}
					combatant={combatant}
					encounter={this.props.encounter}
					squareSize={this.props.squareSize}
					mapDimensions={dims}
					selectable={(this.props.selectableCombatantIDs.length === 0) || this.props.selectableCombatantIDs.includes(combatant.id)}
					selected={this.props.selectedCombatantIDs.includes(combatant.id)}
					onClick={this.props.onClickCombatant}
					onDoubleClick={this.props.onDoubleClickCombatant}
				/>
			);
		});

		const currentCombatant = this.props.encounter.combatants.find(c => c.combat.current);
		const currentCombatantSquares = currentCombatant ? EncounterLogic.getCombatantSquares(this.props.encounter, currentCombatant) : [];
		const edges = EncounterMapLogic.getMapEdges(this.props.encounter.mapSquares);
		const fog = Collections.distinct(this.props.encounter.mapSquares, sq => `${sq.x} ${sq.y}`)
			.filter(sq => {
				if (currentCombatant) {
					return !EncounterMapLogic.canSeeAny(edges, currentCombatantSquares, [ sq ]);
				}

				return false;
			})
			.map(sq => {
				return (
					<Fog
						key={`square ${sq.x} ${sq.y}`}
						square={sq}
						squareSize={this.props.squareSize}
						mapDimensions={dims}
					/>
				);
			});

		const width = dims.right - dims.left + 1;
		const height = dims.bottom - dims.top + 1;
		return (
			<div className='encounter-map' onClick={e => this.props.onClickOff()}>
				<div className='encounter-map-square-container' style={{ maxWidth: `${this.props.squareSize * width}px`, maxHeight: `${this.props.squareSize * height}px` }}>
					{squares}
					{loot}
					{auras}
					{trails}
					{walls}
					{minis}
					{fog}
				</div>
			</div>
		);
	};
}

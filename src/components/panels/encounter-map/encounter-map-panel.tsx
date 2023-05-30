import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import { ActionLogic } from '../../../logic/action-logic';
import { CombatantLogic } from '../../../logic/combatant-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../logic/encounter-map-logic';

import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { ActionOriginParameterModel } from '../../../models/action';
import type { CombatantModel } from '../../../models/combatant';

import { Collections } from '../../../utils/collections';

import { AuraToken } from './aura-token/aura-token';
import { Floor } from './floor/floor';
import { Fog } from './fog/fog';
import { LootToken } from './loot-token/loot-token';
import { MiniToken } from './mini-token/mini-token';
import { Overlay } from './overlay/overlay';
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
}

export class EncounterMapPanel extends Component<Props> {
	getEffect = () => {
		let effect = null;

		const combatant = this.props.encounter.combatants.find(c => c.combat.current);
		if (combatant) {
			if (combatant.combat.selectedAction && !combatant.combat.selectedAction.used) {
				const action = combatant.combat.selectedAction.action;

				const range = ActionLogic.getActionRange(action);
				const param = action.parameters.find(p => p.id === 'origin');
				if (param) {
					if (range > 0) {
						const originParam = param as ActionOriginParameterModel;
						if (originParam.value) {
							const originSquares = (originParam.value as { x: number, y: number }[]);
							if (originSquares.length > 0)
								effect = {
									x: originSquares[0].x,
									y: originSquares[0].y,
									size: 1,
									radius: range
								};
						}
					}
				} else {
					if (range > 1) {
						effect = {
							x: combatant.combat.position.x,
							y: combatant.combat.position.y,
							size: combatant.size,
							radius: range
						};
					}
				}
			}
		}

		return effect;
	};

	render = () => {
		try {
			// Get dimensions, adding a 1-square border
			const dims = EncounterMapLogic.getDimensions(this.props.encounter.mapSquares);
			dims.left -= 1;
			dims.top -= 1;
			dims.right += 1;
			dims.bottom += 1;

			let combatants = this.props.encounter.combatants.filter(combatant => combatant.combat.state !== CombatantState.Dead);
			const current = combatants.find(c => c.combat.current);
			if (current) {
				combatants = combatants.filter(c => (c === current) || (c.type === current.type) || (current.combat.senses >= c.combat.hidden));
			}

			const walls = Collections.distinct(EncounterMapLogic.getAdjacentWalls(this.props.encounter.mapSquares, this.props.encounter.mapSquares), sq => `${sq.x} ${sq.y}`)
				.sort((a, b) => {
					let result: number = a.y - b.y;
					if (result === 0) {
						result = a.x - b.x;
					}
					return result;
				})
				.map(wall => {
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

			const floor = Collections.distinct(this.props.encounter.mapSquares, sq => `${sq.x} ${sq.y}`)
				.sort((a, b) => {
					let result = a.y - b.y;
					if (result === 0) {
						result = a.x - b.x;
					}
					return result;
				})
				.map(sq => {
					return (
						<Floor
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
						encounter={this.props.encounter}
						squareSize={this.props.squareSize}
						mapDimensions={dims}
						selectable={(this.props.selectableLootIDs.length === 0) || this.props.selectableLootIDs.includes(lp.id)}
						selected={this.props.selectedLootIDs.includes(lp.id)}
						onClick={this.props.onClickLoot}
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

			const overlays = [];
			const effect = this.getEffect();
			if (effect) {
				overlays.push(
					<Overlay
						key='effect'
						x={effect.x}
						y={effect.y}
						size={effect.size}
						radius={effect.radius}
						squareSize={this.props.squareSize}
						mapDimensions={dims}
					/>
				);
			}

			const width = dims.right - dims.left + 1;
			const height = dims.bottom - dims.top + 1;

			return (
				<div className='encounter-map' onClick={e => this.props.onClickOff()}>
					<div className='encounter-map-square-container' style={{ maxWidth: `${this.props.squareSize * width}px`, maxHeight: `${this.props.squareSize * height}px` }}>
						{floor}
						{auras}
						{trails}
						{walls}
						{loot}
						{minis}
						{fog}
						{overlays}
					</div>
				</div>
			);
		} catch {
			return <div className='encounter-map render-error' />;
		}
	};
}

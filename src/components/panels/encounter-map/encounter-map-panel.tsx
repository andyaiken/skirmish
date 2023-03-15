import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';
import { TraitType } from '../../../enums/trait-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../logic/encounter-map-logic';

import type { EncounterMapSquareModel, EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';

import { Collections } from '../../../utils/collections';

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

interface WallProps {
	wall: { x: number, y: number };
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (square: { x: number, y: number }) => void;
}

class Wall extends Component<WallProps> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.wall);
		}
	};

	render = () => {
		const selectable = this.props.selectable ? 'selectable' : '';
		const selected = this.props.selected ? 'selected' : '';
		const className = `encounter-map-square wall ${selectable} ${selected}`;

		return (
			<div
				key={`square ${this.props.wall.x} ${this.props.wall.y}`}
				className={className}
				style={{
					width: `${this.props.squareSize}px`,
					left: `${((this.props.wall.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.wall.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
				onClick={e => this.onClick(e)}
			/>
		);
	};
}

interface SquareProps {
	square: EncounterMapSquareModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (square: { x: number, y: number }) => void;
}

class Square extends Component<SquareProps> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.square);
		}
	};

	render = () => {
		const type = this.props.square.type.toLowerCase();
		const selectable = this.props.selectable ? 'selectable' : '';
		const selected = this.props.selected ? 'selected' : '';
		const className = `encounter-map-square ${type} ${selectable} ${selected}`;

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

interface MiniTokenProps {
	combatant: CombatantModel;
	encounter: EncounterModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (combatant: CombatantModel) => void;
	onDoubleClick: (combatant: CombatantModel) => void;
}

class MiniToken extends Component<MiniTokenProps> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.combatant);
		}
	};

	onDoubleClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onDoubleClick(this.props.combatant);
		}
	};

	getMonogram = () => {
		return this.props.combatant.name
			.split(' ')
			.filter(token => token.length > 0)
			.map(token => token[0])
			.join('');
	};

	render = () => {
		const type = this.props.combatant.type.toLowerCase();
		const selectable = this.props.selectable ? 'selectable' : '';
		const selected = this.props.selected ? 'selected' : '';
		const className = `encounter-map-mini-token ${type} ${selectable} ${selected}`;

		let tooltip = this.props.combatant.name;
		if (this.props.combatant.combat.state === CombatantState.Dead) {
			tooltip += ' (dead)';
		} else if (this.props.combatant.combat.state === CombatantState.Unconscious) {
			tooltip += ' (unconscious)';
		} else if (this.props.combatant.combat.wounds > 0) {
			tooltip += ' (wounded)';
		} else if (this.props.combatant.combat.damage > 0) {
			tooltip += ' (damaged)';
		}
		if (this.props.combatant.combat.state === CombatantState.Prone) {
			tooltip += ' (prone)';
		}

		let healthBar = null;
		if (this.props.combatant.combat.wounds > 0) {
			const resolve = EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve);
			const barWidth = 1 - (this.props.combatant.combat.wounds / resolve);
			healthBar = (
				<div className='health-bar' style={{ height: `${this.props.squareSize / 5}px` }}>
					<div className='health-bar-gauge' style={{ width: `${100 * barWidth}%` }} />
				</div>
			);
		}

		return (
			<div
				className={className}
				style={{
					width: `${this.props.squareSize * this.props.combatant.size}px`,
					left: `${((this.props.combatant.combat.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.combatant.combat.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`,
					fontSize: `${this.props.squareSize * 0.35}px`
				}}
				title={tooltip}
				onClick={e => this.onClick(e)}
				onDoubleClick={e => this.onDoubleClick(e)}
			>
				<div className={this.props.combatant.combat.current ? 'mini-token-face current' : 'mini-token-face'}>
					{this.getMonogram()}
				</div>
				{healthBar}
				{this.props.combatant.combat.current ? <div className='pulse pulse-one' /> : null}
				{this.props.combatant.combat.current ? <div className='pulse pulse-two' /> : null}
				{this.props.combatant.combat.current ? <div className='pulse pulse-three' /> : null}
			</div>
		);
	};
}

interface TrailTokenProps {
	position: { x: number, y: number };
	size: number;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

class TrailToken extends Component<TrailTokenProps> {
	render = () => {
		return (
			<div
				className='encounter-map-trail-token'
				style={{
					width: `${this.props.squareSize * this.props.size}px`,
					left: `${((this.props.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
			>
			</div>
		);
	};
}

interface AuraTokenProps {
	combatant: CombatantModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

class AuraToken extends Component<AuraTokenProps> {
	render = () => {
		return (
			<div
				className='encounter-map-aura-token'
				style={{
					width: `${this.props.squareSize * (this.props.combatant.size + 2)}px`,
					left: `${((this.props.combatant.combat.position.x - this.props.mapDimensions.left - 1) * this.props.squareSize)}px`,
					top: `${((this.props.combatant.combat.position.y - this.props.mapDimensions.top - 1) * this.props.squareSize)}px`
				}}
			>
			</div>
		);
	};
}

interface LootTokenProps {
	loot: LootPileModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (loot: LootPileModel) => void;
	onDoubleClick: (loot: LootPileModel) => void;
}

class LootToken extends Component<LootTokenProps> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.loot);
		}
	};

	onDoubleClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onDoubleClick(this.props.loot);
		}
	};

	render = () => {
		const className = `encounter-map-loot-token ${this.props.selected ? 'selected' : ''} ${this.props.selectable ? 'selectable' : ''}`;
		return (
			<div
				className={className}
				style={{
					width: `${this.props.squareSize}px`,
					left: `${((this.props.loot.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.loot.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
				title='Treasure'
				onClick={e => this.onClick(e)}
				onDoubleClick={e => this.onDoubleClick(e)}
			>
				<div className='loot-token-face' />
			</div>
		);
	};
}

interface FogProps {
	square: EncounterMapSquareModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

class Fog extends Component<FogProps> {
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

import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { EncounterMapLogic } from '../../../logic/encounter-map-logic';

import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';

import { Collections } from '../../../utils/collections';

import './encounter-map-panel.scss';

interface Props {
	encounter: EncounterModel;
	squareSize: number;
	selectedIDs: string[];
	onSelect: (item: CombatantModel | LootPileModel | null) => void;
	onDetails: (item: CombatantModel | LootPileModel) => void;
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

		const squares = this.props.encounter.mapSquares.map(sq => {
			const className = `encounter-map-square ${sq.type.toLowerCase()}`;
			return (
				<div
					key={`square ${sq.x} ${sq.y}`}
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

		const loot = this.props.encounter.loot
			.map(lp => {
				return (
					<LootToken
						key={lp.id}
						loot={lp}
						squareSize={this.props.squareSize}
						mapDimensions={dims}
						selected={this.props.selectedIDs.includes(lp.id)}
						onSelect={this.props.onSelect}
						onDetails={this.props.onDetails}
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

		const minis = combatants.map(combatant => {
			return (
				<MiniToken
					key={combatant.id}
					combatant={combatant}
					squareSize={this.props.squareSize}
					mapDimensions={dims}
					selected={this.props.selectedIDs.includes(combatant.id)}
					onSelect={this.props.onSelect}
					onDetails={this.props.onDetails}
				/>
			);
		});

		const edges = ([] as { x: number, y: number }[])
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 'n'))
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 'ne'))
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 'e'))
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 'se'))
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 's'))
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 'sw'))
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 'w'))
			.concat(EncounterMapLogic.getEdges(this.props.encounter.mapSquares, this.props.encounter.mapSquares, 'nw'));
		const walls = Collections.distinct(edges, sq => `${sq.x} ${sq.y}`).map(sq => {
			return (
				<div
					key={`wall ${sq.x} ${sq.y}`}
					className='encounter-map-square wall'
					style={{
						width: `${this.props.squareSize}px`,
						height: `${this.props.squareSize}px`,
						left: `${((sq.x - dims.left) * this.props.squareSize)}px`,
						top: `${((sq.y - dims.top) * this.props.squareSize)}px`
					}}
				/>
			);
		});

		const width = dims.right - dims.left + 1;
		const height = dims.bottom - dims.top + 1;
		return (
			<div className='encounter-map' onClick={e => this.props.onSelect(null)}>
				<div className='encounter-map-square-container' style={{ maxWidth: `${this.props.squareSize * width}px`, maxHeight: `${this.props.squareSize * height}px` }}>
					{squares}
					{loot}
					{auras}
					{minis}
					{walls}
				</div>
			</div>
		);
	};
}

interface MiniTokenProps {
	combatant: CombatantModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selected: boolean;
	onSelect: (combatant: CombatantModel) => void;
	onDetails: (combatant: CombatantModel) => void;
}

class MiniToken extends Component<MiniTokenProps> {
	onClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		this.props.onSelect(this.props.combatant);
	};

	onDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		this.props.onDetails(this.props.combatant);
	};

	render = () => {
		const className = `encounter-map-mini-token ${this.props.combatant.type.toLowerCase()} ${this.props.combatant.combat.current ? 'current' : ''} ${this.props.selected ? 'selected' : ''}`;
		return (
			<div
				className={className}
				style={{
					width: `${this.props.squareSize * this.props.combatant.size}px`,
					height: `${this.props.squareSize * this.props.combatant.size}px`,
					left: `${((this.props.combatant.combat.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.combatant.combat.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`,
					fontSize: `${this.props.squareSize * 0.8}px`
				}}
				title={this.props.combatant.name}
				onClick={e => this.onClick(e)}
				onDoubleClick={e => this.onDoubleClick(e)}
			>
				{this.props.combatant.name[0]}
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
					height: `${this.props.squareSize * (this.props.combatant.size + 2)}px`,
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
	selected: boolean;
	onSelect: (loot: LootPileModel | null) => void;
	onDetails: (loot: LootPileModel) => void;
}

class LootToken extends Component<LootTokenProps> {
	onClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		this.props.onSelect(this.props.loot);
	};

	onDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		this.props.onDetails(this.props.loot);
	};

	render = () => {
		const className = `encounter-map-loot-token ${this.props.selected ? 'selected' : ''}`;
		return (
			<div
				className={className}
				style={{
					width: `${this.props.squareSize}px`,
					height: `${this.props.squareSize}px`,
					left: `${((this.props.loot.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.loot.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
				title='Treasure'
				onClick={e => this.onClick(e)}
				onDoubleClick={e => this.onDoubleClick(e)}
			>
			</div>
		);
	};
}

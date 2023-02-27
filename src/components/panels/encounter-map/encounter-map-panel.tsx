import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { EncounterMapLogic } from '../../../logic/encounter-map-logic';

import type { EncounterModel, LootPileModel } from '../../../models/encounter';
import type { CombatantModel } from '../../../models/combatant';

import './encounter-map-panel.scss';

interface Props {
	encounter: EncounterModel;
	squareSize: number;
	selectedIDs: string[];
	onSelect: (combatant: CombatantModel | null) => void;
	onCombatantDetails: (combatant: CombatantModel) => void;
	onLootDetails: (loot: LootPileModel) => void;
}

export class EncounterMapPanel extends Component<Props> {
	render = () => {
		const dims = EncounterMapLogic.getDimensions(this.props.encounter.mapSquares);

		let combatants = this.props.encounter.combatants.filter(combatant => combatant.combat.state !== CombatantState.Dead);
		const current = combatants.find(c => c.combat.current);
		if (current) {
			combatants = combatants.filter(c => (c === current) || (c.combat.senses >= c.combat.hidden));
		}

		const squares = this.props.encounter.mapSquares.map(sq => {
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

		const loot = this.props.encounter.loot
			.map(lp => {
				return (
					<LootToken
						key={lp.id}
						loot={lp}
						squareSize={this.props.squareSize}
						mapDimensions={dims}
						onDetails={this.props.onLootDetails}
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
					onDetails={this.props.onCombatantDetails}
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
	onSelect: (combatant: CombatantModel | null) => void;
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
	onDetails: (loot: LootPileModel) => void;
}

class LootToken extends Component<LootTokenProps> {
	onDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		this.props.onDetails(this.props.loot);
	};

	render = () => {
		return (
			<div
				className='encounter-map-loot-token'
				style={{
					width: `${this.props.squareSize}px`,
					height: `${this.props.squareSize}px`,
					left: `${((this.props.loot.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.loot.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
				title='Treasure'
				onDoubleClick={e => this.onDoubleClick(e)}
			>
			</div>
		);
	};
}

import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { TraitType } from '../../../../enums/trait-type';

import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import './mini-token.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (combatant: CombatantModel) => void;
	onDoubleClick: (combatant: CombatantModel) => void;
}

export class MiniToken extends Component<Props> {
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

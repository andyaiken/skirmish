import { Component } from 'react';

import { EncounterLogic } from '../../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../../logic/encounter-map-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { ItemModel } from '../../../../models/item';

import { Collections } from '../../../../utils/collections';

import { IconType, IconValue } from '../../../controls';
import { DirectionPanel } from '../../../panels';

import './combatant-move.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	pickUpItem: (item: ItemModel, combatant: CombatantModel) => void;
}

export class CombatantMove extends Component<Props> {
	render = () => {
		const moveCosts: Record<string, number> = {};
		moveCosts.n = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'n');
		moveCosts.ne = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'ne');
		moveCosts.e = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'e');
		moveCosts.se = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'se');
		moveCosts.s = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 's');
		moveCosts.sw = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'sw');
		moveCosts.w = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'w');
		moveCosts.nw = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, 'nw');

		const canPickUp = (this.props.combatant.combat.movement >= 1) && (this.props.combatant.carried.length < 6);

		const adj = EncounterMapLogic.getAdjacentSquares(this.props.encounter.mapSquares, [ this.props.combatant.combat.position ]);
		const piles = this.props.encounter.loot.filter(lp => adj.find(sq => (sq.x === lp.position.x) && (sq.y === lp.position.y)));
		const items = Collections.distinct(piles.flatMap(pile => pile.items), i => i.id);
		const pickUpButtons = items.map(item => {
			const name = item.magic ? `${item.name} (${item.baseItem})` : item.name;
			return (
				<button key={item.id} disabled={!canPickUp} onClick={() => this.props.pickUpItem(item, this.props.combatant)}>
					Pick Up {name}<br/><IconValue value={1} type={IconType.Movement} iconSize={12} />
				</button>
			);
		});

		return (
			<div className='combatant-move'>
				<DirectionPanel combatant={this.props.combatant} costs={moveCosts} onMove={(dir, cost) => this.props.move(this.props.encounter, this.props.combatant, dir, cost)} />
				{this.props.developer ? <button className='developer' onClick={() => this.props.addMovement(this.props.encounter, this.props.combatant, 10)}>Add Movement</button> : null}
				{pickUpButtons.length > 0 ? <hr /> : null}
				{pickUpButtons}
			</div>
		);
	};
}

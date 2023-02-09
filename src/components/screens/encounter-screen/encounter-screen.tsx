import { Component } from 'react';
import { EncounterModel, EncounterState, getEncounterState } from '../../../models/encounter';
import { GameModel } from '../../../models/game';
import { HeroModel } from '../../../models/hero';
import { ItemModel } from '../../../models/item';
import { EncounterMapPanel, InitiativeListPanel } from '../../panels';

import './encounter-screen.scss';

export enum EncounterFinishState {
	Victory = 'victory',
	Defeat = 'defeat',
	Retreat = 'retreat'
}

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	equipItem: (item: ItemModel, hero: HeroModel) => void;
	unequipItem: (item: ItemModel, hero: HeroModel) => void;
	finishEncounter: (state: EncounterFinishState) => void;
}

export class EncounterScreen extends Component<Props> {

	// Each round:
	// Roll reactions to get initiative score
	// Iterate through combatants in initiative order
		// Set Hidden to 0
		// Iterate through conditions
			// If beneficial, reduce by 1
			// Otherwise, roll trait vs condition rank; on success, reduced to 0, on fail, reduced by 1
			// If condition rank is 0, removed
			// If health condition, roll and apply
		// If unconscious, roll resolve vs 8; on failure, dead
		// If standing or prone
			// Roll Speed to set movement points; roll and apply movement conditions
			// Roll Perception to set Senses
			// Draw three action cards
			// Apply auto-healing effects from auras
			// Apply auto-damage effects from auras
			// Combatant moves / takes an action
			// When (action taken and movement points are gone) or (combatant chooses), end turn

	// Moving:
	// Move into any adjacent empty square, including diagonals, for 1 movement point
		// If the square you are moving into is obstructed, add 1 movement point
		// If the square you are moving out of is adjacent to a standing opponent, add 4 movement points
		// Apply ease movement effects from auras
		// Apply prevent movement effects from auras
		// If you are prone or hidden, movement point costs are x2

	// Using an action:
	// Select targets (self / allies / opponents, within range of weapon / implement, cannot target opponents whose Stealth beats your Perception)
	// Apply initial effects
	// If Unreliable weapon, roll Unreliable; if 10 or over, attack ends
	// Otherwise, for each target:
		// Apply pre-attack effects
		// If attack:
			// Roll attacker's attack skill vs target's trait
			// Bonus equal to allies adjacent to the target
			// Apply hit / miss effects
		// Apply post-attack effects
	// Apply finish effects

	// Taking damage:
	// Roll damage rank, add attacker's damage bonus, add weapon damage bonus, subtract target's damage resistance; apply damage vulnerability / damage resistance effects from auras; add this to the target’s Damage
	// If more than 0:
		// Roll target's Endurance; if result less than Damage, reset Damage to 0 and increment Wounds
		// If target's Wounds equals Resolve rank, unconscious; if target's Wounds greater than Resolve rank, dead
			// If dead, removed from the map; equipment lies in the square it fell in

	// Healing:
	// Healing damage reduces target's Damage
	// Healing wounds reduces target's Wounds
	// If unconscious and Wounds reduced to below Resolve, prone

	// Other options:
	// Hide: spend 4 movement pts, roll Stealth
	// Go prone: 1 pt of movement
		// Prone: skill ranks are halved
	// Stand from prone: spend 10 - (Athletics roll) movement points
	// Pick up (and don) adjacent object: 1 movement pts
	// Drop held (or worn) object: 1 movement pt
	// Open / close door: 2 movement pts
	
	public render() {
		let controls = null;
		switch (getEncounterState(this.props.encounter)) {
			case EncounterState.Active:
				controls = (
					<div>
						<div>action card slots</div>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Retreat)}>Retreat</button>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Defeat)}>Surrender</button>
					</div>
				);
				break;
			case EncounterState.Won:
				controls = (
					<div>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Victory)}>Victory</button>
					</div>
				);
				break;
			case EncounterState.Defeated:
				controls = (
					<div>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Defeat)}>Defeat</button>
					</div>
				);
				break;
		}

		return (
			<div className='encounter-screen'>
				<InitiativeListPanel />
				<EncounterMapPanel map={this.props.encounter.map} />
				{controls}
			</div>
		);
	}
}

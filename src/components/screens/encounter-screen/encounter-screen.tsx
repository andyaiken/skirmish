import { Component } from 'react';
import { Encounter, EncounterState, getEncounterState } from '../../../models/encounter';
import { Game } from '../../../models/game';
import { Hero } from '../../../models/hero';
import { Item } from '../../../models/item';
import { CharacterSheetPanel, EncounterMapPanel, InitiativeListPanel } from '../../panels';

import './encounter-screen.scss';

export enum EncounterFinishState {
	Victory = 'victory',
	Defeat = 'defeat',
	Retreat = 'retreat'
}

interface Props {
	encounter: Encounter;
	game: Game;
	equipItem: (item: Item, hero: Hero) => void;
	unequipItem: (item: Item, hero: Hero) => void;
	finishEncounter: (state: EncounterFinishState) => void;
}

export class EncounterScreen extends Component<Props> {
	public render() {
		let controls = null;
		switch (getEncounterState(this.props.encounter)) {
			case EncounterState.Active:
				controls = (
					<div>
						<CharacterSheetPanel
							hero={null as unknown as Hero}
							game={this.props.game}
							equipItem={(item, hero) => this.props.equipItem(item, hero)}
							unequipItem={(item, hero) => this.props.unequipItem(item, hero)}
						/>
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

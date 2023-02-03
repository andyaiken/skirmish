import { Component } from 'react';
import { Encounter, EncounterHelper, EncounterState } from '../../../models/encounter';
import { Game } from '../../../models/game';
import { Hero } from '../../../models/hero';
import { Item } from '../../../models/item';
import { CharacterSheetPanel, EncounterMapPanel, InitiativeListPanel } from '../../panels';

import './encounter-screen.scss';

export enum EncounterFinishState {
	Victory = 'victory',
	Defeat = 'defeat',
	Retreat = 'retreat',
	Concede = 'concede'
}

interface Props {
	encounter: Encounter;
	game: Game;
	equipItem: (item: Item, hero: Hero) => void;
	unequipItem: (item: Item, hero: Hero) => void;
	finish: (state: EncounterFinishState) => void;
}

export class EncounterScreen extends Component<Props> {
	public render() {
		let controls = null;
		switch (EncounterHelper.getState(this.props.encounter)) {
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
						<button onClick={() => this.props.finish(EncounterFinishState.Retreat)}>RETREAT</button>
						<button onClick={() => this.props.finish(EncounterFinishState.Concede)}>CONCEDE</button>
					</div>
				);
				break;
			case EncounterState.Won:
				controls = (
					<div>
						<button onClick={() => this.props.finish(EncounterFinishState.Victory)}>VICTORY</button>
					</div>
				);
				break;
			case EncounterState.Defeated:
				controls = (
					<div>
						<button onClick={() => this.props.finish(EncounterFinishState.Defeat)}>DEFEAT</button>
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

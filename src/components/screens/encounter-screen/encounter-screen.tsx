import { Component } from 'react';

import { EncounterState } from '../../../enums/encounter-state';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { CharacterSheetPanel, EncounterMapPanel, InitiativeListPanel } from '../../panels';
import { CombatantControls } from './combatant-controls/combatant-controls';
import { Dialog } from '../../controls';

import './encounter-screen.scss';

export enum EncounterFinishState {
	Victory = 'victory',
	Defeat = 'defeat',
	Retreat = 'retreat'
}

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	rollInitiative: (encounter: EncounterModel) => void;
	endTurn: (encounter: EncounterModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	standUp: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterFinishState) => void;
}

interface State {
	mapSquareSize: number;
	selectedIDs: string[];
	detailsID: string | null;
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapSquareSize: 10,
			selectedIDs: [],
			detailsID: null
		};
	}

	nudgeMapSize = (delta: number) => {
		const size = Math.max(this.state.mapSquareSize + delta, 5);
		this.setState({
			mapSquareSize: size
		});
	};

	selectCombatant = (combatant: CombatantModel | null) => {
		this.setState({
			selectedIDs: combatant ? [ combatant.id ] : []
		});
	};

	showDetails = (combatant: CombatantModel | null) => {
		this.setState({
			detailsID: combatant ? combatant.id : null
		});
	};

	public render() {
		const acting = EncounterLogic.getActiveCombatants(this.props.encounter);
		const currentCombatant = acting.length > 0 ? acting[0] : null;

		let controls = null;
		switch (EncounterLogic.getEncounterState(this.props.encounter)) {
			case EncounterState.Active:
				if (currentCombatant !== null) {
					controls = (
						<div className='encounter-right-panel'>
							<CombatantControls
								combatant={currentCombatant}
								encounter={this.props.encounter}
								endTurn={this.props.endTurn}
								move={this.props.move}
								standUp={this.props.standUp}
								scan={this.props.scan}
								hide={this.props.hide}
								equipItem={this.props.equipItem}
								unequipItem={this.props.unequipItem}
								showCharacterSheet={this.showDetails}
								finishEncounter={this.props.finishEncounter}
							/>
						</div>
					);
				}
				break;
			case EncounterState.Won:
				controls = (
					<div className='encounter-right-panel'>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Victory)}>Victory</button>
					</div>
				);
				break;
			case EncounterState.Defeated:
				controls = (
					<div className='encounter-right-panel'>
						<button onClick={() => this.props.finishEncounter(EncounterFinishState.Defeat)}>Defeated</button>
					</div>
				);
				break;
		}

		let dialog = null;
		if (this.state.detailsID) {
			const details = EncounterLogic.getCombatant(this.props.encounter, this.state.detailsID) as CombatantModel;
			dialog = (
				<Dialog
					content={
						<CharacterSheetPanel
							hero={details}
							game={this.props.game}
							equipItem={this.props.equipItem}
							unequipItem={this.props.unequipItem}
							pickUpItem={this.props.pickUpItem}
							dropItem={this.props.dropItem}
							levelUp={() => null}
						/>
					}
					onClickOff={() => this.showDetails(null)}
				/>
			);
		}

		return (
			<div className='encounter-screen'>
				<div className='encounter-left-panel'>
					<InitiativeListPanel
						encounter={this.props.encounter}
						currentID={currentCombatant ? currentCombatant.id : null}
						selectedIDs={this.state.selectedIDs}
						rollInitiative={this.props.rollInitiative}
						onSelect={this.selectCombatant}
						onDetails={this.showDetails}
					/>
				</div>
				<div className='encounter-central-panel'>
					<EncounterMapPanel
						encounter={this.props.encounter}
						squareSize={this.state.mapSquareSize}
						currentID={currentCombatant ? currentCombatant.id : null}
						selectedIDs={this.state.selectedIDs}
						onSelect={this.selectCombatant}
					/>
					<div className='map-controls'>
						<button disabled={this.state.mapSquareSize <= 5} onClick={() => this.nudgeMapSize(-5)}>-</button>
						<button disabled={this.state.mapSquareSize >= 50} onClick={() => this.nudgeMapSize(+5)}>+</button>
					</div>
				</div>
				{controls}
				{dialog}
			</div>
		);
	}
}

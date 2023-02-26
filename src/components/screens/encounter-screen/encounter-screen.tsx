import { Component } from 'react';

import { EncounterState } from '../../../enums/encounter-state';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CampaignMapRegionModel } from '../../../models/campaign-map';
import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { CharacterSheetPanel, EncounterMapPanel, InitiativeListPanel } from '../../panels';
import { Dialog, Text, TextType } from '../../controls';
import { CombatantControls } from './combatant-controls/combatant-controls';

import './encounter-screen.scss';

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
	kill: (encounter: EncounterModel, combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterState) => void;
}

interface State {
	mapSquareSize: number;
	selectedIDs: string[];
	manualEncounterState: EncounterState;
	detailsID: string | null;
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapSquareSize: 10,
			selectedIDs: [],
			manualEncounterState: EncounterState.Active,
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

	setManualEncounterState = (state: EncounterState) => {
		this.setState({
			manualEncounterState: state
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

		let state = this.state.manualEncounterState;
		if (state === EncounterState.Active) {
			state = EncounterLogic.getEncounterState(this.props.encounter);
		}

		let initiative = null;
		let controls = null;
		switch (state) {
			case EncounterState.Active:
				if (currentCombatant === null) {
					controls = (
						<div className='encounter-right-panel empty'>
							<button onClick={() => this.props.rollInitiative(this.props.encounter)}>Roll Initiative</button>
						</div>
					);
				} else {
					initiative = (
						<div className='encounter-left-panel'>
							<InitiativeListPanel
								encounter={this.props.encounter}
								currentID={currentCombatant.id}
								selectedIDs={this.state.selectedIDs}
								onSelect={this.selectCombatant}
								onDetails={this.showDetails}
							/>
						</div>
					);
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
								pickUpItem={this.props.pickUpItem}
								showCharacterSheet={this.showDetails}
								kill={this.props.kill}
							/>
						</div>
					);
				}
				break;
			case EncounterState.Victory: {
				const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as CampaignMapRegionModel;
				controls = (
					<div className='encounter-right-panel empty'>
						<Text type={TextType.Heading}>Victory</Text>
						<Text>You won the encounter in {region.name}!</Text>
						<Text>Each surviving hero who took part in this encounter gains 1 XP.</Text>
						<Text>Any heroes who died have been lost.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Victory)}>OK</button>
					</div>
				);
				break;
			}
			case EncounterState.Defeat: {
				const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as CampaignMapRegionModel;
				controls = (
					<div className='encounter-right-panel empty'>
						<Text type={TextType.Heading}>Defeated</Text>
						<Text>You lost the encounter in {region.name}.</Text>
						<Text>Those heroes who took part have been lost, along with all their equipment.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Defeat)}>OK</button>
					</div>
				);
				break;
			}
			case EncounterState.Retreat: {
				const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as CampaignMapRegionModel;
				controls = (
					<div className='encounter-right-panel empty'>
						<Text type={TextType.Heading}>Retreat</Text>
						<Text>You retreated from the encounter in {region.name}.</Text>
						<Text>Any heroes who fell have been lost, along with all their equipment.</Text>
						<button onClick={() => this.props.finishEncounter(EncounterState.Retreat)}>OK</button>
					</div>
				);
				break;
			}
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
				{initiative}
				<div className='encounter-central-panel'>
					<EncounterMapPanel
						encounter={this.props.encounter}
						squareSize={this.state.mapSquareSize}
						currentID={currentCombatant ? currentCombatant.id : null}
						selectedIDs={this.state.selectedIDs}
						onSelect={this.selectCombatant}
						onDetails={this.showDetails}
					/>
					<div className='map-controls'>
						<div className='zoom'>
							<button disabled={this.state.mapSquareSize <= 5} className='zoom-btn' onClick={() => this.nudgeMapSize(-5)}>-</button>
							<button disabled={this.state.mapSquareSize >= 50} className='zoom-btn' onClick={() => this.nudgeMapSize(+5)}>+</button>
						</div>
						<button className='finish-btn hack' onClick={() => this.setManualEncounterState(EncounterState.Victory)}>Victory</button>
						<button className='finish-btn danger' onClick={() => this.setManualEncounterState(EncounterState.Retreat)}>Retreat</button>
						<button className='finish-btn danger' onClick={() => this.setManualEncounterState(EncounterState.Defeat)}>Surrender</button>
					</div>
				</div>
				{controls}
				{dialog}
			</div>
		);
	}
}

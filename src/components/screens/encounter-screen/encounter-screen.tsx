import { Component } from 'react';
import type { EncounterModel } from '../../../models/encounter';
import type { GameModel } from '../../../models/game';
import type { CombatantModel } from '../../../models/combatant';
import type { ItemModel } from '../../../models/item';
import type { CombatDataModel } from '../../../models/combat-data';
import { DirectionPanel, EncounterMapPanel, InitiativeListPanel } from '../../panels';
import { Tag, Text, TextType } from '../../../controls';
import { Box, CardList, IconType, IconValue, PlayingCard, StatValue } from '../../utility';
import { ActionCard } from '../../cards';
import { CombatantUtils } from '../../../logic/combatant-utils';
import { EncounterUtils } from '../../../logic/encounter-utils';

import './encounter-screen.scss';
import { GameLogic } from '../../../logic/game-logic';
import { CombatDataState } from '../../../enums/combat-data-state';
import { CombatantType } from '../../../enums/combatant-type';
import { EncounterState } from '../../../enums/encounter-state';
import { SkillType } from '../../../enums/skill-type';
import { TraitType } from '../../../enums/trait-type';

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
	move: (encounter: EncounterModel, combatData: CombatDataModel, dir: string, cost: number) => void;
	standUp: (encounter: EncounterModel, combatData: CombatDataModel) => void;
	scan: (encounter: EncounterModel, combatData: CombatDataModel) => void;
	hide: (encounter: EncounterModel, combatData: CombatDataModel) => void;
	equipItem: (item: ItemModel, combatant: CombatantModel) => void;
	unequipItem: (item: ItemModel, combatant: CombatantModel) => void;
	finishEncounter: (state: EncounterFinishState) => void;
}

interface State {
	mapSquareSize: number;
	selectedIDs: string[];
}

export class EncounterScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapSquareSize: 10,
			selectedIDs: []
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

	endTurn = () => {
		this.props.endTurn(this.props.encounter);
	};

	getEncounterControls = (currentID: string | null) => {
		if (currentID !== null) {
			const combatant = EncounterUtils.getCombatant(this.props.encounter, currentID) as CombatantModel;
			const combatData = EncounterUtils.getCombatData(this.props.encounter, currentID) as CombatDataModel;

			const prone = combatData.state === CombatDataState.Prone;

			const movement = <IconValue value={combatData.movement} type={IconType.Movement} />;

			let wounds = '';
			for (let n = 0; n < combatData.wounds; ++n) {
				wounds += '♥︎';
			}
			while (wounds.length < CombatantUtils.getTraitValue(combatant, TraitType.Resolve)) {
				wounds += '♡';
			}
			const woundsPerRow = (wounds.length < 6) || (wounds.length > 8) ? 5 : 4;
			const woundsInRows: JSX.Element[] = [];
			while (wounds.length > woundsPerRow) {
				woundsInRows.push(<div key={woundsInRows.length}>{wounds.substring(0, woundsPerRow)}</div>);
				wounds = wounds.substring(woundsPerRow);
			}
			if (wounds !== '') {
				woundsInRows.push(<div key={woundsInRows.length}>{wounds}</div>);
			}

			const moveCosts: Record<string, number> = {};
			moveCosts.n = EncounterUtils.getMoveCost(this.props.encounter, combatData, 'n');
			moveCosts.ne = EncounterUtils.getMoveCost(this.props.encounter, combatData, 'ne');
			moveCosts.e = EncounterUtils.getMoveCost(this.props.encounter, combatData, 'e');
			moveCosts.se = EncounterUtils.getMoveCost(this.props.encounter, combatData, 'se');
			moveCosts.s = EncounterUtils.getMoveCost(this.props.encounter, combatData, 's');
			moveCosts.sw = EncounterUtils.getMoveCost(this.props.encounter, combatData, 'sw');
			moveCosts.w = EncounterUtils.getMoveCost(this.props.encounter, combatData, 'w');
			moveCosts.nw = EncounterUtils.getMoveCost(this.props.encounter, combatData, 'nw');

			const actionCards = combatData.actions.map(a => {
				const source = CombatantUtils.getCardSource(combatant, a.id, 'action');
				return (
					<PlayingCard key={a.id} front={<ActionCard action={a} />} footer={source} />
				);
			});

			switch (combatant.type) {
				case CombatantType.Hero: {
					if (combatData.state === CombatDataState.Unconscious) {
						return (
							<div>
								UNCONSCIOUS
							</div>
						);
					}
					if (combatData.state === CombatDataState.Dead) {
						return (
							<div>
								DEAD
							</div>
						);
					}
					return (
						<div>
							<Text type={TextType.SubHeading}>{combatant.name}</Text>
							<div className='tags'>
								<Tag>{GameLogic.getSpecies(combatant.speciesID)?.name ?? 'Unknown species'}</Tag>
								<Tag>{GameLogic.getRole(combatant.roleID)?.name ?? 'Unknown role'}</Tag>
								<Tag>{GameLogic.getBackground(combatant.backgroundID)?.name ?? 'Unknown background'}</Tag>
								<Tag>Level {combatant.level}</Tag>
							</div>
							{prone ? <Text type={TextType.Information}><b>You are Prone.</b> Your skill ranks are halved and moving costs are doubled.</Text> : null}
							{combatData.hidden > 0 ? <Text type={TextType.Information}><b>You are Hidden.</b> Your moving costs are doubled.</Text> : null}
							<Box label='This Round'>
								<div className='stats-row'>
									<StatValue orientation='vertical' label='Movement' value={movement} />
									<div>
										<StatValue orientation='vertical' label='Senses' value={combatData.senses} />
										<button
											disabled={combatData.movement < 4}
											onClick={() => this.props.scan(this.props.encounter, combatData)}
										>
											Scan<br/><IconValue value={4} type={IconType.Movement} />
										</button>
										<StatValue label='Perc' value={CombatantUtils.getSkillValue(combatant, SkillType.Perception)} />
									</div>
									<div>
										<StatValue orientation='vertical' label='Hidden' value={combatData.hidden} />
										<button
											disabled={combatData.movement < 4}
											onClick={() => this.props.hide(this.props.encounter, combatData)}
										>
											Hide<br/><IconValue value={4} type={IconType.Movement} />
										</button>
										<StatValue label='Stealth' value={CombatantUtils.getSkillValue(combatant, SkillType.Stealth)} />
									</div>
									<div>
										<StatValue orientation='vertical' label='State' value={combatData.state} />
										{
											prone ?
												<button
													disabled={combatData.movement < 8}
													onClick={() => this.props.standUp(this.props.encounter, combatData)}
												>
													Stand<br/><IconValue value={8} type={IconType.Movement} />
												</button>
												: null
										}
									</div>
								</div>
							</Box>
							<Box label='Damage and Wounds'>
								<div className='stats-row'>
									<StatValue orientation='vertical' label='Damage' value={combatData.damage} />
									<StatValue orientation='vertical' label='Wounds' value={<div>{woundsInRows}</div>} />
								</div>
							</Box>
							<Box label='Traits and Conditions'>
								<div className='stats-row'>
									<div>
										<StatValue orientation='vertical' label='Endurance' value={CombatantUtils.getTraitValue(combatant, TraitType.Endurance)} />
										<div>{combatData.conditions.filter(c => c.trait === TraitType.Endurance).map(c => c.type)}</div>
									</div>
									<div>
										<StatValue orientation='vertical' label='Resolve' value={CombatantUtils.getTraitValue(combatant, TraitType.Resolve)} />
										<div>{combatData.conditions.filter(c => c.trait === TraitType.Resolve).map(c => c.type)}</div>
									</div>
									<div>
										<StatValue orientation='vertical' label='Speed' value={CombatantUtils.getTraitValue(combatant, TraitType.Speed)} />
										<div>{combatData.conditions.filter(c => c.trait === TraitType.Speed).map(c => c.type)}</div>
									</div>
								</div>
							</Box>
							<hr />
							<div className='movement'>
								<DirectionPanel combatData={combatData} costs={moveCosts} onMove={(dir, cost) => this.props.move(this.props.encounter, combatData, dir, cost)} />
							</div>
							<hr />
							<div className='actions not-implemented'>
								<CardList cards={actionCards} />
							</div>
							<hr />
							<button className='not-implemented' onClick={() => null}>Pick Up Item<br/><IconValue value={2} type={IconType.Movement} /></button>
							<button className='not-implemented' onClick={() => null}>Drop Item<br/><IconValue value={1} type={IconType.Movement} /></button>
							<hr />
							<button onClick={this.endTurn}>End Turn</button>
							<hr />
							<button className='hack' onClick={() => this.props.finishEncounter(EncounterFinishState.Victory)}>Win</button>
							<button onClick={() => this.props.finishEncounter(EncounterFinishState.Retreat)}>Retreat</button>
							<button onClick={() => this.props.finishEncounter(EncounterFinishState.Defeat)}>Surrender</button>
						</div>
					);
				}
				case CombatantType.Monster: {
					return (
						<div>
							<Text type={TextType.SubHeading}>{combatant.name}</Text>
							<div className='tags'>
								<Tag>Level {combatant.level}</Tag>
							</div>
							MONSTER CONTROLS
							<hr />
							<button onClick={this.endTurn}>End Turn</button>
						</div>
					);
				}
			}
		}
	};

	public render() {
		const acting = EncounterUtils.getActiveCombatants(this.props.encounter);
		const currentID = acting.length > 0 ? acting[0].id : null;

		let controls = null;
		switch (EncounterUtils.getEncounterState(this.props.encounter)) {
			case EncounterState.Active:
				controls = (
					<div className='encounter-right-panel'>
						{this.getEncounterControls(currentID)}
					</div>
				);
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

		return (
			<div className='encounter-screen'>
				<div className='encounter-left-panel'>
					<InitiativeListPanel
						encounter={this.props.encounter}
						currentID={currentID}
						selectedIDs={this.state.selectedIDs}
						rollInitiative={this.props.rollInitiative}
						onSelect={this.selectCombatant}
					/>
				</div>
				<div className='encounter-central-panel'>
					<EncounterMapPanel
						encounter={this.props.encounter}
						squareSize={this.state.mapSquareSize}
						currentID={currentID}
						selectedIDs={this.state.selectedIDs}
						onSelect={this.selectCombatant}
					/>
					<div className='map-controls'>
						<button disabled={this.state.mapSquareSize <= 5} onClick={() => this.nudgeMapSize(-5)}>-</button>
						<button disabled={this.state.mapSquareSize >= 50} onClick={() => this.nudgeMapSize(+5)}>+</button>
					</div>
				</div>
				{controls}
			</div>
		);
	}
}

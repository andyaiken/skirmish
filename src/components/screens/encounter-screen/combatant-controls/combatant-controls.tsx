import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import type { ActionModel, ActionParameterModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { ConfirmButton, Tabs } from '../../../controls';
import { CombatantAction } from './combatant-action/combatant-action';
import { CombatantHeader } from './combatant-header/combatant-header';
import { CombatantMonster } from './combatant-monster/combatant-monster';
import { CombatantMove } from './combatant-move/combatant-move';
import { CombatantOverview } from './combatant-overview/combatant-overview';

import './combatant-controls.scss';

interface CombatantControlsProps {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	selectedActionParameter: ActionParameterModel | null;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameter: (parameter: ActionParameterModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	runMonsterTurn: (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => void;
	endTurn: () => void;
}

interface CombatantControlsState {
	tab: string;
	thinking: boolean;
}

export class CombatantControls extends Component<CombatantControlsProps, CombatantControlsState> {
	constructor(props: CombatantControlsProps) {
		super(props);
		this.state = {
			tab: 'stats',
			thinking: false
		};
	}

	setTab = (tab: string) => {
		this.setState({
			tab: tab
		});
	};

	setThinking = (value: boolean) => {
		this.setState({
			thinking: value
		});
	};

	runMonsterTurn = () => {
		this.setState({
			thinking: true
		}, () => {
			this.props.runMonsterTurn(this.props.encounter, this.props.combatant, () => {
				this.setState({
					thinking: false
				});
			});
		});
	};

	endTurn = () => {
		this.setState({
			tab: 'stats'
		}, () => {
			this.props.endTurn();
		});
	};

	render = () => {
		try {
			const unconscious = this.props.combatant.combat.state === CombatantState.Unconscious;
			const dead = this.props.combatant.combat.state === CombatantState.Dead;
			const stunned = this.props.combatant.combat.stunned;
			if (unconscious || dead || stunned) {
				return (
					<div className='combatant-controls'>
						<CombatantHeader
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.developer}
							onTokenClick={this.props.showToken}
							showCharacterSheet={this.props.showCharacterSheet}
						/>
						<hr />
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}

			if (this.props.combatant.type === CombatantType.Monster) {
				return (
					<div className='combatant-controls'>
						<CombatantHeader
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.developer}
							onTokenClick={this.props.showToken}
							showCharacterSheet={this.props.showCharacterSheet}
						/>
						<CombatantMonster combatant={this.props.combatant} />
						<hr />
						<button disabled={this.state.thinking} onClick={() => this.runMonsterTurn()}>
							{this.state.thinking ? 'Thinking' : 'Go'}
						</button>
					</div>
				);
			}

			let content = null;
			switch (this.state.tab) {
				case 'stats':
					content = (
						<CombatantOverview
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.developer}
							inspire={this.props.inspire}
							scan={this.props.scan}
							hide={this.props.hide}
						/>
					);
					break;
				case 'move':
					content = (
						<CombatantMove
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.developer}
							move={this.props.move}
							addMovement={this.props.addMovement}
						/>
					);
					break;
				case 'action':
					content = (
						<CombatantAction
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							currentActionParameter={this.props.selectedActionParameter}
							developer={this.props.developer}
							drawActions={this.props.drawActions}
							selectAction={this.props.selectAction}
							deselectAction={this.props.deselectAction}
							setActionParameter={this.props.setActionParameter}
							setActionParameterValue={this.props.setActionParameterValue}
							runAction={this.props.runAction}
						/>
					);
					break;
			}

			return (
				<div className='combatant-controls'>
					<CombatantHeader
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						developer={this.props.developer}
						onTokenClick={this.props.showToken}
						showCharacterSheet={this.props.showCharacterSheet}
					/>
					<Tabs
						options={[
							{ id: 'stats', display: 'Stats' },
							{ id: 'move', display: 'Move' },
							{ id: 'action', display: 'Action' }
						]}
						selectedID={this.state.tab}
						onSelect={this.setTab}
					/>
					{content}
					<hr />
					{
						this.props.combatant.combat.selectedAction && this.props.combatant.combat.selectedAction.used ?
							<button onClick={this.endTurn}>End Turn</button>
							:
							<ConfirmButton label='End Turn' info='You have not yet taken an action.' onClick={this.endTurn} />
					}
				</div>
			);
		}  catch {
			return <div className='combatant-controls render-error' />;
		}
	};
}

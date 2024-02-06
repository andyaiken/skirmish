import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
import { StructureType } from '../../../../enums/structure-type';

import { ActionLogic, ActionPrerequisites } from '../../../../logic/action-logic';
import { CombatantLogic } from '../../../../logic/combatant-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { GameModel } from '../../../../models/game';

import { ActionCard, StrongholdBenefitCard } from '../../../cards';
import { Text, TextType } from '../../../controls';
import { ActionParameter } from './action-parameter/action-parameter';

import './action-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	game: GameModel;
	developer: boolean;
	currentActionParameter: ActionParameterModel | null;
	collapsed: boolean;
	toggleCollapsed: () => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel, useCharge: StructureType | null) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameter: (parameter: ActionParameterModel) => void;
	setWeaponParameterValue: (parameter: ActionWeaponParameterModel, weaponID: string) => void;
	setOriginParameterValue: (parameter: ActionOriginParameterModel, square: { x: number, y: number }) => void;
	setTargetParameterValue: (parameter: ActionTargetParameterModel, targetIDs: string[]) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

export class ActionControls extends Component<Props> {
	showParameter = (parameter: ActionParameterModel) => {
		switch (parameter.id) {
			case 'weapon':
				return parameter.candidates.length > 1;
			case 'targets': {
				const targetParam = parameter as ActionTargetParameterModel;
				return !!targetParam.targets && !!targetParam.value;
			}
		}

		return true;
	};

	getNotSelected = () => {
		const actionCards: JSX.Element[] = [];
		const baseCards: JSX.Element[] = [];

		this.props.combatant.combat.actions
			.filter(a => CombatantLogic.getActionSourceType(this.props.combatant, a.id) !== CardType.Base)
			.sort((a, b) => a.name.localeCompare(b.name))
			.forEach(a => {
				const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.combatant));
				actionCards.push(
					<ActionCard
						key={a.id}
						action={a}
						footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
						footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						disabled={!prerequisitesMet}
						onClick={prerequisitesMet ? action => this.props.selectAction(this.props.encounter, this.props.combatant, action) : null}
					/>
				);
			});

		this.props.combatant.combat.actions
			.filter(a => CombatantLogic.getActionSourceType(this.props.combatant, a.id) === CardType.Base)
			.forEach(a => {
				const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.combatant));
				if (prerequisitesMet) {
					baseCards.push(
						<ActionCard
							key={a.id}
							action={a}
							footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							onClick={action => this.props.selectAction(this.props.encounter, this.props.combatant, action)}
						/>
					);
				}
			});

		let benefit = null;
		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Observatory);
		if ((redraws > 0) || this.props.developer) {
			benefit = (
				<StrongholdBenefitCard
					label='Redraw'
					available={redraws}
					developer={this.props.developer}
					onRedraw={() => this.props.drawActions(this.props.encounter, this.props.combatant, this.props.developer ? null : StructureType.Observatory)}
				/>
			);
		}

		return (
			<div key='not-selected' className='action-controls-content'>
				{actionCards}
				{benefit ? <div className='separator' /> : null}
				{benefit}
				{baseCards.length > 0 ? <div className='separator' /> : null}
				{baseCards}
			</div>
		);
	};

	getInProgress = (action: ActionModel) => {
		let prerequisitesMet = true;
		const prerequisites: JSX.Element[] = [];
		action.prerequisites.forEach((prerequisite, n) => {
			if (!ActionPrerequisites.isSatisfied(prerequisite, this.props.combatant)) {
				prerequisitesMet = false;
				prerequisites.push(
					<div key={n} className='action-prerequisite'>{prerequisite.description}</div>
				);
			}
		});

		let allParametersSet = true;
		const parameters: JSX.Element[] = [];
		action.parameters.forEach((parameter, n) => {
			if (!allParametersSet) {
				// A previous parameter isn't finished yet
				return;
			}

			const parameterSet = ActionLogic.isParameterSet(parameter);
			if (this.showParameter(parameter) && !!parameter.value) {
				parameters.push(
					<ActionParameter
						key={parameter.id}
						parameter={parameter}
						encounter={this.props.encounter}
						combatant={this.props.combatant}
						isSelectedOnMap={this.props.currentActionParameter === parameter}
						selectOnMap={this.props.setActionParameter}
						setWeaponParameterValue={this.props.setWeaponParameterValue}
						setOriginParameterValue={this.props.setOriginParameterValue}
						setTargetParameterValue={this.props.setTargetParameterValue}
					/>
				);
			}

			if (!parameterSet) {
				allParametersSet = false;
			}
		});

		return (
			<div key={action.id} className='action-controls-content'>
				<ActionCard
					action={action}
					footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
					footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
					combatant={this.props.combatant}
					encounter={this.props.encounter}
				/>
				<div className='action-details'>
					{prerequisites}
					{parameters}
					<div className='button-row'>
						<button
							className='primary'
							disabled={!prerequisitesMet || !allParametersSet}
							onClick={() => this.props.runAction(this.props.encounter, this.props.combatant)}
						>
							Go
						</button>
						<button
							onClick={() => this.props.deselectAction(this.props.encounter, this.props.combatant)}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	};

	getUsed = (action: ActionModel) => {
		let benefit = null;
		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.ThievesGuild);
		if ((redraws > 0) || this.props.developer) {
			benefit = (
				<StrongholdBenefitCard
					label='Act Again'
					available={redraws}
					developer={this.props.developer}
					onUse={() => this.props.drawActions(this.props.encounter, this.props.combatant, this.props.developer ? null : StructureType.ThievesGuild)}
				/>
			);
		}

		return (
			<div key={action.id + ' used'} className='action-controls-content'>
				<ActionCard
					action={action}
					footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
					footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
					combatant={this.props.combatant}
					encounter={this.props.encounter}
				/>
				{benefit}
				<div className='action-details'>
					<Text type={TextType.Information}>
						<p>You have used your action for this turn.</p>
						{this.props.combatant.combat.movement > 0 ? <p>You still have some movement points you can use.</p> : null }
					</Text>
				</div>
			</div>
		);
	};

	render = () => {
		try {
			let banner = null;
			let content = null;
			if (this.props.combatant.combat.selectedAction) {
				if (this.props.combatant.combat.selectedAction.used) {
					content = this.getUsed(this.props.combatant.combat.selectedAction.action);
				} else {
					content = this.getInProgress(this.props.combatant.combat.selectedAction.action);
				}
			} else {
				if (!this.props.collapsed) {
					banner = (
						<div className='banner'>
							Scroll left and right to see all the action cards in your hand.
						</div>
					);
				}
				content = this.getNotSelected();
			}

			return (
				<div
					key={this.props.combatant.id}
					className={`action-controls ${this.props.collapsed ? 'collapsed' : 'expanded'}`}
					onClick={() => {
						if (this.props.collapsed) {
							this.props.toggleCollapsed();
						}
					}}
				>
					{banner}
					{content}
				</div>
			);
		} catch {
			return <div className='action-controls render-error' />;
		}
	};
}

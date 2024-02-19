import { Component } from 'react';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';
import type { OptionsModel } from '../../../models/options';

import { Text, TextType } from '../../controls';
import { CombatantRowPanel } from '../../panels';

import './initiative-list-panel.scss';

interface Props {
	encounter: EncounterModel;
	options: OptionsModel;
	selectedIDs: string[];
	onSelect: (combatant: CombatantModel) => void;
	nudgeInitiative: (combatant: CombatantModel, delta: number) => void;
}

export class InitiativeListPanel extends Component<Props> {
	render = () => {
		try {
			const currentEntries = EncounterLogic.getActiveCombatants(this.props.encounter)
				.filter(c => c.combat.current)
				.map(combatant => {
					return (
						<CombatantRowPanel
							key={combatant.id}
							mode='initiative'
							combatant={combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							onClick={this.props.onSelect}
							onTokenClick={this.props.onSelect}
						/>
					);
				});

			const activeEntries = EncounterLogic.getActiveCombatants(this.props.encounter)
				.filter(c => !c.combat.current)
				.map(combatant => {
					return (
						<CombatantRowPanel
							key={combatant.id}
							mode='initiative'
							combatant={combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							onClick={this.props.onSelect}
							onTokenClick={this.props.onSelect}
							onNudgeInitiative={this.props.nudgeInitiative}
						/>
					);
				});

			const actedEntries = EncounterLogic.getActedCombatants(this.props.encounter)
				.map(combatant => {
					return (
						<CombatantRowPanel
							key={combatant.id}
							mode='initiative'
							combatant={combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							onClick={this.props.onSelect}
							onTokenClick={this.props.onSelect}
						/>
					);
				});

			const deadEntries = EncounterLogic.getDeadCombatants(this.props.encounter)
				.map(combatant => {
					return (
						<CombatantRowPanel
							key={combatant.id}
							mode='initiative'
							combatant={combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							onClick={this.props.onSelect}
							onTokenClick={this.props.onSelect}
						/>
					);
				});

			let actedHeading = 'Acted';
			if (currentEntries.length === 0) {
				actedHeading = 'Combatants';
			}

			return (
				<div className='initiative-list-panel'>
					{currentEntries.length > 0 ? <Text type={TextType.SubHeading}>Current Combatant</Text> : null}
					{currentEntries}
					{activeEntries.length > 0 ? <Text type={TextType.SubHeading}>Waiting</Text> : null}
					{activeEntries}
					{actedEntries.length > 0 ? <Text type={TextType.SubHeading}>{actedHeading}</Text> : null}
					{actedEntries}
					{deadEntries.length > 0 ? <Text type={TextType.SubHeading}>Dead</Text> : null}
					{deadEntries}
				</div>
			);
		} catch {
			return <div className='initiative-list-panel render-error' />;
		}
	};
}

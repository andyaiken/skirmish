import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { StatValue, Tag } from '../../controls';

import './initiative-list-panel.scss';

interface Props {
	encounter: EncounterModel;
	selectedIDs: string[];
	onSelect: (combatant: CombatantModel) => void;
	onDetails: (combatant: CombatantModel) => void;
}

export class InitiativeListPanel extends Component<Props> {
	render = () => {
		try {
			const activeEntries = EncounterLogic.getActiveCombatants(this.props.encounter).map(combatant => {
				return (
					<Entry
						key={combatant.id}
						combatant={combatant}
						selected={this.props.selectedIDs.includes(combatant.id)}
						onSelect={this.props.onSelect}
						onDetails={this.props.onDetails}
					/>
				);
			});

			const actedEntries = EncounterLogic.getActedCombatants(this.props.encounter).map(combatant => {
				return (
					<Entry
						key={combatant.id}
						combatant={combatant}
						selected={this.props.selectedIDs.includes(combatant.id)}
						onSelect={this.props.onSelect}
						onDetails={this.props.onDetails}
					/>
				);
			});

			return (
				<div className='initiative-list-panel'>
					{activeEntries}
					{(activeEntries.length > 0) && (actedEntries.length > 0) ? <hr /> : null}
					{actedEntries}
				</div>
			);
		} catch {
			return <div className='initiative-list-panel render-error' />;
		}
	};
}

interface EntryProps {
	combatant: CombatantModel;
	selected: boolean;
	onSelect: (combatant: CombatantModel) => void;
	onDetails: (combatant: CombatantModel) => void;
}

class Entry extends Component<EntryProps> {
	render = () => {
		const currentTag = this.props.combatant.combat.current ? <Tag>Current Turn</Tag> : null;
		const hiddenTag = (this.props.combatant.combat.hidden > 0) ? <Tag>Hidden</Tag> : null;
		const stunnedTag = this.props.combatant.combat.stunned ? <Tag>Stunned</Tag> : null;
		const unconsciousTag = this.props.combatant.combat.state === CombatantState.Unconscious ? <Tag>Unconscious</Tag> : null;
		const deadTag = this.props.combatant.combat.state === CombatantState.Dead ? <Tag>Dead</Tag> : null;
		let tags = null;
		if (currentTag || hiddenTag || stunnedTag || unconsciousTag || deadTag) {
			tags = (
				<div className='initiative-entry-tags'>
					{currentTag}
					{hiddenTag}
					{stunnedTag}
					{unconsciousTag}
					{deadTag}
				</div>
			);
		}

		const current = this.props.combatant.combat.current ? 'current' : '';
		const acted = this.props.combatant.combat.initiative === Number.MIN_VALUE ? 'acted' : '';
		const selected = this.props.selected ? 'selected' : '';
		const className = `initiative-entry ${current} ${acted} ${selected}`;
		const label = (
			<div className='initiative-entry-details'>
				<div className='initiative-entry-name'>{this.props.combatant.name}</div>
				{tags}
			</div>
		);

		return (
			<div className={className} onClick={() => this.props.onSelect(this.props.combatant)} onDoubleClick={() => this.props.onDetails(this.props.combatant)}>
				<div className={`initiative-entry-token ${this.props.combatant.type.toLowerCase()}`}></div>
				<StatValue label={label} value={this.props.combatant.combat.initiative !== Number.MIN_VALUE ? this.props.combatant.combat.initiative : ''} />
			</div>
		);
	};
}

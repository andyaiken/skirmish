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
	onSelect: (combatant: CombatantModel | null) => void;
	onDetails: (combatant: CombatantModel) => void;
}

export class InitiativeListPanel extends Component<Props> {
	public render() {
		const entries = EncounterLogic.getActiveCombatants(this.props.encounter).map(combatant => {
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
				{entries}
			</div>
		);
	}
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
		const unconsciousTag = this.props.combatant.combat.state === CombatantState.Unconscious ? <Tag>Unconscious</Tag> : null;
		const deadTag = this.props.combatant.combat.state === CombatantState.Dead ? <Tag>Dead</Tag> : null;
		let tags = null;
		if (currentTag || unconsciousTag || deadTag) {
			tags = (
				<div className='initiative-entry-tags'>
					{currentTag}
					{unconsciousTag}
					{deadTag}
				</div>
			);
		}

		const className = `initiative-entry ${this.props.combatant.combat.current ? 'current' : ''} ${this.props.selected ? 'selected' : ''}`;
		const label = (
			<div className='initiative-entry-details'>
				<div className='initiative-entry-name'>{this.props.combatant.name}</div>
				{tags}
			</div>
		);

		return (
			<div className={className} onClick={() => this.props.onSelect(this.props.combatant)} onDoubleClick={() => this.props.onDetails(this.props.combatant)}>
				<div className={`initiative-entry-token ${this.props.combatant.type.toLowerCase()}`}></div>
				<StatValue label={label} value={this.props.combatant.combat.initiative} />
			</div>
		);
	};
}

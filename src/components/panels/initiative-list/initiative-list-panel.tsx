import { Component } from 'react';

import { CombatantState } from '../../../enums/combatant-state';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { StatValue, Tag, Text, TextType } from '../../controls';

import './initiative-list-panel.scss';

interface Props {
	encounter: EncounterModel;
	currentID: string | null;
	selectedIDs: string[];
	onSelect: (combatant: CombatantModel | null) => void;
	onDetails: (combatant: CombatantModel) => void;
}

export class InitiativeListPanel extends Component<Props> {
	public render() {
		const entries = EncounterLogic.getActiveCombatants(this.props.encounter)
			.map(combatant => {
				const current = combatant.id === this.props.currentID;
				const selected = this.props.selectedIDs.includes(combatant.id);

				const currentTag = current ? <Tag>Current Turn</Tag> : null;
				const unconsciousTag = combatant.combat.state === CombatantState.Unconscious ? <Tag>Unconscious</Tag> : null;
				const deadTag = combatant.combat.state === CombatantState.Dead ? <Tag>Dead</Tag> : null;
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

				const className = `initiative-entry ${current ? 'current' : ''} ${selected ? 'selected' : ''}`;
				const label = (
					<div className='initiative-entry-details'>
						<div className='initiative-entry-name'>{combatant.name}</div>
						{tags}
					</div>
				);
				return (
					<div key={combatant.id} className={className} onClick={() => this.props.onSelect(combatant)} onDoubleClick={() => this.props.onDetails(combatant)}>
						<div className={`initiative-entry-token ${combatant.type.toLowerCase()}`}></div>
						<StatValue label={label} value={combatant.combat.initiative} />
					</div>
				);
			});

		let content = null;
		if (entries.length !== 0) {
			content = (
				<div>
					<Text type={TextType.SubHeading}>Initiative</Text>
					{entries}
				</div>
			);
		}

		return (
			<div className='initiative-list-panel'>
				{content}
			</div>
		);
	}
}

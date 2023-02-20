import { Component } from 'react';

import { CombatDataState } from '../../../enums/combat-data-state';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { StatValue, Tag, Text, TextType } from '../../controls';

import './initiative-list-panel.scss';

interface Props {
	encounter: EncounterModel;
	currentID: string | null;
	selectedIDs: string[];
	rollInitiative: (encounter: EncounterModel) => void;
	onSelect: (combatant: CombatantModel | null) => void;
}

export class InitiativeListPanel extends Component<Props> {
	rollInitiative = () => {
		this.props.rollInitiative(this.props.encounter);
	};

	public render() {
		const acting = EncounterLogic.getActiveCombatants(this.props.encounter)
			.map(cd => {
				return {
					combatant: EncounterLogic.getCombatant(this.props.encounter, cd.id) as CombatantModel,
					data: cd
				};
			})
			.map(a => {
				const currentTag = this.props.currentID === a.combatant.id ? <Tag>Current Turn</Tag> : null;
				const unconsciousTag = a.data.state === CombatDataState.Unconscious ? <Tag>Unconscious</Tag> : null;
				const deadTag = a.data.state === CombatDataState.Dead ? <Tag>Dead</Tag> : null;
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

				const selected = this.props.selectedIDs.includes(a.combatant.id);
				const className = `initiative-entry ${this.props.currentID === a.combatant.id ? 'current' : ''} ${selected ? 'selected' : ''}`;
				const label = (
					<div className='initiative-entry-details'>
						<div className='initiative-entry-name'>{a.combatant.name}</div>
						{tags}
					</div>
				);
				return (
					<div key={a.combatant.id} className={className} onClick={() => this.props.onSelect(a.combatant)}>
						<div className={`initiative-entry-token ${a.combatant.type.toLowerCase()}`}></div>
						<StatValue label={label} value={a.data.initiative} />
					</div>
				);
			});

		let content = null;
		if (acting.length === 0) {
			content = (
				<div className='empty'>
					<button onClick={this.rollInitiative}>Roll for initiative</button>
				</div>
			);
		} else {
			content = (
				<div>
					<Text type={TextType.SubHeading}>Initiative</Text>
					{acting}
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

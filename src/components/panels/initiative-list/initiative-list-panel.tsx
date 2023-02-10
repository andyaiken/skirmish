import { Component } from 'react';
import { Text, TextType } from '../../../controls';
import { CombatantModel } from '../../../models/combatant';
import { EncounterModel, getCombatant } from '../../../models/encounter';

import './initiative-list-panel.scss';

interface Props {
	encounter: EncounterModel;
	rollInitiative: (encounter: EncounterModel) => void;
}

export class InitiativeListPanel extends Component<Props> {
	rollInitiative = () => {
		this.props.rollInitiative(this.props.encounter);
	}

	public render() {
		const acting = this.props.encounter.combatData
			.filter(cd => cd.initiative !== Number.MIN_VALUE)
			.map(cd => {
				return {
					combatant: getCombatant(this.props.encounter, cd.id) as CombatantModel,
					data: cd
				};
			})
			.map(a => {
				return (
					<div key={a.combatant.id} className='initiative-entry'>
						<div className='initiative-entry-name'>{a.combatant.name}</div>
						<div className='initiative-entry-value'>{a.data.initiative}</div>
					</div>
				);
			});

		let content = null;
		if (acting.length === 0) {
			content = (
				<div>
					<button onClick={this.rollInitiative}>Roll for initiative</button>
				</div>
			);
		} else {
			content = (
				<div>
					{acting}
				</div>
			)
		}

		return (
			<div className='initiative-list-panel'>
				<Text type={TextType.SubHeading}>Initiative</Text>
				{content}
			</div>
		);
	}
}

import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { OptionsModel } from '../../../../models/options';

import { CombatantNotices, CombatantRowPanel } from '../../../panels';

import './inactive-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
}

export class InactiveControls extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='inactive-controls'>
					<CombatantRowPanel
						mode='header'
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						onTokenClick={this.props.showToken}
						onDetails={this.props.showCharacterSheet}
					/>
					<CombatantNotices combatant={this.props.combatant} />
				</div>
			);
		}  catch {
			return <div className='inactive-controls render-error' />;
		}
	};
}

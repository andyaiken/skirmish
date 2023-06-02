import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Tabs, Text, TextType } from '../../../controls';
import { CombatantRowPanel } from '../../../panels';

import './combatant-header.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	developer: boolean;
	tabID: string;
	onTokenClick: (combatant: CombatantModel) => void;
	onSelectTab: (tabID: string) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
}

export class CombatantHeader extends Component<Props> {
	getTabs = () => {
		if (this.props.combatant.type === CombatantType.Monster) {
			return null;
		}

		if ((this.props.combatant.combat.state === CombatantState.Dead) || (this.props.combatant.combat.state === CombatantState.Unconscious)) {
			return null;
		}

		if (this.props.combatant.combat.stunned) {
			return null;
		}

		const options = [
			{ id: 'overview', display: 'Overview' },
			{ id: 'move', display: 'Move' },
			{ id: 'action', display: 'Action' }
		];

		return (
			<Tabs
				options={options}
				selectedID={this.props.tabID}
				onSelect={this.props.onSelectTab}
			/>
		);
	};

	render = () => {
		try {
			return (
				<div className='combatant-header'>
					<CombatantRowPanel
						mode='header'
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						onTokenClick={this.props.onTokenClick}
						onDetails={this.props.showCharacterSheet}
					/>
					{
						this.props.combatant.combat.state === CombatantState.Prone ?
							<Text type={TextType.Information}><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and moving costs are doubled.</Text>
							: null
					}
					{
						this.props.combatant.combat.hidden > 0 ?
							<Text type={TextType.Information}><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</Text>
							: null
					}
					{this.getTabs()}
				</div>
			);
		} catch {
			return <div className='combatant-header render-error' />;
		}
	};
}

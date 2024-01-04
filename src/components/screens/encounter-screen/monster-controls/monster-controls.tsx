import { Component } from 'react';

import { CombatantLogic } from '../../../../logic/combatant-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { OptionsModel } from '../../../../models/options';

import { CombatStatsPanel, CombatantNotices, CombatantRowPanel } from '../../../panels';
import { Expander, Text, TextType } from '../../../controls';
import { ActionCard } from '../../../cards';

import './monster-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	switchAllegiance: (combatant: CombatantModel) => void;
}

interface State {
	thinking: boolean;
}

export class MonsterControls extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			thinking: false
		};
	}

	setThinking = (value: boolean) => {
		this.setState({
			thinking: value
		});
	};

	render = () => {
		try {
			let action = null;
			if (this.props.combatant.combat.selectedAction) {
				action = (
					<div className='selected-action-card'>
						<ActionCard
							action={this.props.combatant.combat.selectedAction.action}
							footer={CombatantLogic.getActionSource(this.props.combatant, this.props.combatant.combat.selectedAction.action.id)}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, this.props.combatant.combat.selectedAction.action.id)}
						/>
					</div>
				);
			}

			return (
				<div className='monster-controls' key={this.props.combatant.id}>
					<CombatantRowPanel
						mode='header'
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						onTokenClick={this.props.showToken}
						onDetails={this.props.showCharacterSheet}
					/>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn.</Text>
								}
								content={
									<div>
										<p>{this.props.combatant.name} is a monster.</p>
										<p>You can&apos;t control a monster directly; press the <b>Take Monster Turn</b> button and it will take its turn.</p>
									</div>
								}
							/>
							: null
					}
					<CombatStatsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
					{
						this.props.options.developer ?
							<button className='developer' disabled={this.state.thinking} onClick={() => this.props.switchAllegiance(this.props.combatant)}>Switch Allegiance</button>
							: null
					}
					<CombatantNotices combatant={this.props.combatant} />
					{action}
				</div>
			);
		}  catch {
			return <div className='monster-controls render-error' />;
		}
	};
}

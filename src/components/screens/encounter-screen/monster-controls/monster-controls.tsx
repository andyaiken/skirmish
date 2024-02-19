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
	levelUp: (combatant: CombatantModel) => void;
	switchAllegiance: (combatant: CombatantModel) => void;
	stun: (combatant: CombatantModel) => void;
	knockout: (combatant: CombatantModel) => void;
	kill: (combatant: CombatantModel) => void;
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
						options={this.props.options}
						onTokenClick={this.props.showToken}
						onDetails={this.props.showCharacterSheet}
					/>
					<Text type={TextType.Information}>
						<p>{this.props.combatant.name} is a <b>monster</b>.</p>
					</Text>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn.</Text>
								}
								content={
									<div>
										<p>You can&apos;t control a monster directly; press the <b>Take Monster Turn</b> button and it will take its turn.</p>
									</div>
								}
							/>
							: null
					}
					<CombatStatsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
					<CombatantNotices combatant={this.props.combatant} />
					{
						this.props.options.developer ?
							<button className='developer' onClick={() => this.props.levelUp(this.props.combatant)}>Level Up</button>
							: null
					}
					{
						this.props.options.developer ?
							<button className='developer' onClick={() => this.props.switchAllegiance(this.props.combatant)}>Switch Allegiance</button>
							: null
					}
					{
						this.props.options.developer ?
							<button className='developer' onClick={() => this.props.stun(this.props.combatant)}>Stun / Unstun</button>
							: null
					}
					{
						this.props.options.developer ?
							<button className='developer' onClick={() => this.props.knockout(this.props.combatant)}>Knockout</button>
							: null
					}
					{
						this.props.options.developer ?
							<button className='developer' onClick={() => this.props.kill(this.props.combatant)}>Kill</button>
							: null
					}
					{action}
				</div>
			);
		}  catch {
			return <div className='monster-controls render-error' />;
		}
	};
}

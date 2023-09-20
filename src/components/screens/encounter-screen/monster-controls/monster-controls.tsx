import { Component } from 'react';

import { CombatantLogic } from '../../../../logic/combatant-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { OptionsModel } from '../../../../models/options';

import { CombatantNotices, CombatantRowPanel } from '../../../panels';
import { Expander, Text, TextType } from '../../../controls';
import { ActionCard } from '../../../cards';

import './monster-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	runMonsterTurn: (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => void;
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

	runMonsterTurn = () => {
		this.setState({
			thinking: true
		}, () => {
			this.props.runMonsterTurn(this.props.encounter, this.props.combatant, () => {
				this.setState({
					thinking: false
				});
			});
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
					<CombatantNotices combatant={this.props.combatant} />
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn.</Text>
								}
								content={
									<div>
										<p>You can&apos;t control a monster directly; press the <b>Go</b> button and it will take its turn.</p>
									</div>
								}
							/>
							: null
					}
					<button className='primary' disabled={this.state.thinking} onClick={() => this.runMonsterTurn()}>
						{this.state.thinking ? 'Thinking' : 'Go'}
					</button>
					{action}
				</div>
			);
		}  catch {
			return <div className='monster-controls render-error' />;
		}
	};
}

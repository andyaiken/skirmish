import { Component } from 'react';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { OptionsModel } from '../../../../../models/options';

import { Expander, IconType, IconValue, Text, TextType } from '../../../../controls';
import { CombatStatsPanel } from '../../../../panels';

import './combatant-overview.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

export class CombatantOverview extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='combatant-overview'>
					<CombatStatsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
					<div className='quick-actions'>
						<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.inspire(this.props.encounter, this.props.combatant)}>
							Inspire<br /><IconValue value={4} type={IconType.Movement} iconSize={12} />
						</button>
						<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.scan(this.props.encounter, this.props.combatant)}>
							Scan<br /><IconValue value={4} type={IconType.Movement} iconSize={12} />
						</button>
						<button disabled={this.props.combatant.combat.movement < 4} onClick={() => this.props.hide(this.props.encounter, this.props.combatant)}>
							Hide<br /><IconValue value={4} type={IconType.Movement} iconSize={12} />
						</button>
					</div>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>Damage and Wounds</Text>
								}
								content={
									<div>
										<p>When a combatant takes damage, the amount is added to their Damage value and they roll their <b>Endurance</b> trait.</p>
										<p>If the result of that roll is lower than their Damage value, they take a Wound, and their Damage is reset to 0.</p>
										<p>A combatant can only take as many Wounds as their <b>Resolve</b> trait rank before becoming unconscious.</p>
										<p>Once a combatant is unconscious:</p>
										<ul>
											<li>They will die if they take an additional Wound.</li>
											<li>At the start of their turn they roll their <b>Resolve</b> trait; a result of 1 kills them.</li>
										</ul>
									</div>
								}
							/>
							: null
					}
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>Hidden vs Senses</Text>
								}
								content={
									<div>
										<p>At the start of a combatant&apos;s turn, their Senses value is calculated using their <b>Perception</b> skill rank.</p>
										<p>A combatant cannot see enemies whose Hidden value is greater than this value.</p>
										<p>If you Hide, your Hidden value is increased based on your <b>Stealth</b> skill rank.</p>
										<p>If you Scan, your Senses value is increased based on your <b>Perception</b> skill rank.</p>
									</div>
								}
							/>
							: null
					}
				</div>
			);
		} catch {
			return <div className='combatant-overview render-error' />;
		}
	};
}

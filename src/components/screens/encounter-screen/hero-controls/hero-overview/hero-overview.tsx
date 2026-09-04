import { Component } from 'react';

import { CombatantState } from '../../../../../enums/combatant-state';
import { StructureType } from '../../../../../enums/structure-type';

import { StrongholdLogic } from '../../../../../logic/stronghold/stronghold-logic';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { GameModel } from '../../../../../models/game';
import type { OptionsModel } from '../../../../../models/options';

import { CombatStatsPanel, CombatantNotices } from '../../../../panels';
import { Expander, IconSize, IconType, IconValue, Text, TextType } from '../../../../controls';
import { StrongholdBenefitCard } from '../../../../cards';

import './hero-overview.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	game: GameModel;
	options: OptionsModel;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	treatWounds: (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	levelUp: (combatant: CombatantModel) => void;
	switchAllegiance: (combatant: CombatantModel) => void;
	stun: (combatant: CombatantModel) => void;
	knockout: (combatant: CombatantModel) => void;
	kill: (combatant: CombatantModel) => void;
}

export class HeroOverview extends Component<Props> {
	getTreatment = () => {
		const unconscious = this.props.combatant.combat.state === CombatantState.Unconscious;
		if ((this.props.combatant.combat.wounds === 0) && !unconscious) {
			return null;
		}

		const treatments = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Sanatorium);
		if ((treatments === 0) && !this.props.options.developer) {
			return null;
		}

		return (
			<div className='treatment'>
				<StrongholdBenefitCard
					label='Treat Wounds'
					available={treatments}
					developer={this.props.options.developer}
					onUse={() => this.props.treatWounds(this.props.encounter, this.props.combatant, this.props.options.developer ? null : StructureType.Sanatorium)}
				/>
			</div>
		);
	};

	render = () => {
		return (
			<div className='hero-overview'>
				<CombatStatsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
				{this.getTreatment()}
				<div className='quick-actions'>
					<button
						disabled={this.props.combatant.combat.stunned || (this.props.combatant.combat.movement < 4)}
						onClick={() => this.props.inspire(this.props.encounter, this.props.combatant)}
					>
						Inspire<br /><IconValue value={4} type={IconType.Movement} size={IconSize.Button} />
					</button>
					<button
						disabled={this.props.combatant.combat.stunned || (this.props.combatant.combat.movement < 4)}
						onClick={() => this.props.scan(this.props.encounter, this.props.combatant)}
					>
						Scan<br /><IconValue value={4} type={IconType.Movement} size={IconSize.Button} />
					</button>
					<button
						disabled={this.props.combatant.combat.stunned || (this.props.combatant.combat.movement < 4)}
						onClick={() => this.props.hide(this.props.encounter, this.props.combatant)}
					>
						Hide<br /><IconValue value={4} type={IconType.Movement} size={IconSize.Button} />
					</button>
				</div>
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
				{
					this.props.options.showTips ?
						<Expander
							header={
								<Text type={TextType.Tip}>Taking an Action</Text>
							}
							content={
								<div>
									<p>You haven&apos;t yet chosen your action for this turn.</p>
									<p>Three action cards have been drawn for you from your action deck, and are shown below the map.</p>
									<p>Select one of those cards to use that action.</p>
								</div>
							}
						/>
						: null
				}
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
	};
}

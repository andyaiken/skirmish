import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';
import { StructureType } from '../../../../enums/structure-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { Factory } from '../../../../logic/factory';
import { GameLogic } from '../../../../logic/game-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';

import { Collections } from '../../../../utils/collections';

import { Box, Expander, StatValue, Text, TextType } from '../../../controls';
import { StrongholdBenefitCard } from '../../../cards';

import './round-controls.scss';

interface Props {
	encounter: EncounterModel;
	game: GameModel;
	options: OptionsModel;
	regenerateEncounterMap: () => void;
	addCombatantToEncounter: (encounter: EncounterModel, combatant: CombatantModel, useCharge: StructureType | null) => void;
}

export class RoundControls extends Component<Props> {
	addHero = () => {
		const hero = Collections.draw(this.props.game.heroes);
		this.props.addCombatantToEncounter(this.props.encounter, hero, this.props.options.developer ? null : StructureType.WarRoom);
	};

	addMonster = () => {
		const combatant = Factory.createCombatant(CombatantType.Monster);

		const monsterIDs = GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs);
		const roleIDs = GameLogic.getRoleDeck(this.props.options.packIDs);
		const backgroundIDs = GameLogic.getBackgroundDeck(this.props.options.packIDs);
		CombatantLogic.applyCombatantCards(combatant, Collections.draw(monsterIDs).id, Collections.draw(roleIDs).id, Collections.draw(backgroundIDs).id);

		this.props.addCombatantToEncounter(this.props.encounter, combatant, null);
	};

	render = () => {
		try {
			const heroesActive = this.props.encounter.combatants
				.filter(c => c.faction === CombatantType.Hero)
				.filter(c => (c.combat.state === CombatantState.Standing) || (c.combat.state === CombatantState.Prone)).length;
			const heroesUnconscious = this.props.encounter.combatants
				.filter(c => c.faction === CombatantType.Hero)
				.filter(c => c.combat.state === CombatantState.Unconscious).length;
			const heroesDead = this.props.encounter.combatants
				.filter(c => c.faction === CombatantType.Hero)
				.filter(c => c.combat.state === CombatantState.Dead).length;
			const monstersActive = this.props.encounter.combatants
				.filter(c => c.faction === CombatantType.Monster)
				.filter(c => (c.combat.state === CombatantState.Standing) || (c.combat.state === CombatantState.Prone)).length;
			const monstersUnconscious = this.props.encounter.combatants
				.filter(c => c.faction === CombatantType.Monster)
				.filter(c => c.combat.state === CombatantState.Unconscious).length;
			const monstersDead = this.props.encounter.combatants
				.filter(c => c.faction === CombatantType.Monster)
				.filter(c => c.combat.state === CombatantState.Dead).length;

			const stats = (
				<div className='encounter-stats'>
					<Box label='Heroes'>
						<StatValue orientation='vertical' label='Active' value={heroesActive} />
						<hr />
						<StatValue orientation='vertical' label='Unconscious' value={heroesUnconscious} />
						<hr />
						<StatValue orientation='vertical' label='Dead' value={heroesDead} />
					</Box>
					<Box label='Monsters'>
						<StatValue orientation='vertical' label='Active' value={monstersActive} />
						<hr />
						<StatValue orientation='vertical' label='Unconscious' value={monstersUnconscious} />
						<hr />
						<StatValue orientation='vertical' label='Dead' value={monstersDead} />
					</Box>
				</div>
			);

			let benefit = null;
			if ((this.props.encounter.round > 0) && (this.props.game.heroes.length > 0)) {
				const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.WarRoom);
				if ((redraws > 0) || this.props.options.developer) {
					benefit = (
						<div className='benefits'>
							<StrongholdBenefitCard
								label='Add a Hero'
								available={redraws}
								developer={this.props.options.developer}
								onUse={this.addHero}
							/>
						</div>
					);
				}
			}

			return (
				<div className='round-controls'>
					<Text type={TextType.Heading}>Round {this.props.encounter.round + 1}</Text>
					{stats}
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>At the start of each turn, each combatant rolls initiative.</Text>
								}
								content={
									<div>
										<p>This determines the order they will act in for this round - higher goes first.</p>
										<p>Initiative is calculated using a combatant&apos;s <b>Reactions</b> skill rank.</p>
									</div>
								}
							/>
							: null
					}
					{benefit}
					{this.props.options.developer ? <button className='developer' onClick={this.props.regenerateEncounterMap}>Regenerate Map</button> : null}
					{this.props.options.developer ? <button className='developer' onClick={this.addMonster}>Add a Monster</button> : null}
				</div>
			);
		} catch {
			return <div className='round-controls render-error' />;
		}
	};
}

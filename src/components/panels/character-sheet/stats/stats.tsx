import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';
import { DamageType } from '../../../../enums/damage-type';
import { SkillType } from '../../../../enums/skill-type';
import { TraitType } from '../../../../enums/trait-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { ConditionLogic } from '../../../../logic/condition-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { ActionCard, FeatureCard, PlaceholderCard } from '../../../cards';
import { Box, CardList, Dialog, IconType, IconValue, PlayingCard, StatValue, Tag, Text, TextType } from '../../../controls';
import { CombatStatsPanel } from '../../combat-stats/combat-stats-panel';
import { DamagePanel } from './damage-panel/damage-panel';

import './stats.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel | null;
	developer: boolean;
}

interface State {
	deck: string | null;
}

export class Stats extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			deck: null
		};
	}

	setDeck = (deck: string | null) => {
		this.setState({
			deck: deck
		});
	};

	getSkillRank = (skill: SkillType) => {
		if (this.props.encounter) {
			return EncounterLogic.getSkillRank(this.props.encounter, this.props.combatant, skill);
		}

		return CombatantLogic.getSkillRank(this.props.combatant, [], skill);
	};

	getDamageBonusValue = (damage: DamageType) => {
		if (this.props.encounter) {
			return EncounterLogic.getDamageBonus(this.props.encounter, this.props.combatant, damage);
		}

		return CombatantLogic.getDamageBonus(this.props.combatant, [], damage);
	};

	getDamageResistanceValue = (damage: DamageType) => {
		if (this.props.encounter) {
			return EncounterLogic.getDamageResistance(this.props.encounter, this.props.combatant, damage);
		}

		return CombatantLogic.getDamageResistance(this.props.combatant, [], damage);
	};

	getTraitsSection = () => {
		return (
			<Box label='Traits'>
				<div className='stats-row'>
					<StatValue orientation='vertical' label='Endurance' value={CombatantLogic.getTraitRank(this.props.combatant, [], TraitType.Endurance)}/>
					<StatValue orientation='vertical' label='Resolve' value={CombatantLogic.getTraitRank(this.props.combatant, [], TraitType.Resolve)}/>
					<StatValue orientation='vertical' label='Speed' value={CombatantLogic.getTraitRank(this.props.combatant, [], TraitType.Speed)}/>
				</div>
			</Box>
		);
	};

	getSkillsSection = () => {
		return (
			<Box label='Skills'>
				<StatValue label='Brawl' value={this.getSkillRank(SkillType.Brawl)}/>
				<StatValue label='Perception' value={this.getSkillRank(SkillType.Perception)}/>
				<StatValue label='Presence' value={this.getSkillRank(SkillType.Presence)}/>
				<StatValue label='Reactions' value={this.getSkillRank(SkillType.Reactions)}/>
				<StatValue label='Spellcasting' value={this.getSkillRank(SkillType.Spellcasting)}/>
				<StatValue label='Stealth' value={this.getSkillRank(SkillType.Stealth)}/>
				<StatValue label='Weapon' value={this.getSkillRank(SkillType.Weapon)}/>
			</Box>
		);
	};

	getProficienciesSection = () => {
		let proficiencySection = (
			<Box label='Proficiencies'>
				<Text>None</Text>
			</Box>
		);

		const profs = CombatantLogic.getProficiencies(this.props.combatant);
		if (profs.length > 0) {
			proficiencySection = (
				<Box label='Proficiencies'>
					{profs.map((p, n) => (<Tag key={n}>{p}</Tag>))}
				</Box>
			);
		}

		return proficiencySection;
	};

	getAurasSection = () => {
		let auraSection = (
			<Box label='Auras'>
				<Text>None</Text>
			</Box>
		);

		const auras = CombatantLogic.getAuras(this.props.combatant);
		if (auras.length > 0) {
			auraSection = (
				<Box label='Auras'>
					{
						auras.map(aura => {
							const affects = ConditionLogic.getConditionIsBeneficial(aura) ? 'allies' : 'enemies';
							const desc = `${ConditionLogic.getConditionDescription(aura)} (affects ${affects})`;
							return <StatValue key={aura.id} label={desc} value={aura.rank} />;
						})
					}
				</Box>
			);
		}

		return auraSection;
	};

	getXPSection = () => {
		return (
			<Box label='XP'>
				<StatValue label='Earned' value={<IconValue type={IconType.XP} value={this.props.combatant.xp} iconSize={12} />} />
				<StatValue label={`Required for level ${this.props.combatant.level + 1}`} value={<IconValue type={IconType.XP} value={this.props.combatant.level} iconSize={12} />} />
			</Box>
		);
	};

	render = () => {
		try {
			let cutDown = false;
			switch (this.props.combatant.type) {
				case CombatantType.Hero:
					cutDown = (this.props.combatant.xp >= this.props.combatant.level);
					break;
				case CombatantType.Monster:
					cutDown = false;
					break;
			}

			let combatColumn = null;
			if (this.props.encounter) {
				combatColumn = (
					<div className='column'>
						<CombatStatsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
					</div>
				);
			}

			const primaryColumn = (
				<div className='column'>
					{
						this.props.encounter && (this.props.combatant.combat.state !== CombatantState.Standing) ?
							<Text type={TextType.Information}>
								<p>{this.props.combatant.name} is <b>{this.props.combatant.combat.state}</b>.</p>
							</Text>
							: null
					}
					{
						this.props.encounter && this.props.combatant.combat.stunned ?
							<Text type={TextType.Information}>
								<p>{this.props.combatant.name} is <b>stunned</b>.</p>
							</Text>
							: null
					}
					{this.getTraitsSection()}
					{this.getSkillsSection()}
					{this.getProficienciesSection()}
					{this.getAurasSection()}
					{cutDown ? <DamagePanel label='Damage Bonuses' getValue={this.getDamageBonusValue} /> : null}
					{cutDown ? <DamagePanel label='Damage Resistances' getValue={this.getDamageResistanceValue} /> : null}
					{cutDown ? <hr /> : null}
					{
						cutDown ?
							<div className='decks'>
								<PlayingCard
									stack={true}
									type={CardType.Feature}
									front={<PlaceholderCard text='Feature Deck' onClick={() => this.setDeck('features')} />}
								/>
								<PlayingCard
									stack={true}
									type={CardType.Action}
									front={<PlaceholderCard text='Action Deck' onClick={() => this.setDeck('actions')} />}
								/>
							</div>
							: null
					}
				</div>
			);

			const secondaryColumn = (
				<div className='column'>
					<DamagePanel label='Damage Bonuses' getValue={this.getDamageBonusValue} />
					<DamagePanel label='Damage Resistances' getValue={this.getDamageResistanceValue} />
					{this.props.combatant.type === CombatantType.Hero ? this.getXPSection() : null}
				</div>
			);

			const decksColumn = (
				<div className='column decks'>
					<PlayingCard
						stack={true}
						type={CardType.Feature}
						front={<PlaceholderCard text='Feature Deck' onClick={() => this.setDeck('features')} />}
					/>
					<PlayingCard
						stack={true}
						type={CardType.Action}
						front={<PlaceholderCard text='Action Deck' onClick={() => this.setDeck('actions')} />}
					/>
				</div>
			);

			let dialog = null;
			if (this.state.deck !== null) {
				let heading = '';
				let cards: JSX.Element[] = [];
				switch (this.state.deck) {
					case 'features':
						heading = 'Features';
						cards = CombatantLogic.getFeatureDeck(this.props.combatant).map(f => (
							<FeatureCard
								key={f.id}
								feature={f}
								footer={CombatantLogic.getFeatureSource(this.props.combatant, f.id)}
								footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, f.id)}
							/>
						));
						break;
					case 'actions':
						heading = 'Actions';
						cards = CombatantLogic.getActionDeck(this.props.combatant).map(a => (
							<ActionCard
								key={a.id}
								action={a}
								footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
								footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
								combatant={this.props.combatant}
							/>
						));
						break;
				}
				dialog = (
					<Dialog
						content={(
							<div>
								<Text type={TextType.Heading}>{heading}</Text>
								<hr />
								<CardList cards={cards} />
							</div>
						)}
						level={2}
						onClose={() => this.setDeck(null)}
					/>
				);
			}

			return (
				<div className='stats'>
					{combatColumn}
					{primaryColumn}
					{cutDown ? null : secondaryColumn}
					{cutDown ? null : decksColumn}
					{dialog}
				</div>
			);
		} catch {
			return <div className='stats render-error' />;
		}
	};
}

import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
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
import { Box, CardList, Dialog, Gauge, PlayingCard, StatValue, Tag, Text, TextType } from '../../../controls';
import { CombatStatsPanel } from '../../../panels/combat-stats/combat-stats-panel';
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

	getTraitRank = (trait: TraitType) => {
		if (this.props.encounter) {
			return EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, trait);
		}

		return CombatantLogic.getTraitRank(this.props.combatant, [], trait);
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
					<StatValue orientation='vertical' label='Endurance' value={this.getTraitRank(TraitType.Endurance)}/>
					<StatValue orientation='vertical' label='Resolve' value={this.getTraitRank(TraitType.Resolve)}/>
					<StatValue orientation='vertical' label='Speed' value={this.getTraitRank(TraitType.Speed)}/>
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
				<div className='xp-gauge'>
					<Gauge
						progress={this.props.combatant.xp / this.props.combatant.level}
						content={`${this.props.combatant.xp} XP / ${this.props.combatant.level}`}
					/>
				</div>
			</Box>
		);
	};

	render = () => {
		try {
			let combatColumn = null;
			if (this.props.encounter) {
				combatColumn = (
					<div className='column'>
						<CombatStatsPanel combatant={this.props.combatant} encounter={this.props.encounter} />
					</div>
				);
			}

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
					<div className='column'>
						{this.getTraitsSection()}
						{this.getSkillsSection()}
						{this.getProficienciesSection()}
						{this.getAurasSection()}
					</div>
					<div className='column'>
						<DamagePanel label='Damage Bonuses' getValue={this.getDamageBonusValue} />
						<DamagePanel label='Damage Resistances' getValue={this.getDamageResistanceValue} />
						{this.props.combatant.type === CombatantType.Hero ? this.getXPSection() : null}
					</div>
					<div className='column decks'>
						<PlayingCard
							stack={true}
							type={CardType.Feature}
							front={<PlaceholderCard text='Feature Deck' />}
							onClick={() => this.setDeck('features')}
						/>
						<PlayingCard
							stack={true}
							type={CardType.Action}
							front={<PlaceholderCard text='Action Deck' />}
							onClick={() => this.setDeck('actions')}
						/>
					</div>
					{dialog}
				</div>
			);
		} catch {
			return <div className='stats render-error' />;
		}
	};
}

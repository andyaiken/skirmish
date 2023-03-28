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

	render = () => {
		let cutDown = false;
		switch (this.props.combatant.type) {
			case CombatantType.Hero:
				cutDown = (this.props.combatant.xp >= this.props.combatant.level);
				break;
			case CombatantType.Monster:
				cutDown = false;
				break;
		}

		const traitsSection = (
			<Box label='Traits'>
				<div className='stats-row'>
					<StatValue orientation='vertical' label='Endurance' value={CombatantLogic.getTraitRank(this.props.combatant, [], TraitType.Endurance)}/>
					<StatValue orientation='vertical' label='Resolve' value={CombatantLogic.getTraitRank(this.props.combatant, [], TraitType.Resolve)}/>
					<StatValue orientation='vertical' label='Speed' value={CombatantLogic.getTraitRank(this.props.combatant, [], TraitType.Speed)}/>
				</div>
			</Box>
		);

		const skillsSection = (
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

		const damageColumn = (
			<div className='column'>
				<Box label='Damage Bonuses'>
					<StatValue label='Acid' value={this.getDamageBonusValue(DamageType.Acid)}/>
					<StatValue label='Edged' value={this.getDamageBonusValue(DamageType.Edged)}/>
					<StatValue label='Impact' value={this.getDamageBonusValue(DamageType.Impact)}/>
					<StatValue label='Piercing' value={this.getDamageBonusValue(DamageType.Piercing)}/>
					<hr />
					<StatValue label='Cold' value={this.getDamageBonusValue(DamageType.Cold)}/>
					<StatValue label='Electricity' value={this.getDamageBonusValue(DamageType.Electricity)}/>
					<StatValue label='Fire' value={this.getDamageBonusValue(DamageType.Fire)}/>
					<StatValue label='Light' value={this.getDamageBonusValue(DamageType.Light)}/>
					<StatValue label='Sonic' value={this.getDamageBonusValue(DamageType.Sonic)}/>
					<hr />
					<StatValue label='Decay' value={this.getDamageBonusValue(DamageType.Decay)}/>
					<StatValue label='Poison' value={this.getDamageBonusValue(DamageType.Poison)}/>
					<StatValue label='Psychic' value={this.getDamageBonusValue(DamageType.Psychic)}/>
				</Box>
				<Box label='Resistances'>
					<StatValue label='Acid' value={this.getDamageResistanceValue(DamageType.Acid)}/>
					<StatValue label='Edged' value={this.getDamageResistanceValue(DamageType.Edged)}/>
					<StatValue label='Impact' value={this.getDamageResistanceValue(DamageType.Impact)}/>
					<StatValue label='Piercing' value={this.getDamageResistanceValue(DamageType.Piercing)}/>
					<hr />
					<StatValue label='Cold' value={this.getDamageResistanceValue(DamageType.Cold)}/>
					<StatValue label='Electricity' value={this.getDamageResistanceValue(DamageType.Electricity)}/>
					<StatValue label='Fire' value={this.getDamageResistanceValue(DamageType.Fire)}/>
					<StatValue label='Light' value={this.getDamageResistanceValue(DamageType.Light)}/>
					<StatValue label='Sonic' value={this.getDamageResistanceValue(DamageType.Sonic)}/>
					<hr />
					<StatValue label='Decay' value={this.getDamageResistanceValue(DamageType.Decay)}/>
					<StatValue label='Poison' value={this.getDamageResistanceValue(DamageType.Poison)}/>
					<StatValue label='Psychic' value={this.getDamageResistanceValue(DamageType.Psychic)}/>
				</Box>
			</div>
		);

		const deckColumn = (
			<div className='column'>
				<CardList cards={[
					<PlayingCard
						key='features'
						stack={true}
						type={CardType.Feature}
						front={<PlaceholderCard text={<div>Feature<br />Deck</div>} />}
						onClick={() => this.setDeck('features')}
					/>,
					<PlayingCard
						key='actions'
						stack={true}
						type={CardType.Action}
						front={<PlaceholderCard text={<div>Action<br />Deck</div>} />}
						onClick={() => this.setDeck('actions')}
					/>
				]} />
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
						<PlayingCard
							key={f.id}
							type={CardType.Feature}
							front={<FeatureCard feature={f} />}
							footer={CombatantLogic.getCardSource(this.props.combatant, f.id, 'feature')}
							footerType={CombatantLogic.getCardSourceType(this.props.combatant, f.id, 'feature')}
						/>
					));
					break;
				case 'actions':
					heading = 'Actions';
					cards = CombatantLogic.getActionDeck(this.props.combatant).map(a => (
						<PlayingCard
							key={a.id}
							type={CardType.Action}
							front={<ActionCard action={a} />}
							footer={CombatantLogic.getCardSource(this.props.combatant, a.id, 'action')}
							footerType={CombatantLogic.getCardSourceType(this.props.combatant, a.id, 'action')}
						/>
					));
					break;
			}
			const content = (
				<div>
					<Text type={TextType.Heading}>{heading}</Text>
					<CardList cards={cards} />
				</div>
			);
			dialog = (
				<Dialog
					content={content}
					onClose={() => this.setDeck(null)}
				/>
			);
		}

		return (
			<div className='stats'>
				<div className='grid'>
					<div className='column'>
						{
							this.props.encounter && (this.props.combatant.combat.state !== CombatantState.Standing) ?
								<Text type={TextType.Information}>{this.props.combatant.name} is <b>{this.props.combatant.combat.state}</b>.</Text>
								: null
						}
						{
							this.props.encounter && this.props.combatant.combat.stunned ?
								<Text type={TextType.Information}>{this.props.combatant.name} is <b>stunned</b>.</Text>
								: null
						}
						{traitsSection}
						{skillsSection}
						{proficiencySection}
						{auraSection}
						{this.props.combatant.type === CombatantType.Hero ? <Box label='XP'>
							<StatValue label='Earned' value={<IconValue type={IconType.XP} value={this.props.combatant.xp} iconSize={12} />} />
							<StatValue label={`Required for level ${this.props.combatant.level + 1}`} value={<IconValue type={IconType.XP} value={this.props.combatant.level} iconSize={12} />} />
						</Box> : null}
					</div>
					{cutDown ? null : damageColumn}
					{cutDown ? null : deckColumn}
				</div>
				{dialog}
			</div>
		);
	};
}

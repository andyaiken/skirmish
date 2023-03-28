import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { ConditionLogic } from '../../../logic/condition-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { StatValue, Tag, Text, TextType } from '../../controls';

import './hero-card.scss';

interface Props {
	hero: CombatantModel;
	encounter: EncounterModel | null;
}

export class HeroCard extends Component<Props> {
	static defaultProps = {
		encounter: null
	};

	render = () => {
		let traits = (
			<div className='traits'>
				<StatValue orientation='vertical' label='End' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Endurance)} />
				<StatValue orientation='vertical' label='Res' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Resolve)} />
				<StatValue orientation='vertical' label='Spd' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Speed)} />
			</div>
		);
		if (this.props.encounter) {
			traits = (
				<div className='traits'>
					<StatValue orientation='vertical' label='End' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.hero, TraitType.Endurance)} />
					<StatValue orientation='vertical' label='Res' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.hero, TraitType.Resolve)} />
					<StatValue orientation='vertical' label='Spd' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.hero, TraitType.Speed)} />
				</div>
			);
		}

		let damage = null;
		if (this.props.encounter) {
			damage = (
				<div className='damage'>
					<StatValue orientation='vertical' label='Dmg' value={this.props.hero.combat.damage} />
					<div style={{ flex: '2 2 0' }}>
						<StatValue
							orientation='vertical'
							label='Wounds'
							value={`${this.props.hero.combat.wounds} / ${EncounterLogic.getTraitRank(this.props.encounter, this.props.hero, TraitType.Resolve)}`}
						/>
					</div>
				</div>
			);
		}

		let conditions = null;
		if (this.props.encounter && (this.props.hero.combat.conditions.length > 0)) {
			conditions = (
				<div className='conditions'>
					<hr />
					{this.props.hero.combat.conditions.map(c => <StatValue key={c.id} orientation='compact' label={ConditionLogic.getConditionDescription(c)} value={c.rank} />)}
				</div>
			);
		}

		let items = null;
		const magicItems = this.props.hero.items.filter(i => i.magic);
		if (magicItems.length > 0) {
			items = (
				<div className='items'>
					{magicItems.map(i => (<div key={i.id} className='item'>{i.name} ({i.baseItem})</div>))}
				</div>
			);
		}

		return (
			<div className='hero-card'>
				<Text type={TextType.SubHeading}>{this.props.hero.name || 'unnamed hero'}</Text>
				<hr />
				<div className='tags'>
					<Tag>{GameLogic.getSpecies(this.props.hero.speciesID)?.name ?? 'Unknown species'}</Tag>
					<Tag>{GameLogic.getRole(this.props.hero.roleID)?.name ?? 'Unknown role'}</Tag>
					<Tag>{GameLogic.getBackground(this.props.hero.backgroundID)?.name ?? 'Unknown background'}</Tag>
					<Tag>Level {this.props.hero.level}</Tag>
				</div>
				{traits}
				{damage}
				{conditions}
				{items}
			</div>
		);
	};
}

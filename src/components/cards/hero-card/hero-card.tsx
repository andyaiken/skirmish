import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';

import { Tag, Text, TextType } from '../../../controls';
import { StatValue } from '../../utility';

import './hero-card.scss';

interface Props {
	hero: CombatantModel;
}

export class HeroCard extends Component<Props> {
	public render() {
		const items = this.props.hero.items.filter(i => i.magic);

		let itemSection = null;
		if (items.length > 0) {
			itemSection = (
				<div className='items'>
					{items.map(i => (<div key={i.id} className='item'>{i.name}</div>))}
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
				<div className='traits'>
					<StatValue orientation='vertical' label='End' value={CombatantLogic.getTraitValue(this.props.hero, TraitType.Endurance)} />
					<StatValue orientation='vertical' label='Res' value={CombatantLogic.getTraitValue(this.props.hero, TraitType.Resolve)} />
					<StatValue orientation='vertical' label='Spd' value={CombatantLogic.getTraitValue(this.props.hero, TraitType.Speed)} />
				</div>
				{itemSection}
			</div>
		);
	}
}

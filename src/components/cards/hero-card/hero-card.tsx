import { Component } from 'react';
import { Tag, Text, TextType } from '../../../controls';
import type { CombatantModel } from '../../../models/combatant';
import { TraitType } from '../../../enums/enums';
import { StatValue } from '../../utility';
import { CombatantUtils } from '../../../logic/combatant-utils';

import './hero-card.scss';
import { GameLogic } from '../../../logic/game-logic';

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
					<StatValue orientation='vertical' label='End' value={CombatantUtils.getTraitValue(this.props.hero, TraitType.Endurance)} />
					<StatValue orientation='vertical' label='Res' value={CombatantUtils.getTraitValue(this.props.hero, TraitType.Resolve)} />
					<StatValue orientation='vertical' label='Spd' value={CombatantUtils.getTraitValue(this.props.hero, TraitType.Speed)} />
				</div>
				{itemSection}
			</div>
		);
	}
}

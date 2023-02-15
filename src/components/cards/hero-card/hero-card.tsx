import { Component } from 'react';
import { Tag, Text, TextType } from '../../../controls';
import { getBackground } from '../../../models/background';
import { CombatantModel, getTraitValue } from '../../../models/combatant';
import { getRole } from '../../../models/role';
import { getSpecies } from '../../../models/species';
import { TraitType } from '../../../models/trait';
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
					<Tag>{getSpecies(this.props.hero.speciesID)?.name ?? 'Unknown species'}</Tag>
					<Tag>{getRole(this.props.hero.roleID)?.name ?? 'Unknown role'}</Tag>
					<Tag>{getBackground(this.props.hero.backgroundID)?.name ?? 'Unknown background'}</Tag>
					<Tag>Level {this.props.hero.level}</Tag>
				</div>
				<div className='traits'>
					<StatValue orientation='vertical' label='End' value={getTraitValue(this.props.hero, TraitType.Endurance)} />
					<StatValue orientation='vertical' label='Res' value={getTraitValue(this.props.hero, TraitType.Resolve)} />
					<StatValue orientation='vertical' label='Spd' value={getTraitValue(this.props.hero, TraitType.Speed)} />
				</div>
				{itemSection}
			</div>
		);
	}
}

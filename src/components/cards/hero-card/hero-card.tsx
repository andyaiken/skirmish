import { Component } from 'react';

import { TraitType } from '../../../enums/trait-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';

import { Color } from '../../../utils/color';

import { StatValue, Tag, Text, TextType } from '../../controls';
import { ListItemPanel } from '../../panels';

import './hero-card.scss';

interface Props {
	hero: CombatantModel;
}

export class HeroCard extends Component<Props> {
	render = () => {
		let colorDark = this.props.hero.color;
		let colorLight = this.props.hero.color;
		const color = Color.parse(this.props.hero.color);
		if (color) {
			colorDark = Color.toString(Color.darken(color));
			colorLight = Color.toString(Color.lighten(color));
		}

		let items = null;
		const magicItems = this.props.hero.items.filter(i => i.magic);
		if (magicItems.length > 0) {
			items = (
				<div className='items'>
					<Text type={TextType.MinorHeading}>Magic Items</Text>
					{magicItems.map(i => (<ListItemPanel key={i.id} item={`${i.name} (${i.baseItem})`} />))}
				</div>
			);
		}

		const species = GameLogic.getSpecies(this.props.hero.speciesID);
		const role = GameLogic.getRole(this.props.hero.roleID);
		const background = GameLogic.getBackground(this.props.hero.backgroundID);

		return (
			<div className='hero-card'>
				<Text type={TextType.SubHeading}>{this.props.hero.name || 'unnamed hero'}</Text>
				<div
					className='color-box'
					style={{
						backgroundImage: `linear-gradient(135deg, ${colorLight}, ${this.props.hero.color})`,
						borderColor: colorDark
					}}
				/>
				<div className='tags'>
					{species ? <Tag>{species.name}</Tag> : null}
					{role ? <Tag>{role.name}</Tag> : null}
					{background ? <Tag>{background.name}</Tag> : null}
					<Tag>Level {this.props.hero.level}</Tag>
					{this.props.hero.quirks.map((q, n) => <Tag key={n}>{q}</Tag>)}
				</div>
				<div className='traits'>
					<StatValue orientation='vertical' label='End' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Endurance)} />
					<StatValue orientation='vertical' label='Res' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Resolve)} />
					<StatValue orientation='vertical' label='Spd' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Speed)} />
				</div>
				{items}
			</div>
		);
	};
}

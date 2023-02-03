import { Component } from 'react';
import { Tag } from '../../../controls';
import { BackgroundHelper } from '../../../models/background';
import { Hero } from '../../../models/hero';
import { RoleHelper } from '../../../models/role';
import { SpeciesHelper } from '../../../models/species';
import { Text, TextType } from '../../utility';

import './hero-card.scss';

interface Props {
	hero: Hero;
}

export class HeroCard extends Component<Props> {
	public render() {
		return (
			<div className='hero-card'>
				<Text type={TextType.SubHeading}>{this.props.hero.name || 'unnamed hero'}</Text>
				<hr />
				<div className='tags'>
					<Tag>{SpeciesHelper.getSpecies(this.props.hero.speciesID)?.name || 'Unknown species'}</Tag>
					<Tag>{RoleHelper.getRole(this.props.hero.roleID)?.name || 'Unknown role'}</Tag>
					<Tag>{BackgroundHelper.getBackground(this.props.hero.backgroundID)?.name || 'Unknown background'}</Tag>
					<Tag>Level {this.props.hero.level}</Tag>
				</div>
			</div>
		);
	}
}

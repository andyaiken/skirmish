import { Divider } from 'antd';
import React from 'react';
import { BackgroundHelper } from '../../models/background';
import { Hero } from '../../models/hero';
import { RoleHelper } from '../../models/role';
import { SpeciesHelper } from '../../models/species';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';

interface Props {
	hero: Hero;
}

export class HeroCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Divider>
						{this.props.hero.name || 'unnamed hero'}
					</Divider>
					<div style={{ textAlign: 'center' }}>
						{SpeciesHelper.getSpecies(this.props.hero.speciesID)?.name || 'Unknown species'}
						<br/>
						{RoleHelper.getRole(this.props.hero.roleID)?.name || 'Unknown role'}
						<br/>
						{BackgroundHelper.getBackground(this.props.hero.backgroundID)?.name || 'Unknown background'}
						<br/>
						Level {this.props.hero.level}
					</div>
				</Align>
			</Padding>
		);
	}
}

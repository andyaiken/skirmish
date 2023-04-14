import { Component } from 'react';

import { GameLogic } from '../../../logic/game-logic';

import type { RegionModel } from '../../../models/region';

import { StatValue, Text, TextType } from '../../controls';

import './region-card.scss';

interface Props {
	region: RegionModel;
}

export class RegionCard extends Component<Props> {
	render = () => {
		const monsters = this.props.region.demographics.speciesIDs
			.map(id => {
				const species = GameLogic.getSpecies(id);
				return species ? species.name : '[species]';
			})
			.sort()
			.join(', ');

		return (
			<div className='region-card'>
				<Text type={TextType.SubHeading}>{this.props.region.name}</Text>
				<div className='region-color-box' style={{ backgroundColor: this.props.region.color }} />
				<StatValue label='Area' value={`${this.props.region.demographics.size} sq mi`} />
				<StatValue label='Population' value={`${(this.props.region.demographics.population * 100).toLocaleString()}`} />
				<StatValue label='Terrain' value={this.props.region.demographics.terrain} />
				<StatValue label='Monsters' value={monsters} />
				<StatValue label='Number of Encounters' value={this.props.region.encounters.length} />
			</div>
		);
	};
}

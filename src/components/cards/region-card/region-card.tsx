import { Component } from 'react';

import { GameLogic } from '../../../logic/game-logic';

import type { RegionModel } from '../../../models/region';

import { StatValue, Tag, Text, TextType } from '../../controls';

import { Color } from '../../../utils/color';

import './region-card.scss';

interface Props {
	region: RegionModel;
}

export class RegionCard extends Component<Props> {
	render = () => {
		let colorDark = this.props.region.color;
		let colorLight = this.props.region.color;
		const color = Color.parse(this.props.region.color);
		if (color) {
			colorDark = Color.toString(Color.darken(color));
			colorLight = Color.toString(Color.lighten(color));
		}

		const monsters = this.props.region.demographics.speciesIDs
			.map(id => {
				const species = GameLogic.getSpecies(id);
				return species ? species.name : '[species]';
			})
			.sort()
			.map((m, n) => <Tag key={n}>{m}</Tag>);

		return (
			<div className='region-card'>
				<Text type={TextType.SubHeading}>{this.props.region.name}</Text>
				<div
					className='color-box'
					style={{
						backgroundImage: `linear-gradient(135deg, ${colorLight}, ${this.props.region.color})`,
						borderColor: colorDark
					}}
				/>
				<StatValue label='Area' value={`${this.props.region.demographics.size} sq mi`} />
				<StatValue label='Population' value={`${(this.props.region.demographics.population * 100).toLocaleString()}`} />
				<StatValue label='Terrain' value={this.props.region.demographics.terrain} />
				<StatValue label='Denizens' value={monsters} />
				<StatValue label='Number of Encounters' value={this.props.region.encounters.length} />
			</div>
		);
	};
}

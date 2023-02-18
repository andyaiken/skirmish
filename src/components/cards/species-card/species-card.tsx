import { Component } from 'react';
import { SpeciesModel } from '../../../models/species';
import { Text, TextType } from '../../../controls';
import { StatValue } from '../../utility';
import { getFeatureDescription, getFeatureTitle } from '../../../utils/game-logic';

import './species-card.scss';

interface Props {
	species: SpeciesModel;
}

export class SpeciesCard extends Component<Props> {
	public render() {
		return (
			<div className='species-card'>
				<Text type={TextType.SubHeading}>{this.props.species.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.species.traits.map(t => t.toString()).join(', ') || '-'}/>
				<StatValue label='Features' value={this.props.species.features.length > 0 ? this.props.species.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`) : '-'}/>
				<StatValue label='Actions' value={this.props.species.actions.length > 0 ? this.props.species.actions.map(a => a.name) : '-'}/>
			</div>
		);
	}
}

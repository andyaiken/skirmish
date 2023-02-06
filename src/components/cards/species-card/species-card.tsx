import { Component } from 'react';
import { getFeatureDescription, getFeatureTitle } from '../../../models/feature';
import { Species } from '../../../models/species';
import { StatValue, StatValueList, Text, TextType } from '../../utility';

import './species-card.scss';

interface Props {
	species: Species;
}

export class SpeciesCard extends Component<Props> {
	public render() {
		return (
			<div className='species-card'>
				<Text type={TextType.SubHeading}>{this.props.species.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.species.traits.map(t => t.toString()).join(', ')}/>
				<StatValueList label='Features' values={this.props.species.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`)}/>
				<StatValueList label='Actions' values={this.props.species.actions.map(a => a.name)}/>
			</div>
		);
	}
}

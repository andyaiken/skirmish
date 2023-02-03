import { Component } from 'react';
import { FeatureHelper } from '../../../models/feature';
import { Species } from '../../../models/species';
import { StatValue, Text, TextType } from '../../utility';

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
				<StatValue label='Features' value={this.props.species.features.map(f => FeatureHelper.getName(f)).join(', ')}/>
			</div>
		);
	}
}

import { Component } from 'react';
import type { SpeciesModel } from '../../../models/species';
import { Text, TextType } from '../../../controls';
import { StatValue } from '../../utility';
import { GameLogic } from '../../../logic/game-logic';

import './species-card.scss';

interface Props {
	species: SpeciesModel;
}

export class SpeciesCard extends Component<Props> {
	public render() {
		const features = this.props.species.features.length > 0 ? this.props.species.features.map(f => GameLogic.getFeatureDescription(f)) : '-';
		const actions = this.props.species.actions.length > 0 ? this.props.species.actions.map(a => GameLogic.getActionDescription(a)) : '-';

		return (
			<div className='species-card'>
				<Text type={TextType.SubHeading}>{this.props.species.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.species.traits.map(t => t.toString()).join(', ') || '-'}/>
				<StatValue label='Features' value={features}/>
				<StatValue label='Actions' value={actions}/>
			</div>
		);
	}
}

import { Component } from 'react';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import type { SpeciesModel } from '../../../models/species';

import { StatValue, Text, TextType } from '../../controls';

import './species-card.scss';

interface Props {
	species: SpeciesModel;
}

export class SpeciesCard extends Component<Props> {
	render = () => {
		let features = null;
		if (this.props.species.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.species.features.map(f => <Text key={f.id} type={TextType.ListItem}>{FeatureLogic.getFeatureDescription(f)}</Text>)}
				</div>
			);
		}

		let actions = null;
		if (this.props.species.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.species.actions.map(a => <Text key={a.id} type={TextType.ListItem}>{ActionLogic.getActionDescription(a)}</Text>)}
				</div>
			);
		}

		return (
			<div className='species-card'>
				<Text type={TextType.SubHeading}>{this.props.species.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.species.traits.map(t => t.toString()).join(', ') || '-'}/>
				{features}
				{actions}
			</div>
		);
	};
}

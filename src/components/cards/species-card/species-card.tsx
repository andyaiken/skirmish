import { Component } from 'react';

import type { SpeciesModel } from '../../../models/species';

import { ActionListItemPanel, FeatureListItemPanel, TextListItemPanel } from '../../panels';

import { Text, TextType } from '../../controls';

import './species-card.scss';

interface Props {
	species: SpeciesModel;
}

export class SpeciesCard extends Component<Props> {
	render = () => {
		let traits = null;
		if (this.props.species.traits.length > 0) {
			traits = (
				<div>
					<Text type={TextType.MinorHeading}>Traits</Text>
					{this.props.species.traits.map((t, n) => <TextListItemPanel key={n} item={t} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.species.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.species.features.map(f => <FeatureListItemPanel key={f.id} item={f} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.species.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.species.actions.map(a => <ActionListItemPanel key={a.id} item={a} />)}
				</div>
			);
		}

		return (
			<div className='species-card'>
				<Text type={TextType.SubHeading}>{this.props.species.name}</Text>
				<hr />
				{traits}
				{features}
				{actions}
			</div>
		);
	};
}

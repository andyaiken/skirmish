import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import type { SpeciesModel } from '../../../models/species';

import { CardDetailsModal } from '../card-details/card-details-modal';

interface Props {
	species: SpeciesModel;
	developer: boolean;
}

export class SpeciesModal extends Component<Props> {
	static defaultProps = {
		developer: false
	};

	render = () => {
		return (
			<CardDetailsModal
				name={this.props.species.name}
				description={this.props.species.description}
				type={CardType.Species}
				startingFeatures={this.props.species.startingFeatures}
				features={this.props.species.features}
				actions={this.props.species.actions}
				deathActions={this.props.species.deathActions}
				tags={this.props.species.quirks}
				developer={this.props.developer}
			/>
		);
	};
}

import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import type { BackgroundModel } from '../../../models/background';

import { CardDetailsModal } from '../card-details/card-details-modal';

interface Props {
	background: BackgroundModel;
	developer: boolean;
}

// Only a species has death actions, so this leaves them at their default of none
export class BackgroundModal extends Component<Props> {
	static defaultProps = {
		developer: false
	};

	render = () => {
		return (
			<CardDetailsModal
				name={this.props.background.name}
				description={this.props.background.description}
				type={CardType.Background}
				startingFeatures={this.props.background.startingFeatures}
				features={this.props.background.features}
				actions={this.props.background.actions}
				developer={this.props.developer}
			/>
		);
	};
}

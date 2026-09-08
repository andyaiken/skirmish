import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import type { RoleModel } from '../../../models/role';

import { CardDetailsModal } from '../card-details/card-details-modal';

interface Props {
	role: RoleModel;
	developer: boolean;
}

// Only a species has death actions, so this leaves them at their default of none
export class RoleModal extends Component<Props> {
	static defaultProps = {
		developer: false
	};

	render = () => {
		return (
			<CardDetailsModal
				name={this.props.role.name}
				description={this.props.role.description}
				type={CardType.Role}
				startingFeatures={this.props.role.startingFeatures}
				features={this.props.role.features}
				actions={this.props.role.actions}
				developer={this.props.developer}
			/>
		);
	};
}

import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';

import './aura-token.scss';

interface Props {
	combatant: CombatantModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

export class AuraToken extends Component<Props> {
	render = () => {
		return (
			<div
				className='encounter-map-aura-token'
				style={{
					width: `${this.props.squareSize * (this.props.combatant.size + 2)}px`,
					left: `${((this.props.combatant.combat.position.x - this.props.mapDimensions.left - 1) * this.props.squareSize)}px`,
					top: `${((this.props.combatant.combat.position.y - this.props.mapDimensions.top - 1) * this.props.squareSize)}px`
				}}
			>
			</div>
		);
	};
}

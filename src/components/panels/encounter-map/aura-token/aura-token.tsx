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
		const x = (this.props.combatant.combat.position.x - this.props.mapDimensions.left - 1) * this.props.squareSize;
		const y = (this.props.combatant.combat.position.y - this.props.mapDimensions.top - 1) * this.props.squareSize;

		return (
			<div
				className='encounter-map-aura-token'
				style={{
					width: `${this.props.squareSize * (this.props.combatant.size + 2)}px`,
					// Positioned with a transform, so that following a combatant
					// around the map doesn't put the map through layout
					transform: `translate(${x}px, ${y}px)`
				}}
			>
			</div>
		);
	};
}

import { Component } from 'react';
import { IconArrowUp } from '@tabler/icons-react';

import { EncounterMapLogic } from '../../../logic/encounter-map/encounter-map-logic';

import './direction-indicator-panel.scss';

interface Props {
	from: { x: number, y: number }[];
	to: { x: number, y: number }[];
}

export class DirectionIndicatorPanel extends Component<Props> {
	render = () => {
		const distance = EncounterMapLogic.getDistanceAny(this.props.from, this.props.to);

		return (
			<div className='direction-indicator-panel'>
				{
					distance > 0 ?
						<IconArrowUp
							style={{
								transform: `rotate(${EncounterMapLogic.getDirection(EncounterMapLogic.getCenter(this.props.from), EncounterMapLogic.getCenter(this.props.to))}deg)`
							}}
						/>
						: null
				}
				<span>{distance}sq</span>
			</div>
		);
	};
}

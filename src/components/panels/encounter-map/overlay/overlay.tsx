import { Component } from 'react';

import './overlay.scss';

interface Props {
	x: number;
	y: number;
	size: number;
	radius: number;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

export class Overlay extends Component<Props> {
	render = () => {
		return (
			<div
				className='encounter-map-overlay'
				style={{
					width: `${this.props.squareSize * (this.props.size + (2 * this.props.radius))}px`,
					left: `${((this.props.x - this.props.mapDimensions.left - this.props.radius) * this.props.squareSize)}px`,
					top: `${((this.props.y - this.props.mapDimensions.top - this.props.radius) * this.props.squareSize)}px`
				}}
			>
			</div>
		);
	};
}

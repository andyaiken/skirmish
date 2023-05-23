import { Component } from 'react';

import './trail-token.scss';

interface Props {
	position: { x: number, y: number };
	size: number;
	squareSize: number;
	mapDimensions: { left: number, top: number };
}

export class TrailToken extends Component<Props> {
	render = () => {
		try {
			return (
				<div
					className='encounter-map-trail-token'
					style={{
						width: `${this.props.squareSize * this.props.size}px`,
						left: `${((this.props.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
						top: `${((this.props.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
					}}
				>
				</div>
			);
		} catch {
			return <div className='encounter-map-trail-token render-error' />;
		}
	};
}

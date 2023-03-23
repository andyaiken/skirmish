import { Component } from 'react';

import './wall.scss';

interface Props {
	wall: { x: number, y: number };
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (square: { x: number, y: number }) => void;
}

export class Wall extends Component<Props> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.wall);
		}
	};

	render = () => {
		const selectable = this.props.selectable ? 'selectable' : '';
		const selected = this.props.selected ? 'selected' : '';
		const className = `encounter-map-wall ${selectable} ${selected}`;

		return (
			<div
				key={`square ${this.props.wall.x} ${this.props.wall.y}`}
				className={className}
				style={{
					width: `${this.props.squareSize}px`,
					left: `${((this.props.wall.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.wall.y - this.props.mapDimensions.top) * this.props.squareSize)}px`
				}}
				onClick={e => this.onClick(e)}
			/>
		);
	};
}

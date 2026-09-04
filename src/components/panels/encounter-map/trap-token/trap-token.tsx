import { Component } from 'react';

import type { EncounterModel, TrapModel } from '../../../../models/encounter';

import './trap-token.scss';

interface Props {
	trap: TrapModel;
	encounter: EncounterModel | null;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (trap: TrapModel) => void;
}

export class TrapToken extends Component<Props> {
	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.trap);
		}
	};

	render = () => {
		const onMap = this.props.encounter ? 'on-map' : '';
		const selected = this.props.selected ? 'selected' : '';
		const selectable = this.props.selectable ? 'selectable' : '';
		const armed = this.props.trap.armed ? 'armed' : 'sprung';
		const className = `encounter-map-trap-token ${onMap} ${selected} ${selectable} ${armed}`;

		return (
			<div
				className={className}
				style={{
					width: `${this.props.squareSize}px`,
					left: this.props.encounter ? `${((this.props.trap.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px` : '0',
					top: this.props.encounter ? `${((this.props.trap.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px` : '0'
				}}
				title={this.props.trap.armed ? this.props.trap.name : `${this.props.trap.name} (sprung)`}
				onClick={e => this.onClick(e)}
			>
				<div className='trap-token-face' />
			</div>
		);
	};
}

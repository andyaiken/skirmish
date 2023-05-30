import { Component } from 'react';

import type { EncounterModel, LootPileModel } from '../../../../models/encounter';

import './loot-token.scss';

interface Props {
	loot: LootPileModel;
	encounter: EncounterModel | null;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (loot: LootPileModel) => void;
}

interface State {
	mouseOver: boolean;
}

export class LootToken extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mouseOver: false
		};
	}

	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.loot);
		}
	};

	setMouseOver = (value: boolean) => {
		this.setState({
			mouseOver: value
		});
	};

	render = () => {
		try {
			const selected = this.props.selected ? 'selected' : '';
			const selectable = this.props.selectable ? 'selectable' : '';
			const className = `encounter-map-loot-token ${selected} ${selectable}`;

			return (
				<div
					className={className}
					style={{
						width: `${this.props.squareSize}px`,
						left: this.props.encounter ? `${((this.props.loot.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px` : '0',
						top: this.props.encounter ? `${((this.props.loot.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px` : '0'
					}}
					title='Treasure'
					onClick={e => this.onClick(e)}
					onMouseEnter={() => this.setMouseOver(true)}
					onMouseLeave={() => this.setMouseOver(false)}
				>
					<div className='loot-token-face' />
				</div>
			);
		} catch {
			return <div className='encounter-map-loot-token render-error' />;
		}
	};
}

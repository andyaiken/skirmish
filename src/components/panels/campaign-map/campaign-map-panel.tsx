import { Component, MouseEvent } from 'react';
import { CampaignMapModel, CampaignMapRegionModel, CampaignMapSquareModel, getCampaignMapDimensions } from '../../../models/campaign-map';

import './campaign-map-panel.scss';

interface Props {
	map: CampaignMapModel;
	selectedRegion: CampaignMapRegionModel | null;
	onSelectRegion: (region: CampaignMapRegionModel | null) => void;
}

export class CampaignMapPanel extends Component<Props> {
	onClick = (e: MouseEvent, square: CampaignMapSquareModel) => {
		e.stopPropagation();
		const region = this.props.map.regions.find(r => r.id === square.regionID) ?? null;
		this.props.onSelectRegion(region);
	};

	render = () => {
		// Get dimensions, adding a 1-square border
		const dims = getCampaignMapDimensions(this.props.map);
		dims.left -= 1;
		dims.top -= 1;
		dims.right += 1;
		dims.bottom += 1;

		// Determine the percentage width and height of a square
		const width = 1 + (dims.right - dims.left);
		const height = 1 + (dims.bottom - dims.top);
		const squareSizePC = 100 / Math.max(width, height);

		const squares: JSX.Element[] = this.props.map.squares.map(square => {
			const region = this.props.map.regions.find(r => r.id === square.regionID);
			const color = region ? region.color : 'white';

			// Which borders do we need?
			const top = this.props.map.squares.find(s => (s.x === square.x) && (s.y === square.y - 1) && (s.regionID !== square.regionID));
			const right = this.props.map.squares.find(s => (s.x === square.x + 1) && (s.y === square.y) && (s.regionID !== square.regionID));
			const bottom = this.props.map.squares.find(s => (s.x === square.x) && (s.y === square.y + 1) && (s.regionID !== square.regionID));
			const left = this.props.map.squares.find(s => (s.x === square.x - 1) && (s.y === square.y) && (s.regionID !== square.regionID));

			return (
				<div
					key={`${square.x} ${square.y}`}
					className='campaign-map-square'
					style={{
						width: `${squareSizePC}%`,
						height: `${squareSizePC}%`,
						left: `${((square.x - dims.left) * squareSizePC)}%`,
						top: `${((square.y - dims.top) * squareSizePC)}%`,
						backgroundColor: (this.props.selectedRegion === region) ? 'white' : color,
						borderTopWidth: top ? 1 : 0,
						borderRightWidth: right ? 1 : 0,
						borderBottomWidth: bottom ? 1 : 0,
						borderLeftWidth: left ? 1 : 0
					}}
					title={region ? region.name : 'Conquered'}
					onClick={e => this.onClick(e, square)}
				/>
			);
		});

		return (
			<div className='campaign-map' onClick={() => this.props.onSelectRegion(null)}>
				<div className='campaign-map-inner'>
					<div className='campaign-map-square-container'>
						{squares}
					</div>
				</div>
			</div>
		);
	};
}

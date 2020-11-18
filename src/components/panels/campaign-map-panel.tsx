import React from 'react';
import { CampaignMap, CampaignMapHelper, CampaignMapRegion, CampaignMapSquare } from '../../models/campaign-map';

interface Props {
	map: CampaignMap;
	selectedRegion: CampaignMapRegion | null;
	onSelectRegion: (region: CampaignMapRegion | null) => void;
}

// TODO: Display at the correct aspect ratio

export class CampaignMapPanel extends React.Component<Props> {
	private onClick(e: React.MouseEvent, square: CampaignMapSquare) {
		e.stopPropagation();
		const region = this.props.map.regions.find(r => r.id === square.regionID) || null;
		this.props.onSelectRegion(region);
	}

	public render() {
		// Get dimensions, adding a 1-square border
		const dims = CampaignMapHelper.getDimensions(this.props.map);
		dims.left -= 1;
		dims.top -= 1;
		dims.right += 1;
		dims.bottom += 1;

		// Determine the percentage width and height of a square
		const width = 1 + (dims.right - dims.left);
		const height = 1 + (dims.bottom - dims.top);
		const squareWidthPC = 100 / width;
		const squareHeightPC = 100 / height;

		const regions: JSX.Element[] = this.props.map.squares.map(square => {
			const region = this.props.map.regions.find(r => r.id === square.regionID);
			const color = region ? region.color : 'white';

			// Which borders do we need?
			const top = this.props.map.squares.find(s => (s.x === square.x) && (s.y === square.y - 1) && (s.regionID !== square.regionID));
			const right = this.props.map.squares.find(s => (s.x === square.x + 1) && (s.y === square.y) && (s.regionID !== square.regionID));
			const bottom = this.props.map.squares.find(s => (s.x === square.x) && (s.y === square.y + 1) && (s.regionID !== square.regionID));
			const left = this.props.map.squares.find(s => (s.x === square.x - 1) && (s.y === square.y) && (s.regionID !== square.regionID));

			return (
				<div
					key={square.id}
					className='campaign-map-square'
					style={{
						width: squareWidthPC + '%',
						height: squareHeightPC + '%',
						left: ((square.x - dims.left) * squareWidthPC) + '%',
						top: ((square.y - dims.top) * squareHeightPC) + '%',
						backgroundColor: (this.props.selectedRegion === region) ? 'white' : color,
						borderTopWidth: top ? 1 : 0,
						borderRightWidth: right ? 1 : 0,
						borderBottomWidth: bottom ? 1 : 0,
						borderLeftWidth: left ? 1 : 0
					}}
					role='button'
					onClick={e => this.onClick(e, square)}
				/>
			);
		});

		return (
			<div className='campaign-map' role='button' onClick={() => this.props.onSelectRegion(null)}>
				<div className='campaign-map-inner'>
					<div className='campaign-map-square-container'>
						{regions}
					</div>
				</div>
			</div>
		);
	}
}

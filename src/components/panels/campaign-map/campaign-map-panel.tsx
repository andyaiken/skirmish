import { Component } from 'react';

import { CampaignMapLogic } from '../../../logic/campaign-map-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../../../models/campaign-map';
import type { RegionModel } from '../../../models/region';

import './campaign-map-panel.scss';

interface Props {
	map: CampaignMapModel;
	selectedRegion: RegionModel | null;
	onSelectRegion: (region: RegionModel | null) => void;
}

export class CampaignMapPanel extends Component<Props> {
	onClick = (e: React.MouseEvent, square: CampaignMapSquareModel) => {
		e.stopPropagation();
		const region = this.props.map.regions.find(r => r.id === square.regionID) ?? null;
		this.props.onSelectRegion(region);
	};

	render = () => {
		try {
			// Get dimensions, adding a 1-square border
			const dims = CampaignMapLogic.getDimensions(this.props.map);
			dims.left -= 1;
			dims.top -= 1;
			dims.right += 1;
			dims.bottom += 1;

			// Determine the percentage width and height of a square
			const width = 1 + (dims.right - dims.left);
			const height = 1 + (dims.bottom - dims.top);
			const squareSizePC = 100 / Math.max(width, height);

			const squares = this.props.map.squares
				.sort((a, b) => {
					let result: number = a.x - b.x;
					if (result === 0) {
						result = a.y - b.y;
					}
					return result;
				})
				.map(square => {
					const region = this.props.map.regions.find(r => r.id === square.regionID);
					let backgroundColor = 'rgb(255, 255, 255)';
					let borderColor = 'rgb(255, 255, 255)';
					if (region) {
						backgroundColor = region.color;
						borderColor = 'rgb(0, 0, 0)';

						if (this.props.selectedRegion && (this.props.selectedRegion.id === region.id)) {
							backgroundColor = 'rgb(255, 255, 255)';
							borderColor = 'rgb(60, 170, 255)';
						}
					}

					// Which borders do we need?
					const top = this.props.map.squares.find(s => (s.x === square.x) && (s.y === square.y - 1) && (s.regionID !== square.regionID));
					const right = this.props.map.squares.find(s => (s.x === square.x + 1) && (s.y === square.y) && (s.regionID !== square.regionID));
					const bottom = this.props.map.squares.find(s => (s.x === square.x) && (s.y === square.y + 1) && (s.regionID !== square.regionID));
					const left = this.props.map.squares.find(s => (s.x === square.x - 1) && (s.y === square.y) && (s.regionID !== square.regionID));

					const overlap = 0.1;

					return (
						<div
							key={`${square.x} ${square.y}`}
							className='campaign-map-square'
							style={{
								width: `calc(${squareSizePC}% + ${overlap * 2}px)`,
								height: `calc(${squareSizePC}% + ${overlap * 2}px)`,
								left: `calc(${((square.x - dims.left) * squareSizePC)}% - ${overlap}px)`,
								top: `calc(${((square.y - dims.top) * squareSizePC)}% - ${overlap}px)`,
								backgroundColor: backgroundColor,
								borderTop: top ? `1px solid ${borderColor}` : `0px solid ${backgroundColor}`,
								borderRight: right ? `1px solid ${borderColor}` : `0px solid ${backgroundColor}`,
								borderBottom: bottom ? `1px solid ${borderColor}` : `0px solid ${backgroundColor}`,
								borderLeft: left ? `1px solid ${borderColor}` : `0px solid ${backgroundColor}`
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
		} catch {
			return <div className='campaign-map render-error' />;
		}
	};
}

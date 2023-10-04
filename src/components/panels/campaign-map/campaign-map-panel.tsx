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
					let result = a.x - b.x;
					if (result === 0) {
						result = a.y - b.y;
					}
					return result;
				})
				.map(square => {
					const region = this.props.map.regions.find(r => r.id === square.regionID);
					let backgroundColor = 'rgb(255, 255, 255)';
					let borderColor = 'rgb(200, 230, 255)';
					if (region) {
						backgroundColor = region.color;
						borderColor = CampaignMapLogic.canAttackRegion(this.props.map, region) ? 'rgb(255, 255, 255)' : 'rgb(160, 160, 160)';

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

					return (
						<div
							key={`${square.x} ${square.y}`}
							className='campaign-map-square'
							style={{
								width: `${squareSizePC}%`,
								height: `${squareSizePC}%`,
								left: `${((square.x - dims.left) * squareSizePC)}%`,
								top: `${((square.y - dims.top) * squareSizePC)}%`,
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

			const labels = this.props.map.regions.map(region => {
				const square = CampaignMapLogic.getCentralSquare(this.props.map, region);
				if (square) {
					return (
						<div
							key={`label ${region.id}`}
							className='campaign-map-label'
							style={{
								width: `calc(${squareSizePC}% + 2px)`,
								left: `calc(${((square.x - dims.left) * squareSizePC)}% - 2px)`,
								top: `calc(${((square.y - dims.top) * squareSizePC)}% - 2px)`
							}}
							title={region ? region.name : 'Conquered'}
							onClick={e => this.onClick(e, square)}
						>
							{region.encounters.length}
						</div>
					);
				}

				return null;
			});

			return (
				<div className='campaign-map' onClick={() => this.props.onSelectRegion(null)}>
					<div className='campaign-map-inner'>
						<div className='campaign-map-square-container'>
							{squares}
							{labels}
						</div>
					</div>
				</div>
			);
		} catch {
			return <div className='campaign-map render-error' />;
		}
	};
}

import { Component } from 'react';

import { CampaignMapLogic } from '../../../logic/campaign-map-logic';

import type { CampaignMapModel } from '../../../models/campaign-map';
import type { RegionModel } from '../../../models/region';

import './campaign-map-panel.scss';

interface Props {
	map: CampaignMapModel;
	selectedRegion: RegionModel | null;
	onSelectRegion: (region: RegionModel | null) => void;
}

export class CampaignMapPanel extends Component<Props> {
	onClick = (e: React.MouseEvent, region: RegionModel | null) => {
		e.stopPropagation();
		this.props.onSelectRegion(region);
	};

	render = () => {
		try {
			const squares = this.props.map.squares
				.map(square => {
					let backgroundColor = 'rgb(255, 255, 255)';
					let borderColor = 'rgb(240, 240, 240)';

					const region = this.props.map.regions.find(r => r.id === square.regionID) || null;
					if (region) {
						backgroundColor = region.color;
						borderColor = region.colorDark;

						if (this.props.selectedRegion && (this.props.selectedRegion.id === region.id)) {
							backgroundColor = region.colorLight;
							borderColor = region.color;
						}
					}

					const padding = 0.024;
					const dx = 0.1;
					const points = [
						{ x: square.x + padding + dx, y: square.y + padding },
						{ x: square.x + 1 - padding - dx, y: square.y + padding },
						{ x: square.x + 1 + dx - padding, y: square.y + 0.5 },
						{ x: square.x + 1 - padding - dx, y: square.y + 1 - padding },
						{ x: square.x + padding + dx, y: square.y + 1 - padding },
						{ x: square.x + padding - dx, y: square.y + 0.5 }
					];

					if (square.x % 2 === 0) {
						points.forEach(pt => pt.y += 0.25);
					} else {
						points.forEach(pt => pt.y -= 0.25);
					}

					return (
						<polygon
							key={`${square.x} ${square.y}`}
							aria-description={`${square.x}, ${square.y}`}
							className='campaign-map-square'
							points={points.map(pt => `${pt.x},${pt.y}`).join(' ')}
							style={{
								fill: backgroundColor,
								stroke: borderColor
							}}
							onClick={e => this.onClick(e, region)}
						/>
					);
				});

			// Get dimensions, adding a 1-square border
			const dims = CampaignMapLogic.getDimensions(this.props.map);
			dims.left -= 1;
			dims.top -= 1;
			dims.right += 1;
			dims.bottom += 1;

			const width = 1 + (dims.right - dims.left);
			const height = 1 + (dims.bottom - dims.top);

			return (
				<svg className='campaign-map' viewBox={`${dims.left} ${dims.top} ${width} ${height}`} onClick={e => this.onClick(e, null)}>
					{squares}
				</svg>
			);
		} catch {
			return <div className='campaign-map render-error' />;
		}
	};
}

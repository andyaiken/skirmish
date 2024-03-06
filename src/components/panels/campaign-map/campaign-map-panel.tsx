import { Component } from 'react';

import { CampaignMapLogic } from '../../../logic/campaign-map-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../../../models/campaign-map';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { Color } from '../../../utils/color';
import { Random } from '../../../utils/random';

import './campaign-map-panel.scss';

interface Props {
	map: CampaignMapModel;
	options: OptionsModel;
	mode: 'map' | 'region';
	selectedRegion: RegionModel | null;
	onSelectRegion: (region: RegionModel | null) => void;
}

export class CampaignMapPanel extends Component<Props> {
	public static defaultProps = {
		mode: 'map',
		onSelectRegion: () => null
	};

	onClick = (e: React.MouseEvent, region: RegionModel | null) => {
		e.stopPropagation();
		this.props.onSelectRegion(region);
	};

	getHex = (square: CampaignMapSquareModel) => {
		let backgroundColor = 'rgb(255, 255, 255)';
		let borderColor = 'var(--control)';

		const region = this.props.map.regions.find(r => r.id === square.regionID) || null;
		if (region) {
			let color = Color.parse(region.color);
			if (color) {
				const id = `${square.x} ${square.y}`;
				const rng = Random.getSeededRNG(id);
				color = Color.tweak(color, 6, rng);

				backgroundColor = Color.toString(color);
				borderColor = Color.toString(Color.darken(color, 0.95));

				if (this.props.selectedRegion && (this.props.selectedRegion.id === region.id)) {
					backgroundColor = Color.toString(Color.lighten(color, 0.7));
					borderColor = Color.toString(color);
				}
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
				className='campaign-map-hex'
				points={
					points
						.map(pt => `${pt.x},${pt.y}`)
						.join(' ')
				}
				style={{
					fill: backgroundColor,
					stroke: borderColor
				}}
				onClick={e => this.onClick(e, region)}
			/>
		);
	};

	getLabel = (region: RegionModel) => {
		const square = CampaignMapLogic.getCentralSquare(this.props.map, region);
		if (square) {
			let dx = 0;
			let dy = 0;
			switch (this.props.options.renderer) {
				case 'chrome':
				case 'edge':
				case 'firefox':
					dx = 0.24;
					dy = 0.04;
					break;
				case 'safari':
					dx = -0.005;
					dy = 0.03;
					break;
			}

			return (
				<g key={region.id} onClick={e => this.onClick(e, region)}>
					<circle
						className='campaign-map-label-container'
						cx={square.x + 0.5}
						cy={square.y + 0.5 + ((square.x % 2 === 0) ? 0.25 : -0.25)}
						r={0.33}
					/>
					<text
						className='campaign-map-label-text'
						x={square.x + 0.5 + dx}
						y={square.y + 0.5 + dy + ((square.x % 2 === 0) ? 0.25 : -0.25)}
						textLength={0.5}
						dominantBaseline='middle'
						textAnchor='middle'
					>
						{region.encounters.length}
					</text>
				</g>
			);
		}

		return null;
	};

	render = () => {
		try {
			let mapSquares = this.props.map.squares;
			if ((this.props.mode === 'region') && (this.props.selectedRegion !== null)) {
				const regionID = this.props.selectedRegion.id;
				mapSquares = mapSquares.filter(square => square.regionID === regionID);
			}

			// Get dimensions, adding a 1-square border
			const dims = CampaignMapLogic.getDimensions(mapSquares);
			dims.left -= 1;
			dims.top -= 1;
			dims.right += 1;
			dims.bottom += 1;

			const width = 1 + (dims.right - dims.left);
			const height = 1 + (dims.bottom - dims.top);

			return (
				<svg className='campaign-map' viewBox={`${dims.left} ${dims.top} ${width} ${height}`} onClick={e => this.onClick(e, null)}>
					{mapSquares.map(this.getHex)}
					{this.props.mode === 'map' ? this.props.map.regions.map(this.getLabel) : null}
				</svg>
			);
		} catch {
			return <div className='campaign-map render-error' />;
		}
	};
}

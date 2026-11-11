import { Component, createRef } from 'react';
import { IconTower } from '@tabler/icons-react';

import { CampaignMapLogic } from '../../../logic/campaign-map/campaign-map-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../../../models/campaign-map';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { HEX_ROW_HEIGHT, getHexDisplayCenter, getHexPoints, toDisplay } from '../../../utils/hex-grid/hex-grid';
import { Color } from '../../../utils/color/color';
import { Keyboard } from '../../../utils/keyboard/keyboard';

import './campaign-map-panel.scss';

interface Props {
	map: CampaignMapModel;
	options: OptionsModel;
	mode: 'map' | 'region';
	zoomable?: boolean;
	// Whether the region labels can be reached by keyboard or controller. Off for a map that is
	// only there to be looked at, such as the one on the landing screen.
	selectable?: boolean;
	selectedRegion: RegionModel | null;
	onSelectRegion: (region: RegionModel | null) => void;
}

interface ViewBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface PointerPosition {
	x: number;
	y: number;
}

interface MapPoint {
	x: number;
	y: number;
}

interface State {
	viewBox: ViewBox | null;
}

// Open polylines (no baseline) on a 1x1 grid; each square with a peak uses one of them.
const MOUNTAIN_PATHS = [
	'M0.06 0.82 L0.36 0.22 L0.51 0.49 L0.67 0.13 L0.96 0.82',
	'M0.1 0.8 L0.5 0.12 L0.9 0.8',
	'M0.05 0.8 L0.28 0.38 L0.42 0.58 L0.62 0.18 L0.95 0.8',
	'M0.08 0.82 L0.3 0.3 L0.45 0.55 L0.58 0.4 L0.7 0.62 L0.92 0.82',
	'M0.12 0.8 L0.4 0.25 L0.55 0.5 L0.85 0.15 L0.95 0.8',
	'M0.04 0.82 L0.25 0.45 L0.38 0.6 L0.55 0.1 L0.72 0.5 L0.84 0.38 L0.97 0.82',
	'M0.15 0.8 L0.35 0.4 L0.5 0.6 L0.65 0.2 L0.88 0.8',
	'M0.06 0.82 L0.2 0.5 L0.32 0.62 L0.5 0.15 L0.66 0.55 L0.8 0.35 L0.94 0.82',
	'M0.1 0.82 L0.45 0.2 L0.6 0.45 L0.7 0.32 L0.9 0.82',
	'M0.08 0.8 L0.3 0.18 L0.48 0.62 L0.74 0.28 L0.92 0.8',
	'M0.05 0.82 L0.33 0.35 L0.46 0.48 L0.6 0.12 L0.8 0.58 L0.95 0.82',
	'M0.12 0.82 L0.28 0.5 L0.4 0.58 L0.52 0.3 L0.62 0.45 L0.78 0.14 L0.93 0.82'
];

const getAdjacentCoordinates = (x: number, y: number): MapPoint[] => {
	if (x % 2 === 0) {
		return [
			{ x: x, y: y - 1 },
			{ x: x + 1, y: y },
			{ x: x + 1, y: y + 1 },
			{ x: x, y: y + 1 },
			{ x: x - 1, y: y + 1 },
			{ x: x - 1, y: y }
		];
	}

	return [
		{ x: x, y: y - 1 },
		{ x: x + 1, y: y - 1 },
		{ x: x + 1, y: y },
		{ x: x, y: y + 1 },
		{ x: x - 1, y: y },
		{ x: x - 1, y: y - 1 }
	];
};

export class CampaignMapPanel extends Component<Props, State> {
	private static nextSymbolsID = 0;

	public static defaultProps = {
		mode: 'map',
		zoomable: false,
		selectable: false,
		onSelectRegion: () => null
	};

	private pointers = new Map<number, PointerPosition>();
	private pinchStart: { distance: number; viewBox: ViewBox; anchor: PointerPosition } | null = null;
	private dragStart: { pointer: PointerPosition; viewBox: ViewBox } | null = null;
	private suppressClickUntil = 0;
	private svgRef = createRef<SVGSVGElement>();
	private readonly symbolsID = CampaignMapPanel.nextSymbolsID++;

	constructor(props: Props) {
		super(props);
		this.state = {
			viewBox: null
		};
	}

	componentDidMount() {
		this.svgRef.current?.addEventListener('wheel', this.onWheel, { passive: false });
	}

	componentWillUnmount() {
		this.svgRef.current?.removeEventListener('wheel', this.onWheel);
	}

	onClick = (e: React.MouseEvent, region: RegionModel | null) => {
		e.stopPropagation();
		this.props.onSelectRegion(region);
	};

	onClickCapture = (e: React.MouseEvent<SVGSVGElement>) => {
		if (Date.now() < this.suppressClickUntil) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
		if (!this.props.zoomable || ((e.pointerType === 'mouse') && (e.button !== 0))) {
			return;
		}

		const pointer = { x: e.clientX, y: e.clientY };
		this.pointers.set(e.pointerId, pointer);

		const points = Array.from(this.pointers.values());
		if (points.length >= 2) {
			const viewBox = this.state.viewBox || this.getBaseViewBox();
			const base = this.getBaseViewBox();
			const point = this.getMapPoint(e.currentTarget, (points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2, viewBox);
			const anchor = {
				x: Math.max(base.x, Math.min(base.x + base.width, point.x)),
				y: Math.max(base.y, Math.min(base.y + base.height, point.y))
			};
			this.pinchStart = {
				distance: this.getDistance(points[0], points[1]),
				viewBox,
				anchor
			};
			this.dragStart = null;
		} else if (this.state.viewBox) {
			this.dragStart = {
				pointer,
				viewBox: this.state.viewBox
			};
		}
	};

	onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
		if (!this.props.zoomable || !this.pointers.has(e.pointerId)) {
			return;
		}

		this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		const points = Array.from(this.pointers.values());
		if (points.length >= 2 && this.pinchStart) {
			const scale = this.getDistance(points[0], points[1]) / this.pinchStart.distance;
			const base = this.getBaseViewBox();
			const zoom = Math.max(1, Math.min(4, (base.width / this.pinchStart.viewBox.width) * scale));
			const width = base.width / zoom;
			const height = base.height / zoom;
			const pinchScale = this.pinchStart.viewBox.width / width;
			const x = this.pinchStart.anchor.x - (this.pinchStart.anchor.x - this.pinchStart.viewBox.x) * pinchScale;
			const y = this.pinchStart.anchor.y - (this.pinchStart.anchor.y - this.pinchStart.viewBox.y) * pinchScale;

			this.suppressClickUntil = Date.now() + 300;
			this.setState({
				viewBox: {
					x: Math.max(base.x, Math.min(base.x + base.width - width, x)),
					y: Math.max(base.y, Math.min(base.y + base.height - height, y)),
					width,
					height
				}
			});
			return;
		}

		if (points.length === 1 && this.dragStart) {
			const dx = e.clientX - this.dragStart.pointer.x;
			const dy = e.clientY - this.dragStart.pointer.y;
			if (Math.abs(dx) + Math.abs(dy) > 4) {
				if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
					e.currentTarget.setPointerCapture(e.pointerId);
				}

				const rect = e.currentTarget.getBoundingClientRect();
				const scale = Math.min(rect.width / this.dragStart.viewBox.width, rect.height / this.dragStart.viewBox.height);
				const base = this.getBaseViewBox();
				this.suppressClickUntil = Date.now() + 300;
				this.setState({
					viewBox: {
						...this.dragStart.viewBox,
						x: Math.max(base.x, Math.min(base.x + base.width - this.dragStart.viewBox.width, this.dragStart.viewBox.x - dx / scale)),
						y: Math.max(base.y, Math.min(base.y + base.height - this.dragStart.viewBox.height, this.dragStart.viewBox.y - dy / scale))
					}
				});
			}
		}
	};

	onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
		if (!this.props.zoomable) {
			return;
		}

		this.pointers.delete(e.pointerId);
		if (this.pointers.size < 2) {
			this.pinchStart = null;
		}

		if (this.pointers.size === 1 && this.state.viewBox) {
			const [ pointer ] = this.pointers.values();
			this.dragStart = {
				pointer,
				viewBox: this.state.viewBox
			};
		} else {
			this.dragStart = null;
		}
	};

	onWheel = (e: WheelEvent) => {
		if (!this.props.zoomable || !e.ctrlKey) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		const base = this.getBaseViewBox();
		const current = this.state.viewBox || base;
		const svg = this.svgRef.current;
		if (!svg) {
			return;
		}

		const point = this.getMapPoint(svg, e.clientX, e.clientY, current);
		const zoom = Math.max(1, Math.min(4, (base.width / current.width) * Math.exp(-e.deltaY * 0.01)));
		const width = base.width / zoom;
		const height = base.height / zoom;
		const scale = current.width / width;

		this.setState({
			viewBox: {
				x: Math.max(base.x, Math.min(base.x + base.width - width, point.x - (point.x - current.x) * scale)),
				y: Math.max(base.y, Math.min(base.y + base.height - height, point.y - (point.y - current.y) * scale)),
				width,
				height
			}
		});
	};

	// Zooms by the given factor, centred on a point on the map, for the keyboard and a controller:
	// there is no pointer to zoom around, so the thing being looked at is put in the middle.
	zoomBy = (factor: number, centre: MapPoint) => {
		const base = this.getBaseViewBox();
		const current = this.state.viewBox || base;
		const zoom = Math.max(1, Math.min(4, (base.width / current.width) * factor));
		if (zoom === 1) {
			this.setState({ viewBox: null });
			return;
		}

		const width = base.width / zoom;
		const height = base.height / zoom;
		this.setState({
			viewBox: {
				x: Math.max(base.x, Math.min(base.x + base.width - width, centre.x - (width / 2))),
				y: Math.max(base.y, Math.min(base.y + base.height - height, centre.y - (height / 2))),
				width,
				height
			}
		});
	};

	// When the map is zoomed in, moving focus to a region whose label is out of view pans the map
	// to bring it into view, so the D-pad doubles as a way of moving around the map.
	revealPoint = (point: MapPoint) => {
		const current = this.state.viewBox;
		if (!current) {
			return;
		}

		const margin = 1;
		const inView = (point.x >= current.x + margin) && (point.x <= current.x + current.width - margin)
			&& (point.y >= current.y + margin) && (point.y <= current.y + current.height - margin);
		if (!inView) {
			this.zoomBy(1, point);
		}
	};

	getLabelCentre = (square: CampaignMapSquareModel): MapPoint => {
		return getHexDisplayCenter(square);
	};

	// + and - zoom in and out (a controller's triggers send the same keys), around the region
	// with focus if there is one, and otherwise around the middle of what is on screen.
	onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
		if (!this.props.zoomable || e.altKey || e.ctrlKey || e.metaKey) {
			return;
		}

		let factor = 0;
		if ((e.key === '+') || (e.key === '=')) {
			factor = 1.5;
		} else if (e.key === '-') {
			factor = 1 / 1.5;
		}
		if (factor === 0) {
			return;
		}

		e.preventDefault();

		const current = this.state.viewBox || this.getBaseViewBox();
		let centre = { x: current.x + (current.width / 2), y: current.y + (current.height / 2) };
		const regionID = (e.target as Element).getAttribute?.('data-region');
		const region = this.props.map.regions.find(r => r.id === regionID);
		const square = region ? CampaignMapLogic.getSettlement(this.props.map, region) : null;
		if (square) {
			centre = this.getLabelCentre(square);
		}

		this.zoomBy(factor, centre);
	};

	getDistance = (a: PointerPosition, b: PointerPosition) => Math.hypot(a.x - b.x, a.y - b.y);

	getMapPoint = (svg: SVGSVGElement, x: number, y: number, viewBox: ViewBox): PointerPosition => {
		const rect = svg.getBoundingClientRect();
		const scale = Math.min(rect.width / viewBox.width, rect.height / viewBox.height);
		const offsetX = (rect.width - viewBox.width * scale) / 2;
		const offsetY = (rect.height - viewBox.height * scale) / 2;
		return {
			x: viewBox.x + (x - rect.left - offsetX) / scale,
			y: viewBox.y + (y - rect.top - offsetY) / scale
		};
	};

	getBaseViewBox = (): ViewBox => {
		const mapSquares = (this.props.mode === 'region') && (this.props.selectedRegion !== null)
			? this.props.map.squares.filter(square => square.regionID === this.props.selectedRegion?.id)
			: this.props.map.squares;
		const dims = CampaignMapLogic.getDimensions(mapSquares);
		dims.left -= 1;
		dims.top -= 1;
		dims.right += 1;
		dims.bottom += 1;
		// The dimensions are in squares of the grid; the map is drawn with its rows spread to suit
		// regular hexes (see toDisplay), so the box is spread to match.
		return {
			x: dims.left,
			y: dims.top * HEX_ROW_HEIGHT,
			width: 1 + (dims.right - dims.left),
			height: (1 + (dims.bottom - dims.top)) * HEX_ROW_HEIGHT
		};
	};

	getShadedColor = (color: { r: number, g: number, b: number }, height: number) => {
		const shade = (height - 4.5) * 0.018;
		return shade < 0 ? Color.darken(color, 1 + shade) : Color.lighten(color, shade);
	};

	getHex = (square: CampaignMapSquareModel, regionAt: Map<string, RegionModel>) => {
		let backgroundColor = 'rgb(255, 255, 255)';
		let borderColor = 'var(--control)';

		const region = regionAt.get(square.regionID) || null;
		if (region) {
			let color = Color.parse(region.color);
			if (color) {
				color = this.getShadedColor(color, square.height);

				backgroundColor = Color.toString(color);
				borderColor = Color.toString(Color.darken(color, 0.95));

				if (this.props.selectedRegion && (this.props.selectedRegion.id === region.id)) {
					backgroundColor = Color.toString(Color.lighten(color, 0.7));
					borderColor = Color.toString(color);
				}
			}
		} else if (square.regionID === '') {
			let color = { r: 255, g: 255, b: 255 };
			if (square.feature === 'peak') {
				color = { r: 0, g: 0, b: 0 };
			} else if (square.feature === 'road') {
				color = { r: 220, g: 220, b: 220 };
			}
			backgroundColor = Color.toString(color);
			borderColor = Color.toString(Color.darken(color, 0.68));
		}

		return (
			<polygon
				key={`${square.x} ${square.y}`}
				className='campaign-map-hex'
				points={
					getHexPoints(square)
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

	// One ring of the shallows. All the outer rings are drawn before any inner ring, so that a
	// neighbouring hex's outer ring never covers this one's inner ring.
	getShallows = (square: CampaignMapSquareModel, outer: boolean) => (
		<polygon
			key={`shallows-${outer ? 'outer' : 'inner'}-${square.x}-${square.y}`}
			className={outer ? 'campaign-map-shallows outer' : 'campaign-map-shallows'}
			points={getHexPoints(square, outer ? 1.8 : 1.4).map(point => `${point.x},${point.y}`).join(' ')}
			pointerEvents='none'
		/>
	);

	// On the whole map a region still to be taken has its label on its settlement, so only conquered
	// ones get the icon. A single region has no label, so its settlement always does.
	getSettlement = (square: CampaignMapSquareModel) => {
		if ((square.feature !== 'settlement') || ((square.regionID !== '') && (this.props.mode !== 'region'))) {
			return null;
		}

		const center = getHexDisplayCenter(square);
		const size = 0.85;
		return (
			<IconTower
				key={`settlement-${square.x}-${square.y}`}
				x={center.x - (size / 2)}
				y={center.y - (size / 2)}
				width={size}
				height={size}
				strokeWidth={1.5}
				className='campaign-map-settlement'
				pointerEvents='none'
			/>
		);
	};

	getFeature = (square: CampaignMapSquareModel) => {
		if (square.feature !== 'peak') {
			return null;
		}

		const center = getHexDisplayCenter(square);
		const size = 0.9;
		const variant = Math.abs((square.x * 73856093) ^ (square.y * 19349663)) % MOUNTAIN_PATHS.length;
		return (
			<use
				key={`feature-${square.x}-${square.y}`}
				href={`#campaign-map-${this.symbolsID}-mountain-${variant}`}
				x={center.x - (size / 2)}
				y={center.y - (size / 2)}
				width={size}
				height={size}
				className='campaign-map-feature peak'
				pointerEvents='none'
			/>
		);
	};

	getRivers = () => (this.props.map.rivers ?? []).map((river, riverIndex) => (
		<g key={`river-${riverIndex}`} className='campaign-map-river'>
			{river.points.slice(1).map((point, index) => {
				// Stored on the map's grid; see toDisplay
				const from = toDisplay(river.points[index]);
				const to = toDisplay(point);
				return (
					<line
						key={index}
						x1={from.x}
						y1={from.y}
						x2={to.x}
						y2={to.y}
						strokeWidth={point.width}
					/>
				);
			})}
		</g>
	));

	getSymbols = () => (
		<defs>
			{MOUNTAIN_PATHS.map((path, index) => (
				<symbol key={index} id={`campaign-map-${this.symbolsID}-mountain-${index}`} viewBox='0 0 1 1'>
					<path fill='none' stroke='var(--campaign-map-mountain)' strokeWidth='0.05' strokeLinecap='round' strokeLinejoin='round' d={path} />
				</symbol>
			))}
		</defs>
	);

	getLabel = (region: RegionModel) => {
		const square = CampaignMapLogic.getSettlement(this.props.map, region);
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
				<g
					key={region.id}
					className='campaign-map-label'
					data-region={region.id}
					{...Keyboard.clickable(this.props.selectable)}
					aria-label={`${region.name}: ${region.encounters.length} ${region.encounters.length === 1 ? 'encounter' : 'encounters'}`}
					onFocus={() => this.revealPoint(this.getLabelCentre(square))}
					onClick={e => this.onClick(e, region)}
				>
					<circle
						className='campaign-map-label-container'
						cx={this.getLabelCentre(square).x}
						cy={this.getLabelCentre(square).y}
						r={0.33}
					/>
					<text
						className='campaign-map-label-text'
						x={this.getLabelCentre(square).x + dx}
						y={this.getLabelCentre(square).y + dy}
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
		let mapSquares = this.props.map.squares;
		if ((this.props.mode === 'region') && (this.props.selectedRegion !== null)) {
			const regionID = this.props.selectedRegion.id;
			mapSquares = mapSquares.filter(square => square.regionID === regionID);
		}

		const baseViewBox = this.getBaseViewBox();
		const viewBox = this.state.viewBox || baseViewBox;
		const squareAt = new Map(this.props.map.squares.map(square => [ `${square.x},${square.y}`, square ]));
		const regionAt = new Map(this.props.map.regions.map(region => [ region.id, region ]));
		const regionOnly = (this.props.mode === 'region') && (this.props.selectedRegion !== null);
		const coastline = regionOnly ? [] : mapSquares.filter(square =>
			getAdjacentCoordinates(square.x, square.y).some(point => !squareAt.has(`${point.x},${point.y}`)));

		return (
			<svg
				ref={this.svgRef}
				className={`campaign-map ${this.props.zoomable ? 'zoomable' : ''}`}
				data-nav-group={this.props.selectable ? 'campaign-map' : undefined}
				viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
				onClickCapture={this.onClickCapture}
				onPointerDown={this.onPointerDown}
				onPointerMove={this.onPointerMove}
				onPointerUp={this.onPointerUp}
				onPointerCancel={this.onPointerUp}
				onKeyDown={this.onKeyDown}
				onClick={e => this.onClick(e, null)}
			>
				{this.getSymbols()}
				<g className='campaign-map-sea'>
					{coastline.map(square => this.getShallows(square, true))}
					{coastline.map(square => this.getShallows(square, false))}
				</g>
				<g className='campaign-map-land'>{mapSquares.map(square => this.getHex(square, regionAt))}</g>
				{regionOnly ? null : <g className='campaign-map-rivers'>{this.getRivers()}</g>}
				<g className='campaign-map-features'>
					{mapSquares.map(square => this.getFeature(square))}
				</g>
				<g className='campaign-map-settlements'>{mapSquares.map(square => this.getSettlement(square))}</g>
				<g className='campaign-map-labels'>
					{this.props.mode === 'map' ? this.props.map.regions.map(this.getLabel) : null}
				</g>
			</svg>
		);
	};
}

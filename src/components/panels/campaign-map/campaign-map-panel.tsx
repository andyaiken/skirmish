import { Component, createRef } from 'react';

import { CampaignMapLogic } from '../../../logic/campaign-map/campaign-map-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../../../models/campaign-map';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { Color } from '../../../utils/color/color';
import { Random } from '../../../utils/random/random';

import './campaign-map-panel.scss';

interface Props {
	map: CampaignMapModel;
	options: OptionsModel;
	mode: 'map' | 'region';
	zoomable?: boolean;
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

interface State {
	viewBox: ViewBox | null;
}

export class CampaignMapPanel extends Component<Props, State> {
	public static defaultProps = {
		mode: 'map',
		zoomable: false,
		onSelectRegion: () => null
	};

	private pointers = new Map<number, PointerPosition>();
	private pinchStart: { distance: number; viewBox: ViewBox; anchor: PointerPosition } | null = null;
	private dragStart: { pointer: PointerPosition; viewBox: ViewBox } | null = null;
	private suppressClickUntil = 0;
	private svgRef = createRef<SVGSVGElement>();

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
		return {
			x: dims.left,
			y: dims.top,
			width: 1 + (dims.right - dims.left),
			height: 1 + (dims.bottom - dims.top)
		};
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
		let mapSquares = this.props.map.squares;
		if ((this.props.mode === 'region') && (this.props.selectedRegion !== null)) {
			const regionID = this.props.selectedRegion.id;
			mapSquares = mapSquares.filter(square => square.regionID === regionID);
		}

		const baseViewBox = this.getBaseViewBox();
		const viewBox = this.state.viewBox || baseViewBox;

		return (
			<svg
				ref={this.svgRef}
				className={`campaign-map ${this.props.zoomable ? 'zoomable' : ''}`}
				viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
				onClickCapture={this.onClickCapture}
				onPointerDown={this.onPointerDown}
				onPointerMove={this.onPointerMove}
				onPointerUp={this.onPointerUp}
				onPointerCancel={this.onPointerUp}
				onClick={e => this.onClick(e, null)}
			>
				{mapSquares.map(this.getHex)}
				{this.props.mode === 'map' ? this.props.map.regions.map(this.getLabel) : null}
			</svg>
		);
	};
}

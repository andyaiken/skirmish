import { Component } from 'react';

import { StrongholdLogic } from '../../../logic/stronghold/stronghold-logic';
import { StrongholdMapLogic } from '../../../logic/stronghold-map/stronghold-map-logic';

import { StructureType } from '../../../enums/structure-type';

import type { StructureModel } from '../../../models/structure';

import { Color } from '../../../utils/color/color';
import { Random } from '../../../utils/random/random';

import './stronghold-map-panel.scss';

interface Props {
	stronghold: StructureModel[];
	// One entry for each person wandering the map; a person with a colour of
	// their own is a hero, and everyone else is drawn in the default grey
	people: { id: string, color: string | null }[];
	mode: 'map' | 'structure';
	// How full a structure is, for the ones that hold things rather than charging up. A type
	// listed here gets a gauge; everything else falls back to its charges.
	occupancy: Partial<Record<StructureType, { used: number, capacity: number }>>;
	selectedStructure: StructureModel | null;
	onSelectStructure: (structure: StructureModel | null) => void;
}

export class StrongholdMapPanel extends Component<Props> {
	public static defaultProps = {
		people: [],
		mode: 'map',
		occupancy: {},
		onSelectStructure: () => null
	};

	// Beyond this many charges a row of pips stops being countable at a glance, and the panel
	// falls back to a written count. Structures have no level cap, so this has to hold.
	static maxPips = 10;

	// Every building occupies one square of the map, whatever its own footprint
	static square = 1;

	onClick = (e: React.MouseEvent, structure: StructureModel | null) => {
		e.stopPropagation();
		this.props.onSelectStructure(structure);
	};

	getStructure = (structure: StructureModel) => {
		const rng = Random.getSeededRNG(structure.id);

		const width = (Random.randomDecimal(rng) * 40) + 50;
		const height = (Random.randomDecimal(rng) * 40) + 50;
		const degrees = (Random.randomDecimal(rng) * 360);
		const color = StrongholdLogic.canCharge(structure) ? Random.randomColor(80, 120, rng) : { r: 50, g: 50, b: 50 };

		if (structure === this.props.selectedStructure) {
			color.r = 255;
			color.g = 255;
			color.b = 255;
		}

		// A monument is a landmark rather than a working building - there is nothing to do in it
		// and nothing to report about it - so it is drawn as a disc, and getPanel gives it no
		// plaque. The smaller of its two dimensions keeps the disc inside its own square.
		if (structure.type === StructureType.Monument) {
			return (
				<g key={structure.id}>
					<circle
						className='structure'
						cx={structure.position.x + 0.5}
						cy={structure.position.y + 0.5}
						r={Math.min(width, height) / 200}
						style={{ fill: Color.toString(color) }}
						onClick={e => this.onClick(e, structure)}
					>
						<title>{structure.name}</title>
					</circle>
				</g>
			);
		}

		let points: { x: number, y: number }[] = [];
		switch (Random.randomNumber(4, rng)) {
			case 0:
				// Square
				points = [
					{ x: 0, y: 0 },
					{ x: width, y: 0 },
					{ x: width, y: height },
					{ x: 0, y: height }
				];
				break;
			case 1: {
				// L-shape
				const x = Random.randomNumber(width / 3, rng) + (width / 3);
				const y = Random.randomNumber(height / 3, rng) + (height / 3);
				points = [
					{ x: 0, y: 0 },
					{ x: x, y: 0 },
					{ x: x, y: y },
					{ x: width, y: y },
					{ x: width, y: height },
					{ x: 0, y: height }
				];
				break;
			}
			case 2: {
				// C-shape
				const x = Random.randomNumber(width / 4, rng) + (width / 2);
				const y1 = Random.randomNumber(height / 6, rng) + (height / 6);
				const y2 = Random.randomNumber(height / 6, rng) + (height / 6) + (height / 2);
				points = [
					{ x: 0, y: 0 },
					{ x: width, y: 0 },
					{ x: width, y: y1 },
					{ x: x, y: y1 },
					{ x: x, y: y2 },
					{ x: width, y: y2 },
					{ x: width, y: height },
					{ x: 0, y: height }
				];
				break;
			}
			case 3: {
				// T-shape
				const x1 = Random.randomNumber(width / 6, rng) + (width / 6) + (width / 2);
				const x2 = Random.randomNumber(width / 6, rng) + (width / 6);
				const y1 = Random.randomNumber(height / 3, rng) + (height / 3);
				const y2 = Random.randomNumber(height / 3, rng) + (height / 3);
				points = [
					{ x: 0, y: 0 },
					{ x: width, y: 0 },
					{ x: width, y: y1 },
					{ x: x1, y: y1 },
					{ x: x1, y: height },
					{ x: x2, y: height },
					{ x: x2, y: y2 },
					{ x: 0, y: y2 }
				];
				break;
			}
		}

		const offsetX = (100 - width) / 2;
		const offsetY = (100 - height) / 2;

		return (
			<g key={structure.id}>
				<polygon
					className='structure'
					points={
						points
							.map(pt => {
								const dx = (pt.x + offsetX) / 100;
								const dy = (pt.y + offsetY) / 100;
								return `${structure.position.x + dx},${structure.position.y + dy}`;
							})
							.join(' ')
					}
					style={{
						fill: Color.toString(color),
						rotate: `${degrees}deg`
					}}
					onClick={e => this.onClick(e, structure)}
				>
					<title>{structure.name}</title>
				</polygon>
			</g>
		);
	};

	// A label and a readout, centred on the building. Everything is a proportion of the square a
	// building occupies, so the panels stay consistent with each other and scale with the map.
	getPanel = (structure: StructureModel) => {
		const occupancy = this.props.occupancy[structure.type];
		const charged = !occupancy && StrongholdLogic.canCharge(structure);
		const pips = charged && (structure.level <= StrongholdMapPanel.maxPips);

		// Nothing to report but a name, which the building's own tooltip already gives, so it
		// goes without a plaque rather than carrying one that says nothing
		if (!occupancy && !charged) {
			return null;
		}

		const cx = structure.position.x + 0.5;
		const cy = structure.position.y + 0.5;

		// Sized from the square the building sits in rather than from the building itself, which
		// varies - so every panel on the map comes out the same size
		const panelWidth = StrongholdMapPanel.square * 0.84;
		const panelHeight = StrongholdMapPanel.square * 0.32;
		const panelTop = cy - (panelHeight / 2);

		// A label row above a readout row, packed close - the plaque sits on top of the building,
		// so any space it does not need is building the player cannot see
		const labelY = panelTop + (panelHeight * 0.34);
		const readoutY = panelTop + (panelHeight * 0.76);

		// SVG cannot measure text, so the label is sized from the length of the name - capped so
		// that a short name does not swell to fill the panel, and scaled by the panel either way
		const fontSize = panelWidth * Math.min(0.16, 1 / (0.58 * Math.max(structure.name.length, 1)));

		const readoutWidth = panelWidth * 0.76;

		let readout = null;
		if (occupancy) {
			// A gauge, for the buildings that hold things
			const ratio = occupancy.capacity > 0 ? Math.min(occupancy.used / occupancy.capacity, 1) : 0;
			const gaugeHeight = panelHeight * 0.26;
			const gaugeY = readoutY - (gaugeHeight / 2);
			readout = (
				<g>
					<rect
						className='gauge-track'
						x={cx - (readoutWidth / 2)} y={gaugeY}
						width={readoutWidth} height={gaugeHeight} rx={gaugeHeight / 2}
					/>
					{
						ratio > 0 ?
							<rect
								className={ratio < 1 ? 'gauge-fill' : 'gauge-fill full'}
								x={cx - (readoutWidth / 2)} y={gaugeY}
								width={readoutWidth * ratio} height={gaugeHeight} rx={gaugeHeight / 2}
							/>
							: null
					}
				</g>
			);
		} else if (pips) {
			// A pip per charge, filled for the ones still available. They keep a fixed size and
			// spacing and sit centred, so that two charges read as two of something rather than
			// being flung to either end of the panel; they only close up when a high-level
			// structure has more of them than the row will take.
			const maxRadius = panelHeight * 0.15;
			const spread = maxRadius * 2.6;
			const rowWidth = ((structure.level - 1) * spread) + (maxRadius * 2);
			const scale = Math.min(readoutWidth / rowWidth, 1);

			const radius = maxRadius * scale;
			const gap = spread * scale;
			const left = cx - (((structure.level - 1) * gap) / 2);
			readout = (
				<g>
					{
						Array.from({ length: structure.level }, (_, n) => (
							<circle
								key={n}
								className={n < structure.charges ? 'pip filled' : 'pip'}
								cx={left + (n * gap)} cy={readoutY} r={radius}
							/>
						))
					}
				</g>
			);
		} else if (charged) {
			// Past a countable number of pips, say it in words instead
			readout = (
				<text className='structure-panel-count' x={cx} y={readoutY} fontSize={fontSize * 0.85}>
					{structure.charges} / {structure.level}
				</text>
			);
		}

		return (
			<g key={`${structure.id}-panel`} className='structure-panel'>
				<rect
					className='structure-panel-bg'
					x={cx - (panelWidth / 2)} y={panelTop}
					width={panelWidth} height={panelHeight} rx={panelHeight * 0.2}
				/>
				<text className='structure-panel-label' x={cx} y={labelY} fontSize={fontSize}>
					{structure.name}
				</text>
				{readout}
			</g>
		);
	};

	getPeople = (structures: StructureModel[]) => {
		if ((this.props.mode !== 'map') || (structures.length < 2)) {
			return [];
		}

		const streets = StrongholdMapLogic.getStreets(structures);

		const secondsPerSquare = 5;

		const seed = structures.map(s => s.id).join('-');

		return this.props.people.map(person => {
			const rng = Random.getSeededRNG(`${person.id}-${seed}`);

			const walk = StrongholdMapLogic.getWalk(structures, streets, rng);
			if (walk === null) {
				return null;
			}

			const duration = Math.max(walk.distance * secondsPerSquare, 1);
			const offset = Random.randomDecimal(rng) * duration;

			return (
				<circle
					key={person.id}
					className={person.color ? 'person hero' : 'person'}
					r={0.045}
					style={{
						offsetPath: `path('${walk.path}')`,
						animationDuration: `${duration.toFixed(2)}s`,
						animationDelay: `-${offset.toFixed(2)}s`,
						fill: person.color ?? undefined
					}}
				/>
			);
		});
	};

	render = () => {
		let structures = this.props.stronghold;
		if ((this.props.mode === 'structure') && (this.props.selectedStructure !== null)) {
			const structureID = this.props.selectedStructure.id;
			structures = structures.filter(s => s.id === structureID);
		}

		// Get dimensions, adding a 1-square border
		const dims = StrongholdLogic.getDimensions(structures);
		dims.left -= 1;
		dims.top -= 1;
		dims.right += 1;
		dims.bottom += 1;

		const width = 1 + (dims.right - dims.left);
		const height = 1 + (dims.bottom - dims.top);
		const viewBox = `${dims.left} ${dims.top} ${width} ${height}`;

		// The people are drawn on a layer of their own, beneath the structures,
		// so that they still pass behind the buildings but redrawing them as
		// they walk can't drag the structures - and their drop shadows - into
		// being redrawn too
		const people = this.getPeople(structures);

		return (
			<div className='stronghold-map'>
				{people.length > 0 ? <svg className='people-layer' viewBox={viewBox}>{people}</svg> : null}
				<svg className='structure-layer' viewBox={viewBox} onClick={e => this.onClick(e, null)}>
					{structures.map(this.getStructure)}
					{structures.map(this.getPanel)}
				</svg>
			</div>
		);
	};
}

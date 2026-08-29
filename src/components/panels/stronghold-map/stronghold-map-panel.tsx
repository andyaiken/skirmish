import { Component } from 'react';

import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { StructureModel } from '../../../models/structure';

import { Color } from '../../../utils/color';
import { Random } from '../../../utils/random';

import './stronghold-map-panel.scss';

interface Props {
	stronghold: StructureModel[];
	people: number;
	mode: 'map' | 'structure';
	selectedStructure: StructureModel | null;
	onSelectStructure: (structure: StructureModel | null) => void;
}

export class StrongholdMapPanel extends Component<Props> {
	public static defaultProps = {
		people: 0,
		mode: 'map',
		onSelectStructure: () => null
	};

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

		if (structure === this.props.selectedStructure) {
			color.r = 255;
			color.g = 255;
			color.b = 255;
		}

		return (
			<g key={structure.id}>
				<polygon
					className={StrongholdLogic.canCharge(structure) && (structure.charges === 0) ? 'structure uncharged' : 'structure'}
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

	// Ambient decoration: a handful of people wandering between the buildings.
	// Each one follows a closed circuit of structures, animated by the browser
	// via a CSS motion path so that the map itself never has to re-render.
	// These are drawn before the structures, so that people pass behind them.
	getPeople = (structures: StructureModel[]) => {
		if ((this.props.mode !== 'map') || (structures.length < 2)) {
			return [];
		}

		// Seeded from the structures present, so the routes stay stable between
		// renders but are reshuffled when the stronghold is built up or changed.
		const rng = Random.getSeededRNG(structures.map(s => s.id).join('-'));

		const centre = (structure: StructureModel) => {
			return {
				x: structure.position.x + 0.5,
				y: structure.position.y + 0.5
			};
		};

		return Array.from({ length: this.props.people }, (_, n) => {
			// Walk a circuit of three or four structures, picked at random. Stops
			// are never repeated, so that no leg of the route has zero length.
			const stops = Math.min(structures.length, Random.randomNumber(2, rng) + 3);
			const remaining = [ ...structures ];
			const route: { x: number, y: number }[] = [];
			for (let i = 0; i !== stops; ++i) {
				const [ structure ] = remaining.splice(Random.randomNumber(remaining.length, rng), 1);
				route.push(centre(structure));
			}

			// Total distance of the closed circuit, so everyone moves at a
			// similar speed however far apart their stops happen to be
			let distance = 0;
			route.forEach((pt, i) => {
				const next = route[(i + 1) % route.length];
				distance += Math.sqrt(Math.pow(next.x - pt.x, 2) + Math.pow(next.y - pt.y, 2));
			});

			// Seconds spent crossing one square, so that everyone walks at the same
			// pace however long their own circuit happens to be
			const secondsPerSquare = 2.5;

			const path = `M${route.map(pt => `${pt.x},${pt.y}`).join(' L')} Z`;
			const duration = Math.max(distance * secondsPerSquare, 1);
			// A negative delay drops each person part-way around their circuit, so
			// that they are spread out rather than all setting off together
			const offset = Random.randomDecimal(rng) * duration;

			return (
				<circle
					key={n}
					className='person'
					r={0.045}
					style={{
						offsetPath: `path('${path}')`,
						animationDuration: `${duration.toFixed(2)}s`,
						animationDelay: `-${offset.toFixed(2)}s`
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

		return (
			<svg className='stronghold-map' viewBox={`${dims.left} ${dims.top} ${width} ${height}`} onClick={e => this.onClick(e, null)}>
				{this.getPeople(structures)}
				{structures.map(this.getStructure)}
			</svg>
		);
	};
}

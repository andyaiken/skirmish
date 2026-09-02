import { Component } from 'react';

import { StrongholdLogic } from '../../../logic/stronghold-logic';
import { StrongholdMapLogic } from '../../../logic/stronghold-map-logic';

import type { StructureModel } from '../../../models/structure';

import { Color } from '../../../utils/color';
import { Random } from '../../../utils/random';

import './stronghold-map-panel.scss';

interface Props {
	stronghold: StructureModel[];
	// One entry for each person wandering the map; a person with a colour of
	// their own is a hero, and everyone else is drawn in the default grey
	people: { id: string, color: string | null }[];
	mode: 'map' | 'structure';
	selectedStructure: StructureModel | null;
	onSelectStructure: (structure: StructureModel | null) => void;
}

export class StrongholdMapPanel extends Component<Props> {
	public static defaultProps = {
		people: [],
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

	getPeople = (structures: StructureModel[]) => {
		if ((this.props.mode !== 'map') || (structures.length < 2)) {
			return [];
		}

		const streets = StrongholdMapLogic.getStreets(structures);

		const secondsPerSquare = 3;

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

		return (
			<svg className='stronghold-map' viewBox={`${dims.left} ${dims.top} ${width} ${height}`} onClick={e => this.onClick(e, null)}>
				{this.getPeople(structures)}
				{structures.map(this.getStructure)}
			</svg>
		);
	};
}

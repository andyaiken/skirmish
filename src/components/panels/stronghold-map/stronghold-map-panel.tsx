import { Component } from 'react';

import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { StructureModel } from '../../../models/structure';

import { Random } from '../../../utils/random';

import './stronghold-map-panel.scss';

interface Props {
	stronghold: StructureModel[];
	mode: 'map' | 'structure';
	selectedStructure: StructureModel | null;
	onSelectStructure: (structure: StructureModel | null) => void;
}

export class StrongholdMapPanel extends Component<Props> {
	public static defaultProps = {
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
						fill: `rgb(${color.r}, ${color.g}, ${color.b})`,
						rotate: `${degrees}deg`
					}}
					onClick={e => this.onClick(e, structure)}
				>
					<title>{structure.name}</title>
				</polygon>
			</g>
		);
	};

	render = () => {
		try {
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
					{structures.map(this.getStructure)}
				</svg>
			);
		} catch {
			return <div className='stronghold-map render-error' />;
		}
	};
}

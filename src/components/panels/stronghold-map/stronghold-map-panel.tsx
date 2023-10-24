import { Component } from 'react';

import { StrongholdLogic } from '../../../logic/stronghold-logic';

import { type StructureModel } from '../../../models/structure';

import { Random } from '../../../utils/random';

import './stronghold-map-panel.scss';

interface Props {
	stronghold: StructureModel[];
	selectedStructure: StructureModel | null;
	onSelectStructure: (structure: StructureModel | null) => void;
}

export class StrongholdMapPanel extends Component<Props> {
	onClick = (e: React.MouseEvent, structure: StructureModel) => {
		e.stopPropagation();
		this.props.onSelectStructure(structure);
	};

	getStructure = (structure: StructureModel) => {
		const rng = Random.getSeededRNG(structure.id);

		const width = (Random.randomDecimal(rng) * 40) + 40;
		const height = (Random.randomDecimal(rng) * 40) + 40;
		const degrees = (Random.randomDecimal(rng) * 360);
		let color = Random.randomColor(80, 120, rng);
		if (structure === this.props.selectedStructure) {
			color = 'rgb(255, 255, 255)';
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
				// N-shape
				const x = Random.randomNumber(width / 3, rng) + (width / 3);
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
			<svg key={structure.id} className='structure-container' viewBox='0 0 100 100'>
				<polygon
					className='structure'
					points={points.map(pt => `${pt.x + offsetX},${pt.y + offsetY}`).join(' ')}
					style={{ fill: color, rotate: `${degrees}deg` }}
					onClick={e => this.onClick(e, structure)}
				/>
			</svg>
		);
	};

	render = () => {
		try {
			// Get dimensions, adding a 1-square border
			const dims = StrongholdLogic.getDimensions(this.props.stronghold);
			dims.left -= 1;
			dims.top -= 1;
			dims.right += 1;
			dims.bottom += 1;

			// Determine the percentage width and height of a square
			const width = 1 + (dims.right - dims.left);
			const height = 1 + (dims.bottom - dims.top);
			const widthPC = 100 / width;
			const heightPC = 100 / height;

			const squares = this.props.stronghold.map(structure => {
				return (
					<div
						key={`${structure.position.x} ${structure.position.y}`}
						className={`stronghold-map-square ${this.props.selectedStructure === structure ? 'selected' : ''}`}
						style={{
							width: `${widthPC}%`,
							height: `${heightPC}%`,
							left: `${((structure.position.x - dims.left) * widthPC)}% `,
							top: `${((structure.position.y - dims.top) * heightPC)}%`,
							fontSize: `${Math.min(widthPC, heightPC) * 1.5}pt`
						}}
					>
						{this.getStructure(structure)}
						<div className='structure-name'>
							{structure.name}
							{structure.charges > 0 ? <br /> : null}
							{structure.charges > 0 ? ''.padEnd(structure.charges, '⬢') : null}
						</div>
					</div>
				);
			});

			return (
				<div className='stronghold-map' onClick={() => this.props.onSelectStructure(null)}>
					{squares}
				</div>
			);
		} catch {
			return <div className='stronghold-map render-error' />;
		}
	};
}

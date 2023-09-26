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
	onClick = (e: React.MouseEvent, square: StructureModel) => {
		e.stopPropagation();
		const region = this.props.stronghold.find(s => s.id === square.id) ?? null;
		this.props.onSelectStructure(region);
	};

	getStructure = (structure: StructureModel) => {
		const rng = Random.getSeededRNG(structure.id);

		const width = (Random.randomDecimal(rng) * 40) + 40;
		const height = (Random.randomDecimal(rng) * 40) + 40;
		const degrees = (Random.randomDecimal(rng) * 360);
		const color = Random.randomColor(80, 120, rng);

		return (
			<div
				key={structure.id}
				className='structure'
				style={{
					width: `${width}%`,
					height: `${height}%`,
					transform: `rotate(${degrees}deg)`,
					backgroundColor: color
				}}
				title={structure.name}
				onClick={e => this.onClick(e, structure)}
			/>
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
			const squareSizePC = 100 / Math.max(width, height);

			const squares = this.props.stronghold.map(structure => {
				return (
					<div
						key={`${structure.position.x} ${structure.position.y}`}
						className={`stronghold-map-square ${this.props.selectedStructure === structure ? 'selected' : ''}`}
						style={{
							width: `${squareSizePC}%`,
							left: `${((structure.position.x - dims.left) * squareSizePC)}% `,
							top: `${((structure.position.y - dims.top) * squareSizePC)}%`,
							fontSize: `${squareSizePC * 5}%`
						}}
					>
						{this.getStructure(structure)}
						<div className='structure-name'>
							{structure.name}
							{structure.charges > 0 ? <br /> : null}
							{structure.charges > 0 ? ''.padEnd(structure.charges, '★') : null}
						</div>
					</div>
				);
			});

			return (
				<div className='stronghold-map' onClick={() => this.props.onSelectStructure(null)}>
					<div className='stronghold-map-inner'>
						<div className='stronghold-map-square-container'>
							{squares}
						</div>
					</div>
				</div>
			);
		} catch {
			return <div className='stronghold-map render-error' />;
		}
	};
}

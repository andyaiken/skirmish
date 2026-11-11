import { Component, MouseEvent, ReactNode } from 'react';
import { IconChevronDown, IconChevronDownLeft, IconChevronDownRight, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronUpLeft, IconChevronUpRight } from '@tabler/icons-react';

import { IconSize, IconType, IconValue } from '../../controls';
import { Keyboard } from '../../../utils/keyboard/keyboard';

import './direction-panel.scss';

interface Props {
	mode: 'full' | 'compact';
	movement: number;
	costs: Record<string, number>;
	onMove: (dir: string, cost: number) => void;
}

export class DirectionPanel extends Component<Props> {
	getClassName = (dir: string) => {
		return `dir ${dir} ${this.canMove(dir) ? 'enabled' : 'disabled'}`;
	};

	canMove = (dir: string) => {
		const cost = this.props.costs[dir];
		return (cost !== Number.MAX_VALUE) && (cost <= this.props.movement);
	};

	getCostLabel = (value: number) => {
		if (value === Number.MAX_VALUE) {
			return '-';
		}

		return value;
	};

	onClick = (e: MouseEvent, dir: string, cost: number) => {
		e.stopPropagation();
		this.props.onMove(dir, cost);
	};

	onDoubleClick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	getDirection = (dir: string, label: string, icon: ReactNode) => {
		// Only a direction you can move in takes focus; the rest are skipped, as they do nothing.
		return (
			<div
				className={this.getClassName(dir)}
				{...Keyboard.clickable(this.canMove(dir))}
				aria-label={`Move ${label}`}
				onClick={e => this.onClick(e, dir, this.props.costs[dir])}
				onDoubleClick={this.onDoubleClick}
			>
				<div className='arrow'>{icon}</div>
				{this.props.mode === 'full' ? <div className='cost'>{this.getCostLabel(this.props.costs[dir])}</div> : null}
			</div>
		);
	};

	render = () => {
		const size = this.props.mode === 'full' ? 70 : 20;
		const showValues = this.props.mode === 'full';

		return (
			<div className={`direction-panel ${this.props.mode}`}>
				<div className='direction-row'>
					{this.getDirection('nw', 'north-west', <IconChevronUpLeft size={size} />)}
					{this.getDirection('n', 'north', <IconChevronUp size={size} />)}
					{this.getDirection('ne', 'north-east', <IconChevronUpRight size={size} />)}
				</div>
				<div className='direction-row'>
					{this.getDirection('w', 'west', <IconChevronLeft size={size} />)}
					<div className='center'>
						{showValues ? <div className='cost big'><IconValue type={IconType.Movement} value={this.props.movement} size={IconSize.Large} /></div> : null}
					</div>
					{this.getDirection('e', 'east', <IconChevronRight size={size} />)}
				</div>
				<div className='direction-row'>
					{this.getDirection('sw', 'south-west', <IconChevronDownLeft size={size} />)}
					{this.getDirection('s', 'south', <IconChevronDown size={size} />)}
					{this.getDirection('se', 'south-east', <IconChevronDownRight size={size} />)}
				</div>
			</div>
		);
	};
}

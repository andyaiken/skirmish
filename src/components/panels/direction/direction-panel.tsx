import { Component, MouseEvent } from 'react';
import { IconChevronDown, IconChevronDownLeft, IconChevronDownRight, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronUpLeft, IconChevronUpRight } from '@tabler/icons-react';

import { IconSize, IconType, IconValue } from '../../controls';

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

	render = () => {
		try {
			const size = this.props.mode === 'full' ? 70 : 20;
			const showValues = this.props.mode === 'full';

			return (
				<div className={`direction-panel ${this.props.mode}`}>
					<div className='direction-row'>
						<div className={this.getClassName('nw')} onClick={e => this.onClick(e, 'nw', this.props.costs.nw)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronUpLeft size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.nw)} /></div> : null}
						</div>
						<div className={this.getClassName('n')} onClick={e => this.onClick(e, 'n', this.props.costs.n)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronUp size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.n)} /></div> : null}
						</div>
						<div className={this.getClassName('ne')} onClick={e => this.onClick(e, 'ne', this.props.costs.ne)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronUpRight size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.ne)} /></div> : null}
						</div>
					</div>
					<div className='direction-row'>
						<div className={this.getClassName('w')} onClick={e => this.onClick(e, 'w', this.props.costs.w)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronLeft size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.w)} /></div> : null}
						</div>
						<div className='center'>
							{showValues ? <div className='cost big'><IconValue type={IconType.Movement} value={this.props.movement} size={IconSize.Large} /></div> : null}
						</div>
						<div className={this.getClassName('e')} onClick={e => this.onClick(e, 'e', this.props.costs.e)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronRight size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.e)} /></div> : null}
						</div>
					</div>
					<div className='direction-row'>
						<div className={this.getClassName('sw')} onClick={e => this.onClick(e, 'sw', this.props.costs.sw)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronDownLeft size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.sw)} /></div> : null}
						</div>
						<div className={this.getClassName('s')} onClick={e => this.onClick(e, 's', this.props.costs.s)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronDown size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.s)} /></div> : null}
						</div>
						<div className={this.getClassName('se')} onClick={e => this.onClick(e, 'se', this.props.costs.se)} onDoubleClick={this.onDoubleClick}>
							<div className='arrow'><IconChevronDownRight size={size} /></div>
							{showValues ? <div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.se)} /></div> : null}
						</div>
					</div>
				</div>
			);
		} catch {
			return <div className='direction-panel render-error' />;
		}
	};
}

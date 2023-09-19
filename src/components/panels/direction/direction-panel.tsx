import { Component, MouseEvent } from 'react';
import { IconChevronDown, IconChevronDownLeft, IconChevronDownRight, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronUpLeft, IconChevronUpRight } from '@tabler/icons-react';

import type { CombatantModel } from '../../../models/combatant';

import { IconSize, IconType, IconValue } from '../../controls';

import './direction-panel.scss';

interface Props {
	combatant: CombatantModel;
	costs: Record<string, number>;
	onMove: (dir: string, cost: number) => void;
}

export class DirectionPanel extends Component<Props> {
	getClassName = (dir: string) => {
		return `dir ${dir} ${this.canMove(dir) ? 'enabled' : 'disabled'}`;
	};

	canMove = (dir: string) => {
		const cost = this.props.costs[dir];
		return (cost !== Number.MAX_VALUE) && (cost <= this.props.combatant.combat.movement);
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
			return (
				<div className='direction-panel'>
					<div className={this.getClassName('nw')} onClick={e => this.onClick(e, 'nw', this.props.costs.nw)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronUpLeft size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.nw)} /></div>
					</div>
					<div className={this.getClassName('n')} onClick={e => this.onClick(e, 'n', this.props.costs.n)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronUp size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.n)} /></div>
					</div>
					<div className={this.getClassName('ne')} onClick={e => this.onClick(e, 'ne', this.props.costs.ne)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronUpRight size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.ne)} /></div>
					</div>
					<div className={this.getClassName('w')} onClick={e => this.onClick(e, 'w', this.props.costs.w)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronLeft size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.w)} /></div>
					</div>
					<div className='center'>
						<div className='cost big'><IconValue type={IconType.Movement} value={this.props.combatant.combat.movement} size={IconSize.Large} /></div>
					</div>
					<div className={this.getClassName('e')} onClick={e => this.onClick(e, 'e', this.props.costs.e)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronRight size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.e)} /></div>
					</div>
					<div className={this.getClassName('sw')} onClick={e => this.onClick(e, 'sw', this.props.costs.sw)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronDownLeft size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.sw)} /></div>
					</div>
					<div className={this.getClassName('s')} onClick={e => this.onClick(e, 's', this.props.costs.s)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronDown size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.s)} /></div>
					</div>
					<div className={this.getClassName('se')} onClick={e => this.onClick(e, 'se', this.props.costs.se)} onDoubleClick={this.onDoubleClick}>
						<div className='arrow'><IconChevronDownRight size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.se)} /></div>
					</div>
				</div>
			);
		} catch {
			return <div className='direction-panel render-error' />;
		}
	};
}

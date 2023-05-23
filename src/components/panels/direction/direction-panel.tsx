import { IconChevronDown, IconChevronDownLeft, IconChevronDownRight, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronUpLeft, IconChevronUpRight } from '@tabler/icons-react';
import { Component } from 'react';

import type { CombatantModel } from '../../../models/combatant';

import { IconType, IconValue } from '../../controls';

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

	render = () => {
		try {
			return (
				<div className='direction-panel'>
					<div className={this.getClassName('nw')} onClick={() => this.props.onMove('nw', this.props.costs.nw)}>
						<div className='arrow'><IconChevronUpLeft size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.nw)} iconSize={12} /></div>
					</div>
					<div className={this.getClassName('n')} onClick={() => this.props.onMove('n', this.props.costs.n)}>
						<div className='arrow'><IconChevronUp size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.n)} iconSize={12} /></div>
					</div>
					<div className={this.getClassName('ne')} onClick={() => this.props.onMove('ne', this.props.costs.ne)}>
						<div className='arrow'><IconChevronUpRight size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.ne)} iconSize={12} /></div>
					</div>
					<div className={this.getClassName('w')} onClick={() => this.props.onMove('w', this.props.costs.w)}>
						<div className='arrow'><IconChevronLeft size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.w)} iconSize={12} /></div>
					</div>
					<div className='center'>
						<div className='cost'><IconValue type={IconType.Movement} value={this.props.combatant.combat.movement} iconSize={12} /></div>
					</div>
					<div className={this.getClassName('e')} onClick={() => this.props.onMove('e', this.props.costs.e)}>
						<div className='arrow'><IconChevronRight size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.e)} iconSize={12} /></div>
					</div>
					<div className={this.getClassName('sw')} onClick={() => this.props.onMove('sw', this.props.costs.sw)}>
						<div className='arrow'><IconChevronDownLeft size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.sw)} iconSize={12} /></div>
					</div>
					<div className={this.getClassName('s')} onClick={() => this.props.onMove('s', this.props.costs.s)}>
						<div className='arrow'><IconChevronDown size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.s)} iconSize={12} /></div>
					</div>
					<div className={this.getClassName('se')} onClick={() => this.props.onMove('se', this.props.costs.se)}>
						<div className='arrow'><IconChevronDownRight size={70} /></div>
						<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.se)} iconSize={12} /></div>
					</div>
				</div>
			);
		} catch {
			return <div className='direction-panel render-error' />;
		}
	};
}

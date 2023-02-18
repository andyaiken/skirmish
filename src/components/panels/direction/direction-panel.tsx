import { Component } from 'react';
import type { CombatDataModel } from '../../../models/combat-data';
import { IconType, IconValue } from '../../utility';

import './direction-panel.scss';

interface Props {
	combatData: CombatDataModel;
	costs: Record<string, number>;
	onMove: (dir: string, cost: number) => void;
}

export class DirectionPanel extends Component<Props> {
	getClassName = (dir: string) => {
		return `dir ${dir} ${this.canMove(dir) ? 'enabled' : 'disabled'}`;
	};

	canMove = (dir: string) => {
		const cost = this.props.costs[dir];
		return (cost !== Number.MAX_VALUE) && (cost <= this.props.combatData.movement);
	};

	getCostLabel = (value: number) => {
		if (value === Number.MAX_VALUE) {
			return '-';
		}

		return value;
	};

	render = () => {
		return (
			<div className='direction-panel'>
				<div className={this.getClassName('nw')} onClick={() => this.props.onMove('nw', this.props.costs.nw)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.nw)} /></div>
				</div>
				<div className={this.getClassName('n')} onClick={() => this.props.onMove('n', this.props.costs.n)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.n)} /></div>
				</div>
				<div className={this.getClassName('ne')} onClick={() => this.props.onMove('ne', this.props.costs.ne)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.ne)} /></div>
				</div>
				<div className={this.getClassName('w')} onClick={() => this.props.onMove('w', this.props.costs.w)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.w)} /></div>
				</div>
				<div className='center'></div>
				<div className={this.getClassName('e')} onClick={() => this.props.onMove('e', this.props.costs.e)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.e)} /></div>
				</div>
				<div className={this.getClassName('sw')} onClick={() => this.props.onMove('sw', this.props.costs.sw)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.sw)} /></div>
				</div>
				<div className={this.getClassName('s')} onClick={() => this.props.onMove('s', this.props.costs.s)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.s)} /></div>
				</div>
				<div className={this.getClassName('se')} onClick={() => this.props.onMove('se', this.props.costs.se)}>
					<div className='arrow'>➔</div>
					<div className='cost'><IconValue type={IconType.Movement} value={this.getCostLabel(this.props.costs.se)} /></div>
				</div>
			</div>
		);
	};
}

import { Component } from 'react';
import type { DamageType } from '../../../enums/damage-type';

import './icon-value.scss';

export enum IconType {
	Movement = 'Movement'
}

interface Props {
	value: number | string;
	type: DamageType | IconType;
}

export class IconValue extends Component<Props> {
	render = () => {
		let icon = null;
		switch (this.props.type) {
			case IconType.Movement:
				icon = '▶︎';
				break;
			default:
				icon = '✦';
				break;
		}

		return (
			<div className='icon-value'>
				{this.props.value} {icon}
			</div>
		);
	};
}

import { Component } from 'react';

import type { DamageType } from '../../../enums/damage-type';

import './icon-value.scss';

export enum IconType {
	Movement = 'Movement',
	Money = 'Money',
	XP = 'XP'
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
			case IconType.Money:
				icon = '𑁍';
				break;
			case IconType.XP:
				icon = '⬥';
				break;
			default:
				icon = '';
				break;
		}

		return (
			<div className='icon-value'>
				{this.props.value} {icon}
			</div>
		);
	};
}

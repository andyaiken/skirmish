import {
	IconAccessPoint, IconArrowBigRightLinesFilled, IconAwardFilled, IconBolt, IconBrain, IconCoins, IconFlame,
	IconHammer, IconRefresh, IconSkull, IconSlice, IconSnowflake, IconSpiral, IconSun, IconTrident, IconVaccineBottle
} from '@tabler/icons-react';
import { Component } from 'react';

import { DamageType } from '../../../enums/damage-type';

import './icon-value.scss';

export enum IconType {
	Movement = 'Movement',
	Money = 'Money',
	XP = 'XP',
	Redraw = 'Redraw'
}

export enum IconSize {
	Default = 'default',
	Button = 'button',
	Large = 'large'
}

interface Props {
	value: number | string;
	type: DamageType | IconType;
	size: IconSize;
}

export class IconValue extends Component<Props> {
	static defaultProps = {
		size: IconSize.Default
	};

	getTextSize = () => {
		switch (this.props.size) {
			case IconSize.Button:
				return 15;
			case IconSize.Large:
				return 30;
		}

		return 15;
	};

	getIconSize = () => {
		switch (this.props.size) {
			case IconSize.Button:
				return 15;
			case IconSize.Large:
				return 24;
		}

		return 12;
	};

	getTextWeight = () => {
		switch (this.props.size) {
			case IconSize.Button:
			case IconSize.Large:
				return 600;
		}

		return 400;
	};

	render = () => {
		try {
			const size = this.getIconSize();

			let icon = null;
			switch (this.props.type) {
				case IconType.Movement:
					icon = <IconArrowBigRightLinesFilled size={size} />;
					break;
				case IconType.Money:
					icon = <IconCoins size={size} />;
					break;
				case IconType.XP:
					icon = <IconAwardFilled size={size} />;
					break;
				case IconType.Redraw:
					icon = <IconRefresh size={size} />;
					break;
				case DamageType.Acid:
					icon = <IconVaccineBottle size={size} />;
					break;
				case DamageType.Cold:
					icon = <IconSnowflake size={size} />;
					break;
				case DamageType.Decay:
					icon = <IconSpiral size={size} />;
					break;
				case DamageType.Edged:
					icon = <IconSlice size={size} />;
					break;
				case DamageType.Electricity:
					icon = <IconBolt size={size} />;
					break;
				case DamageType.Fire:
					icon = <IconFlame size={size} />;
					break;
				case DamageType.Impact:
					icon = <IconHammer size={size} />;
					break;
				case DamageType.Light:
					icon = <IconSun size={size} />;
					break;
				case DamageType.Piercing:
					icon = <IconTrident size={size} />;
					break;
				case DamageType.Poison:
					icon = <IconSkull size={size} />;
					break;
				case DamageType.Psychic:
					icon = <IconBrain size={size} />;
					break;
				case DamageType.Sonic:
					icon = <IconAccessPoint size={size} />;
					break;
			}

			return (
				<div className='icon-value' title={`${this.props.value} ${this.props.type}`} style={{ fontSize: `${this.getTextSize()}px`, fontWeight: `${this.getTextWeight()}` }}>
					{this.props.value} {icon}
				</div>
			);
		} catch {
			return <div className='icon-value render-error' />;
		}
	};
}

import {
	IconAccessPoint, IconArrowBigRightLinesFilled, IconAwardFilled, IconBolt, IconBrain, IconCoins, IconFlame,
	IconHammer, IconSkull, IconSlice, IconSnowflake, IconSpiral, IconSun, IconTrident, IconVaccineBottle
} from '@tabler/icons-react';
import { Component } from 'react';

import { DamageType } from '../../../enums/damage-type';

import './icon-value.scss';

export enum IconType {
	Movement = 'Movement',
	Money = 'Money',
	XP = 'XP'
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
				return 40;
		}

		return 12;
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
				return 600;
			case IconSize.Large:
				return 600;
		}

		return 400;
	};

	render = () => {
		try {
			let icon = null;
			switch (this.props.type) {
				case IconType.Movement:
					icon = <IconArrowBigRightLinesFilled size={this.getIconSize()} />;
					break;
				case IconType.Money:
					icon = <IconCoins size={this.getIconSize()} />;
					break;
				case IconType.XP:
					icon = <IconAwardFilled size={this.getIconSize()} />;
					break;
				case DamageType.Acid:
					icon = <IconVaccineBottle size={this.getIconSize()} />;
					break;
				case DamageType.Cold:
					icon = <IconSnowflake size={this.getIconSize()} />;
					break;
				case DamageType.Decay:
					icon = <IconSpiral size={this.getIconSize()} />;
					break;
				case DamageType.Edged:
					icon = <IconSlice size={this.getIconSize()} />;
					break;
				case DamageType.Electricity:
					icon = <IconBolt size={this.getIconSize()} />;
					break;
				case DamageType.Fire:
					icon = <IconFlame size={this.getIconSize()} />;
					break;
				case DamageType.Impact:
					icon = <IconHammer size={this.getIconSize()} />;
					break;
				case DamageType.Light:
					icon = <IconSun size={this.getIconSize()} />;
					break;
				case DamageType.Piercing:
					icon = <IconTrident size={this.getIconSize()} />;
					break;
				case DamageType.Poison:
					icon = <IconSkull size={this.getIconSize()} />;
					break;
				case DamageType.Psychic:
					icon = <IconBrain size={this.getIconSize()} />;
					break;
				case DamageType.Sonic:
					icon = <IconAccessPoint size={this.getIconSize()} />;
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

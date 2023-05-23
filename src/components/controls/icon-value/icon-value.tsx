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

interface Props {
	value: number | string;
	type: DamageType | IconType;
	iconSize: number;
}

export class IconValue extends Component<Props> {
	static defaultProps = {
		iconSize: 24
	};

	render = () => {
		try {
			let icon = null;
			switch (this.props.type) {
				case IconType.Movement:
					icon = <IconArrowBigRightLinesFilled size={this.props.iconSize} />;
					break;
				case IconType.Money:
					icon = <IconCoins size={this.props.iconSize} />;
					break;
				case IconType.XP:
					icon = <IconAwardFilled size={this.props.iconSize} />;
					break;
				case DamageType.Acid:
					icon = <IconVaccineBottle size={this.props.iconSize} />;
					break;
				case DamageType.Cold:
					icon = <IconSnowflake size={this.props.iconSize} />;
					break;
				case DamageType.Decay:
					icon = <IconSpiral size={this.props.iconSize} />;
					break;
				case DamageType.Edged:
					icon = <IconSlice size={this.props.iconSize} />;
					break;
				case DamageType.Electricity:
					icon = <IconBolt size={this.props.iconSize} />;
					break;
				case DamageType.Fire:
					icon = <IconFlame size={this.props.iconSize} />;
					break;
				case DamageType.Impact:
					icon = <IconHammer size={this.props.iconSize} />;
					break;
				case DamageType.Light:
					icon = <IconSun size={this.props.iconSize} />;
					break;
				case DamageType.Piercing:
					icon = <IconTrident size={this.props.iconSize} />;
					break;
				case DamageType.Poison:
					icon = <IconSkull size={this.props.iconSize} />;
					break;
				case DamageType.Psychic:
					icon = <IconBrain size={this.props.iconSize} />;
					break;
				case DamageType.Sonic:
					icon = <IconAccessPoint size={this.props.iconSize} />;
					break;
			}

			return (
				<div className='icon-value' title={`${this.props.value} ${this.props.type}`}>
					{this.props.value} {icon}
				</div>
			);
		} catch {
			return <div className='icon-value render-error' />;
		}
	};
}

import { Component } from 'react';
import { Boon, BoonType } from '../../../models/boon';
import { Text, TextType } from '../../utility';

import './boon-card.scss';

interface Props {
	boon: Boon;
}

export class BoonCard extends Component<Props> {
	public render() {
		let desc = '';
		switch (this.props.boon.type) {
			case BoonType.ExtraHero:
				desc = 'Gain an empty hero slot.';
				break;
			case BoonType.ExtraXP:
				desc = 'Choose one of your heroes to gain additional XP';
				break;
			case BoonType.LevelUp:
				desc = 'Choose one of your heroes to level up.';
				break;
		}
		return (
			<div className='boon-card'>
				<Text type={TextType.SubHeading}>{this.props.boon.type}</Text>
				<hr />
				<Text>{desc}</Text>
			</div>
		);
	}
}

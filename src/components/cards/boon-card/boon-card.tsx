import { Component } from 'react';

import { ItemCard } from '../item-card/item-card';
import type { BoonModel } from '../../../models/boon';
import type { ItemModel } from '../../../models/item';
import { Text, TextType } from '../../../controls';
import { StatValue } from '../../utility';
import { BoonType } from '../../../enums/enums';

import './boon-card.scss';

interface Props {
	boon: BoonModel;
}

export class BoonCard extends Component<Props> {
	public render() {
		if (this.props.boon.type === BoonType.MagicItem) {
			return <ItemCard item={this.props.boon.data as ItemModel} />;
		}

		let desc = '';
		let extra = null;
		switch (this.props.boon.type) {
			case BoonType.ExtraHero:
				desc = 'Gain an empty hero slot.';
				break;
			case BoonType.ExtraXP:
				desc = 'Choose one of your heroes to gain bonus XP.';
				extra = <StatValue orientation='vertical' label='XP' value={this.props.boon.data as number} />;
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
				{extra ? <div className='extra'>{extra}</div> : null}
			</div>
		);
	}
}

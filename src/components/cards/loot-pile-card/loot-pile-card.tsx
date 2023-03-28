import { Component } from 'react';

import type { LootPileModel } from '../../../models/encounter';

import { Text, TextType } from '../../controls';

import './loot-pile-card.scss';

interface Props {
	loot: LootPileModel;
}

export class LootPileCard extends Component<Props> {
	render = () => {
		let itemSection = null;
		if (this.props.loot.items.length > 0) {
			itemSection = (
				<div className='items'>
					{this.props.loot.items.map(i => (<div key={i.id} className='item'>{i.name}</div>))}
				</div>
			);
		}

		return (
			<div className='loot-pile-card'>
				<Text type={TextType.SubHeading}>Treasure</Text>
				<hr />
				{itemSection}
			</div>
		);
	};
}

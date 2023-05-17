import { Component } from 'react';

import type { LootPileModel } from '../../../models/encounter';

import { Text, TextType } from '../../controls';

import { ListItemPanel } from '../../panels';

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
					{this.props.loot.items.map(i => (<ListItemPanel key={i.id} item={i.name} />))}
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

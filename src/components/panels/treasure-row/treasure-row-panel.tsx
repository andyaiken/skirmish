import { Component, MouseEvent } from 'react';
import { IconList, IconX } from '@tabler/icons-react';

import type { LootPileModel } from '../../../models/encounter';

import { Text, TextType } from '../../controls';
import { LootToken } from '../encounter-map/loot-token/loot-token';

import './treasure-row-panel.scss';

interface Props {
	loot: LootPileModel;
	onDetails: (loot: LootPileModel) => void;
	onCancel: (loot: LootPileModel) => void;
}

export class TreasureRowPanel extends Component<Props> {
	onDetails = (e: MouseEvent) => {
		e.stopPropagation();
		if (this.props.onDetails) {
			this.props.onDetails(this.props.loot);
		}
	};

	onCancel = (e: MouseEvent) => {
		e.stopPropagation();
		if (this.props.onCancel) {
			this.props.onCancel(this.props.loot);
		}
	};

	render = () => {
		try {
			let name = '';
			if (this.props.loot.items.length === 1) {
				const item = this.props.loot.items[0];
				name = item.magic ? item.description : item.name;
			} else if (this.props.loot.items.length > 1) {
				name = `${this.props.loot.items.length} items`;
			}
			if (this.props.loot.money > 0) {
				if (name === '') {
					name = 'Money';
				} else {
					name += '; money';
				}
			}

			return (
				<div className='treasure-row-panel'>
					<div className='token-container'>
						<LootToken
							loot={this.props.loot}
							encounter={null}
							squareSize={40}
							mapDimensions={{ left: 0, top: 0 }}
							selectable={true}
							selected={false}
							onClick={() => null}
						/>
					</div>
					<div className='name'>
						<Text type={TextType.MinorHeading}>{name}</Text>
					</div>
					<button className='icon-btn' onClick={e => this.onDetails(e)}>
						<IconList />
					</button>
					<button className='icon-btn' onClick={e => this.onCancel(e)}>
						<IconX />
					</button>
				</div>
			);
		} catch {
			return <div className='treasure-row-panel render-error' />;
		}
	};
}

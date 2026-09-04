import { Component, MouseEvent } from 'react';
import { IconX } from '@tabler/icons-react';

import { TrapData } from '../../../data/trap-data';

import type { TrapModel } from '../../../models/encounter';

import { Tag, Text, TextType } from '../../controls';
import { TrapToken } from '../encounter-map/trap-token/trap-token';

import './trap-row-panel.scss';

interface Props {
	trap: TrapModel;
	onCancel: (trap: TrapModel) => void;
}

export class TrapRowPanel extends Component<Props> {
	onCancel = (e: MouseEvent) => {
		e.stopPropagation();
		if (this.props.onCancel) {
			this.props.onCancel(this.props.trap);
		}
	};

	render = () => {
		return (
			<div className='trap-row-panel'>
				<div className='token-container'>
					<TrapToken
						trap={this.props.trap}
						encounter={null}
						squareSize={40}
						mapDimensions={{ left: 0, top: 0 }}
						selectable={true}
						selected={false}
						onClick={() => null}
					/>
				</div>
				<div className='name'>
					<Text type={TextType.MinorHeading}>{this.props.trap.name}</Text>
					<Tag>{this.props.trap.armed ? 'Armed' : 'Sprung'}</Tag>
					<Text type={TextType.Small}>{TrapData.getDescription(this.props.trap.type)}</Text>
				</div>
				<button className='icon-btn' onClick={e => this.onCancel(e)}>
					<IconX />
				</button>
			</div>
		);
	};
}

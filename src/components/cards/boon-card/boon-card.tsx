import { Component } from 'react';
import { BoonType } from '../../../models/boon';
import { Text, TextType } from '../../utility';

import './boon-card.scss';

interface Props {
	boon: BoonType;
}

export class BoonCard extends Component<Props> {
	public render() {
		return (
			<div className='boon-card'>
				<Text type={TextType.SubHeading}>{this.props.boon}</Text>
			</div>
		);
	}
}

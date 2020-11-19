import { Divider, Typography } from 'antd';
import React from 'react';
import { FeatureHelper } from '../../models/feature';
import { Item } from '../../models/item';
import { Padding } from '../utility/padding';
import { StatValue } from '../utility/stat-value';

interface Props {
	item: Item;
}

export class ItemCard extends React.Component<Props> {
	public render() {
		let wpn = null;
		if (this.props.item.weapon) {
			wpn = (
				<div>
					<Divider/>
					<StatValue label='Damage' value={this.props.item.weapon.damage.rank + ' ' + this.props.item.weapon.damage.type}/>
					<StatValue label='Range' value={this.props.item.weapon.range}/>
					<StatValue label='Unreliable' value={this.props.item.weapon.unreliable}/>
				</div>
			);
		}

		let features = null;
		if (this.props.item.features.length > 0) {
			features = (
				<div>
					<Divider/>
					<StatValue label='Features' value={this.props.item.features.map(f => FeatureHelper.getName(f)).join(', ')}/>
				</div>
			);
		}

		let location = this.props.item.location.toString();
		if (this.props.item.slots > 1) {
			location = this.props.item.slots + ' ' + location + 's';
		}

		return (
			<Padding>
				<Typography.Paragraph style={{ textAlign: 'center' }}>
					<b>{this.props.item.name}</b>
				</Typography.Paragraph>
				<Divider/>
				<StatValue label='Proficiency' value={this.props.item.proficiency}/>
				<StatValue label='Location' value={location}/>
				{wpn}
				{features}
			</Padding>
		);
	}
}

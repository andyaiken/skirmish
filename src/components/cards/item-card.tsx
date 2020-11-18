import { Divider, Typography } from 'antd';
import React from 'react';
import { FeatureHelper } from '../../models/feature';
import { Item } from '../../models/item';
import { Padding } from '../utility/padding';

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
					<Typography.Paragraph>
						<b>Damage:</b> {this.props.item.weapon.damage.rank} {this.props.item.weapon.damage.type}
					</Typography.Paragraph>
					<Typography.Paragraph>
						<b>Range:</b> {this.props.item.weapon.range}
					</Typography.Paragraph>
					<Typography.Paragraph>
						<b>Unreliable:</b> {this.props.item.weapon.unreliable}
					</Typography.Paragraph>
				</div>
			);
		}

		let features = null;
		if (this.props.item.features.length > 0) {
			features = (
				<div>
					<Divider/>
					<Typography.Paragraph>
						<b>Features:</b> {this.props.item.features.map(t => FeatureHelper.getName(t)).join(', ')}
					</Typography.Paragraph>
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
				<Typography.Paragraph>
					<b>Proficiency:</b> {this.props.item.proficiency}
				</Typography.Paragraph>
				<Typography.Paragraph>
					<b>Location:</b> {location}
				</Typography.Paragraph>
				{wpn}
				{features}
			</Padding>
		);
	}
}

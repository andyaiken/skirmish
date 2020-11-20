import { Divider, Tag } from 'antd';
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
					<StatValue label='Damage' value={this.props.item.weapon.damage.rank}/>
					<StatValue label='Type' value={this.props.item.weapon.damage.type}/>
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
					{this.props.item.features.map(f => (
						<Tag key={f.id}>
							{FeatureHelper.getName(f)}
						</Tag>
					))}
				</div>
			);
		}

		let location = this.props.item.location.toString();
		if (this.props.item.slots > 1) {
			location = this.props.item.slots + ' ' + location + 's';
		}

		return (
			<Padding>
				<Divider>{this.props.item.name}</Divider>
				{wpn}
				<StatValue label='Location' value={location}/>
				{features}
				<Divider>Proficiency</Divider>
				<Tag>{this.props.item.proficiency}</Tag>
			</Padding>
		);
	}
}

import { Component } from 'react';
import { FeatureHelper } from '../../../models/feature';
import { Item } from '../../../models/item';
import { StatValue, Text, TextType } from '../../utility';

import './item-card.scss';

interface Props {
	item: Item;
}

export class ItemCard extends Component<Props> {
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
					<StatValue label='Features' value={this.props.item.features.map(f => FeatureHelper.getName(f)).join(', ')}/>
				</div>
			);
		}

		let location = this.props.item.location.toString();
		if (this.props.item.slots > 1) {
			location = this.props.item.slots + ' ' + location + 's';
		}

		return (
			<div className='item-card'>
				<Text type={TextType.SubHeading}>{this.props.item.name}</Text>
				<hr />
				<StatValue label='Location' value={location}/>
				<StatValue label='Proficiency' value={this.props.item.proficiency}/>
				{wpn}
				{features}
			</div>
		);
	}
}

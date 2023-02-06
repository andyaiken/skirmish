import { Component } from 'react';
import { Tag } from '../../../controls';
import { getFeatureDescription, getFeatureTitle } from '../../../models/feature';
import { Item } from '../../../models/item';
import { Proficiency } from '../../../models/proficiency';
import { StatValue, StatValueList, Text, TextType } from '../../utility';

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
					{this.props.item.weapon.range > 0 ? <StatValue label='Range' value={this.props.item.weapon.range}/> : null}
					{this.props.item.weapon.unreliable > 0 ? <StatValue label='Unreliable' value={this.props.item.weapon.unreliable}/> : null}
				</div>
			);
		}

		let location = this.props.item.location.toString();
		if (this.props.item.slots > 1) {
			location = `${this.props.item.slots} ${location}s`;
		}

		let features = null;
		if (this.props.item.features.length > 0) {
			features = (
				<div>
					<StatValueList label='Features' values={this.props.item.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`)}/>
				</div>
			);
		}

		let actions = null;
		if (this.props.item.actions.length > 0) {
			actions = (
				<div>
					<StatValueList label='Actions' values={this.props.item.actions.map(a => a.name)}/>
				</div>
			);
		}

		return (
			<div className='item-card'>
				<Text type={TextType.SubHeading}>{this.props.item.name}</Text>
				<hr />
				<div className='tags'>
					{this.props.item.proficiency !== Proficiency.None ? <Tag>{this.props.item.proficiency}</Tag> : null}
					<Tag>{location}</Tag>
				</div>
				{wpn}
				{features}
				{actions}
			</div>
		);
	}
}

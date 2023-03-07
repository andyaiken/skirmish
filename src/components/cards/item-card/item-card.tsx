import { Component } from 'react';

import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import type { ItemModel } from '../../../models/item';

import { StatValue, Tag, Text, TextType } from '../../controls';

import './item-card.scss';

interface Props {
	item: ItemModel;
}

export class ItemCard extends Component<Props> {
	render = () => {
		let location = this.props.item.location.toString();
		if (this.props.item.slots > 1) {
			location = `${this.props.item.slots} ${location}s`;
		}

		let features = null;
		if (this.props.item.weapon || (this.props.item.features.length > 0)) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.item.weapon ?<StatValue label='Damage' value={`${this.props.item.weapon.damage.rank} (${this.props.item.weapon.damage.type})`}/> : null}
					{this.props.item.weapon && (this.props.item.weapon.range > 1) ? <StatValue label='Range' value={this.props.item.weapon.range}/> : null}
					{this.props.item.weapon && (this.props.item.weapon.unreliable > 0) ? <StatValue label='Unreliable' value={this.props.item.weapon.unreliable}/> : null}
					{this.props.item.features.map(f => <Text key={f.id} type={TextType.ListItem}>{FeatureLogic.getFeatureDescription(f)}</Text>)}
				</div>
			);
		}

		let actions = null;
		if (this.props.item.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.item.actions.map(a => <Text key={a.id} type={TextType.ListItem}>{ActionLogic.getActionDescription(a)}</Text>)}
				</div>
			);
		}

		return (
			<div className='item-card'>
				<Text type={TextType.SubHeading}>{this.props.item.name}</Text>
				<hr />
				<div className='tags'>
					{this.props.item.baseItem !== '' ? <Tag>Magical {this.props.item.baseItem}</Tag> : null}
					{this.props.item.proficiency !== ItemProficiencyType.None ? <Tag>{this.props.item.proficiency}</Tag> : null}
					<Tag>{location}</Tag>
				</div>
				{features}
				{actions}
			</div>
		);
	};
}
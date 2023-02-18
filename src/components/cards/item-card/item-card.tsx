import { Component } from 'react';
import { Tag, Text, TextType } from '../../../controls';
import { ItemProficiencyType } from '../../../models/enums';
import { ItemModel } from '../../../models/item';
import { getFeatureTitle, getFeatureDescription } from '../../../utils/game-logic';
import { StatValue } from '../../utility';

import './item-card.scss';

interface Props {
	item: ItemModel;
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
					<StatValue label='Features' value={this.props.item.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`)}/>
				</div>
			);
		}

		let actions = null;
		if (this.props.item.actions.length > 0) {
			actions = (
				<div>
					<StatValue label='Actions' value={this.props.item.actions.map(a => a.name)}/>
				</div>
			);
		}

		return (
			<div className='item-card'>
				<Text type={TextType.SubHeading}>{this.props.item.name}</Text>
				<hr />
				<div className='tags'>
					{this.props.item.proficiency !== ItemProficiencyType.None ? <Tag>{this.props.item.proficiency}</Tag> : null}
					<Tag>{location}</Tag>
					{this.props.item.baseItem !== '' ? <Tag>{this.props.item.baseItem}</Tag> : null}
				</div>
				{wpn}
				{features}
				{actions}
			</div>
		);
	}
}

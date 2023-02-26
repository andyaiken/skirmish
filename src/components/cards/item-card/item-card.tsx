import { Component } from 'react';

import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { GameLogic } from '../../../logic/game-logic';

import type { ItemModel } from '../../../models/item';

import { Box, StatValue, Tag, Text, TextType } from '../../controls';

import './item-card.scss';

interface Props {
	item: ItemModel;
}

export class ItemCard extends Component<Props> {
	public render() {
		let wpn = null;
		if (this.props.item.weapon) {
			wpn = (
				<Box label='Weapon'>
					<StatValue label='Damage' value={this.props.item.weapon.damage.rank}/>
					<StatValue label='Type' value={this.props.item.weapon.damage.type}/>
					{this.props.item.weapon.range > 0 ? <StatValue label='Range' value={this.props.item.weapon.range}/> : null}
					{this.props.item.weapon.unreliable > 0 ? <StatValue label='Unreliable' value={this.props.item.weapon.unreliable}/> : null}
				</Box>
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
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.item.features.map(f => <Text key={f.id} type={TextType.ListItem}>{GameLogic.getFeatureDescription(f)}</Text>)}
				</div>
			);
		}

		let actions = null;
		if (this.props.item.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.item.actions.map(a => <Text key={a.id} type={TextType.ListItem}>{GameLogic.getActionDescription(a)}</Text>)}
				</div>
			);
		}

		return (
			<div className='item-card'>
				<Text type={TextType.SubHeading}>{this.props.item.name}</Text>
				{this.props.item.baseItem !== '' ? <Text type={TextType.MinorHeading}>{this.props.item.baseItem}</Text> : null}
				<hr />
				<div className='tags'>
					{this.props.item.proficiency !== ItemProficiencyType.None ? <Tag>{this.props.item.proficiency}</Tag> : null}
					<Tag>{location}</Tag>
				</div>
				{wpn}
				{features}
				{actions}
			</div>
		);
	}
}

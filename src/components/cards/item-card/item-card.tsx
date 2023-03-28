import { Component } from 'react';

import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import type { ItemModel } from '../../../models/item';

import { ActionListItemPanel, FeatureListItemPanel } from '../../panels';

import { IconValue, StatValue, Tag, Text, TextType } from '../../controls';

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

		let weapon = null;
		if (this.props.item.weapon) {
			weapon = (
				<div>
					<Text type={TextType.MinorHeading}>Weapon</Text>
					{this.props.item.weapon ?<StatValue orientation='compact' label='Damage' value={
						this.props.item.weapon.damage.map((dmg, n) => (
							<IconValue key={n} type={dmg.type} value={dmg.rank} iconSize={12} />
						))
					}/> : null}
					{this.props.item.weapon && (this.props.item.weapon.range > 1) ? <StatValue orientation='compact' label='Range' value={this.props.item.weapon.range}/> : null}
					{this.props.item.weapon && (this.props.item.weapon.unreliable > 0) ? <StatValue orientation='compact' label='Unreliable' value={this.props.item.weapon.unreliable}/> : null}
				</div>
			);
		}

		let armor = null;
		if (this.props.item.armor) {
			armor = (
				<div>
					<Text type={TextType.MinorHeading}>Armor</Text>
					{this.props.item.armor.features.map(f => <FeatureListItemPanel key={f.id} item={f} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.item.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.item.features.map(f => <FeatureListItemPanel key={f.id} item={f} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.item.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.item.actions.map(a => <ActionListItemPanel key={a.id} item={a} />)}
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
				{weapon}
				{armor}
				{features}
				{actions}
			</div>
		);
	};
}

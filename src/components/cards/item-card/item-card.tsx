import { Component, MouseEvent } from 'react';
import { IconCheck, IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import type { ItemModel } from '../../../models/item';

import { ListItemPanel } from '../../panels';

import { IconValue, PlayingCard, StatValue, Tag, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './item-card.scss';

interface Props {
	item: ItemModel;
	onSelect: ((item: ItemModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class ItemCard extends Component<Props, State> {
	static defaultProps = {
		onSelect: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	onFlip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			flipped: !this.state.flipped
		});
	};

	onSelect = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onSelect) {
			this.props.onSelect(this.props.item);
		}
	};

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
					{this.props.item.armor.features.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.item.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.item.features.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.item.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.item.actions.map(a => <ListItemPanel key={a.id} item={ActionLogic.getActionDescription(a)} />)}
				</div>
			);
		}

		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' onClick={this.onFlip}><IconRefresh /></button>
		);
		if (this.props.onSelect && (buttons.length > 0)) {
			buttons.push(
				<button key='select' className='icon-btn' onClick={this.onSelect}><IconCheck /></button>
			);
		}

		return (
			<PlayingCard
				type={CardType.Item}
				front={(
					<PlaceholderCard
						text={this.props.item.name}
						subtext={(
							<div className='item-card'>
								<Text type={TextType.Small}>{this.props.item.description}</Text>
								<hr />
								<div className='tags'>
									{this.props.item.baseItem !== '' ? <Tag>Magical {this.props.item.baseItem}</Tag> : null}
									{this.props.item.proficiency !== ItemProficiencyType.None ? <Tag>{this.props.item.proficiency}</Tag> : null}
									<Tag>{location}</Tag>
								</div>
							</div>
						)}
					/>
				)}
				back={(
					<div className='item-card'>
						{weapon}
						{armor}
						{features}
						{actions}
					</div>
				)}
				footerText='Item'
				footerContent={buttons}
				flipped={this.state.flipped}
				onClick={this.props.onSelect ? this.onSelect : null}
			/>
		);
	};
}

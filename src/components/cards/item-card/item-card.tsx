import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { ItemLocationType } from '../../../enums/item-location-type';
import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { ActionEffects, ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import type { ItemModel } from '../../../models/item';

import { ListItemPanel } from '../../panels';

import { IconValue, PlayingCard, StatValue, Tag, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './item-card.scss';

interface Props {
	item: ItemModel;
	count: number;
	disabled: boolean;
	onClick: ((item: ItemModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class ItemCard extends Component<Props, State> {
	static defaultProps = {
		count: 1,
		disabled: false,
		onClick: null
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

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.state.flipped) {
			this.onFlip(e);
		} else if (this.props.onClick) {
			this.props.onClick(this.props.item);
		}
	};

	render = () => {
		let location = this.props.item.location.toString();
		if (this.props.item.slots > 1) {
			location = `${this.props.item.slots} ${location}s`;
		}
		if (this.props.item.location === ItemLocationType.None) {
			location = '';
		}

		let weapon = null;
		if (this.props.item.weapon) {
			weapon = (
				<div>
					<Text type={TextType.MinorHeading}>Weapon</Text>
					{this.props.item.weapon ?<StatValue orientation='compact' label='Damage' value={
						this.props.item.weapon.damage.map((dmg, n) => (
							<IconValue key={n} type={dmg.type} value={dmg.rank} />
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

		let potion = null;
		if (this.props.item.potion) {
			potion = (
				<div>
					<Text type={TextType.MinorHeading}>Potion</Text>
					{this.props.item.potion.effects.map((e, n) => <ListItemPanel key={n} item={ActionEffects.getDescription(e, null, null)} />)}
				</div>
			);
		}

		let features = null;
		const collatedFeatures = FeatureLogic.collateFeatures(this.props.item.features);
		if (collatedFeatures.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{collatedFeatures.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
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

		let empty = null;
		if (!weapon && !armor && !potion && !features && !actions) {
			empty = (
				<div>
					<Text type={TextType.Small}>This item has no additional statistics.</Text>
				</div>
			);
		}

		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' title='Flip' onClick={this.onFlip}><IconRefresh /></button>
		);

		return (
			<PlayingCard
				type={this.props.item.potion ? CardType.Potion : CardType.Item}
				front={(
					<PlaceholderCard
						text={this.props.count === 1 ? this.props.item.name : `${this.props.item.name} (x${this.props.count})`}
						subtext={this.props.item.description}
						content={(
							<div className='item-card-front'>
								<div className='tags'>
									{this.props.item.proficiency !== ItemProficiencyType.None ? <Tag>{this.props.item.proficiency}</Tag> : null}
									{location !== '' ? <Tag>{location}</Tag> : null}
								</div>
							</div>
						)}
					/>
				)}
				back={(
					<div className='item-card-back'>
						{weapon}
						{armor}
						{potion}
						{features}
						{actions}
						{empty}
					</div>
				)}
				footerText={this.props.item.potion ? 'Potion' : 'Item'}
				footerContent={buttons}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : this.onFlip}
			/>
		);
	};
}

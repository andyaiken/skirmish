import { IconAB, IconCircleCheck } from '@tabler/icons-react';
import { Component } from 'react';

import { ItemLocationType } from '../../../enums/item-location-type';
import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { CombatantLogic } from '../../../logic/combatant-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { Collections } from '../../../utils/collections';

import { Dialog, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './magic-item-info-panel.scss';

interface Props {
	item: ItemModel;
	game: GameModel;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
}

interface State {
	hero: CombatantModel | null;
}

export class MagicItemInfoPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hero: null
		};
	}

	setComparison = (hero: CombatantModel | null) => {
		this.setState({
			hero: hero
		});
	};

	render = () => {
		try {
			const heroes = this.props.game.heroes
				.filter(hero => (this.props.item.proficiency === ItemProficiencyType.None) || CombatantLogic.getProficiencies(hero).includes(this.props.item.proficiency))
				.map(hero => {
					let slotsTotal = 1;
					switch (this.props.item.location) {
						case ItemLocationType.Hand:
						case ItemLocationType.Ring:
							slotsTotal = 2;
							break;
					}
					const equipped = hero.items.filter(i => i.location === this.props.item.location);
					const slotsUsed = Collections.sum(equipped, i => i.slots);
					const slotsAvailable = slotsTotal - slotsUsed;
					const canEquip = this.props.item.slots <= slotsAvailable;

					return (
						<div key={hero.id} className='hero-row'>
							<div className='hero-name'>{hero.name}</div>
							{
								canEquip ?
									<button className='icon-btn' onClick={() => this.props.equipItem(this.props.item, hero)}><IconCircleCheck /></button>
									:
									<button className='icon-btn' onClick={() => this.setComparison(hero)}><IconAB /></button>
							}
						</div>
					);
				});

			if (heroes.length === 0) {
				heroes.push(
					<Text key='empty' type={TextType.Small}>(none of your current heroes)</Text>
				);
			}

			let dialog = null;
			if (this.state.hero) {
				dialog = (
					<Dialog
						level={2}
						content={
							<div className='item-comparer-dialog'>
								<Text type={TextType.Heading}>{this.state.hero.name}</Text>
								<div className='item-columns'>
									<div className='item-column'>
										<Text type={TextType.SubHeading}>Currently Equipped</Text>
										<div className='card-container'>
											{this.state.hero.items.filter(i => i.location === this.props.item.location).map(i => (
												<div key={i.id}>
													<ItemCard item={i} />
													<button onClick={() => this.props.dropItem(i, this.state.hero as CombatantModel)}>Drop</button>
												</div>
											))}
										</div>
									</div>
									<div className='item-column'>
										<Text type={TextType.SubHeading}>New Item</Text>
										<div className='card-container'>
											<ItemCard item={this.props.item} />
										</div>
									</div>
								</div>
							</div>
						}
						onClose={() => this.setComparison(null)}
					/>
				);
			}

			return (
				<div className='magic-item-info-panel'>
					<div className='usable-by'>
						Can be used by:
					</div>
					{heroes}
					{dialog}
				</div>
			);
		} catch {
			return <div className='magic-item-info render-error' />;
		}
	};
}

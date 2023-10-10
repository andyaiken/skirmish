import { Component } from 'react';

import { ItemLocationType } from '../../../enums/item-location-type';
import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { GameLogic } from '../../../logic/game-logic';

import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';

import { CardList, Selector, Text, TextType } from '../../controls';
import { ItemCard } from '../../cards';

import './buy-equipment-modal.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyItem: (item: ItemModel) => void;
}

interface State {
	proficiency: ItemProficiencyType;
	location: ItemLocationType;
}

export class BuyEquipmentModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			proficiency: ItemProficiencyType.Any,
			location: ItemLocationType.Any
		};
	}

	getItems = () => {
		const items = GameLogic.getItemDeck(this.props.options.packIDs)
			.filter(i => (i.proficiency === this.state.proficiency) || (this.state.proficiency === ItemProficiencyType.Any))
			.filter(i => (i.location === this.state.location) || (this.state.location === ItemLocationType.Any));

		return Collections.sort(items, n => n.name);
	};

	render = () => {
		try {
			const cards = this.getItems()
				.map(item => (
					<ItemCard key={item.id} item={item} onClick={this.props.buyItem} />
				));

			return (
				<div className='buy-equipment-modal'>
					<Text type={TextType.Heading}>Buy Equipment</Text>
					<hr />
					<div className='card-selection-row'>
						<Text type={TextType.SubHeading}>Filter by proficiency</Text>
						<Selector
							options={[
								{ id: ItemProficiencyType.Any, display: 'Any proficiency' },
								{ id: ItemProficiencyType.None, display: 'No proficiency' },
								{ id: ItemProficiencyType.MilitaryWeapons },
								{ id: ItemProficiencyType.LargeWeapons },
								{ id: ItemProficiencyType.PairedWeapons },
								{ id: ItemProficiencyType.RangedWeapons },
								{ id: ItemProficiencyType.PowderWeapons },
								{ id: ItemProficiencyType.Implements },
								{ id: ItemProficiencyType.LightArmor },
								{ id: ItemProficiencyType.HeavyArmor },
								{ id: ItemProficiencyType.Shields }
							]}
							columnCount={4}
							selectedID={this.state.proficiency}
							onSelect={prof => this.setState({ proficiency: prof as ItemProficiencyType })}
						/>
						<Text type={TextType.SubHeading}>Filter by location</Text>
						<Selector
							options={[
								{ id: ItemLocationType.Any, display: 'Any location' },
								{ id: ItemLocationType.Head },
								{ id: ItemLocationType.Neck },
								{ id: ItemLocationType.Body },
								{ id: ItemLocationType.Feet },
								{ id: ItemLocationType.Hand },
								{ id: ItemLocationType.Ring }
							]}
							columnCount={4}
							selectedID={this.state.location}
							onSelect={loc => this.setState({ location: loc as ItemLocationType })}
						/>
						<hr />
						<CardList cards={cards} />
					</div>
				</div>
			);
		} catch {
			return <div className='buy-equipment-modal render-error' />;
		}
	};
}

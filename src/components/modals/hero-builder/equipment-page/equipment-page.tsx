import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
import { ItemProficiencyType } from '../../../../enums/item-proficiency-type';
import { StructureType } from '../../../../enums/structure-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { GameLogic } from '../../../../logic/game-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { Collections } from '../../../../utils/collections';
import { Utils } from '../../../../utils/utils';

import { CardList, Expander, PlayingCard, Text, TextType } from '../../../controls';
import { ItemCard, PlaceholderCard, StrongholdBenefitCard } from '../../../cards';

import './equipment-page.scss';

interface Props {
	hero: CombatantModel;
	game: GameModel;
	options: OptionsModel;
	addItems: (items: ItemModel[]) => void;
	useCharge: (type: StructureType, count: number) => void;
}

interface State {
	slots: {
		proficiency: ItemProficiencyType;
		candidates: ItemModel[];
		selected: ItemModel | null;
	}[];
}

export class EquipmentPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const slots = CombatantLogic.getProficiencies(this.props.hero).map(prof => {
			return {
				proficiency: prof,
				candidates: Collections.shuffle(GameLogic.getItemsForProficiency(prof, props.options.packIDs)).splice(0, 3),
				selected: null
			};
		});

		this.state = {
			slots: slots
		};
	}

	selectItem = (item: ItemModel) => {
		const slot = this.state.slots.find(s => s.proficiency === item.proficiency);
		if (slot) {
			const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy.id = Utils.guid();
			slot.selected = copy;
			this.setState({
				slots: this.state.slots
			});
		}
	};

	redraw = (proficiency: ItemProficiencyType) => {
		const slot = this.state.slots.find(s => s.proficiency === proficiency);
		if (slot) {
			slot.candidates = Collections.shuffle(GameLogic.getItemsForProficiency(proficiency, this.props.options.packIDs)).splice(0, 3);
			this.setState({
				slots: this.state.slots
			}, () => {
				if (!this.props.options.developer) {
					this.props.useCharge(StructureType.Quartermaster, 1);
				}
			});
		}
	};

	addItems = () => {
		const items = this.state.slots.map(s => s.selected).filter(i => i !== null) as ItemModel[];
		this.props.addItems(items);
	};

	render = () => {
		try {
			const role = GameLogic.getRole(this.props.hero.roleID);
			if (!role) {
				return null;
			}

			const overviewCards = this.state.slots.map((slot, n) => {
				if (slot.selected) {
					return (
						<ItemCard key={n} item={slot.selected} />
					);
				}
				return (
					<PlayingCard
						key={n}
						type={CardType.Item}
						disabled={true}
						front={<PlaceholderCard text={slot.proficiency} subtext={`Choose one of the ${slot.proficiency} cards below`} />}
					/>
				);
			});

			const slots = this.state.slots.filter(slot => !slot.selected).map((slot, n) => {
				const cards = slot.candidates.map(item => <ItemCard key={item.id} item={item} onClick={this.selectItem} />);

				const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Quartermaster);
				if ((redraws > 0) || this.props.options.developer) {
					cards.push(
						<StrongholdBenefitCard
							key='redraw'
							label='Redraw'
							available={redraws}
							developer={this.props.options.developer}
							onRedraw={() => this.redraw(slot.proficiency)}
						/>
					);
				}

				return (
					<div key={n} className='card-selection-row'>
						<CardList mode='row' cards={cards} />
					</div>
				);
			});

			const canSelect = this.state.slots.every(s => s.selected !== null);

			return (
				<div className='equipment-page'>
					<div className='card-selection-row'>
						<CardList mode='row' cards={overviewCards} />
					</div>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>Your hero can choose starting equipment.</Text>
								}
								content={
									<div>
										<p>Your hero&apos;s starting features include <b>Proficiencies</b> for weapons, armor, or magical implements.</p>
										<p>For each proficiency, you can choose an item for your hero to use.</p>
									</div>
								}
							/>
							: null
					}
					<hr />
					{slots}
					{ canSelect ? <button className='primary' onClick={() => this.addItems()}>Next</button> : null }
				</div>
			);
		} catch {
			return <div className='equipment-page render-error' />;
		}
	};
}

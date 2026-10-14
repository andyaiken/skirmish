import { Component, ReactNode } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game/game-logic';
import { PackLogic } from '../../../../logic/pack/pack-logic';

import type { BackgroundModel } from '../../../../models/background';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';
import type { RoleModel } from '../../../../models/role';
import type { SpeciesModel } from '../../../../models/species';
import type { StructureModel } from '../../../../models/structure';

// Imported from their own files rather than through the modals barrel: this component is reached
// from that barrel by way of the help modal, so going back through it would close a cycle
import { BackgroundCard, ItemCard, RoleCard, SpeciesCard, StructureCard } from '../../../cards';
import { Badge, CardList, CardPreview, Selector, Text, TextType } from '../../../controls';

import './decks-tab.scss';

type CardPreviewSelection =
	{ type: CardType.Species, card: SpeciesModel } |
	{ type: CardType.Role, card: RoleModel } |
	{ type: CardType.Background, card: BackgroundModel } |
	{ type: CardType.Item, card: ItemModel } |
	{ type: CardType.Structure, card: StructureModel };

interface Props {
	options: OptionsModel;
}

interface State {
	tab: string;
	selected: CardPreviewSelection | null;
}

export class DecksTab extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			tab: 'heroes',
			selected: null
		};
	}

	setTab = (tab: string) => {
		this.setState({
			tab: tab
		});
	};

	setSelected = (selected: CardPreviewSelection) => {
		this.setState({
			selected: selected
		});
	};

	clearSelected = () => {
		this.setState({
			selected: null
		});
	};

	getSelectedCard = (selected: CardPreviewSelection) => {
		switch (selected.type) {
			case CardType.Species:
				return <SpeciesCard species={selected.card} />;
			case CardType.Role:
				return <RoleCard role={selected.card} />;
			case CardType.Background:
				return <BackgroundCard background={selected.card} />;
			case CardType.Item:
				return <ItemCard item={selected.card} />;
			case CardType.Structure:
				return <StructureCard structure={selected.card} />;
		}
	};

	getBadge = (cardID: string) => {
		const pack = PackLogic.findContainingPack(cardID);
		if (pack) {
			return pack.name;
		}

		return '';
	};

	render = () => {
		const cards: ReactNode[] = [];

		switch (this.state.tab) {
			case 'heroes':
				GameLogic.getHeroSpeciesDeck(this.props.options.packIDs)
					.forEach(s => {
						cards.push(
							<Badge key={s.id} value={this.getBadge(s.id)}>
								<SpeciesCard species={s} onClick={s => this.setSelected({ type: CardType.Species, card: s })} />
							</Badge>
						);
					});
				break;
			case 'monsters':
				GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs)
					.forEach(s => {
						cards.push(
							<Badge key={s.id} value={this.getBadge(s.id)}>
								<SpeciesCard species={s} onClick={s => this.setSelected({ type: CardType.Species, card: s })} />
							</Badge>
						);
					});
				break;
			case 'roles':
				GameLogic.getRoleDeck(this.props.options.packIDs)
					.forEach(r => {
						cards.push(
							<Badge key={r.id} value={this.getBadge(r.id)}>
								<RoleCard role={r} onClick={r => this.setSelected({ type: CardType.Role, card: r })} />
							</Badge>
						);
					});
				break;
			case 'backgrounds':
				GameLogic.getBackgroundDeck(this.props.options.packIDs)
					.forEach(b => {
						cards.push(
							<Badge key={b.id} value={this.getBadge(b.id)}>
								<BackgroundCard background={b} onClick={b => this.setSelected({ type: CardType.Background, card: b })} />
							</Badge>
						);
					});
				break;
			case 'structures':
				GameLogic.getStructureDeck(this.props.options.packIDs)
					.forEach(s => {
						cards.push(
							<Badge key={s.id} value={this.getBadge(s.id)}>
								<StructureCard structure={s} onClick={structure => this.setSelected({ type: CardType.Structure, card: structure })} />
							</Badge>
						);
					});
				break;
			case 'items':
				GameLogic.getItemDeck(this.props.options.packIDs)
					.forEach(i => {
						cards.push(
							<Badge key={i.id} value={this.getBadge(i.id)}>
								<ItemCard item={i} onClick={item => this.setSelected({ type: CardType.Item, card: item })} />
							</Badge>
						);
					});
				break;
			case 'potions':
				GameLogic.getPotionDeck(this.props.options.packIDs)
					.forEach(p => {
						cards.push(
							<Badge key={p.id} value={this.getBadge(p.id)}>
								<ItemCard item={p} onClick={item => this.setSelected({ type: CardType.Item, card: item })} />
							</Badge>
						);
					});
				break;
			case 'scrolls':
				GameLogic.getScrollDeck(this.props.options.packIDs)
					.forEach(sc => {
						cards.push(
							<Badge key={sc.id} value={this.getBadge(sc.id)}>
								<ItemCard item={sc} onClick={item => this.setSelected({ type: CardType.Item, card: item })} />
							</Badge>
						);
					});
				break;
		}

		let preview = null;
		if (this.state.selected) {
			preview = (
				<CardPreview
					card={this.getSelectedCard(this.state.selected)}
					onClose={this.clearSelected}
				/>
			);
		}

		return (
			<div className='decks-tab'>
				<Selector
					options={[
						{ id: 'heroes', display: 'Heroes' },
						{ id: 'monsters', display: 'Monsters' },
						{ id: 'roles', display: 'Roles' },
						{ id: 'backgrounds', display: 'Backgrounds' },
						{ id: 'structures', display: 'Structures' },
						{ id: 'items', display: 'Items' },
						{ id: 'potions', display: 'Potions' },
						{ id: 'scrolls', display: 'Scrolls' }
					]}
					selectedID={this.state.tab}
					onSelect={this.setTab}
				/>
				{cards.length > 0 ? <CardList cards={cards} /> : null}
				{cards.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
				{preview}
			</div>
		);
	};
}

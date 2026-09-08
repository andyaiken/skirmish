import { Component, ReactNode } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game/game-logic';
import { PackLogic } from '../../../../logic/pack/pack-logic';

import type { OptionsModel } from '../../../../models/options';

import type { CardSelection } from '../../card-details/card-details-modal';

// Imported from their own files rather than through the modals barrel: this component is reached
// from that barrel by way of the help modal, so going back through it would close a cycle
import { BackgroundModal } from '../../background/background-modal';
import { RoleModal } from '../../role/role-modal';
import { SpeciesModal } from '../../species/species-modal';

import { BackgroundCard, ItemCard, RoleCard, SpeciesCard, StructureCard } from '../../../cards';
import { Badge, CardList, Dialog, Selector, Text, TextType } from '../../../controls';

import './decks-tab.scss';

interface Props {
	options: OptionsModel;
}

interface State {
	tab: string;
	selected: CardSelection | null;
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

	setSelected = (selected: CardSelection) => {
		this.setState({
			selected: selected
		});
	};

	clearSelected = () => {
		this.setState({
			selected: null
		});
	};

	getSelectedModal = (selected: CardSelection) => {
		switch (selected.type) {
			case CardType.Species:
				return <SpeciesModal species={selected.card} />;
			case CardType.Role:
				return <RoleModal role={selected.card} />;
			case CardType.Background:
				return <BackgroundModal background={selected.card} />;
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
								<StructureCard structure={s} />
							</Badge>
						);
					});
				break;
			case 'items':
				GameLogic.getItemDeck(this.props.options.packIDs)
					.forEach(i => {
						cards.push(
							<Badge key={i.id} value={this.getBadge(i.id)}>
								<ItemCard item={i} />
							</Badge>
						);
					});
				break;
			case 'potions':
				GameLogic.getPotionDeck(this.props.options.packIDs)
					.forEach(p => {
						cards.push(
							<Badge key={p.id} value={this.getBadge(p.id)}>
								<ItemCard item={p} />
							</Badge>
						);
					});
				break;
			case 'scrolls':
				GameLogic.getScrollDeck(this.props.options.packIDs)
					.forEach(sc => {
						cards.push(
							<Badge key={sc.id} value={this.getBadge(sc.id)}>
								<ItemCard item={sc} />
							</Badge>
						);
					});
				break;
		}

		let dialog = null;
		if (this.state.selected) {
			dialog = (
				<Dialog
					content={this.getSelectedModal(this.state.selected)}
					level={2}
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
				{dialog}
			</div>
		);
	};
}

import { Component, ReactNode } from 'react';

import { PackLogic } from '../../../logic/pack/pack-logic';

import type { PackModel } from '../../../models/pack';

import { BackgroundCard, ItemCard, RoleCard, SpeciesCard, StructureCard } from '../../cards';
import { CardList, Text, TextType } from '../../controls';

import './pack-modal.scss';

interface Props {
	pack: PackModel;
	owned: boolean;
	// Already formatted by the store; null when it has not offered this product, which is
	// the case offline and in any build without a store.
	price: string | null;
	buyPack: (pack: PackModel) => void;
}

export class PackModal extends Component<Props> {
	getBuyOption = () => {
		// The base game has no ID and is never for sale.
		if ((this.props.pack.id === '') || this.props.owned) {
			return null;
		}

		return (
			<div>
				<Text type={TextType.Information}>
					<p>You <b>do not</b> own this card pack.</p>
				</Text>
				{
					this.props.price ?
						<button className='primary' onClick={() => this.props.buyPack(this.props.pack)}>
							Buy This Pack ({this.props.price})
						</button>
						:
						<Text type={TextType.Information}>
							<p>This pack is not available to buy at the moment.</p>
						</Text>
				}
			</div>
		);
	};

	// Each section is skipped when the pack has none of that card type, which is common:
	// Skullduggery has no monsters at all, and only Codex Arcanum has potions or scrolls.
	getSection = (title: string, cards: ReactNode[]) => {
		if (cards.length === 0) {
			return null;
		}

		return (
			<div key={title}>
				<hr />
				<Text type={TextType.MinorHeading}>{title}</Text>
				<CardList cards={cards} />
			</div>
		);
	};

	render = () => {
		const packID = this.props.pack.id;

		return (
			<div className='pack-modal'>
				<Text type={TextType.Heading}>{this.props.pack.name}</Text>
				<hr />
				<Text>
					<p style={{ textAlign: 'center' }}>{this.props.pack.description}</p>
				</Text>
				{this.getBuyOption()}
				{this.getSection('Hero Species Cards', PackLogic.getHeroSpecies(packID).map(s => <SpeciesCard key={s.id} species={s} />))}
				{this.getSection('Monster Species Cards', PackLogic.getMonsterSpecies(packID).map(s => <SpeciesCard key={s.id} species={s} />))}
				{this.getSection('Role Cards', PackLogic.getRoles(packID).map(r => <RoleCard key={r.id} role={r} />))}
				{this.getSection('Background Cards', PackLogic.getBackgrounds(packID).map(b => <BackgroundCard key={b.id} background={b} />))}
				{this.getSection('Structure Cards', PackLogic.getStructures(packID).map(s => <StructureCard key={s.id} structure={s} />))}
				{this.getSection('Item Cards', PackLogic.getItems(packID).map(i => <ItemCard key={i.id} item={i} />))}
				{this.getSection('Potion Cards', PackLogic.getPotions(packID).map(p => <ItemCard key={p.id} item={p} />))}
				{this.getSection('Scroll Cards', PackLogic.getScrolls(packID).map(sc => <ItemCard key={sc.id} item={sc} />))}
			</div>
		);
	};
}

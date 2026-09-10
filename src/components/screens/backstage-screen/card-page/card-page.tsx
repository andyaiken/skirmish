import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game/game-logic';
import { PackLogic } from '../../../../logic/pack/pack-logic';

import type { OptionsModel } from '../../../../models/options';
import type { PackModel } from '../../../../models/pack';

import type { CardSelection } from '../../../modals/card-details/card-details-modal';

import { BackgroundModal, RoleModal, SpeciesModal } from '../../../modals';
import { Dialog, StatValue, Tag, Text, TextType } from '../../../controls';

import './card-page.scss';

interface Props {
	options: OptionsModel
}

interface State {
	selected: CardSelection | null;
}

export class CardPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selected: null
		};
	}

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
				return <SpeciesModal species={selected.card} developer={true} />;
			case CardType.Role:
				return <RoleModal role={selected.card} developer={true} />;
			case CardType.Background:
				return <BackgroundModal background={selected.card} developer={true} />;
		}
	};

	getCards = (type: string, pack: PackModel) => {
		switch (type) {
			case 'hero species':
				return PackLogic.getHeroSpecies(pack.id)
					.map(s => (
						<button
							key={s.id}
							className={GameLogic.getBalanceIssues(s, CardType.Species).length > 0 ? 'card-btn danger' : 'card-btn'}
							onClick={() => this.setSelected({ type: CardType.Species, card: s })}
						>
							<div className='card-name'>{s.name}</div>
							<StatValue label='Strength' value={GameLogic.getCardStrength(s)} />
							<StatValue label='Actions' value={s.actions.length} />
							{
								s.quirks.length > 0 ?
									<div>
										{s.quirks.map((q, n) => <Tag key={n}>{q}</Tag>)}
									</div>
									: null
							}
							<div className='card-description'>{s.description}</div>
						</button>
					));
			case 'monster species':
				return PackLogic.getMonsterSpecies(pack.id)
					.map(s => (
						<button
							key={s.id}
							className={GameLogic.getBalanceIssues(s, CardType.Species).length > 0 ? 'card-btn danger' : 'card-btn'}
							onClick={() => this.setSelected({ type: CardType.Species, card: s })}
						>
							<div className='card-name'>{s.name}</div>
							<StatValue label='Strength' value={GameLogic.getCardStrength(s)} />
							<StatValue label='Actions' value={s.actions.length} />
							{
								s.quirks.length > 0 ?
									<div>
										{s.quirks.map((q, n) => <Tag key={n}>{q}</Tag>)}
									</div>
									: null
							}
							<div className='card-description'>{s.description}</div>
						</button>
					));
			case 'roles':
				return PackLogic.getRoles(pack.id)
					.map(r => (
						<button
							key={r.id}
							className={GameLogic.getBalanceIssues(r, CardType.Role).length > 0 ? 'card-btn danger' : 'card-btn'}
							onClick={() => this.setSelected({ type: CardType.Role, card: r })}
						>
							<div className='card-name'>{r.name}</div>
							<StatValue label='Strength' value={GameLogic.getCardStrength(r)} />
							<StatValue label='Actions' value={r.actions.length} />
							<div className='card-description'>{r.description}</div>
						</button>
					));
			case 'backgrounds':
				return PackLogic.getBackgrounds(pack.id)
					.map(b => (
						<button
							key={b.id}
							className={GameLogic.getBalanceIssues(b, CardType.Background).length > 0 ? 'card-btn danger' : 'card-btn'}
							onClick={() => this.setSelected({ type: CardType.Background, card: b })}
						>
							<div className='card-name'>{b.name}</div>
							<StatValue label='Strength' value={GameLogic.getCardStrength(b)} />
							<StatValue label='Actions' value={b.actions.length} />
							<div className='card-description'>{b.description}</div>
						</button>
					));
			case 'structures':
				return PackLogic.getStructures(pack.id)
					.map(s => <Text key={s.id} type={TextType.Small}>{s.name}</Text>);
			case 'potions':
				return PackLogic.getPotions(pack.id)
					.map(p => <Text key={p.id} type={TextType.Small}>{p.name}</Text>);
			case 'scrolls':
				return PackLogic.getScrolls(pack.id)
					.map(sc => <Text key={sc.id} type={TextType.Small}>{sc.name}</Text>);
			case 'items':
				return PackLogic.getItems(pack.id)
					.map(i => <Text key={i.id} type={TextType.Small}>{i.name}</Text>);
		}

		return null;
	};

	getCardCount = (type: string) => {
		const packs = PackLogic.getAllPacks();
		switch (type) {
			case 'hero species':
				return packs.flatMap(p => PackLogic.getHeroSpecies(p.id)).length;
			case 'monster species':
				return packs.flatMap(p => PackLogic.getMonsterSpecies(p.id)).length;
			case 'roles':
				return packs.flatMap(p => PackLogic.getRoles(p.id)).length;
			case 'backgrounds':
				return packs.flatMap(p => PackLogic.getBackgrounds(p.id)).length;
			case 'structures':
				return packs.flatMap(p => PackLogic.getStructures(p.id)).length;
			case 'potions':
				return packs.flatMap(p => PackLogic.getPotions(p.id)).length;
			case 'scrolls':
				return packs.flatMap(p => PackLogic.getScrolls(p.id)).length;
			case 'items':
				return packs.flatMap(p => PackLogic.getItems(p.id)).length;
		}

		return 0;
	};

	render = () => {
		const types = [
			'hero species',
			'monster species',
			'roles',
			'backgrounds',
			'structures',
			'potions',
			'scrolls',
			'items'
		];

		const packs = PackLogic.getAllPacks();

		const rows = types.map(type => {
			return (
				<div key={type}>
					<Text type={TextType.SubHeading}>{type} ({this.getCardCount(type)})</Text>
					<div className='row'>
						{
							packs.map(p => {
								return (
									<div key={p.id} className='cell'>
										{this.getCards(type, p)}
									</div>
								);
							})
						}
					</div>
				</div>
			);
		});

		let dialog = null;
		if (this.state.selected) {
			dialog = (
				<Dialog
					content={this.getSelectedModal(this.state.selected)}
					onClose={this.clearSelected}
				/>
			);
		}

		return (
			<div className='card-page'>
				<div className='card-grid-header'>
					<div className='row'>
						{
							packs.map(p => (
								<div key={p.id} className='cell column-heading'>
									<div className='pack-name'>{p.name || 'Skirmish'}</div>
									<StatValue label='Cards' value={PackLogic.getPackCardCount(p.id)} />
									<div className='pack-desc'>{p.description}</div>
								</div>
							))
						}
					</div>
				</div>
				<div className='card-grid-content'>
					{rows}
				</div>
				{dialog}
			</div>
		);
	};
}

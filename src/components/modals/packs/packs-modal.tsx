import { Component } from 'react';

import { BackgroundData } from '../../../data/background-data';
import { HeroSpeciesData } from '../../../data/hero-species-data';
import { ItemData } from '../../../data/item-data';
import { MonsterSpeciesData } from '../../../data/monster-species-data';
import { PotionData } from '../../../data/potion-data';
import { RoleData } from '../../../data/role-data';
import { StructureData } from '../../../data/structure-data';

import { PackLogic } from '../../../logic/pack-logic';

import type { OptionsModel } from '../../../models/options';
import type { PackModel } from '../../../models/pack';

import { BackgroundCard, ItemCard, PackCard, RoleCard, SpeciesCard, StructureCard } from '../../cards';
import { CardList, Dialog, Text, TextType } from '../../controls';

import './packs-modal.scss';

interface Props {
	options: OptionsModel;
	addPacks: () => void;
	addPack: (packID: string) => void;
	removePack: (packID: string) => void;
}

interface State {
	selectedPack: PackModel | null;
}

export class PacksModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedPack: null
		};
	}

	getDialog = () => {
		if (!this.state.selectedPack) {
			return null;
		}

		const packID = this.state.selectedPack.id;

		let owned = null;
		if ((packID !== '') && !this.props.options.packIDs.includes(packID)) {
			owned = (
				<div>
					<Text type={TextType.Information}>
						<p>You <b>do not</b> own this card pack.</p>
					</Text>
					<button className='primary' onClick={() => this.props.addPack(packID)}>
						Get This Pack
					</button>
				</div>
			);
		}

		const heroes = HeroSpeciesData.getList().filter(s => s.packID === packID).map(s => {
			return (
				<SpeciesCard key={s.id} species={s} />
			);
		});

		const monsters = MonsterSpeciesData.getList().filter(s => s.packID === packID).map(s => {
			return (
				<SpeciesCard key={s.id} species={s} />
			);
		});

		const roles = RoleData.getList().filter(r => r.packID === packID).map(r => {
			return (
				<RoleCard key={r.id} role={r} />
			);
		});

		const backgrounds = BackgroundData.getList().filter(b => b.packID === packID).map(b => {
			return (
				<BackgroundCard key={b.id} background={b} />
			);
		});

		const structures = StructureData.getList().filter(s => s.packID === packID).map(s => {
			return (
				<StructureCard key={s.id} structure={s} />
			);
		});

		const items = ItemData.getList().filter(i => i.packID === packID).map(i => {
			return (
				<ItemCard key={i.id} item={i} />
			);
		});

		const potions = PotionData.getList().filter(i => i.packID === packID).map(p => {
			return (
				<ItemCard key={p.id} item={p} />
			);
		});

		return (
			<Dialog
				content={
					<div>
						<Text type={TextType.Heading}>{this.state.selectedPack.name}</Text>
						<hr />
						<Text>
							<p style={{ textAlign: 'center' }}>{this.state.selectedPack.description}</p>
						</Text>
						{owned}
						{heroes.length > 0 ? <hr /> : null}
						{heroes.length > 0 ? <Text type={TextType.MinorHeading}>Hero Species Cards</Text> : null}
						{heroes.length > 0 ? <CardList cards={heroes} /> : null}
						{monsters.length > 0 ? <hr /> : null}
						{monsters.length > 0 ? <Text type={TextType.MinorHeading}>Monster Species Cards</Text> : null}
						{monsters.length > 0 ? <CardList cards={monsters} /> : null}
						{roles.length > 0 ? <hr /> : null}
						{roles.length > 0 ? <Text type={TextType.MinorHeading}>Role Cards</Text> : null}
						{roles.length > 0 ? <CardList cards={roles} /> : null}
						{backgrounds.length > 0 ? <hr /> : null}
						{backgrounds.length > 0 ? <Text type={TextType.MinorHeading}>Background Cards</Text> : null}
						{backgrounds.length > 0 ? <CardList cards={backgrounds} /> : null}
						{structures.length > 0 ? <hr /> : null}
						{structures.length > 0 ? <Text type={TextType.MinorHeading}>Structure Cards</Text> : null}
						{structures.length > 0 ? <CardList cards={structures} /> : null}
						{items.length > 0 ? <hr /> : null}
						{items.length > 0 ? <Text type={TextType.MinorHeading}>Item Cards</Text> : null}
						{items.length > 0 ? <CardList cards={items} /> : null}
						{potions.length > 0 ? <hr /> : null}
						{potions.length > 0 ? <Text type={TextType.MinorHeading}>Potion Cards</Text> : null}
						{potions.length > 0 ? <CardList cards={potions} /> : null}
					</div>
				}
				level={2}
				onClose={() => this.setState({ selectedPack: null })}
			/>
		);
	};

	render = () => {
		try {
			const core = {
				id: '',
				name: 'Skirmish',
				description: 'The core cards for the game, available to all.'
			};

			const owned = PackLogic.getPacks()
				.filter(pack => this.props.options.packIDs.includes(pack.id))
				.map(pack => {
					return (
						<PackCard
							key={pack.id}
							pack={pack}
							onClick={p => this.setState({ selectedPack: p })}
							onRemove={this.props.options.developer ? p => this.props.removePack(p.id) : null}
						/>
					);
				});
			owned.unshift(
				<PackCard key='core' pack={core} onClick={p => this.setState({ selectedPack: p })} />
			);
			const notOwned = PackLogic.getPacks()
				.filter(pack => !this.props.options.packIDs.includes(pack.id))
				.map(pack => {
					return (
						<PackCard
							key={pack.id}
							pack={pack}
							onClick={p => this.setState({ selectedPack: p })}
						/>
					);
				});

			return (
				<div className='packs-modal'>
					<Text type={TextType.Heading}>Card Packs</Text>
					<hr />
					{notOwned.length > 0 ? <Text type={TextType.SubHeading}>Available Packs</Text> : null}
					{
						notOwned.length > 1 ?
							<button className='primary' onClick={() => this.props.addPacks()}>
								Get All Packs
							</button>
							: null
					}
					{notOwned.length > 0 ? <CardList cards={notOwned} /> : null}
					{notOwned.length > 0 ? <hr /> : null}
					<Text type={TextType.SubHeading}>My Packs</Text>
					<CardList cards={owned} />
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='packs-modal render-error' />;
		}
	};
}

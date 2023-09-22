import { Component } from 'react';

import { BackgroundData } from '../../../data/background-data';
import { HeroSpeciesData } from '../../../data/hero-species-data';
import { ItemData } from '../../../data/item-data';
import { MonsterSpeciesData } from '../../../data/monster-species-data';
import { PotionData } from '../../../data/potion-data';
import { RoleData } from '../../../data/role-data';
import { StructureData } from '../../../data/structure-data';

import { GameLogic } from '../../../logic/game-logic';

import type { OptionsModel } from '../../../models/options';
import type { PackModel } from '../../../models/pack';

import { BackgroundCard, ItemCard, PackCard, RoleCard, SpeciesCard, StructureCard } from '../../cards';
import { Badge, CardList, Dialog, Text, TextType } from '../../controls';

import './packs-modal.scss';

interface Props {
	options: OptionsModel;
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

	getBadge = (strength: number) => {
		let value = '';

		if (this.props.options.developer) {
			const scaled = Math.round(strength / 5);
			for (let n = 0; n < scaled; ++n) {
				value += '★';
			}
		}

		return value;
	};

	getDialog = () => {
		if (!this.state.selectedPack) {
			return null;
		}

		const packID = this.state.selectedPack.id;
		const packName = this.state.selectedPack.name;

		let owned = null;
		if ((packID !== '') && !this.props.options.packIDs.includes(packID)) {
			owned = (
				<Text type={TextType.Information}>
					<p>You <b>do not</b> own this card pack.</p>
					<button onClick={() => this.props.addPack(packID)}>Get This Pack</button>
				</Text>
			);
		}

		const heroes = HeroSpeciesData.getList().filter(s => s.packID === packID).map(s => {
			return (
				<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s))}>
					<SpeciesCard species={s} />
				</Badge>
			);
		});

		const monsters = MonsterSpeciesData.getList().filter(s => s.packID === packID).map(s => {
			return (
				<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s))}>
					<SpeciesCard species={s} />
				</Badge>
			);
		});

		const roles = RoleData.getList().filter(r => r.packID === packID).map(r => {
			return (
				<Badge key={r.id} value={this.getBadge(GameLogic.getRoleStrength(r))}>
					<RoleCard role={r} />
				</Badge>
			);
		});

		const backgrounds = BackgroundData.getList().filter(b => b.packID === packID).map(b => {
			return (
				<Badge key={b.id} value={this.getBadge(GameLogic.getBackgroundStrength(b))}>
					<BackgroundCard background={b} />
				</Badge>
			);
		});

		const items = ItemData.getList().filter(i => i.packID === packID).map(i => {
			return (
				<Badge key={i.id} value={0}>
					<ItemCard item={i} />
				</Badge>
			);
		});

		const potions = PotionData.getList().filter(i => i.packID === packID).map(p => {
			return (
				<Badge key={p.id} value={0}>
					<ItemCard item={p} />
				</Badge>
			);
		});

		const structures = StructureData.getList().filter(s => s.packID === packID).map(s => {
			return (
				<Badge key={s.id} value={0}>
					<StructureCard structure={s} />
				</Badge>
			);
		});

		return (
			<Dialog
				content={
					<div>
						<Text type={TextType.Heading}>{packName}</Text>
						{owned !== null ? <hr /> : null}
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
						{items.length > 0 ? <hr /> : null}
						{items.length > 0 ? <Text type={TextType.MinorHeading}>Item Cards</Text> : null}
						{items.length > 0 ? <CardList cards={items} /> : null}
						{potions.length > 0 ? <hr /> : null}
						{potions.length > 0 ? <Text type={TextType.MinorHeading}>Potion Cards</Text> : null}
						{potions.length > 0 ? <CardList cards={potions} /> : null}
						{structures.length > 0 ? <hr /> : null}
						{structures.length > 0 ? <Text type={TextType.MinorHeading}>Structure Cards</Text> : null}
						{structures.length > 0 ? <CardList cards={structures} /> : null}
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

			const owned = GameLogic.getPacks()
				.filter(pack => this.props.options.packIDs.includes(pack.id))
				.map(pack => {
					return (
						<Badge key={pack.id} value={this.getBadge(GameLogic.getPackStrength(pack))}>
							<PackCard
								pack={pack}
								onClick={p => this.setState({ selectedPack: p })}
								onRemove={this.props.options.developer ? p => this.props.removePack(p.id) : null}
							/>
						</Badge>
					);
				});
			owned.unshift(
				<PackCard key='core' pack={core} onClick={p => this.setState({ selectedPack: p })} />
			);
			const notOwned = GameLogic.getPacks()
				.filter(pack => !this.props.options.packIDs.includes(pack.id))
				.map(pack => {
					return (
						<Badge key={pack.id} value={this.getBadge(GameLogic.getPackStrength(pack))}>
							<PackCard
								pack={pack}
								onClick={p => this.setState({ selectedPack: p })}
							/>
						</Badge>
					);
				});

			return (
				<div className='packs-modal'>
					<Text type={TextType.Heading}>Card Packs</Text>
					<hr />
					{notOwned.length > 0 ? <Text type={TextType.SubHeading}>Available Packs</Text> : null}
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

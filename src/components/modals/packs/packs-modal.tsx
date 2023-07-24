import { Component } from 'react';
import { IconCards } from '@tabler/icons-react';

import { BackgroundData } from '../../../data/background-data';
import { HeroSpeciesData } from '../../../data/hero-species-data';
import { ItemData } from '../../../data/item-data';
import { MonsterSpeciesData } from '../../../data/monster-species-data';
import { RoleData } from '../../../data/role-data';

import { GameLogic } from '../../../logic/game-logic';

import type { OptionsModel } from '../../../models/options';
import type { PackModel } from '../../../models/pack';

import { BackgroundCard, ItemCard, PackCard, RoleCard, SpeciesCard } from '../../cards';
import { Badge, CardList, StatValue, Text, TextType } from '../../controls';

import './packs-modal.scss';

interface Props {
	options: OptionsModel;
	addPack: (packID: string) => void;
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

	addPack = (pack: PackModel | null) => {
		if (pack) {
			this.props.addPack(pack.id);
		}
	};

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

	getPackButton = (pack: PackModel | null) => {
		let className = 'pack-button';
		if (pack === this.state.selectedPack) {
			className += ' selected';
		}

		return (
			<div className={className} onClick={() => this.setState({ selectedPack: pack })}>
				<div className='pack-info'>
					<Text type={TextType.MinorHeading}>{pack ? pack.name : 'Core Game'}</Text>
					<div className='pack-count'>
						<StatValue label='Cards' value={GameLogic.getPackCardCount(pack ? pack.id : '')} />
					</div>
				</div>
				<IconCards />
			</div>
		);
	};

	getPackList = () => {
		const owned = GameLogic.getPacks()
			.filter(pack => this.props.options.packIDs.includes(pack.id))
			.map((pack, n) => <div key={n}>{this.getPackButton(pack)}</div>);
		const notOwned = GameLogic.getPacks()
			.filter(pack => !this.props.options.packIDs.includes(pack.id))
			.map((pack, n) => <div key={n}>{this.getPackButton(pack)}</div>);

		return (
			<div className='packs-sidebar'>
				<Text type={TextType.SubHeading}>Available Packs</Text>
				{notOwned}
				{notOwned.length === 0 ? <Text type={TextType.Small}>None.</Text> : null}
				<hr />
				<Text type={TextType.SubHeading}>My Packs</Text>
				{owned}
				{owned.length === 0 ? <Text type={TextType.Small}>None.</Text> : null}
			</div>
		);
	};

	getPackContent = () => {
		if (!this.state.selectedPack) {
			return (
				<div key='empty' className='pack-content'>
					<Text>Packs provide additional options - more species cards (for heroes and monsters), role cards, and background cards.</Text>
					<Text>Select a pack from the list on the left.</Text>
				</div>
			);
		}

		let owned = null;
		if (!this.props.options.packIDs.includes(this.state.selectedPack.id)) {
			owned = (
				<Text type={TextType.Information}>
					<p>You <b>do not</b> own this pack.</p>
					<button onClick={() => this.addPack(this.state.selectedPack)}>Get This Pack</button>
				</Text>
			);
		}

		const heroes = HeroSpeciesData.getList().filter(s => s.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(s => {
			return (
				<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s))}>
					<SpeciesCard species={s} />
				</Badge>
			);
		});

		const monsters = MonsterSpeciesData.getList().filter(s => s.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(s => {
			return (
				<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s))}>
					<SpeciesCard species={s} />
				</Badge>
			);
		});

		const roles = RoleData.getList().filter(r => r.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(r => {
			return (
				<Badge key={r.id} value={this.getBadge(GameLogic.getRoleStrength(r))}>
					<RoleCard role={r} />
				</Badge>
			);
		});

		const backgrounds = BackgroundData.getList().filter(b => b.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(b => {
			return (
				<Badge key={b.id} value={this.getBadge(GameLogic.getBackgroundStrength(b))}>
					<BackgroundCard background={b} />
				</Badge>
			);
		});

		const items = ItemData.getList().filter(i => i.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(i => {
			return (
				<Badge key={i.id} value={0}>
					<ItemCard item={i} />
				</Badge>
			);
		});

		return (
			<div key={this.state.selectedPack.id} className='pack-content'>
				{owned}
				{owned ? <hr /> : null}
				<div className='pack-card-section'>
					<PackCard pack={this.state.selectedPack} />
				</div>
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
			</div>
		);
	};

	render = () => {
		try {
			return (
				<div className='packs-modal'>
					<Text type={TextType.Heading}>Packs</Text>
					<hr />
					<div className='packs-modal-content'>
						{this.getPackList()}
						{this.getPackContent()}
					</div>
				</div>
			);
		} catch {
			return <div className='packs-modal render-error' />;
		}
	};
}

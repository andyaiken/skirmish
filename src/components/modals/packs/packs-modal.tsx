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
import { CardList, StatValue, Text, TextType } from '../../controls';

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

	getPackButton = (pack: PackModel | null) => {
		let className = 'pack-button';
		if (pack === this.state.selectedPack) {
			className += ' selected';
		}

		return (
			<div className={className} onClick={() => this.setState({ selectedPack: pack })}>
				<Text type={TextType.MinorHeading}>{pack ? pack.name : 'Core Game'}</Text>
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
				<div key='empty' className='pack-content empty'>
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
				<div key={s.id}>
					<SpeciesCard species={s} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
				</div>
			);
		});

		const monsters = MonsterSpeciesData.getList().filter(s => s.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(s => {
			return (
				<div key={s.id}>
					<SpeciesCard species={s} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
				</div>
			);
		});

		const roles = RoleData.getList().filter(r => r.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(r => {
			return (
				<div key={r.id}>
					<RoleCard role={r} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getRoleStrength(r)} /> : null}
				</div>
			);
		});

		const backgrounds = BackgroundData.getList().filter(b => b.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(b => {
			return (
				<div key={b.id}>
					<BackgroundCard background={b} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getBackgroundStrength(b)} /> : null}
				</div>
			);
		});

		const items = ItemData.getList().filter(i => i.packID === (this.state.selectedPack ? this.state.selectedPack.id : '')).map(i => {
			return (
				<div key={i.id}>
					<ItemCard item={i} />
				</div>
			);
		});

		return (
			<div className='pack-content'>
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

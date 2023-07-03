import { Component } from 'react';

import { BackgroundData } from '../../../../data/background-data';
import { HeroSpeciesData } from '../../../../data/hero-species-data';
import { ItemData } from '../../../../data/item-data';
import { MonsterSpeciesData } from '../../../../data/monster-species-data';
import { RoleData } from '../../../../data/role-data';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel } from '../../../../models/action';
import type { FeatureModel } from '../../../../models/feature';
import type { OptionsModel } from '../../../../models/options';

import { BackgroundCard, ItemCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, StatValue, Text, TextType } from '../../../controls';

import './packs-tab.scss';

interface Props {
	options: OptionsModel;
	addPack: (pack: string) => void;
	setActions: (source: string, type: CardType, features: FeatureModel[], actions: ActionModel[]) => void;
}

interface State {
	selectedPack: string;
}

export class PacksTab extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedPack: ''
		};
	}

	getPackList = () => {
		const owned = GameLogic.getPacks().filter(p => this.props.options.packs.includes(p)).map((p, n) => <button key={n} onClick={() => this.setState({ selectedPack: p })}>{p}</button>);
		const notOwned = GameLogic.getPacks().filter(p => !this.props.options.packs.includes(p)).map((p, n) => <button key={n} onClick={() => this.setState({ selectedPack: p })}>{p}</button>);

		return (
			<div className='packs-sidebar'>
				<Text type={TextType.SubHeading}>My Packs</Text>
				{owned}
				{owned.length === 0 ? <Text type={TextType.Small}>None</Text> : null}
				<Text type={TextType.SubHeading}>Other Packs</Text>
				{notOwned}
				{notOwned.length === 0 ? <Text type={TextType.Small}>None</Text> : null}
			</div>
		);
	};

	getPackContent = () => {
		if (this.state.selectedPack === '') {
			return (
				<div key='empty' className='pack-content'>
					<Text>Select a pack from the list on the left.</Text>
				</div>
			);
		}

		let owned = null;
		if ((this.state.selectedPack !== '') && !this.props.options.packs.includes(this.state.selectedPack)) {
			owned = (
				<Text type={TextType.Information}>
					<p>You <b>do not</b> own this pack.</p>
					<button onClick={() => this.props.addPack(this.state.selectedPack)}>Get This Pack</button>
				</Text>
			);
		}

		const heroes = HeroSpeciesData.getList().filter(s => s.pack === this.state.selectedPack).map(s => {
			return (
				<div key={s.id}>
					<SpeciesCard species={s} onSelect={species => this.props.setActions(species.name, CardType.Species, species.features, species.actions)} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
				</div>
			);
		});

		const monsters = MonsterSpeciesData.getList().filter(s => s.pack === this.state.selectedPack).map(s => {
			return (
				<div key={s.id}>
					<SpeciesCard species={s} onSelect={species => this.props.setActions(species.name, CardType.Species, species.features, species.actions)} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
				</div>
			);
		});

		const roles = RoleData.getList().filter(r => r.pack === this.state.selectedPack).map(r => {
			return (
				<div key={r.id}>
					<RoleCard role={r} onSelect={role => this.props.setActions(role.name, CardType.Role, role.features, role.actions)} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getRoleStrength(r)} /> : null}
				</div>
			);
		});

		const backgrounds = BackgroundData.getList().filter(b => b.pack === this.state.selectedPack).map(b => {
			return (
				<div key={b.id}>
					<BackgroundCard background={b} onSelect={background => this.props.setActions(background.name, CardType.Background, background.features, background.actions)} />
					{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getBackgroundStrength(b)} /> : null}
				</div>
			);
		});

		const items = ItemData.getList().filter(i => i.pack === this.state.selectedPack).map(i => {
			return (
				<div key={i.id}>
					<ItemCard item={i} />
				</div>
			);
		});

		return (
			<div className='pack-content'>
				{owned}
				<Text type={TextType.SubHeading}>{this.state.selectedPack}</Text>
				<Text>The <b>{this.state.selectedPack}</b> pack contains the following cards.</Text>
				<hr />
				<Text type={TextType.MinorHeading}>Hero Species Cards</Text>
				{heroes.length > 0 ? <CardList cards={heroes} /> : null}
				{heroes.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
				<hr />
				<Text type={TextType.MinorHeading}>Monster Species Cards</Text>
				{monsters.length > 0 ? <CardList cards={monsters} /> : null}
				{monsters.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
				<hr />
				<Text type={TextType.MinorHeading}>Role Cards</Text>
				{roles.length > 0 ? <CardList cards={roles} /> : null}
				{roles.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
				<hr />
				<Text type={TextType.MinorHeading}>Background Cards</Text>
				{backgrounds.length > 0 ? <CardList cards={backgrounds} /> : null}
				{backgrounds.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
				<hr />
				<Text type={TextType.MinorHeading}>Item Cards</Text>
				{items.length > 0 ? <CardList cards={items} /> : null}
				{items.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
			</div>
		);
	};

	render = () => {
		try {
			return (
				<div className='packs-tab'>
					{this.getPackList()}
					{this.getPackContent()}
				</div>
			);
		} catch {
			return <div className='packs-tab render-error' />;
		}
	};
}

import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel } from '../../../../models/action';
import type { FeatureModel } from '../../../../models/feature';
import type { OptionsModel } from '../../../../models/options';

import { BackgroundCard, ItemCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, StatValue, Text, TextType } from '../../../controls';

import './decks-tab.scss';

interface Props {
	options: OptionsModel;
	setActions: (source: string, type: CardType, features: FeatureModel[], actions: ActionModel[]) => void;
}

export class DecksTab extends Component<Props> {
	render = () => {
		try {
			const heroes = GameLogic.getHeroSpeciesDeck(this.props.options.packs).map(s => {
				return (
					<div key={s.id}>
						<SpeciesCard species={s} onSelect={species => this.props.setActions(species.name, CardType.Species, species.features, species.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
					</div>
				);
			});

			const monsters = GameLogic.getMonsterSpeciesDeck(this.props.options.packs).map(s => {
				return (
					<div key={s.id}>
						<SpeciesCard species={s} onSelect={species => this.props.setActions(species.name, CardType.Species, species.features, species.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
					</div>
				);
			});

			const roles = GameLogic.getRoleDeck(this.props.options.packs).map(r => {
				return (
					<div key={r.id}>
						<RoleCard role={r} onSelect={role => this.props.setActions(role.name, CardType.Role, role.features, role.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getRoleStrength(r)} /> : null}
					</div>
				);
			});

			const backgrounds = GameLogic.getBackgroundDeck(this.props.options.packs).map(b => {
				return (
					<div key={b.id}>
						<BackgroundCard background={b} onSelect={background => this.props.setActions(background.name, CardType.Background, background.features, background.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getBackgroundStrength(b)} /> : null}
					</div>
				);
			});

			const items = GameLogic.getItemDeck(this.props.options.packs).map(i => {
				return (
					<div key={i.id}>
						<ItemCard item={i} />
					</div>
				);
			});

			return (
				<div className='decks-tab'>
					<Text type={TextType.SubHeading}>Hero Species Cards</Text>
					{heroes.length > 0 ? <CardList cards={heroes} /> : null}
					{heroes.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Monster Species Cards</Text>
					{monsters.length > 0 ? <CardList cards={monsters} /> : null}
					{monsters.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Role Cards</Text>
					{roles.length > 0 ? <CardList cards={roles} /> : null}
					{roles.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Background Cards</Text>
					{backgrounds.length > 0 ? <CardList cards={backgrounds} /> : null}
					{backgrounds.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Item Cards</Text>
					{items.length > 0 ? <CardList cards={items} /> : null}
					{items.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
				</div>
			);
		} catch {
			return <div className='decks-tab render-error' />;
		}
	};
}

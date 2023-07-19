import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel } from '../../../../models/action';
import type { FeatureModel } from '../../../../models/feature';
import type { OptionsModel } from '../../../../models/options';

import { ActionCard, BackgroundCard, FeatureCard, ItemCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, Dialog, StatValue, Text, TextType } from '../../../controls';

import './decks-tab.scss';

interface Props {
	options: OptionsModel;
}

interface State {
	selected: { name: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[] } | null;
}

export class DecksTab extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selected: null
		};
	}

	setActions = (name: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[]) => {
		this.setState({
			selected: {
				name: name,
				type: type,
				starting: starting,
				features: features,
				actions: actions
			}
		});
	};

	clearActions = () => {
		this.setState({
			selected: null
		});
	};

	render = () => {
		try {
			const heroes = GameLogic.getHeroSpeciesDeck(this.props.options.packIDs).map(s => {
				return (
					<div key={s.id}>
						<SpeciesCard species={s} onSelect={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
					</div>
				);
			});

			const monsters = GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs).map(s => {
				return (
					<div key={s.id}>
						<SpeciesCard species={s} onSelect={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
					</div>
				);
			});

			const roles = GameLogic.getRoleDeck(this.props.options.packIDs).map(r => {
				return (
					<div key={r.id}>
						<RoleCard role={r} onSelect={role => this.setActions(role.name, CardType.Role, role.startingFeatures, role.features, role.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getRoleStrength(r)} /> : null}
					</div>
				);
			});

			const backgrounds = GameLogic.getBackgroundDeck(this.props.options.packIDs).map(b => {
				return (
					<div key={b.id}>
						<BackgroundCard background={b} onSelect={bg => this.setActions(bg.name, CardType.Background, bg.startingFeatures, bg.features, bg.actions)} />
						{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getBackgroundStrength(b)} /> : null}
					</div>
				);
			});

			const items = GameLogic.getItemDeck(this.props.options.packIDs).map(i => {
				return (
					<div key={i.id}>
						<ItemCard item={i} />
					</div>
				);
			});

			let dialog = null;
			if (this.state.selected) {
				const source = this.state.selected.name;
				const type = this.state.selected.type;

				const startingCards = this.state.selected.starting.map(f => {
					return (
						<div key={f.id}>
							<FeatureCard
								feature={f}
								footer={source}
								footerType={type}
							/>
							{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getFeatureStrength(f)} /> : null}
						</div>
					);
				});
				const featureCards = this.state.selected.features.map(f => {
					return (
						<div key={f.id}>
							<FeatureCard
								feature={f}
								footer={source}
								footerType={type}
							/>
							{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getFeatureStrength(f)} /> : null}
						</div>
					);
				});
				const actionCards = this.state.selected.actions.map(a => {
					return (
						<div key={a.id}>
							<ActionCard
								action={a}
								footer={source}
								footerType={type}
							/>
							{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getActionStrength(a)} /> : null}
						</div>
					);
				});
				const content = (
					<div>
						<Text type={TextType.Heading}>{this.state.selected.name}</Text>
						{startingCards.length > 0 ? <hr /> : null}
						{startingCards.length > 0 ? <Text type={TextType.SubHeading}>Starting Cards</Text> : null}
						{startingCards.length > 0 ? <CardList cards={startingCards} /> : null}
						{featureCards.length > 0 ? <hr /> : null}
						{featureCards.length > 0 ? <Text type={TextType.SubHeading}>Feature Cards</Text> : null}
						{featureCards.length > 0 ? <CardList cards={featureCards} /> : null}
						{actionCards.length > 0 ? <hr /> : null}
						{actionCards.length > 0 ? <Text type={TextType.SubHeading}>Action Cards</Text> : null}
						{actionCards.length > 0 ? <CardList cards={actionCards} /> : null}
					</div>
				);
				dialog = (
					<Dialog
						content={content}
						level={2}
						onClose={() => this.setState({ selected: null })}
					/>
				);
			}

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
					{dialog}
				</div>
			);
		} catch {
			return <div className='decks-tab render-error' />;
		}
	};
}

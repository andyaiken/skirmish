import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel } from '../../../../models/action';
import type { FeatureModel } from '../../../../models/feature';
import type { OptionsModel } from '../../../../models/options';

import { ActionCard, BackgroundCard, FeatureCard, ItemCard, RoleCard, SpeciesCard } from '../../../cards';
import { Badge, CardList, Dialog, Switch, Text, TextType } from '../../../controls';

import './decks-tab.scss';

interface Props {
	options: OptionsModel;
}

interface State {
	showCoreOnly: boolean;
	selected: { name: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[] } | null;
}

export class DecksTab extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showCoreOnly: false,
			selected: null
		};
	}

	setCoreOnly = (value: boolean) => {
		this.setState({
			showCoreOnly: value
		});
	};

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

	getBadge = (packID: string, strength: number) => {
		let value = '';

		if (this.props.options.developer) {
			const scaled = Math.round(strength / 5);
			for (let n = 0; n < scaled; ++n) {
				value += '★';
			}
		} else {
			const pack = GameLogic.getPack(packID);
			if (pack) {
				value = pack.name;
			}
		}

		return value;
	};

	render = () => {
		try {
			const heroes = GameLogic.getHeroSpeciesDeck(this.props.options.packIDs)
				.filter(s => (s.packID === '') || !this.state.showCoreOnly)
				.map(s => {
					return (
						<Badge key={s.id} value={this.getBadge(s.packID, GameLogic.getSpeciesStrength(s))}>
							<SpeciesCard species={s} onSelect={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
						</Badge>
					);
				});

			const monsters = GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs)
				.filter(s => (s.packID === '') || !this.state.showCoreOnly)
				.map(s => {
					return (
						<Badge key={s.id} value={this.getBadge(s.packID, GameLogic.getSpeciesStrength(s))}>
							<SpeciesCard species={s} onSelect={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
						</Badge>
					);
				});

			const roles = GameLogic.getRoleDeck(this.props.options.packIDs)
				.filter(s => (s.packID === '') || !this.state.showCoreOnly)
				.map(r => {
					return (
						<Badge key={r.id} value={this.getBadge(r.packID, GameLogic.getRoleStrength(r))}>
							<RoleCard role={r} onSelect={role => this.setActions(role.name, CardType.Role, role.startingFeatures, role.features, role.actions)} />
						</Badge>
					);
				});

			const backgrounds = GameLogic.getBackgroundDeck(this.props.options.packIDs)
				.filter(s => (s.packID === '') || !this.state.showCoreOnly)
				.map(b => {
					return (
						<Badge key={b.id} value={this.getBadge(b.packID, GameLogic.getBackgroundStrength(b))}>
							<BackgroundCard background={b} onSelect={bg => this.setActions(bg.name, CardType.Background, bg.startingFeatures, bg.features, bg.actions)} />
						</Badge>
					);
				});

			const items = GameLogic.getItemDeck(this.props.options.packIDs)
				.filter(s => (s.packID === '') || !this.state.showCoreOnly)
				.map(i => {
					return (
						<Badge key={i.id} value={this.getBadge(i.packID, 0)}>
							<ItemCard item={i} />
						</Badge>
					);
				});

			let dialog = null;
			if (this.state.selected) {
				const source = this.state.selected.name;
				const type = this.state.selected.type;

				const startingCards = this.state.selected.starting.map(f => {
					return (
						<Badge key={f.id} value={this.props.options.developer ? GameLogic.getFeatureStrength(f) : 0}>
							<FeatureCard
								feature={f}
								footer={source}
								footerType={type}
							/>
						</Badge>
					);
				});
				const featureCards = this.state.selected.features.map(f => {
					return (
						<Badge key={f.id} value={this.props.options.developer ? GameLogic.getFeatureStrength(f) : 0}>
							<FeatureCard
								feature={f}
								footer={source}
								footerType={type}
							/>
						</Badge>
					);
				});
				const actionCards = this.state.selected.actions.map(a => {
					return (
						<Badge key={a.id} value={this.props.options.developer ? GameLogic.getActionStrength(a) : 0}>
							<ActionCard
								action={a}
								footer={source}
								footerType={type}
							/>
						</Badge>
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
					{this.props.options.developer ? <Switch label='Show core cards only' checked={this.state.showCoreOnly} onChange={value => this.setCoreOnly(value)} /> : null}
					{this.props.options.developer ? <hr /> : null}
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

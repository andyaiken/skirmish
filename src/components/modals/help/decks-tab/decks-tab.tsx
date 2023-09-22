import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel } from '../../../../models/action';
import type { FeatureModel } from '../../../../models/feature';
import type { OptionsModel } from '../../../../models/options';

import { ActionCard, BackgroundCard, FeatureCard, ItemCard, RoleCard, SpeciesCard, StructureCard } from '../../../cards';
import { Badge, CardList, Dialog, Text, TextType } from '../../../controls';

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

	getBadge = (strength: number, scale: number, packID = '') => {
		let value = '';

		if (this.props.options.developer) {
			const scaled = Math.round(strength / scale);
			value = value.padEnd(scaled, '★');
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
				.map(s => {
					return (
						<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s), 5, s.packID)}>
							<SpeciesCard species={s} onClick={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
						</Badge>
					);
				});

			const monsters = GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs)
				.map(s => {
					return (
						<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s), 5, s.packID)}>
							<SpeciesCard species={s} onClick={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
						</Badge>
					);
				});

			const roles = GameLogic.getRoleDeck(this.props.options.packIDs)
				.map(r => {
					return (
						<Badge key={r.id} value={this.getBadge(GameLogic.getRoleStrength(r), 5, r.packID)}>
							<RoleCard role={r} onClick={role => this.setActions(role.name, CardType.Role, role.startingFeatures, role.features, role.actions)} />
						</Badge>
					);
				});

			const backgrounds = GameLogic.getBackgroundDeck(this.props.options.packIDs)
				.map(b => {
					return (
						<Badge key={b.id} value={this.getBadge(GameLogic.getBackgroundStrength(b), 5, b.packID)}>
							<BackgroundCard background={b} onClick={bg => this.setActions(bg.name, CardType.Background, bg.startingFeatures, bg.features, bg.actions)} />
						</Badge>
					);
				});

			const items = GameLogic.getItemDeck(this.props.options.packIDs)
				.map(i => {
					return (
						<ItemCard key={i.id} item={i} />
					);
				});

			const potions = GameLogic.getPotionDeck(this.props.options.packIDs)
				.map(p => {
					return (
						<ItemCard key={p.id} item={p} />
					);
				});

			const structures = GameLogic.getStructureDeck(this.props.options.packIDs)
				.map(s => {
					return (
						<StructureCard key={s.id} structure={s} />
					);
				});

			let dialog = null;
			if (this.state.selected) {
				const source = this.state.selected.name;
				const type = this.state.selected.type;

				const startingCards = this.state.selected.starting.map(f => {
					return (
						<Badge key={f.id} value={this.getBadge(GameLogic.getFeatureStrength(f), 2)}>
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
						<Badge key={f.id} value={this.getBadge(GameLogic.getFeatureStrength(f), 2)}>
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
						<Badge key={a.id} value={this.getBadge(GameLogic.getActionStrength(a), 3)}>
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
					{this.props.options.developer ? <hr /> : null}
					<Text type={TextType.SubHeading}>Hero Species Cards ({heroes.length})</Text>
					{heroes.length > 0 ? <CardList cards={heroes} /> : null}
					{heroes.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Monster Species Cards ({monsters.length})</Text>
					{monsters.length > 0 ? <CardList cards={monsters} /> : null}
					{monsters.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Role Cards ({roles.length})</Text>
					{roles.length > 0 ? <CardList cards={roles} /> : null}
					{roles.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Background Cards ({backgrounds.length})</Text>
					{backgrounds.length > 0 ? <CardList cards={backgrounds} /> : null}
					{backgrounds.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Item Cards ({items.length})</Text>
					{items.length > 0 ? <CardList cards={items} /> : null}
					{items.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Potion Cards ({potions.length})</Text>
					{potions.length > 0 ? <CardList cards={potions} /> : null}
					{potions.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					<hr />
					<Text type={TextType.SubHeading}>Structure Cards ({structures.length})</Text>
					{structures.length > 0 ? <CardList cards={structures} /> : null}
					{structures.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					{dialog}
				</div>
			);
		} catch {
			return <div className='decks-tab render-error' />;
		}
	};
}

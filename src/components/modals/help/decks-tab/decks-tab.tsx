import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { ActionModel } from '../../../../models/action';
import type { FeatureModel } from '../../../../models/feature';
import type { OptionsModel } from '../../../../models/options';

import { ActionCard, BackgroundCard, FeatureCard, ItemCard, RoleCard, SpeciesCard, StructureCard } from '../../../cards';
import { Badge, CardList, Dialog, Selector, Text, TextType } from '../../../controls';

import './decks-tab.scss';

interface Props {
	options: OptionsModel;
}

interface State {
	tab: string;
	selected: { name: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[] } | null;
}

export class DecksTab extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			tab: 'heroes',
			selected: null
		};
	}

	setTab = (tab: string) => {
		this.setState({
			tab: tab
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

	getBadge = (strength: number, scale: number, packID = '') => {
		let value = '';

		if (this.props.options.developer) {
			const scaled = Math.round(strength / scale);
			value = value.padEnd(scaled, '★');
		}

		if ((value === '') && (packID !== '')) {
			const pack = GameLogic.getPack(packID);
			if (pack) {
				value = pack.name;
			}
		}

		return value;
	};

	render = () => {
		try {
			const cards: JSX.Element[] = [];

			switch (this.state.tab) {
				case 'heroes':
					GameLogic.getHeroSpeciesDeck(this.props.options.packIDs)
						.forEach(s => {
							cards.push(
								<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s), 5, s.packID)}>
									<SpeciesCard species={s} onClick={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
								</Badge>
							);
						});
					break;
				case 'monsters':
					GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs)
						.forEach(s => {
							cards.push(
								<Badge key={s.id} value={this.getBadge(GameLogic.getSpeciesStrength(s), 5, s.packID)}>
									<SpeciesCard species={s} onClick={species => this.setActions(species.name, CardType.Species, species.startingFeatures, species.features, species.actions)} />
								</Badge>
							);
						});
					break;
				case 'roles':
					GameLogic.getRoleDeck(this.props.options.packIDs)
						.forEach(r => {
							cards.push(
								<Badge key={r.id} value={this.getBadge(GameLogic.getRoleStrength(r), 5, r.packID)}>
									<RoleCard role={r} onClick={role => this.setActions(role.name, CardType.Role, role.startingFeatures, role.features, role.actions)} />
								</Badge>
							);
						});
					break;
				case 'backgrounds':
					GameLogic.getBackgroundDeck(this.props.options.packIDs)
						.forEach(b => {
							cards.push(
								<Badge key={b.id} value={this.getBadge(GameLogic.getBackgroundStrength(b), 5, b.packID)}>
									<BackgroundCard background={b} onClick={bg => this.setActions(bg.name, CardType.Background, bg.startingFeatures, bg.features, bg.actions)} />
								</Badge>
							);
						});
					break;
				case 'structures':
					GameLogic.getStructureDeck(this.props.options.packIDs)
						.forEach(s => {
							cards.push(
								<Badge key={s.id} value={this.getBadge(0, 5, s.packID)}>
									<StructureCard structure={s} />
								</Badge>
							);
						});
					break;
				case 'items':
					GameLogic.getItemDeck(this.props.options.packIDs)
						.forEach(i => {
							cards.push(
								<Badge key={i.id} value={this.getBadge(0, 5, i.packID)}>
									<ItemCard item={i} />
								</Badge>
							);
						});
					break;
				case 'potions':
					GameLogic.getPotionDeck(this.props.options.packIDs)
						.forEach(p => {
							cards.push(
								<Badge key={p.id} value={this.getBadge(0, 5, p.packID)}>
									<ItemCard item={p} />
								</Badge>
							);
						});
					break;
			}

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
					<Selector
						options={[
							{ id: 'heroes', display: 'Heroes' },
							{ id: 'monsters', display: 'Species' },
							{ id: 'roles', display: 'Roles' },
							{ id: 'backgrounds', display: 'Backgrounds' },
							{ id: 'structures', display: 'Structures' },
							{ id: 'items', display: 'Items' },
							{ id: 'potions', display: 'Potions' }
						]}
						selectedID={this.state.tab}
						onSelect={this.setTab}
					/>
					{cards.length > 0 ? <CardList cards={cards} /> : null}
					{cards.length > 0 ? null : <Text type={TextType.Small}>None.</Text>}
					{dialog}
				</div>
			);
		} catch {
			return <div className='decks-tab render-error' />;
		}
	};
}

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
	selected: { name: string, description: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[] } | null;
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

	setActions = (name: string, description: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[]) => {
		this.setState({
			selected: {
				name: name,
				description: description,
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

	getBadge = (packID: string) => {
		const pack = GameLogic.getPack(packID);
		if (pack) {
			return pack.name;
		}

		return '';
	};

	render = () => {
		try {
			const cards: JSX.Element[] = [];

			switch (this.state.tab) {
				case 'heroes':
					GameLogic.getHeroSpeciesDeck(this.props.options.packIDs)
						.forEach(s => {
							cards.push(
								<Badge key={s.id} value={this.getBadge(s.packID)}>
									<SpeciesCard species={s} onClick={s => this.setActions(s.name, s.description, CardType.Species, s.startingFeatures, s.features, s.actions)} />
								</Badge>
							);
						});
					break;
				case 'monsters':
					GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs)
						.forEach(s => {
							cards.push(
								<Badge key={s.id} value={this.getBadge(s.packID)}>
									<SpeciesCard species={s} onClick={s => this.setActions(s.name, s.description, CardType.Species, s.startingFeatures, s.features, s.actions)} />
								</Badge>
							);
						});
					break;
				case 'roles':
					GameLogic.getRoleDeck(this.props.options.packIDs)
						.forEach(r => {
							cards.push(
								<Badge key={r.id} value={this.getBadge(r.packID)}>
									<RoleCard role={r} onClick={r => this.setActions(r.name, r.description, CardType.Role, r.startingFeatures, r.features, r.actions)} />
								</Badge>
							);
						});
					break;
				case 'backgrounds':
					GameLogic.getBackgroundDeck(this.props.options.packIDs)
						.forEach(b => {
							cards.push(
								<Badge key={b.id} value={this.getBadge(b.packID)}>
									<BackgroundCard background={b} onClick={b => this.setActions(b.name, b.description, CardType.Background, b.startingFeatures, b.features, b.actions)} />
								</Badge>
							);
						});
					break;
				case 'structures':
					GameLogic.getStructureDeck(this.props.options.packIDs)
						.forEach(s => {
							cards.push(
								<Badge key={s.id} value={this.getBadge(s.packID)}>
									<StructureCard structure={s} />
								</Badge>
							);
						});
					break;
				case 'items':
					GameLogic.getItemDeck(this.props.options.packIDs)
						.forEach(i => {
							cards.push(
								<Badge key={i.id} value={this.getBadge(i.packID)}>
									<ItemCard item={i} />
								</Badge>
							);
						});
					break;
				case 'potions':
					GameLogic.getPotionDeck(this.props.options.packIDs)
						.forEach(p => {
							cards.push(
								<Badge key={p.id} value={this.getBadge(p.packID)}>
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
						<Badge key={f.id} value=''>
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
						<Badge key={f.id} value=''>
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
						<Badge key={a.id} value=''>
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
						<hr />
						<Text>
							<p style={{ textAlign: 'center' }}>{this.state.selected.description}</p>
						</Text>
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
						onClose={this.clearActions}
					/>
				);
			}

			return (
				<div className='decks-tab'>
					<Selector
						options={[
							{ id: 'heroes', display: 'Heroes' },
							{ id: 'monsters', display: 'Monsters' },
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

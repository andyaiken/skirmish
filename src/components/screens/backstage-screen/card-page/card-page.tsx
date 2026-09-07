import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game/game-logic';
import { PackLogic } from '../../../../logic/pack/pack-logic';

import type { ActionModel } from '../../../../models/action';
import type { FeatureModel } from '../../../../models/feature';
import type { OptionsModel } from '../../../../models/options';
import type { PackModel } from '../../../../models/pack';

import { ActionCard, FeatureCard } from '../../../cards';
import { Badge, CardList, Dialog, StatValue, Tag, Text, TextType } from '../../../controls';

import './card-page.scss';

interface Props {
	options: OptionsModel
}

interface State {
	selected: { name: string, description: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[], deathActions: ActionModel[] } | null;
}

export class CardPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selected: null
		};
	}

	setActions = (name: string, description: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[], deathActions: ActionModel[]) => {
		this.setState({
			selected: {
				name: name,
				description: description,
				type: type,
				starting: starting,
				features: features,
				actions: actions,
				deathActions: deathActions
			}
		});
	};

	clearActions = () => {
		this.setState({
			selected: null
		});
	};

	getMarked = (card: { name: string, features: FeatureModel[], actions: ActionModel[] }, strength: number, band: { min: number, max: number }) => {
		if ((strength < band.min) || (strength > band.max)) {
			return true;
		}

		const actionBand = GameLogic.strengthBands.action;
		if (card.actions.some(a => (GameLogic.getActionStrength(a) < actionBand.min) || (GameLogic.getActionStrength(a) > actionBand.max))) {
			return true;
		}

		/*
		// Check if any attack action uses a skill we don't have a feature bonus for
		const usedSkills: SkillType[] = [];
		card.actions.forEach(a => {
			a.effects
				.filter(e => e.id === 'attack')
				.forEach(e => {
					const attack = e.data as { skill: SkillType };
					if (!usedSkills.includes(attack.skill)) {
						usedSkills.push(attack.skill);
					}
				});
		});
		const bonusSkills: SkillType[] = [];
		card.features.filter(f => f.type === FeatureType.Skill).forEach(f => {
			if (!bonusSkills.includes(f.skill)) {
				bonusSkills.push(f.skill);
			}
		});
		const missingSkills: SkillType[] = usedSkills.filter(skill => !bonusSkills.includes(skill));
		if (missingSkills.length > 0) {
			console.log(card.name, missingSkills.join(', '));
			return true;
		}
		*/

		return false;
	};

	getCards = (type: string, pack: PackModel) => {
		switch (type) {
			case 'hero species':
				return PackLogic.getHeroSpecies(pack.id)
					.map(s => {
						const strength = GameLogic.getSpeciesStrength(s);
						const className = this.getMarked(s, strength, GameLogic.strengthBands.heroSpecies) ? 'card-btn danger' : 'card-btn';
						return (
							<button
								key={s.id}
								className={className}
								onClick={() => this.setActions(s.name, s.description, CardType.Species, s.startingFeatures, s.features, s.actions, s.deathActions)}
							>
								<StatValue label={s.name} value={strength} />
								<div className='card-description'>{s.description}</div>
							</button>
						);
					});
			case 'monster species':
				return PackLogic.getMonsterSpecies(pack.id)
					.map(s => {
						const strength = GameLogic.getSpeciesStrength(s);
						const className = this.getMarked(s, strength, GameLogic.strengthBands.monsterSpecies) ? 'card-btn danger' : 'card-btn';
						return (
							<button
								key={s.id}
								className={className}
								onClick={() => this.setActions(s.name, s.description, CardType.Species, s.startingFeatures, s.features, s.actions, s.deathActions)}
							>
								<StatValue label={s.name} value={strength} />
								<div className='card-description'>{s.description}</div>
							</button>
						);
					});
			case 'roles':
				return PackLogic.getRoles(pack.id)
					.map(r => {
						const strength = GameLogic.getRoleStrength(r);
						const className = this.getMarked(r, strength, GameLogic.strengthBands.role) ? 'card-btn danger' : 'card-btn';
						return (
							<button
								key={r.id}
								className={className}
								onClick={() => this.setActions(r.name, r.description, CardType.Species, r.startingFeatures, r.features, r.actions, [])}
							>
								<StatValue label={r.name} value={strength} />
								<div className='card-description'>{r.description}</div>
							</button>
						);
					});
			case 'backgrounds':
				return PackLogic.getBackgrounds(pack.id)
					.map(b => {
						const strength = GameLogic.getBackgroundStrength(b);
						const className = this.getMarked(b, strength, GameLogic.strengthBands.background) ? 'card-btn danger' : 'card-btn';
						return (
							<button
								key={b.id}
								className={className}
								onClick={() => this.setActions(b.name, b.description, CardType.Species, b.startingFeatures, b.features, b.actions, [])}
							>
								<StatValue label={b.name} value={strength} />
								<div className='card-description'>{b.description}</div>
							</button>
						);
					});
			case 'structures':
				return PackLogic.getStructures(pack.id)
					.map(s => <Text key={s.id} type={TextType.Small}>{s.name}</Text>);
			case 'potions':
				return PackLogic.getPotions(pack.id)
					.map(p => <Text key={p.id} type={TextType.Small}>{p.name}</Text>);
			case 'scrolls':
				return PackLogic.getScrolls(pack.id)
					.map(sc => <Text key={sc.id} type={TextType.Small}>{sc.name}</Text>);
			case 'items':
				return PackLogic.getItems(pack.id)
					.map(i => <Text key={i.id} type={TextType.Small}>{i.name}</Text>);
		}

		return null;
	};

	getCardCount = (type: string) => {
		const packs = PackLogic.getAllPacks();
		switch (type) {
			case 'hero species':
				return packs.flatMap(p => PackLogic.getHeroSpecies(p.id)).length;
			case 'monster species':
				return packs.flatMap(p => PackLogic.getMonsterSpecies(p.id)).length;
			case 'roles':
				return packs.flatMap(p => PackLogic.getRoles(p.id)).length;
			case 'backgrounds':
				return packs.flatMap(p => PackLogic.getBackgrounds(p.id)).length;
			case 'structures':
				return packs.flatMap(p => PackLogic.getStructures(p.id)).length;
			case 'potions':
				return packs.flatMap(p => PackLogic.getPotions(p.id)).length;
			case 'scrolls':
				return packs.flatMap(p => PackLogic.getScrolls(p.id)).length;
			case 'items':
				return packs.flatMap(p => PackLogic.getItems(p.id)).length;
		}

		return 0;
	};

	render = () => {
		const types = [
			'hero species',
			'monster species',
			'roles',
			'backgrounds',
			'structures',
			'potions',
			'scrolls',
			'items'
		];

		const packs = PackLogic.getAllPacks();

		const rows = types.map(type => {
			return (
				<div key={type}>
					<Text type={TextType.SubHeading}>{type} ({this.getCardCount(type)})</Text>
					<div className='row'>
						{
							packs.map(p => {
								return (
									<div key={p.id} className='cell'>
										{this.getCards(type, p)}
									</div>
								);
							})
						}
					</div>
				</div>
			);
		});

		let dialog = null;
		if (this.state.selected) {
			const source = this.state.selected.name;
			const type = this.state.selected.type;

			const startingCards = this.state.selected.starting.map(f => {
				const strength = GameLogic.getFeatureStrength(f);
				return (
					<Badge key={f.id} value={strength}>
						<FeatureCard
							feature={f}
							footer={source}
							footerType={type}
						/>
					</Badge>
				);
			});
			const featureCards = this.state.selected.features.map(f => {
				const strength = GameLogic.getFeatureStrength(f);
				return (
					<Badge key={f.id} value={strength}>
						<FeatureCard
							feature={f}
							footer={source}
							footerType={type}
						/>
					</Badge>
				);
			});
			const actionCards = this.state.selected.actions.map(a => {
				const strength = GameLogic.getActionStrength(a);
				return (
					<Badge key={a.id} value={strength}>
						<ActionCard
							action={a}
							developer={true}
							footer={source}
							footerType={type}
						/>
					</Badge>
				);
			});
			const deathActionCards = this.state.selected.deathActions.map(a => {
				const strength = GameLogic.getActionStrength(a);
				return (
					<Badge key={a.id} value={strength}>
						<ActionCard
							action={a}
							developer={true}
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
					{deathActionCards.length > 0 ? <hr /> : null}
					{deathActionCards.length > 0 ? <Text type={TextType.SubHeading}>Death Action Cards</Text> : null}
					{deathActionCards.length > 0 ? <CardList cards={deathActionCards} /> : null}
				</div>
			);
			dialog = (
				<Dialog
					content={content}
					onClose={this.clearActions}
				/>
			);
		}

		return (
			<div className='card-page'>
				<div className='card-grid-header'>
					<div className='row'>
						{
							packs.map(p => (
								<div key={p.id} className='cell column-heading'>
									<div className='pack-name'>{p.name || 'Skirmish'}</div>
									<Tag>Cards: {PackLogic.getPackCardCount(p.id)}</Tag>
								</div>
							))
						}
					</div>
				</div>
				<div className='card-grid-content'>
					{rows}
				</div>
				{dialog}
			</div>
		);
	};
}

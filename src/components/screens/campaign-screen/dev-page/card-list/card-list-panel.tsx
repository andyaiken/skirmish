import { Component } from 'react';

import { BackgroundData } from '../../../../../data/background-data';
import { HeroSpeciesData } from '../../../../../data/hero-species-data';
import { ItemData } from '../../../../../data/item-data';
import { MonsterSpeciesData } from '../../../../../data/monster-species-data';
import { PackData } from '../../../../../data/pack-data';
import { PotionData } from '../../../../../data/potion-data';
import { RoleData } from '../../../../../data/role-data';
import { StructureData } from '../../../../../data/structure-data';

import { CardType } from '../../../../../enums/card-type';

import { GameLogic } from '../../../../../logic/game-logic';

import type { ActionModel } from '../../../../../models/action';
import type { FeatureModel } from '../../../../../models/feature';
import type { OptionsModel } from '../../../../../models/options';

import type { Platform } from '../../../../../platform/platform';

import { ActionCard, FeatureCard } from '../../../../cards';
import { Badge, CardList, Dialog, StatValue, Text, TextType } from '../../../../controls';

import './card-list-panel.scss';

interface Props {
	options: OptionsModel
	platform: Platform;
}

interface State {
	selected: { name: string, description: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[] } | null;
}

export class CardListPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selected: null
		};
	}

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

	getMarked = (card: { name: string, features: FeatureModel[], actions: ActionModel[] }, strength: number,  min: number, max: number) => {
		if ((strength < min) || (strength > max)) {
			return true;
		}

		if (card.actions.some(a => (GameLogic.getActionStrength(a) < 1) || (GameLogic.getActionStrength(a) > 12))) {
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

	getCards = (type: string, packID: string) => {
		switch (type) {
			case 'hero species':
				return HeroSpeciesData.getList()
					.filter(s => s.packID === packID)
					.map(s => {
						const strength = GameLogic.getSpeciesStrength(s);
						const className = this.getMarked(s, strength, 4, 6) ? 'danger' : '';
						return (
							<button key={s.id} className={className} onClick={() => this.setActions(s.name, s.description, CardType.Species, s.startingFeatures, s.features, s.actions)}>
								<StatValue label={s.name} value={strength} />
							</button>
						);
					});
			case 'monster species':
				return MonsterSpeciesData.getList()
					.filter(s => s.packID === packID)
					.map(s => {
						const strength = GameLogic.getSpeciesStrength(s);
						const className = this.getMarked(s, strength, 4, 6) ? 'danger' : '';
						return (
							<button key={s.id} className={className} onClick={() => this.setActions(s.name, s.description, CardType.Species, s.startingFeatures, s.features, s.actions)}>
								<StatValue label={s.name} value={strength} />
							</button>
						);
					});
			case 'roles':
				return RoleData.getList()
					.filter(r => r.packID === packID)
					.map(r => {
						const strength = GameLogic.getRoleStrength(r);
						const className = this.getMarked(r, strength, 4, 6) ? 'danger' : '';
						return (
							<button key={r.id} className={className} onClick={() => this.setActions(r.name, r.description, CardType.Species, r.startingFeatures, r.features, r.actions)}>
								<StatValue label={r.name} value={strength} />
							</button>
						);
					});
			case 'backgrounds':
				return BackgroundData.getList()
					.filter(b => b.packID === packID)
					.map(b => {
						const strength = GameLogic.getBackgroundStrength(b);
						const className = this.getMarked(b, strength, 3, 4) ? 'danger' : '';
						return (
							<button key={b.id} className={className} onClick={() => this.setActions(b.name, b.description, CardType.Species, b.startingFeatures, b.features, b.actions)}>
								<StatValue label={b.name} value={strength} />
							</button>
						);
					});
			case 'structures':
				return StructureData.getList()
					.filter(s => s.packID === packID)
					.map(s => <Text key={s.id} type={TextType.Small}>{s.name}</Text>);
			case 'potions':
				return PotionData.getList()
					.filter(p => p.packID === packID)
					.map(p => <Text key={p.id} type={TextType.Small}>{p.name}</Text>);
			case 'items':
				return ItemData.getList()
					.filter(i => i.packID === packID)
					.map(i => <Text key={i.id} type={TextType.Small}>{i.name}</Text>);
		}

		return null;
	};

	getCardCount = (type: string) => {
		switch (type) {
			case 'hero species':
				return HeroSpeciesData.getList().length;
			case 'monster species':
				return MonsterSpeciesData.getList().length;
			case 'roles':
				return RoleData.getList().length;
			case 'backgrounds':
				return BackgroundData.getList().length;
			case 'structures':
				return StructureData.getList().length;
			case 'potions':
				return PotionData.getList().length;
			case 'items':
				return ItemData.getList().length;
		}

		return 0;
	};

	render = () => {
		try {
			const types = [
				'hero species',
				'monster species',
				'roles',
				'backgrounds',
				'structures',
				'potions',
				'items'
			];

			const packIDs = [ '' ].concat(PackData.getList().map(p => p.id));

			const rows = types.map(type => {
				return (
					<div key={type}>
						<Text type={TextType.SubHeading}>{type} ({this.getCardCount(type)})</Text>
						<div className='row'>
							{
								packIDs.map(id => {
									return (
										<div key={id} className='cell'>
											{this.getCards(type, id)}
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
						onClose={this.clearActions}
					/>
				);
			}

			return (
				<div className='card-list-panel'>
					<div className='row'>
						{
							packIDs.map(id => {
								const pack = GameLogic.getPack(id);
								const name = pack ? pack.name : 'Skirmish';
								return (
									<div key={id} className='cell column-heading'>
										{name}
									</div>
								);
							})
						}
					</div>
					{rows}
					{dialog}
				</div>
			);
		} catch {
			return <div className='card-list-panel render-error' />;
		}
	};
}

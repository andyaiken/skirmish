import { Component } from 'react';

import { BackgroundData } from '../../../data/background-data';
import { HeroSpeciesData } from '../../../data/hero-species-data';
import { ItemData } from '../../../data/item-data';
import { MonsterSpeciesData } from '../../../data/monster-species-data';
import { PackData } from '../../../data/pack-data';
import { PotionData } from '../../../data/potion-data';
import { RoleData } from '../../../data/role-data';
import { StructureData } from '../../../data/structure-data';

import { CardType } from '../../../enums/card-type';

import { GameLogic } from '../../../logic/game-logic';
import { PackLogic } from '../../../logic/pack-logic';

import type { ActionModel } from '../../../models/action';
import type { FeatureModel } from '../../../models/feature';

import { Collections } from '../../../utils/collections';
import { Format } from '../../../utils/format';

import { ActionCard, FeatureCard } from '../../cards';
import { Badge, CardList, Dialog, StatValue, Text, TextType } from '../../controls';

import './card-grid-panel.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

interface State {
	selected: { name: string, type: CardType, starting: FeatureModel[], features: FeatureModel[], actions: ActionModel[] } | null;
}

export class CardGridPanel extends Component<Props, State> {
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

	getBadge = (strength: number, scale: number) => {
		let value = '';

		const scaled = Math.round(strength / scale);
		value = value.padEnd(scaled, '★');

		return value;
	};

	getCards = (type: string, packID: string) => {
		switch (type) {
			case 'hero species':
				return HeroSpeciesData.getList()
					.filter(s => s.packID === packID)
					.map(s => {
						return (
							<button key={s.id} onClick={() => this.setActions(s.name, CardType.Species, s.startingFeatures, s.features, s.actions)}>
								<StatValue label={s.name} value={GameLogic.getSpeciesStrength(s)} />
							</button>
						);
					});
			case 'monster species':
				return MonsterSpeciesData.getList()
					.filter(s => s.packID === packID)
					.map(s => {
						return (
							<button key={s.id} onClick={() => this.setActions(s.name, CardType.Species, s.startingFeatures, s.features, s.actions)}>
								<StatValue key={s.id} label={s.name} value={GameLogic.getSpeciesStrength(s)} />
							</button>
						);
					});
			case 'roles':
				return RoleData.getList()
					.filter(r => r.packID === packID)
					.map(r => {
						return (
							<button key={r.id} onClick={() => this.setActions(r.name, CardType.Species, r.startingFeatures, r.features, r.actions)}>
								<StatValue key={r.id} label={r.name} value={GameLogic.getRoleStrength(r)} />
							</button>
						);
					});
			case 'backgrounds':
				return BackgroundData.getList()
					.filter(b => b.packID === packID)
					.map(b => {
						return (
							<button key={b.id} onClick={() => this.setActions(b.name, CardType.Species, b.startingFeatures, b.features, b.actions)}>
								<StatValue key={b.id} label={b.name} value={GameLogic.getBackgroundStrength(b)} />
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
						<Text type={TextType.SubHeading}>{type}</Text>
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
							<div key='total' className='cell centered'>
								<StatValue orientation='vertical' label='Cards' value={this.getCardCount(type)} />
							</div>
						</div>
					</div>
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
						onClose={this.clearActions}
					/>
				);
			}

			return (
				<div className='card-grid-panel'>
					<div className='row'>
						{
							packIDs.map(id => {
								const pack = GameLogic.getPack(id);
								const name = pack ? pack.name : 'Skirmish';
								return (
									<div key={id} className='cell column-heading'>
										<div className='pack-name'>{name}</div>
										<div className='pack-stats'>
											{pack ? <StatValue label='Cards' value={PackLogic.getPackCardCount(pack.id)}/> : null}
											{pack ? <StatValue label='Strength' value={GameLogic.getPackStrength(pack)}/> : null}
											{pack ? <StatValue label='Price' value={Format.toCurrency(PackLogic.getPackPrice(pack.id), '$')}/> : null}
										</div>
									</div>
								);
							})
						}
						<div key='total' className='cell column-heading'>
							<div className='pack-name'>Total</div>
							<div className='pack-stats'>
								<StatValue label='Price' value={Format.toCurrency(Collections.sum(PackData.getList(), pack => PackLogic.getPackPrice(pack.id)), '$')}/>
							</div>
						</div>
					</div>
					{rows}
					{dialog}
				</div>
			);
		} catch {
			return <div className='card-grid-panel render-error' />;
		}
	};
}

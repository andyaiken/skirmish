import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { CombatantType } from '../../../../enums/combatant-type';
import { GameLogic } from '../../../../logic/game-logic';

import { Factory } from '../../../../logic/factory';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { BoonCard, HeroCard, PlaceholderCard } from '../../../cards';
import { CardList, ConfirmButton, Dialog, PlayingCard, Text, TextType } from '../../../controls';
import { CharacterSheetPanel, HeroBuilderPanel } from '../../../panels';

import './heroes-page.scss';

interface Props {
	game: GameModel;
	developer: boolean;
	addHero: (hero: CombatantModel) => void;
	incrementXP: (hero: CombatantModel) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
	retireHero: (combatant: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null) => void;
}

interface State {
	selectedHero: CombatantModel | null;
	selectedBoon: BoonModel | null;
	retiringHero: CombatantModel | null;
}

export class HeroesPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedHero: null,
			selectedBoon: null,
			retiringHero: null
		};
	}

	selectBoon = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.ExtraHero:
			case BoonType.MagicItem:
			case BoonType.Money: {
				this.props.redeemBoon(boon, null, null, null);
				break;
			}
			case BoonType.ExtraXP:
			case BoonType.LevelUp:
			case BoonType.EnchantItem: {
				this.setState({
					selectedBoon: boon
				});
				break;
			}
		}
	};

	selectHero = (hero: CombatantModel) => {
		this.setState({
			selectedHero: hero
		});
	};

	selectRetiringHero = (hero: CombatantModel) => {
		this.setState({
			retiringHero: hero
		});
	};

	retireHero = (hero: CombatantModel) => {
		this.setState({
			selectedHero: null
		}, () => {
			this.props.retireHero(hero);
		});
	};

	getContent = () => {
		if (this.props.game.heroes.length > 0) {
			const cards = this.props.game.heroes.map(hero => {
				return (
					<div key={hero.id}>
						<HeroCard hero={hero} onCharacterSheet={this.selectHero} onRetire={this.selectRetiringHero} />
						{this.props.developer ? <button className='developer' onClick={() => this.props.incrementXP(hero)}>Add XP</button> : null}
					</div>
				);
			});

			return (
				<div>
					<CardList cards={cards} />
				</div>
			);
		}

		return (
			<div>
				<Text type={TextType.Information}>
					<p>You have no heroes.</p>
				</Text>
			</div>
		);
	};

	getSidebar = () => {
		let boons = null;
		if (this.props.game.boons.filter(boon => GameLogic.getBoonIsHeroType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => GameLogic.getBoonIsHeroType(boon))
				.map(b => <BoonCard key={b.id} boon={b} onSelect={this.selectBoon} />);
			boons = (
				<div>
					<Text type={TextType.Information}>
						<p><b>You have won these rewards.</b> Select a card to redeem that reward.</p>
					</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let levelUp = null;
		if (this.props.game.heroes.some(h => h.xp >= h.level)) {
			const cards = this.props.game.heroes.filter(h => h.xp >= h.level).map(h => (
				<button key={h.id} onClick={() => this.setState({ selectedHero: h })}>{h.name}</button>
			));
			levelUp = (
				<div>
					<Text type={TextType.Information}>
						<p><b>Some of your heroes have gained enough XP to level up.</b> Click on their name to upgrade them.</p>
					</Text>
					{cards}
				</div>
			);
		}

		let blankHeroes = null;
		if (this.props.game.heroSlots > 0) {
			const text = this.props.game.heroSlots === 1 ? 'a new hero' : `${this.props.game.heroSlots} new heroes`;
			blankHeroes = (
				<div>
					<Text type={TextType.Information}>
						<p><b>You can recruit {text}.</b> Click the hero deck below to recruit a new level 1 hero.</p>
					</Text>
					<div className='center'>
						<PlayingCard
							stack={true}
							front={<PlaceholderCard text='Heroes' onClick={() => this.setState({ selectedHero: Factory.createCombatant(CombatantType.Hero) })} />}
						/>
					</div>
				</div>
			);
		}

		return (
			<div className='sidebar'>
				<Text type={TextType.SubHeading}>Your Team</Text>
				<Text>This page shows the heroes that you have recruited.</Text>
				{levelUp !== null ? <hr /> : null}
				{levelUp}
				{boons !== null ? <hr /> : null}
				{boons}
				{blankHeroes !== null ? <hr /> : null}
				{blankHeroes}
			</div>
		);
	};

	getDialog = () => {
		if (this.state.selectedHero) {
			if (!this.state.selectedHero.name) {
				return (
					<Dialog
						content={(
							<HeroBuilderPanel
								hero={this.state.selectedHero}
								game={this.props.game}
								developer={this.props.developer}
								finished={hero => {
									const h = this.state.selectedHero as CombatantModel;
									this.setState({
										selectedHero: null
									}, () => {
										hero.id = h.id;
										this.props.addHero(hero);
									});
								}}
							/>
						)}
					/>
				);
			} else {
				return (
					<Dialog
						content={(
							<CharacterSheetPanel
								combatant={this.state.selectedHero}
								game={this.props.game}
								developer={this.props.developer}
								equipItem={this.props.equipItem}
								unequipItem={this.props.unequipItem}
								pickUpItem={this.props.pickUpItem}
								dropItem={this.props.dropItem}
								levelUp={this.props.levelUp}
								retireHero={this.retireHero}
							/>
						)}
						onClose={this.state.selectedHero.xp >= this.state.selectedHero.level ? null : () => {
							this.setState({
								selectedHero: null
							});
						}}
					/>
				);
			}
		}

		if (this.state.selectedBoon) {
			const heroCards = this.props.game.heroes
				.map(h => {
					return (
						<HeroCard
							key={h.id}
							hero={h}
							onSelect={hero => {
								//
								const boon = this.state.selectedBoon as BoonModel;
								this.setState({
									selectedBoon: null
								}, () => {
									this.props.redeemBoon(boon, hero, null, null);
								});
							}}
						/>
					);
				});

			return (
				<Dialog
					content={(
						<div>
							<Text type={TextType.Heading}>Choose a Hero</Text>
							<Text type={TextType.Information}>
								<p>Choose a hero to receive this reward:</p>
							</Text>
							<CardList cards={heroCards} />
						</div>
					)}
					onClose={() => {
						this.setState({
							selectedBoon: null
						});
					}}
				/>
			);
		}

		if (this.state.retiringHero) {
			return (
				<Dialog
					content={(
						<div>
							<Text type={TextType.Heading}>Retire This Hero</Text>
							<div>
								<Text type={TextType.Information}>
									<p><b>You can retire this hero.</b> If you do:</p>
									<ul>
										<li>You&apos;ll get half their total XP to add to another hero</li>
										<li>You keep any magic items they have</li>
										<li>You can recruit a new hero to take their place</li>
									</ul>
									<p>This cannot be undone.</p>
								</Text>
								<ConfirmButton
									label='Retire'
									onClick={() => {
										const h = this.state.retiringHero as CombatantModel;
										this.setState({
											retiringHero: null
										}, () => {
											this.props.retireHero(h);
										});
									}}
								/>
							</div>
						</div>
					)}
					onClose={() => {
						this.setState({
							retiringHero: null
						});
					}}
				/>
			);
		}

		return null;
	};

	render = () => {
		try {
			return (
				<div className='heroes-page'>
					<div className='heroes-content'>
						{this.getContent()}
					</div>
					{this.getSidebar()}
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='heroes-page render-error' />;
		}
	};
}

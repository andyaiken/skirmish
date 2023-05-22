import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { CardType } from '../../../../enums/card-type';
import { GameLogic } from '../../../../logic/game-logic';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';

import { BoonCard, HeroCard, PlaceholderCard } from '../../../cards';
import { CardList, Dialog, PlayingCard, Text, TextType } from '../../../controls';
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
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null) => void;
}

interface State {
	selectedHero: CombatantModel | null;
	selectedBoon: BoonModel | null;
}

export class HeroesPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedHero: null,
			selectedBoon: null
		};
	}

	selectBoon = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.ExtraHero:
			case BoonType.MagicItem:
			case BoonType.Money: {
				this.props.redeemBoon(boon, null);
				break;
			}
			case BoonType.ExtraXP:
			case BoonType.LevelUp: {
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

	getContent = () => {
		if (this.props.game.heroes.filter(h => !!h.name).length > 0) {
			const cards = this.props.game.heroes.filter(h => !!h.name).map(hero => {
				return (
					<div key={hero.id}>
						<PlayingCard
							type={CardType.Hero}
							front={<HeroCard hero={hero} />}
							footer='Hero'
							onClick={() => this.selectHero(hero)}
						/>
						{this.props.developer ? <button className='developer' onClick={() => this.props.incrementXP(hero)}>Add XP</button> : null}
					</div>
				);
			});

			return (
				<div>
					<Text type={TextType.SubHeading}>Heroes ({cards.length})</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		return (
			<div>
				<Text type={TextType.SubHeading}>Heroes (0)</Text>
				<Text type={TextType.Information}>You have no heroes.</Text>
			</div>
		);
	};

	getSidebar = () => {
		let boons = null;
		if (this.props.game.boons.filter(boon => GameLogic.getBoonIsHeroType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => GameLogic.getBoonIsHeroType(boon))
				.map(b => (<PlayingCard key={b.id} type={CardType.Boon} front={<BoonCard boon={b} />} footer='Reward' onClick={() => this.selectBoon(b)} />));
			boons = (
				<div>
					<Text type={TextType.Information}><b>You have won these rewards.</b> Select a card to redeem that reward.</Text>
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
					<Text type={TextType.Information}><b>Some of your heroes have gained enough XP to level up.</b> Click on their name to upgrade them.</Text>
					{cards}
				</div>
			);
		}

		let blankHeroes = null;
		const blank = this.props.game.heroes.filter(h => !h.name);
		if (blank.length > 0) {
			const text = blank.length === 1 ? 'a new hero' : `${blank.length} new heroes`;
			blankHeroes = (
				<div>
					<Text type={TextType.Information}><b>You can recruit {text}.</b> Click the hero deck below to recruit a new level 1 hero.</Text>
					<div className='center'>
						<PlayingCard
							stack={true}
							front={<PlaceholderCard text='Heroes' />}
							onClick={() => this.setState({ selectedHero: blank[0] })}
						/>
					</div>
				</div>
			);
		}

		return (
			<div className='sidebar'>
				<Text type={TextType.SubHeading}>Your Team</Text>
				<Text>This page shows the heroes that you have recruited.</Text>
				{boons !== null ? <hr /> : null}
				{boons}
				{levelUp !== null ? <hr /> : null}
				{levelUp}
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
				.filter(h => h.name !== '')
				.map(h => {
					return (
						<PlayingCard
							key={h.id}
							type={CardType.Hero}
							front={<HeroCard hero={h} />}
							footer='Hero'
							onClick={() => {
								const boon = this.state.selectedBoon as BoonModel;
								this.setState({
									selectedBoon: null
								}, () => {
									this.props.redeemBoon(boon, h);
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
							<Text type={TextType.Information}>Choose a hero to receive this reward:</Text>
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

		return null;
	};

	render = () => {
		return (
			<div className='heroes-page'>
				<div className='heroes-content'>
					{this.getContent()}
				</div>
				{this.getSidebar()}
				{this.getDialog()}
			</div>
		);
	};
}

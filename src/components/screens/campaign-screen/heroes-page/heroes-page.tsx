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

	selectHero = (e: React.MouseEvent, hero: CombatantModel) => {
		e.stopPropagation();
		this.setState({
			selectedHero: hero
		});
	};

	render = () => {
		let boons = null;
		if (this.props.game.boons.filter(boon => GameLogic.getBoonIsHeroType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => GameLogic.getBoonIsHeroType(boon))
				.map(b => (<PlayingCard key={b.id} type={CardType.Boon} front={<BoonCard boon={b} />} footer='Reward' onClick={() => this.selectBoon(b)} />));
			boons = (
				<div>
					<Text type={TextType.SubHeading}>Rewards ({cards.length})</Text>
					<Text type={TextType.Information}><b>You have won these rewards.</b> Select a card to redeem a reward.</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let blankHeroes = null;
		if (this.props.game.heroes.some(h => !h.name)) {
			const cards = this.props.game.heroes.filter(h => !h.name).map(h => {
				return (
					<PlayingCard key={h.id} front={<PlaceholderCard>Hero</PlaceholderCard>} onClick={() => this.setState({ selectedHero: h })} />
				);
			});
			blankHeroes = (
				<div>
					<Text type={TextType.SubHeading}>New Heroes ({cards.length})</Text>
					<Text type={TextType.Information}><b>You have unfilled hero slots.</b> Select a blank hero card to recruit a new level 1 hero.</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let levelUp = null;
		if (this.props.game.heroes.some(h => h.xp >= h.level)) {
			const cards = this.props.game.heroes.filter(h => h.xp >= h.level).map(h => {
				return (
					<button key={h.id} onClick={() => this.setState({ selectedHero: h })}>{h.name}</button>
				);
			});
			levelUp = (
				<div>
					<Text type={TextType.SubHeading}>Level Up ({cards.length})</Text>
					<Text type={TextType.Information}><b>Some of your heroes have gained enough XP to level up.</b> Click on their name to upgrade them.</Text>
					{cards}
				</div>
			);
		}

		let heroes = null;
		if (this.props.game.heroes.filter(h => !!h.name).length > 0) {
			const cards = this.props.game.heroes.filter(h => !!h.name).map(hero => {
				return (
					<div key={hero.id}>
						<PlayingCard
							type={CardType.Hero}
							front={<HeroCard hero={hero} />}
							footer={<button onClick={e => this.selectHero(e, hero)}>Character Sheet</button>}
						/>
						{this.props.developer ? <button className='developer' onClick={() => this.props.incrementXP(hero)}>Add XP</button> : null}
					</div>
				);
			});
			heroes = (
				<div>
					<Text type={TextType.SubHeading}>Heroes ({cards.length})</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		const sidebar = (
			<div>
				<Text type={TextType.SubHeading}>Your Heroes</Text>
				<Text>These are your heroes.</Text>
			</div>
		);

		let dialog = null;
		if (this.state.selectedHero) {
			if (!this.state.selectedHero.name) {
				dialog = (
					<Dialog
						content={(
							<HeroBuilderPanel
								hero={this.state.selectedHero}
								game={this.props.game}
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
				dialog = (
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

			dialog = (
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

		return (
			<div className='heroes-page'>
				<div className='heroes-content'>
					{blankHeroes}
					{heroes}
					{dialog}
				</div>
				<div className='sidebar'>
					{(boons === null) && (levelUp == null) ? sidebar : null}
					{boons}
					{(boons !== null) && (levelUp !== null) ? <hr /> : null}
					{levelUp}
				</div>
			</div>
		);
	};
}

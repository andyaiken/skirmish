import { Component } from 'react';
import { Dialog, Text, TextType } from '../../../../controls';
import { BoonModel, BoonType } from '../../../../models/boon';
import { FeatureModel } from '../../../../models/feature';
import { GameModel } from '../../../../models/game';
import { CombatantModel } from '../../../../models/combatant';
import { ItemModel } from '../../../../models/item';
import { BoonCard, HeroCard, ItemCard, PlaceholderCard } from '../../../cards';
import { CharacterSheetPanel, HeroBuilderPanel } from '../../../panels';
import { CardList, PlayingCard } from '../../../utility';

import './heroes-page.scss';

interface Props {
	game: GameModel;
	addHero: (hero: CombatantModel) => void;
	incrementXP: (hero: CombatantModel) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
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
			case BoonType.MagicItem: {
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
	}

	public render() {
		let boons = null;
		if (this.props.game.boons.length > 0) {
			boons = (
				<div>
					<Text type={TextType.SubHeading}>Rewards</Text>
					<Text>You have won these rewards. Select a card to redeem a reward.</Text>
					<CardList cards={this.props.game.boons.map(b => (<PlayingCard key={b.id} front={<BoonCard boon={b} />} onClick={() => this.selectBoon(b)} />))} />
				</div>
			);
		}

		let blankHeroes = null;
		if (this.props.game.heroes.some(h => !h.name)) {
			const heroCards = this.props.game.heroes.filter(h => !h.name).map(h => {
				return (
					<PlayingCard key={h.id} front={<PlaceholderCard text='Hero' />} onClick={() => this.setState({ selectedHero: h })} />
				);
			});
			blankHeroes = (
				<div>
					<Text type={TextType.SubHeading}>New Heroes</Text>
					<Text>You have unfilled hero slots. Select a blank hero card to recruit a new level 1 hero.</Text>
					<CardList cards={heroCards} />
				</div>
			);
		}

		let levelUp = null;
		if (this.props.game.heroes.some(h => h.xp >= h.level)) {
			const heroCards = this.props.game.heroes.filter(h => h.xp >= h.level).map(h => {
				return (
					<PlayingCard key={h.id} front={<HeroCard hero={h} />} onClick={() => this.setState({ selectedHero: h })} />
				);
			});
			levelUp = (
				<div>
					<Text type={TextType.SubHeading}>Level Up</Text>
					<Text>Some of your heroes have gained enough XP to level up. Select their card to upgrade them.</Text>
					<CardList cards={heroCards} />
				</div>
			);
		}

		let heroes = null;
		if (this.props.game.heroes.length > 0) {
			const heroCards = this.props.game.heroes.map(hero => {
				return (
					<div key={hero.id}>
						<PlayingCard front={<HeroCard hero={hero} />} onClick={() => this.setState({ selectedHero: hero })} />
						<button className='hack' onClick={() => this.props.incrementXP(hero)}>Add XP</button>
					</div>
				);
			});
			heroes = (
				<div>
					<Text type={TextType.SubHeading}>Heroes ({this.props.game.heroes.length})</Text>
					<CardList cards={heroCards} />
				</div>
			);
		}

		let magicItems = null;
		if (this.props.game.items.filter(i => i.magic).length > 0) {
			magicItems = (
				<div>
					<Text type={TextType.SubHeading}>Magic Items ({this.props.game.items.filter(i => i.magic).length})</Text>
					<Text>You have the following magic items:</Text>
					<CardList cards={this.props.game.items.filter(i => i.magic).map((i, n) => (<PlayingCard key={n} front={<ItemCard item={i} />} />))} />
				</div>
			);
		}

		let mundaneItems = null;
		if (this.props.game.items.filter(i => !i.magic).length > 0) {
			mundaneItems = (
				<div>
					<Text type={TextType.SubHeading}>Mundane Items ({this.props.game.items.filter(i => !i.magic).length})</Text>
					<Text>In addition to the equipment carried by your heroes, you also have:</Text>
					<CardList cards={this.props.game.items.filter(i => !i.magic).map((i, n) => (<PlayingCard key={n} front={<ItemCard item={i} />} />))} />
				</div>
			);
		}

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
						onClickOff={() => {
							this.setState({
								selectedHero: null
							});
						}}
					/>
				);
			} else {
				dialog = (
					<Dialog
						content={(
							<CharacterSheetPanel
								hero={this.state.selectedHero}
								game={this.props.game}
								equipItem={this.props.equipItem}
								unequipItem={this.props.unequipItem}
								levelUp={this.props.levelUp}
							/>
						)}
						onClickOff={() => {
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
							<Text>Choose a hero to receive this reward:</Text>
							<CardList cards={heroCards} />
						</div>
					)}
					onClickOff={() => {
						this.setState({
							selectedBoon: null
						});
					}}
				/>
			);
		}

		return (
			<div className='heroes-page'>
				{boons}
				{blankHeroes}
				{levelUp}
				{heroes}
				{magicItems}
				{mundaneItems}
				{dialog}
			</div>
		);
	}
}

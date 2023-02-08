import { Component } from 'react';
import { Dialog, Text, TextType } from '../../../../controls';
import { BoonModel, BoonType } from '../../../../models/boon';
import { GameModel } from '../../../../models/game';
import { HeroModel } from '../../../../models/hero';
import { ItemModel } from '../../../../models/item';
import { BoonCard, HeroCard, ItemCard, PlaceholderCard } from '../../../cards';
import { CharacterSheetPanel, HeroBuilderPanel } from '../../../panels';
import { CardList, PlayingCard } from '../../../utility';

import './heroes-page.scss';

interface Props {
	game: GameModel;
	addHero: (hero: HeroModel) => void;
	incrementXP: (hero: HeroModel) => void;
	equipItem: (item: ItemModel, hero: HeroModel) => void;
	unequipItem: (item: ItemModel, hero: HeroModel) => void;
	redeemBoon: (boon: BoonModel, hero: HeroModel | null) => void;
}

interface State {
	selectedHero: HeroModel | null;
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
		let heroes = null;
		if (this.props.game.heroes.length > 0) {
			let info = null;
			if (this.props.game.heroes.some(h => !h.name)) {
				info = (
					<Text type={TextType.Information}>
						<b>You have unfilled hero slots.</b> Select a blank hero card to recruit a new level 1 hero.
					</Text>
				);
			} else if (this.props.game.heroes.some(h => h.xp >= h.level)) {
				info = (
					<Text type={TextType.Information}>
						<b>Some of your heroes can level up.</b> Select their card to upgrade them.
					</Text>
				);
			}

			const heroCards = this.props.game.heroes.map(hero => {
				let card = null;
				if (!hero.name) {
					card = (
						<PlaceholderCard text='Hero' />
					);
				} else {
					card = (
						<HeroCard hero={hero} />
					);
				}
				let info = null;
				if (!hero.name) {
					info = (
						<Text type={TextType.Information}>Empty</Text>
					);
				} else {
					info = (
						<button className='hack' onClick={() => this.props.incrementXP(hero)}>Add XP</button>
					);
				}
				if (hero.xp >= hero.level) {
					info = (
						<Text type={TextType.Information}>Level Up</Text>
					);
				}
				return (
					<div key={hero.id}>
						<PlayingCard front={card} onClick={() => this.setState({ selectedHero: hero })} />
						{info}
					</div>
				);
			});

			heroes = (
				<div>
					{info}
					<CardList cards={heroCards} />
				</div>
			);
		}

		let items = null;
		if (this.props.game.items.length > 0) {
			items = (
				<div>
					<hr />
					<Text>In addition to the equipment carried by your heroes, you also have:</Text>
					<CardList cards={this.props.game.items.map((i, n) => (<PlayingCard key={n} front={<ItemCard item={i} />} />))} />
				</div>
			);
		}

		let boons = null;
		if (this.props.game.boons.length > 0) {
			boons = (
				<div>
					<hr />
					<Text type={TextType.Information}>
						<b>You have won these rewards.</b> Select a card to redeem a reward.
					</Text>
					<CardList cards={this.props.game.boons.map(b => (<PlayingCard key={b.id} front={<BoonCard boon={b} />} onClick={() => this.selectBoon(b)} />))} />
				</div>
			);
		}

		let dialog = null;
		if (this.state.selectedHero) {
			if (!this.state.selectedHero.name || (this.state.selectedHero.xp >= this.state.selectedHero.level)) {
				dialog = (
					<Dialog
						content={(
							<HeroBuilderPanel
								hero={this.state.selectedHero}
								game={this.props.game}
								finished={hero => {
									const h = this.state.selectedHero as HeroModel;
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
								equipItem={(item, hero) => this.props.equipItem(item, hero)}
								unequipItem={(item, hero) => this.props.unequipItem(item, hero)}
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
				{heroes}
				{items}
				{boons}
				{dialog}
			</div>
		);
	}
}

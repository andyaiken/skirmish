import { Component } from 'react';
import { Selector } from '../../../controls';
import { Game } from '../../../models/game';
import { Hero } from '../../../models/hero';
import { Item } from '../../../models/item';
import { BoonCard, HeroCard, ItemCard, PlaceholderCard } from '../../cards';
import { CharacterSheetPanel, HeroBuilderPanel } from '../../panels';
import { CardList, Dialog, PlayingCard, Text, TextType } from '../../utility';

import './heroes-screen.scss';

interface Props {
	game: Game;
	addHero: (hero: Hero) => void;
	// levelUp: (hero: Hero, trait: Trait, skill: Skill, feature: Feature) => void;
	incrementXP: (hero: Hero) => void;
	equipItem: (item: Item, hero: Hero) => void;
	unequipItem: (item: Item, hero: Hero) => void;
	viewCampaignMap: () => void;
}

interface State {
	selectedHero: Hero | null;
}

export class HeroesScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedHero: null
		};
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
					<CardList cards={this.props.game.boons.map((b, n) => (<PlayingCard key={n} front={<BoonCard boon={b} />} />))} />
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
									const h = this.state.selectedHero as Hero;
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

		return (
			<div className='heroes-screen'>
				<Selector options={[{ id: 'heroes', display: 'Your Team' }, { id: 'map', display: 'The Island' }]} selectedID='heroes' onSelect={this.props.viewCampaignMap} />
				{heroes}
				{items}
				{boons}
				{dialog}
			</div>
		);
	}
}

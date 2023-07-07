import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';

import { NameGenerator } from '../../../generators/name-generator';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { Factory } from '../../../logic/factory';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';
import { Random } from '../../../utils/random';

import { CharacterSheetPanel, CombatantRowPanel, HeroBuilderPanel } from '../../panels';
import { Dialog, PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../../cards';

import './setup-screen.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	addHero: (hero: CombatantModel) => void;
	addHeroes: (heroes: CombatantModel[]) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	beginCampaign: () => void;
}

interface State {
	hero: CombatantModel | null;
}

export class SetupScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hero: null
		};
	}

	createHero = () => {
		this.setState({
			hero: Factory.createCombatant(CombatantType.Hero)
		});
	};

	createHeroes = () => {
		let speciesDeck = GameLogic.getHeroSpeciesDeck(this.props.options.packIDs).map(s => s.id);
		let roleDeck = GameLogic.getRoleDeck(this.props.options.packIDs).map(r => r.id);
		let backgroundDeck = GameLogic.getBackgroundDeck(this.props.options.packIDs).map(b => b.id);

		const heroes: CombatantModel[] = [];
		while (heroes.length < 5) {
			const hero = Factory.createCombatant(CombatantType.Hero);
			hero.name = NameGenerator.generateName();
			hero.color = Random.randomColor(20, 180);

			const speciesID = Collections.draw(speciesDeck);
			speciesDeck = speciesDeck.filter(s => s !== speciesID);
			const roleID = Collections.draw(roleDeck);
			roleDeck = roleDeck.filter(r => r !== roleID);
			const backgroundID = Collections.draw(backgroundDeck);
			backgroundDeck = backgroundDeck.filter(b => b !== backgroundID);

			CombatantLogic.applyCombatantCards(hero, speciesID, roleID, backgroundID);
			CombatantLogic.addItems(hero, this.props.options.packIDs);

			heroes.push(hero);
		}

		this.props.addHeroes(heroes);
	};

	selectHero = (hero: CombatantModel | null) => {
		this.setState({
			hero: hero
		});
	};

	getDialog = () => {
		if (!this.state.hero) {
			return null;
		}

		if (this.state.hero.name === '') {
			return (
				<Dialog
					content={(
						<HeroBuilderPanel
							hero={this.state.hero}
							game={this.props.game}
							options={this.props.options}
							finished={hero => {
								this.setState({
									hero: null
								}, () => {
									this.props.addHero(hero);
								});
							}}
						/>
					)}
				/>
			);
		}

		return (
			<Dialog
				content={
					<CharacterSheetPanel
						combatant={this.state.hero}
						game={this.props.game}
						developer={false}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						pickUpItem={this.props.pickUpItem}
						dropItem={this.props.dropItem}
						levelUp={() => null}
						retireHero={() => null}
					/>
				}
				onClose={() => this.selectHero(null)}
			/>
		);
	};

	render = () => {
		try {
			const heroes = this.props.game.heroes.map(h => <CombatantRowPanel key={h.id} combatant={h} onDetails={this.selectHero} />);
			if (heroes.length < 5) {
				heroes.push(
					<div key='add' className='empty-panel'>
						<button onClick={this.createHero}>Recruit a Hero</button>
					</div>
				);
			}
			while (heroes.length < 5) {
				heroes.push(
					<div key={heroes.length} className='empty-panel' />
				);
			}

			return (
				<div className='setup-screen'>
					<div className='setup-top-bar'>
						<div className='logo-text inset-text'>Skirmish</div>
					</div>
					<div className='setup-content'>
						<div className='left-panel'>
							{
								this.props.game.heroes.length === 0 ?
									<PlayingCard
										type={CardType.Role}
										stack={true}
										front={<PlaceholderCard text='Randomize' subtext='Click here to draw a random team of heroes' onClick={this.createHeroes} />}
									/>
									: null
							}
						</div>
						<div className='center-panel'>
							<Text type={TextType.Information}>
								<p><b>Recruit your team.</b> These five heroes will begin the task of conquering the island.</p>
							</Text>
							{heroes}
						</div>
						<div className='right-panel'>
							{
								this.props.game.heroes.length >= 5 ?
									<PlayingCard
										type={CardType.Role}
										stack={true}
										front={<PlaceholderCard text='Begin the Campaign' onClick={this.props.beginCampaign} />}
									/>
									: null
							}
						</div>
					</div>
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='setup-screen render-error' />;
		}
	};
}

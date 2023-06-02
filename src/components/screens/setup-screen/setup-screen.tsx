import { Component } from 'react';

import { CombatantType } from '../../../enums/combatant-type';

import { NameGenerator } from '../../../generators/name-generator';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { Collections } from '../../../utils/collections';
import { Random } from '../../../utils/random';

import { CharacterSheetPanel, CombatantRowPanel, HeroBuilderPanel } from '../../panels';
import { Dialog, PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../../cards';

import './setup-screen.scss';

interface Props {
	game: GameModel;
	developer: boolean;
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
		const hero = this.props.game.heroes.find(h => h.name === '');
		if (hero) {
			this.setState({
				hero: hero
			});
		}
	};

	createHeroes = () => {
		let speciesDeck = GameLogic.getSpeciesDeck(CombatantType.Hero);
		let roleDeck = GameLogic.getRoleDeck();
		let backgroundDeck = GameLogic.getBackgroundDeck();

		const heroes: CombatantModel[] = [];
		this.props.game.heroes.forEach(hero => {
			hero.name = NameGenerator.generateName();
			hero.color = Random.randomColor(20, 180);

			const speciesID = Collections.draw(speciesDeck);
			speciesDeck = speciesDeck.filter(s => s !== speciesID);
			const roleID = Collections.draw(roleDeck);
			roleDeck = roleDeck.filter(r => r !== roleID);
			const backgroundID = Collections.draw(backgroundDeck);
			backgroundDeck = backgroundDeck.filter(b => b !== backgroundID);

			CombatantLogic.applyCombatantCards(hero, speciesID, roleID, backgroundID);
			CombatantLogic.addItems(hero);

			heroes.push(hero);
		});

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
							developer={this.props.developer}
							finished={hero => {
								const h = this.state.hero as CombatantModel;
								this.setState({
									hero: null
								}, () => {
									hero.id = h.id;
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
			const heroes = this.props.game.heroes.filter(h => h.name !== '').map(h => <CombatantRowPanel key={h.id} combatant={h} onDetails={this.selectHero} />);
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
								this.props.game.heroes.filter(h => h.name !== '').length === 0 ?
									<PlayingCard stack={true} front={<PlaceholderCard text={<div>Draw A<br />Random<br />Team</div>} />} onClick={this.createHeroes} />
									: null
							}
						</div>
						<div className='center-panel'>
							<Text type={TextType.Information}><b>Recruit your team.</b> These five heroes will begin the task of conquering the island.</Text>
							{heroes}
						</div>
						<div className='right-panel'>
							{
								this.props.game.heroes.filter(h => h.name !== '').length >= 5 ?
									<PlayingCard stack={true} front={<PlaceholderCard text={<div>Begin<br />The<br />Campaign</div>} />} onClick={this.props.beginCampaign} />
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

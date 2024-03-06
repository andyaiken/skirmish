import { Component } from 'react';
import { IconCards } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';
import { OrientationType } from '../../../enums/orientation-type';

import { NameGenerator } from '../../../generators/name-generator';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { Factory } from '../../../logic/factory';
import { GameLogic } from '../../../logic/game-logic';
import { PackLogic } from '../../../logic/pack-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';
import { Color } from '../../../utils/color';
import { Random } from '../../../utils/random';

import { CharacterSheetModal, HeroBuilderModal } from '../../modals';
import { CombatantRowPanel, LogoPanel } from '../../panels';
import { Dialog, Expander, PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../../cards';

import './setup-screen.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	orientation: OrientationType;
	addHero: (hero: CombatantModel) => void;
	addHeroes: (heroes: CombatantModel[]) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	showPacks: () => void;
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
		const needed = 5 - this.props.game.heroes.length;
		while (heroes.length < needed) {
			const hero = Factory.createCombatant(CombatantType.Hero);
			hero.name = NameGenerator.generateName(Math.random);
			const color = Random.randomColor(20, 180);
			hero.color = Color.toString(color);

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
						<HeroBuilderModal
							hero={this.state.hero}
							game={this.props.game}
							options={this.props.options}
							useCharge={() => null}
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
					<CharacterSheetModal
						combatant={this.state.hero}
						game={this.props.game}
						developer={this.props.options.developer}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						pickUpItem={this.props.pickUpItem}
						dropItem={this.props.dropItem}
						levelUp={() => null}
						retireHero={() => null}
						useCharge={() => null}
					/>
				}
				onClose={() => this.selectHero(null)}
			/>
		);
	};

	render = () => {
		try {
			const heroes = this.props.game.heroes.map(h => <CombatantRowPanel key={h.id} combatant={h} options={this.props.options} onDetails={this.selectHero} />);
			if (heroes.length < 5) {
				heroes.push(
					<div key='add' className='empty-panel'>
						<button className='primary' onClick={this.createHero}>Recruit a Hero</button>
					</div>
				);
			}
			while (heroes.length < 5) {
				heroes.push(
					<div key={heroes.length} className='empty-panel' />
				);
			}

			let packsBtn = null;
			const availablePacks = PackLogic.getPacks().filter(p => !this.props.options.packIDs.includes(p.id)).length;
			if (availablePacks > 0) {
				packsBtn = (
					<button className='packs-btn' onClick={() => this.props.showPacks()}>
						{`${availablePacks} card pack${availablePacks === 1 ? '' : 's'} available`}
						<IconCards />
					</button>
				);
			}

			return (
				<div className={`setup-screen ${this.props.orientation}`}>
					<div className='setup-top-bar'>
						<LogoPanel size={100} />
					</div>
					<div className='setup-content'>
						<div className='left-panel'>
							{heroes}
						</div>
						<div className='right-panel'>
							{
								this.props.game.heroes.length >= 5 ?
									<PlayingCard
										type={CardType.Role}
										stack={true}
										front={
											<PlaceholderCard
												text='Begin the Campaign'
												content={<LogoPanel text={null} size={170} />}
											/>
										}
										onClick={this.props.beginCampaign}
									/>
									:
									<Text type={TextType.Information}>
										<p><b>Recruit your team.</b> These five heroes will begin the task of conquering the island.</p>
									</Text>
							}
							{
								this.props.options.showTips ?
									<Expander
										header={
											<Text type={TextType.Tip}>When you see a box like this, you can tap it to show more information.</Text>
										}
										content={
											<div>
												<p>We&apos;ll use these boxes to explain how to play the game.</p>
												<p>You can tap it again to close it.</p>
											</div>
										}
									/>
									: null
							}
							{this.props.options.developer && (this.props.game.heroes.length < 5) ? <button className='developer' onClick={this.createHeroes}>Randomize</button> : null}
							{packsBtn}
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

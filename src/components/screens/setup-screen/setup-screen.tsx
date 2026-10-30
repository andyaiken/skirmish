import { IconCards, IconDice5, IconHelpCircle } from '@tabler/icons-react';
import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';
import { HeroGenerator } from '../../../generators/hero/hero-generator';

import { Factory } from '../../../logic/factory/factory';
import { OrientationLogic } from '../../../logic/orientation/orientation-logic';
import { PackLogic } from '../../../logic/pack/pack-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { LayoutModel } from '../../../models/layout';
import type { OptionsModel } from '../../../models/options';

import { CharacterSheetModal, HeroBuilderModal } from '../../modals';
import { CombatantRowPanel, LogoPanel } from '../../panels';
import { Dialog, Expander, PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../../cards';

import './setup-screen.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	layout: LayoutModel;
	addHero: (hero: CombatantModel) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	showPacks: () => void;
	showHelp: (file: string) => void;
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

	// Sideways on a phone the Begin card has nowhere to go: the rows and the buttons already fill
	// the height, and fitting it in beside them squeezed both. So once the team is complete it
	// arrives as a panel over the right-hand side instead, and nothing underneath has to move.
	cardInSheet = () => {
		return OrientationLogic.isSmall(this.props.layout.orientation)
			&& OrientationLogic.isLandscape(this.props.layout.orientation)
			&& (this.props.game.heroes.length >= 5);
	};

	getBeginCard = () => {
		return (
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
		);
	};

	createHero = () => {
		this.setState({
			hero: Factory.createCombatant(CombatantType.Hero)
		});
	};

	createRandomHero = () => {
		this.props.addHero(HeroGenerator.generateHero(this.props.options.packIDs, this.props.game.heroes, Math.random));
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
							spendCharge={() => null}
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
						spendCharge={() => null}
					/>
				}
				onClose={() => this.selectHero(null)}
			/>
		);
	};

	render = () => {
		const heroes = this.props.game.heroes.map(h => <CombatantRowPanel key={h.id} combatant={h} options={this.props.options} onDetails={this.selectHero} />);
		if (heroes.length < 5) {
			heroes.push(
				<div key='add' className='empty-panel'>
					<button className='primary' onClick={this.createHero}>Recruit a Hero</button>
					<button className='random-btn' onClick={this.createRandomHero}><IconDice5 /></button>
				</div>
			);
		}
		while (heroes.length < 5) {
			heroes.push(
				<div key={heroes.length} className='empty-panel'>Hero {heroes.length + 1}</div>
			);
		}

		let packsBtn = null;
		const availablePacks = PackLogic.getExpansionPacks().filter(pack => !this.props.options.packIDs.includes(pack.id)).length;
		if (availablePacks > 0) {
			packsBtn = (
				<button className='packs-btn' onClick={() => this.props.showPacks()}>
					{`${availablePacks} card pack${availablePacks === 1 ? '' : 's'} available`}
					<IconCards />
				</button>
			);
		}

		return (
			<div className={`setup-screen ${OrientationLogic.getClassName(this.props.layout.orientation)}`}>
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
								(this.cardInSheet() ? null : this.getBeginCard())
								:
								<Text type={TextType.Information}>
									<p><b>Recruit your team.</b> These five heroes will begin the task of conquering the island.</p>
									<p>You can click the <IconDice5 /> button to generate a random hero.</p>
								</Text>
						}
						{/* Grouped so that a phone held sideways can put them beside the card rather
							than under it: the card alone is 300 of the 361 that orientation has. */}
						<div className='right-panel-rest'>
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
							{packsBtn}
							<button className='help-btn' title='Help' onClick={() => this.props.showHelp('setup')}>
								<IconHelpCircle />
								Help
							</button>
						</div>
					</div>
				</div>
				{this.cardInSheet() ? <div className='setup-sheet'>{this.getBeginCard()}</div> : null}
				{this.getDialog()}
			</div>
		);
	};
}

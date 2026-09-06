import { IconCards, IconDice5, IconHelpCircle } from '@tabler/icons-react';
import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';
import { OrientationType } from '../../../enums/orientation-type';

import { HeroGenerator } from '../../../generators/hero/hero-generator';

import { Factory } from '../../../logic/factory/factory';
import { PackLogic } from '../../../logic/pack/pack-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

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
									<p>You can click the <IconDice5 /> button to generate a random hero.</p>
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
						<div>
							{packsBtn}
							<button className='help-btn' title='Help' onClick={() => this.props.showHelp('setup')}>
								<IconHelpCircle />
								Help
							</button>
						</div>
					</div>
				</div>
				{this.getDialog()}
			</div>
		);
	};
}

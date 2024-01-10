import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { CombatantType } from '../../../../enums/combatant-type';
import { OrientationType } from '../../../../enums/orientation-type';
import { StructureType } from '../../../../enums/structure-type';

import { Factory } from '../../../../logic/factory';
import { GameLogic } from '../../../../logic/game-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { Badge, CardList, ConfirmButton, Dialog, PlayingCard, Text, TextType } from '../../../controls';
import { BoonCard, HeroCard, PlaceholderCard, StrongholdBenefitCard } from '../../../cards';
import { CharacterSheetModal, HeroBuilderModal } from '../../../modals';

import './heroes-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	orientation: OrientationType;
	addHero: (hero: CombatantModel) => void;
	addXP: (hero: CombatantModel, useCharge: StructureType | null) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
	retireHero: (combatant: CombatantModel) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => void;
	useCharge: (type: StructureType, count: number) => void;
}

interface State {
	selectedHero: CombatantModel | null;
	selectedBoon: BoonModel | null;
	retiringHero: CombatantModel | null;
	selectingHero: boolean;
}

export class HeroesPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedHero: null,
			selectedBoon: null,
			retiringHero: null,
			selectingHero: false
		};
	}

	selectBoon = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.ExtraHero:
			case BoonType.MagicItem:
			case BoonType.Money: {
				this.props.redeemBoon(boon, null, null, null, 0);
				break;
			}
			case BoonType.ExtraXP:
			case BoonType.LevelUp:
			case BoonType.EnchantItem: {
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

	selectRetiringHero = (hero: CombatantModel) => {
		this.setState({
			retiringHero: hero
		});
	};

	retireHero = (hero: CombatantModel) => {
		this.setState({
			selectedHero: null
		}, () => {
			this.props.retireHero(hero);
		});
	};

	addXP = (hero: CombatantModel) => {
		this.setState({
			selectingHero: false
		}, () => {
			this.props.addXP(hero, this.props.options.developer ? null : StructureType.Academy);
		});
	};

	getContent = () => {
		let levelUp = null;
		if (this.props.game.heroes.some(h => h.xp >= h.level)) {
			levelUp = (
				<Text type={TextType.Information}>
					<p><b>Some of your heroes have gained enough XP to level up.</b> Open their character sheet to upgrade them.</p>
				</Text>
			);
		}

		if (this.props.game.heroes.length > 0) {
			const cards = this.props.game.heroes.map(hero => {
				return (
					<div key={hero.id}>
						<Badge value={hero.xp >= hero.level ? 'Level Up' : null}>
							<HeroCard hero={hero} onCharacterSheet={this.selectHero} onRetire={this.selectRetiringHero} />
						</Badge>
					</div>
				);
			});

			return (
				<div>
					{levelUp}
					<CardList cards={cards} />
				</div>
			);
		}

		return (
			<div>
				<Text type={TextType.Information}>
					<p>You have no heroes.</p>
				</Text>
			</div>
		);
	};

	getSidebar = () => {
		let boons = null;
		if (this.props.game.boons.filter(boon => GameLogic.getBoonIsHeroType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => GameLogic.getBoonIsHeroType(boon))
				.map(b => <BoonCard key={b.id} boon={b} onClick={this.selectBoon} />);
			boons = (
				<div>
					<Text type={TextType.Information}>
						<p><b>You have won these rewards.</b> Select a card to redeem that reward.</p>
					</Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let slots = null;
		if (this.props.game.heroSlots > 0) {
			const atHeroLimit = this.props.game.heroes.length >= StrongholdLogic.getHeroLimit(this.props.game);
			slots = (
				<CardList cards={[
					<PlayingCard
						key='recruits'
						stack={true}
						front={
							<PlaceholderCard
								text='Recruits Available'
								subtext={atHeroLimit ? 'You can\'t recruit any more heroes until you have more living space in your stronghold.' : 'Click here to recruit a new hero.'}
								content={<div className='slots-count'>{this.props.game.heroSlots}</div>}
							/>
						}
						disabled={atHeroLimit}
						onClick={() => this.setState({ selectedHero: Factory.createCombatant(CombatantType.Hero) })}
					/>
				]}/>
			);
		}

		let benefits = null;
		if ((StrongholdLogic.getStructureCharges(this.props.game, StructureType.Academy) > 0) || this.props.options.developer) {
			benefits = (
				<CardList cards={[
					<StrongholdBenefitCard
						key='xp'
						label='Bonus XP'
						available={StrongholdLogic.getStructureCharges(this.props.game, StructureType.Academy)}
						developer={this.props.options.developer}
						onUse={() => this.setState({ selectingHero: true })}
					/>
				]}/>
			);
		}

		return (
			<div className='sidebar'>
				<div className='sidebar-section'>
					<Text type={TextType.SubHeading}>Your Team</Text>
					<Text>
						<p>This page shows the heroes that you have recruited.</p>
						<p>You can flip a hero&apos;s card over to see some important stats, or press the button to see their character sheet.</p>
					</Text>
				</div>
				{
					(boons !== null) || (benefits !== null) ?
						<div className='sidebar-section'>
							{boons}
							{(boons !== null) && (benefits !== null) ? <hr /> : null}
							{benefits}
						</div>
						: null
				}
				{
					slots !== null ?
						<div className='sidebar-section'>
							{slots}
						</div>
						: null
				}
			</div>
		);
	};

	getDialog = () => {
		if (this.state.selectedHero) {
			if (!this.state.selectedHero.name) {
				return (
					<Dialog
						content={(
							<HeroBuilderModal
								hero={this.state.selectedHero}
								game={this.props.game}
								options={this.props.options}
								useCharge={this.props.useCharge}
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
							<CharacterSheetModal
								combatant={this.state.selectedHero}
								game={this.props.game}
								developer={this.props.options.developer}
								equipItem={this.props.equipItem}
								unequipItem={this.props.unequipItem}
								pickUpItem={this.props.pickUpItem}
								dropItem={this.props.dropItem}
								levelUp={this.props.levelUp}
								retireHero={this.retireHero}
								useCharge={this.props.useCharge}
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
				.map(h => {
					return (
						<HeroCard
							key={h.id}
							hero={h}
							onClick={hero => {
								const boon = this.state.selectedBoon as BoonModel;
								this.setState({
									selectedBoon: null
								}, () => {
									this.props.redeemBoon(boon, hero, null, null, 0);
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
							<Text type={TextType.Information}>
								<p>Choose a hero to receive this reward.</p>
							</Text>
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

		if (this.state.retiringHero) {
			return (
				<Dialog
					content={(
						<div>
							<Text type={TextType.Heading}>Retire This Hero</Text>
							<div className='retire-hero-card'>
								<HeroCard hero={this.state.retiringHero} />
								<div>
									<Text type={TextType.Information}>
										<p><b>You can retire this hero.</b> If you do:</p>
										<ul>
											<li>You&apos;ll get half their total XP to add to another hero</li>
											<li>You keep any potions and magic items they have</li>
											<li>You can recruit a new hero to take their place</li>
										</ul>
										<p>This cannot be undone.</p>
									</Text>
									<ConfirmButton
										label='Retire'
										onClick={() => {
											const h = this.state.retiringHero as CombatantModel;
											this.setState({
												retiringHero: null
											}, () => {
												this.props.retireHero(h);
											});
										}}
									/>
								</div>
							</div>
						</div>
					)}
					onClose={() => {
						this.setState({
							retiringHero: null
						});
					}}
				/>
			);
		}

		if (this.state.selectingHero) {
			return (
				<Dialog
					content={(
						<div>
							<Text type={TextType.Heading}>Choose a Hero</Text>
							<hr />
							<Text type={TextType.Information}>
								<p>Choose the hero to gain 1 XP.</p>
							</Text>
							<CardList cards={this.props.game.heroes.map(h => <HeroCard key={h.id} hero={h} onClick={() => this.addXP(h)} />)} />
						</div>
					)}
					onClose={() => this.setState({ selectingHero: false })}
				/>
			);
		}

		return null;
	};

	render = () => {
		try {
			return (
				<div className={`heroes-page ${this.props.orientation}`}>
					<div className='heroes-content'>
						{this.getContent()}
					</div>
					{this.getSidebar()}
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='heroes-page render-error' />;
		}
	};
}

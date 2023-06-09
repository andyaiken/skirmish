import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { ItemProficiencyType } from '../../../enums/item-proficiency-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';
import { NameGenerator } from '../../../generators/name-generator';

import type { BackgroundModel } from '../../../models/background';
import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { RoleModel } from '../../../models/role';
import type { SpeciesModel } from '../../../models/species';

import { Collections } from '../../../utils/collections';
import { Random } from '../../../utils/random';
import { Utils } from '../../../utils/utils';

import { BackgroundCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, PlayingCard, Text, TextType } from '../../controls';
import { CombatantRowPanel } from '../combatant-row/combatant-row-panel';

import './hero-builder-panel.scss';

interface Props {
	hero: CombatantModel;
	game: GameModel;
	developer: boolean;
	finished: (hero: CombatantModel) => void;
}

interface State {
	hero: CombatantModel;
}

export class HeroBuilderPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const hero = JSON.parse(JSON.stringify(props.hero)) as CombatantModel;
		hero.name = NameGenerator.generateName();
		hero.color = Random.randomColor(20, 180);

		this.state = {
			hero: hero
		};
	}

	selectCards = (speciesID: string, roleID: string, backgroundID: string) => {
		const hero = this.state.hero;
		CombatantLogic.applyCombatantCards(hero, speciesID, roleID, backgroundID);
		this.setState({
			hero: hero
		});
	};

	addItems = (items: ItemModel[]) => {
		const hero = this.state.hero;
		hero.items = items;
		this.setState({
			hero: hero
		});
	};

	rename = () => {
		const hero = this.state.hero;
		hero.name = NameGenerator.generateName();
		this.setState({
			hero: hero
		});
	};

	recolor = () => {
		const hero = this.state.hero;
		hero.color = Random.randomColor(20, 180);
		this.setState({
			hero: hero
		});
	};

	finished = () => {
		this.props.finished(this.state.hero);
	};

	render = () => {
		try {
			let content = null;
			if ((this.state.hero.speciesID === '') && (this.state.hero.roleID === '') && (this.state.hero.backgroundID === '')) {
				// Initial card selection
				content = (
					<CardSelector
						game={this.props.game}
						developer={this.props.developer}
						select={this.selectCards}
					/>
				);
			} else if (CombatantLogic.getProficiencies(this.state.hero).length !== this.state.hero.items.length) {
				// Choose initial equipment
				content = (
					<EquipmentSelector
						hero={this.state.hero}
						developer={this.props.developer}
						addItems={this.addItems}
					/>
				);
			} else if (this.state.hero.level === 1) {
				// Finalise character creation
				content = (
					<div className='finish-page'>
						<div className='header'>
							<Text type={TextType.Heading}>
								Recruit a Hero
							</Text>
						</div>
						<div className='content'>
							<div className='rename-section'>
								<CombatantRowPanel combatant={this.state.hero} />
								<hr />
								<button onClick={this.rename}>Change name</button>
								<button onClick={this.recolor}>Change color</button>
								<hr />
								<button onClick={this.finished}>Finished</button>
							</div>
						</div>
					</div>
				);
			}

			return (
				<div className='hero-builder-panel'>
					{content}
				</div>
			);
		} catch {
			return <div className='hero-builder-panel render-error' />;
		}
	};
}

//#region Card selector

interface CardSelectorProps {
	game: GameModel;
	developer: boolean;
	select: (speciesID: string, roleID: string, backgroundID: string) => void;
}

interface CardSelectorState {
	speciesIDs: string[];
	roleIDs: string[];
	backgroundIDs: string[];
	selectedSpeciesID: string;
	selectedRoleID: string;
	selectedBackgroundID: string;
}

class CardSelector extends Component<CardSelectorProps, CardSelectorState> {
	constructor(props: CardSelectorProps) {
		super(props);
		this.state = {
			speciesIDs: Collections.shuffle(GameLogic.getHeroSpeciesDeck()).splice(0, 3),
			roleIDs: Collections.shuffle(GameLogic.getRoleDeck()).splice(0, 3),
			backgroundIDs: Collections.shuffle(GameLogic.getBackgroundDeck()).splice(0, 3),
			selectedSpeciesID: '',
			selectedRoleID: '',
			selectedBackgroundID: ''
		};
	}

	selectSpecies = (species: SpeciesModel) => {
		if (this.state.selectedSpeciesID === '') {
			this.setState({
				selectedSpeciesID: species.id
			});
		}
	};

	selectRole = (role: RoleModel) => {
		if (this.state.selectedRoleID === '') {
			this.setState({
				selectedRoleID: role.id
			});
		}
	};

	selectBackground = (background: BackgroundModel) => {
		if (this.state.selectedBackgroundID === '') {
			this.setState({
				selectedBackgroundID: background.id
			});
		}
	};

	select = () => {
		this.props.select(this.state.selectedSpeciesID, this.state.selectedRoleID, this.state.selectedBackgroundID);
	};

	redraw = (type: CardType) => {
		switch (type) {
			case CardType.Species:
				this.setState({
					speciesIDs: Collections.shuffle(GameLogic.getHeroSpeciesDeck()).splice(0, 3)
				});
				break;
			case CardType.Role:
				this.setState({
					roleIDs: Collections.shuffle(GameLogic.getRoleDeck()).splice(0, 3)
				});
				break;
			case CardType.Background:
				this.setState({
					backgroundIDs: Collections.shuffle(GameLogic.getBackgroundDeck()).splice(0, 3)
				});
				break;
		}
	};

	getOverviewSection = () => {
		let speciesCard = (
			<PlayingCard
				type={CardType.Species}
				front={<PlaceholderCard text='Species' subtext='Choose one of the Species cards below' />}
			/>
		);

		let roleCard = (
			<PlayingCard
				type={CardType.Role}
				front={<PlaceholderCard text='Role' subtext='Choose one of the Role cards below' />}
			/>
		);

		let backgroundCard = (
			<PlayingCard
				type={CardType.Background}
				front={<PlaceholderCard text='Background' subtext='Choose one of the Background cards below' />}
			/>
		);

		const species = GameLogic.getSpecies(this.state.selectedSpeciesID);
		if (species) {
			speciesCard = (
				<SpeciesCard species={species} />
			);
		}

		const role = GameLogic.getRole(this.state.selectedRoleID);
		if (role) {
			roleCard = (
				<RoleCard role={role} />
			);
		}

		const background = GameLogic.getBackground(this.state.selectedBackgroundID);
		if (background) {
			backgroundCard = (
				<BackgroundCard background={background} />
			);
		}

		return (
			<div className='card-selection-row'>
				<CardList cards={[ speciesCard, roleCard, backgroundCard ]} />
			</div>
		);
	};

	getSpeciesSection = () => {
		if (this.state.selectedSpeciesID) {
			return;
		}

		const cards = this.state.speciesIDs.map(id => {
			const species = GameLogic.getSpecies(id) as SpeciesModel;
			return (
				<SpeciesCard key={species.id} species={species} onSelect={this.selectSpecies} />
			);
		});

		return (
			<div className='card-selection-row'>
				<CardList cards={cards} />
				{ this.props.developer ? <button className='developer' onClick={() => this.redraw(CardType.Species)}>Redraw</button> : null }
			</div>
		);
	};

	getRoleSection = () => {
		if (this.state.selectedRoleID) {
			return;
		}

		const cards = this.state.roleIDs.map(id => {
			const role = GameLogic.getRole(id) as RoleModel;
			return (
				<RoleCard key={role.id} role={role} onSelect={this.selectRole} />
			);
		});

		return (
			<div className='card-selection-row'>
				<CardList cards={cards} />
				{ this.props.developer ? <button className='developer' onClick={() => this.redraw(CardType.Role)}>Redraw</button> : null }
			</div>
		);
	};

	getBackgroundSection = () => {
		if (this.state.selectedBackgroundID) {
			return;
		}

		const cards = this.state.backgroundIDs.map(id => {
			const background = GameLogic.getBackground(id) as BackgroundModel;
			return (
				<BackgroundCard key={background.id} background={background} onSelect={this.selectBackground} />
			);
		});

		return (
			<div className='card-selection-row'>
				<CardList cards={cards} />
				{ this.props.developer ? <button className='developer' onClick={() => this.redraw(CardType.Background)}>Redraw</button> : null }
			</div>
		);
	};

	render = () => {
		try {
			const canSelect = (this.state.selectedSpeciesID !== '') && (this.state.selectedRoleID !== '') && (this.state.selectedBackgroundID !== '');

			return (
				<div className='card-selector-page'>
					<div className='header'>
						<Text type={TextType.Heading}>
							Recruit a Hero
						</Text>
					</div>
					<div className='content'>
						<div className='card-selection-section'>
							{this.getOverviewSection()}
							<hr />
							{this.getSpeciesSection()}
							{this.getRoleSection()}
							{this.getBackgroundSection()}
							{ canSelect ? <button onClick={() => this.select()}>Next</button> : null }
						</div>
					</div>
				</div>
			);
		} catch {
			return <div className='card-selector-page render-error' />;
		}
	};
}

//#endregion

//#region Equipment selector

interface EquipmentSelectorProps {
	hero: CombatantModel;
	developer: boolean;
	addItems: (items: ItemModel[]) => void;
}

interface EquipmentSelectorState {
	slots: {
		proficiency: ItemProficiencyType;
		candidates: ItemModel[];
		selected: ItemModel | null;
	}[];
}

class EquipmentSelector extends Component<EquipmentSelectorProps, EquipmentSelectorState> {
	constructor(props: EquipmentSelectorProps) {
		super(props);

		const role = GameLogic.getRole(this.props.hero.roleID) as RoleModel;
		const slots = role.proficiencies.map(prof => {
			return {
				proficiency: prof,
				candidates: Collections.shuffle(GameLogic.getItemsForProficiency(prof)).splice(0, 3),
				selected: null
			};
		});

		this.state = {
			slots: slots
		};
	}

	selectItem = (item: ItemModel) => {
		const slot = this.state.slots.find(s => s.proficiency === item.proficiency);
		if (slot) {
			const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy.id = Utils.guid();
			slot.selected = copy;
			this.setState({
				slots: this.state.slots
			});
		}
	};

	addItems = () => {
		const items = this.state.slots.map(s => s.selected).filter(i => i !== null) as ItemModel[];
		this.props.addItems(items);
	};

	render = () => {
		try {
			const role = GameLogic.getRole(this.props.hero.roleID);
			if (!role) {
				return null;
			}

			const overviewCards = this.state.slots.map((slot, n) => {
				if (slot.selected) {
					return (
						<ItemCard key={n} item={slot.selected} />
					);
				}
				return (
					<PlayingCard
						key={n}
						type={CardType.Item}
						front={<PlaceholderCard text={slot.proficiency} content={<div>Choose one of the <b>{slot.proficiency}</b> cards below</div>}/>}
					/>
				);
			});

			const slots = this.state.slots.filter(slot => !slot.selected).map((slot, n) => {
				const cards = slot.candidates.map(item => <ItemCard key={item.id} item={item} onSelect={this.selectItem} />);

				return (
					<div key={n} className='card-selection-row'>
						<CardList cards={cards} />
					</div>
				);
			});

			const canSelect = this.state.slots.every(s => s.selected !== null);

			return (
				<div className='equipment-page'>
					<div className='header'>
						<Text type={TextType.Heading}>
							Recruit a Hero
						</Text>
					</div>
					<div className='content'>
						<div className='card-selection-section'>
							<div className='card-selection-row'>
								<CardList cards={overviewCards} />
							</div>
							<hr />
							{slots}
							{ canSelect ? <button onClick={() => this.addItems()}>Next</button> : null }
						</div>
					</div>
				</div>
			);
		} catch {
			return <div className='equipment-page render-error' />;
		}
	};
}

//#endregion

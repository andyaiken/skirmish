import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';
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
import { Utils } from '../../../utils/utils';

import { BackgroundCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, PlayingCard, PlayingCardSide, Tag, Text, TextType } from '../../controls';

import './hero-builder-panel.scss';

interface Props {
	hero: CombatantModel;
	game: GameModel;
	finished: (hero: CombatantModel) => void;
}

interface State {
	hero: CombatantModel;
}

export class HeroBuilderPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const hero = JSON.parse(JSON.stringify(props.hero)) as CombatantModel;
		if (hero.name === '') {
			hero.name = NameGenerator.generateName();
		}

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

	finished = () => {
		this.props.finished(this.state.hero);
	};

	render = () => {
		let content = null;
		if ((this.state.hero.speciesID === '') && (this.state.hero.roleID === '') && (this.state.hero.backgroundID === '')) {
			// Initial card selection
			content = (
				<CardSelector
					game={this.props.game}
					select={this.selectCards}
				/>
			);
		} else if (CombatantLogic.getProficiencies(this.state.hero).length !== this.state.hero.items.length) {
			// Choose initial equipment
			content = (
				<EquipmentSelector
					hero={this.state.hero}
					addItems={this.addItems}
				/>
			);
		} else if (this.state.hero.level === 1) {
			// Finalise character creation
			const species = GameLogic.getSpecies(this.state.hero.speciesID);
			const role = GameLogic.getRole(this.state.hero.roleID);
			const background = GameLogic.getBackground(this.state.hero.backgroundID);

			content = (
				<div className='finish-page'>
					<div className='header'>
						<Text type={TextType.Heading}>
							Recruit a Hero
						</Text>
					</div>
					<div className='content'>
						<div className='rename-section'>
							<div className='hero-name'>
								{this.state.hero.name}
							</div>
							<div className='tags'>
								<Tag>{species?.name ?? ''}</Tag> <Tag>{role?.name ?? ''}</Tag> <Tag>{background?.name ?? ''}</Tag>
							</div>
							<button onClick={this.rename}>Rename this hero</button>
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
	};
}

//#region Card selector

interface CardSelectorProps {
	game: GameModel;
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
			speciesIDs: Collections.shuffle(GameLogic.getSpeciesDeck(CombatantType.Hero)).splice(0, 3),
			roleIDs: Collections.shuffle(GameLogic.getRoleDeck()).splice(0, 3),
			backgroundIDs: Collections.shuffle(GameLogic.getBackgroundDeck()).splice(0, 3),
			selectedSpeciesID: '',
			selectedRoleID: '',
			selectedBackgroundID: ''
		};
	}

	selectSpecies = (id: string) => {
		if (this.state.selectedSpeciesID === '') {
			this.setState({
				selectedSpeciesID: id
			});
		}
	};

	selectRole = (id: string) => {
		if (this.state.selectedRoleID === '') {
			this.setState({
				selectedRoleID: id
			});
		}
	};

	selectBackground = (id: string) => {
		if (this.state.selectedBackgroundID === '') {
			this.setState({
				selectedBackgroundID: id
			});
		}
	};

	select = () => {
		this.props.select(this.state.selectedSpeciesID, this.state.selectedRoleID, this.state.selectedBackgroundID);
	};

	getOverviewSection = () => {
		let speciesCard = (
			<PlayingCard
				type={CardType.Species}
				front={<PlaceholderCard text='Species' subtext={<div>Choose one of the <b>Species</b> cards below</div>} />}
			/>
		);

		let roleCard = (
			<PlayingCard
				type={CardType.Role}
				front={<PlaceholderCard text='Role' subtext={<div>Choose one of the <b>Role</b> cards below</div>} />}
			/>
		);

		let backgroundCard = (
			<PlayingCard
				type={CardType.Background}
				front={<PlaceholderCard text='Background' subtext={<div>Choose one of the <b>Background</b> cards below</div>} />}
			/>
		);

		const species = GameLogic.getSpecies(this.state.selectedSpeciesID);
		if (species) {
			speciesCard = (
				<PlayingCard
					type={CardType.Species}
					front={<SpeciesCard species={species} />}
					footer='Species'
				/>
			);
		}

		const role = GameLogic.getRole(this.state.selectedRoleID);
		if (role) {
			roleCard = (
				<PlayingCard
					type={CardType.Role}
					front={<RoleCard role={role} />}
					footer='Role'
				/>
			);
		}

		const background = GameLogic.getBackground(this.state.selectedBackgroundID);
		if (background) {
			backgroundCard = (
				<PlayingCard
					type={CardType.Background}
					front={<BackgroundCard background={background} />}
					footer='Background'
				/>
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
				<div key={species.id}>
					<PlayingCard
						type={CardType.Species}
						front={<SpeciesCard species={species} />}
						footer='Species'
						back={<PlaceholderCard text='Species' />}
						onClick={(this.state.selectedSpeciesID !== '') ? null : () => this.selectSpecies(species.id)}
					/>
				</div>
			);
		});

		return (
			<div className='card-selection-row'>
				<CardList cards={cards} />
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
				<div key={role.id}>
					<PlayingCard
						type={CardType.Role}
						front={<RoleCard role={role} />}
						footer='Role'
						back={<PlaceholderCard text='Role' />}
						onClick={(this.state.selectedRoleID !== '') ? null : () => this.selectRole(role.id)}
					/>
				</div>
			);
		});

		return (
			<div className='card-selection-row'>
				<CardList cards={cards} />
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
				<div key={background.id}>
					<PlayingCard
						type={CardType.Background}
						front={<BackgroundCard background={background} />}
						footer='Background'
						back={<PlaceholderCard text='Background' />}
						onClick={(this.state.selectedBackgroundID !== '') ? null : () => this.selectBackground(background.id)}
					/>
				</div>
			);
		});

		return (
			<div className='card-selection-row'>
				<CardList cards={cards} />
			</div>
		);
	};

	render = () => {
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
						{ canSelect ? <button onClick={() => this.select()}>Select these cards</button> : null }
					</div>
				</div>
			</div>
		);
	};
}

//#endregion

//#region Equipment selector

interface EquipmentSelectorProps {
	hero: CombatantModel;
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
		const role = GameLogic.getRole(this.props.hero.roleID);
		if (!role) {
			return null;
		}

		const overviewCards = this.state.slots.map((slot, n) => {
			if (slot.selected) {
				return (
					<PlayingCard
						key={n}
						type={CardType.Item}
						front={<ItemCard item={slot.selected} />}
						footer='Item'
					/>
				);
			}
			return (
				<PlayingCard
					key={n}
					type={CardType.Item}
					front={<PlaceholderCard text={slot.proficiency} subtext={<div>Choose one of the <b>{slot.proficiency}</b> cards below</div>}/>}
				/>
			);
		});

		const slots = this.state.slots.filter(slot => !slot.selected).map((slot, n) => {
			const cards = slot.candidates.map(item => {
				return (
					<div key={item.id}>
						<PlayingCard
							type={CardType.Item}
							front={<ItemCard item={item} />}
							footer='Item'
							back={<PlaceholderCard text='Item' />}
							display={(slot.selected !== null) && (slot.selected.name !== item.name) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={(slot.selected !== null) ? null : () => this.selectItem(item)}
						/>
					</div>
				);
			});

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
						{ canSelect ? <button onClick={() => this.addItems()}>Select these items</button> : null }
					</div>
				</div>
			</div>
		);
	};
}

//#endregion

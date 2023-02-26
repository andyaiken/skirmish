import { Component } from 'react';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';
import { NameGenerator } from '../../../logic/name-generator';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

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

	public render() {
		const header = (
			<div className='header'>
				<Text type={TextType.Heading}>
					Recruit a Hero
				</Text>
			</div>
		);

		let content = null;
		if ((this.state.hero.speciesID === '') && (this.state.hero.roleID === '') && (this.state.hero.backgroundID === '')) {
			// Initial card selection
			content = (
				<CardSelector
					game={this.props.game}
					header={header}
					select={this.selectCards}
				/>
			);
		} else if (CombatantLogic.getProficiencies(this.state.hero).length !== this.state.hero.items.length) {
			// Choose initial equipment
			content = (
				<EquipmentSelector
					hero={this.state.hero}
					header={header}
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
					{header}
					<div className='content'>
						<div className='rename-section'>
							<div className='hero-name'>
								{this.state.hero.name}
							</div>
							<div className='tags'>
								<Tag>{species?.name ?? ''}</Tag> <Tag>{role?.name ?? ''}</Tag> <Tag>{background?.name ?? ''}</Tag>
							</div>
							<button onClick={this.rename}>Rename this hero</button>
						</div>
					</div>
					<div className='footer'>
						<button onClick={this.finished}>Finished</button>
					</div>
				</div>
			);
		}

		return (
			<div className='hero-builder-panel'>
				{content}
			</div>
		);
	}
}

//#region Card selector

interface CardSelectorProps {
	game: GameModel;
	header: JSX.Element;
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
			speciesIDs: Collections.shuffle(GameLogic.getSpeciesDeck(this.props.game)).splice(0, 3),
			roleIDs: Collections.shuffle(GameLogic.getRoleDeck(this.props.game)).splice(0, 3),
			backgroundIDs: Collections.shuffle(GameLogic.getBackgroundDeck(this.props.game)).splice(0, 3),
			selectedSpeciesID: '',
			selectedRoleID: '',
			selectedBackgroundID: ''
		};
	}

	private selectSpecies(id: string) {
		if (this.state.selectedSpeciesID === '') {
			this.setState({
				selectedSpeciesID: id
			});
		}
	}

	private selectRole(id: string) {
		if (this.state.selectedRoleID === '') {
			this.setState({
				selectedRoleID: id
			});
		}
	}

	private selectBackground(id: string) {
		if (this.state.selectedBackgroundID === '') {
			this.setState({
				selectedBackgroundID: id
			});
		}
	}

	private select() {
		this.props.select(this.state.selectedSpeciesID, this.state.selectedRoleID, this.state.selectedBackgroundID);
	}

	public render() {
		const speciesCards = this.state.speciesIDs.map(id => {
			const species = GameLogic.getSpecies(id);
			if (species) {
				return (
					<div key={species.id}>
						<PlayingCard
							front={<SpeciesCard species={species} />}
							back={<PlaceholderCard text='Species' />}
							display={(this.state.selectedSpeciesID !== '') && (this.state.selectedSpeciesID !== species.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={(this.state.selectedSpeciesID !== '') ? null : () => this.selectSpecies(species.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const roleCards = this.state.roleIDs.map(id => {
			const role = GameLogic.getRole(id);
			if (role) {
				return (
					<div key={role.id}>
						<PlayingCard
							front={<RoleCard role={role} />}
							back={<PlaceholderCard text='Role' />}
							display={(this.state.selectedRoleID !== '') && (this.state.selectedRoleID !== role.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={(this.state.selectedRoleID !== '') ? null : () => this.selectRole(role.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const backgroundCards = this.state.backgroundIDs.map(id => {
			const background = GameLogic.getBackground(id);
			if (background) {
				return (
					<div key={background.id}>
						<PlayingCard
							front={<BackgroundCard background={background} />}
							back={<PlaceholderCard text='Background' />}
							display={(this.state.selectedBackgroundID !== '') && (this.state.selectedBackgroundID !== background.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={(this.state.selectedBackgroundID !== '') ? null : () => this.selectBackground(background.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const canSelect = (this.state.selectedSpeciesID !== '') && (this.state.selectedRoleID !== '') && (this.state.selectedBackgroundID !== '');

		return (
			<div className='card-selector-page'>
				{this.props.header}
				<div className='content'>
					<div className='card-selection-row'>
						<Text>Select one of these <b>species</b> cards:</Text>
						<CardList cards={speciesCards} />
					</div>
					<div className='card-selection-row'>
						<Text>Select one of these <b>role</b> cards:</Text>
						<CardList cards={roleCards} />
					</div>
					<div className='card-selection-row'>
						<Text>Select one of these <b>background</b> cards:</Text>
						<CardList cards={backgroundCards} />
					</div>
				</div>
				<div className='footer'>
					<button disabled={!canSelect} onClick={() => this.select()}>Select these cards</button>
				</div>
			</div>
		);
	}
}

//#endregion

//#region Equipment selector

interface EquipmentSelectorProps {
	hero: CombatantModel;
	header: JSX.Element;
	addItems: (items: ItemModel[]) => void;
}

interface EquipmentSelectorState {
	items: ItemModel[];
}

class EquipmentSelector extends Component<EquipmentSelectorProps, EquipmentSelectorState> {
	constructor(props: EquipmentSelectorProps) {
		super(props);
		this.state = {
			items: []
		};
	}

	private selectItem(id: string) {
		const item = GameLogic.getItem(id);
		if (item) {
			const slotFilled = this.state.items.find(i => i.proficiency === item.proficiency);
			if (!slotFilled) {
				const items = this.state.items;
				const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
				copy.id = Utils.guid();
				items.push(copy);
				this.setState({
					items: items
				});
			}
		}
	}

	public render() {
		const role = GameLogic.getRole(this.props.hero.roleID);
		if (!role) {
			return null;
		}

		const slots = role.proficiencies.map((prof, n) => {
			const currentItemNames = this.state.items
				.filter(item => item.proficiency === prof)
				.map(item => item.name);

			const items = GameLogic.getItemsForProficiency(prof).map(item => (
				<div key={item.id}>
					<PlayingCard
						front={<ItemCard item={item} />}
						back={<PlaceholderCard text='Item' />}
						display={(currentItemNames.length !== 0) && (!currentItemNames.includes(item.name)) ? PlayingCardSide.Back : PlayingCardSide.Front}
						onClick={(currentItemNames.length !== 0) ? null : () => this.selectItem(item.id)}
					/>
				</div>
			));

			return (
				<div key={n}>
					<Text>Choose an item for <b>{prof}</b>:</Text>
					<CardList cards={items} />
				</div>
			);
		});

		const canSelect = (this.state.items.length === role.proficiencies.length);

		return (
			<div className='equipment-page'>
				{this.props.header}
				<div className='content'>
					{slots}
				</div>
				<div className='footer'>
					<button disabled={!canSelect} onClick={() => this.props.addItems(this.state.items)}>Select these items</button>
				</div>
			</div>
		);
	}
}

//#endregion

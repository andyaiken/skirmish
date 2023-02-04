import { Component } from 'react';
import { getBackground, getBackgroundDeck } from '../../../models/background';
import { createHero, Hero, proficiencies } from '../../../models/hero';
import { getItem, getItems, Item } from '../../../models/item';
import { getRole, getRoleDeck } from '../../../models/role';
import { getSpecies, getSpeciesDeck } from '../../../models/species';
import { shuffle } from '../../../utils/collections';
import { generateName } from '../../../utils/name-generator';
import { BackgroundCard, ItemCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, PlayingCard, PlayingCardSide, Text, TextType } from '../../utility';

import './hero-builder-panel.scss';

interface Props {
	finished: (hero: Hero) => void;
}

interface State {
	hero: Hero;
}

export class HeroBuilderPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const hero = createHero();
		hero.name = generateName();

		this.state = {
			hero: hero
		};
	}

	rename = () => {
		const hero = this.state.hero;
		hero.name = generateName();
		this.setState({
			hero: hero
		});
	}

	finished = () => {
		this.props.finished(this.state.hero);
	}

	public render() {
		let content = null;
		if ((this.state.hero.speciesID === '') && (this.state.hero.roleID === '') && (this.state.hero.backgroundID === '')) {
			content = (
				<CardSelector
					select={(speciesID, roleID, backgroundID) => {
						const hero = this.state.hero;
						hero.speciesID = speciesID;
						hero.roleID = roleID;
						hero.backgroundID = backgroundID;
						this.setState({
							hero: hero
						});
					}}
				/>
			);
		} else if (proficiencies(this.state.hero).length !== this.state.hero.items.length) {
			content = (
				<EquipmentSelector
					hero={this.state.hero}
					addItems={items => {
						const hero = this.state.hero;
						hero.items = items;
						this.setState({
							hero: hero
						});
					}}
				/>
			);
		} else {
			content = (
				<div>
					<button onClick={this.rename}>Rename</button>
					<button onClick={this.finished}>Finished</button>
				</div>
			);
		}

		let cardInfo = null;
		if ((this.state.hero.speciesID !== '') && (this.state.hero.roleID !== '') && (this.state.hero.backgroundID !== '')) {
			const species = getSpecies(this.state.hero.speciesID);
			const role = getRole(this.state.hero.roleID);
			const background = getBackground(this.state.hero.backgroundID);
			cardInfo = (
				<Text>
					<b>{this.state.hero.name}</b> is a <b>{species?.name} {role?.name} {background?.name}</b>
				</Text>
			);
		}

		let itemInfo = null;
		if (this.state.hero.items.length > 0) {
			itemInfo = (
				<Text>
					They carry: <b>{this.state.hero.items.map(i => i.name).join(', ')}</b>
				</Text>
			);
		}

		return (
			<div className='hero-builder-panel'>
				<Text type={TextType.Heading}>Create a Hero</Text>
				{cardInfo}
				{itemInfo}
				{content}
			</div>
		);
	}
}

//#region Cards

interface CardSelectorProps {
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
			speciesIDs: shuffle(getSpeciesDeck()).splice(0, 3),
			roleIDs: shuffle(getRoleDeck()).splice(0, 3),
			backgroundIDs: shuffle(getBackgroundDeck()).splice(0, 3),
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
			const species = getSpecies(id);
			if (species) {
				return (
					<div key={species.id}>
						<PlayingCard
							front={<SpeciesCard species={species} />}
							back='Species'
							display={(this.state.selectedSpeciesID !== '') && (this.state.selectedSpeciesID !== species.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={() => this.selectSpecies(species.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const roleCards = this.state.roleIDs.map(id => {
			const role = getRole(id);
			if (role) {
				return (
					<div key={role.id}>
						<PlayingCard
							front={<RoleCard role={role} />}
							back='Role'
							display={(this.state.selectedRoleID !== '') && (this.state.selectedRoleID !== role.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={() => this.selectRole(role.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const backgroundCards = this.state.backgroundIDs.map(id => {
			const background = getBackground(id);
			if (background) {
				return (
					<div key={background.id}>
						<PlayingCard
							front={<BackgroundCard background={background} />}
							back='Background'
							display={(this.state.selectedBackgroundID !== '') && (this.state.selectedBackgroundID !== background.id) ? PlayingCardSide.Back : PlayingCardSide.Front}
							onClick={() => this.selectBackground(background.id)}
						/>
					</div>
				);
			}

			return null;
		});

		const canSelect = (this.state.selectedSpeciesID !== '') && (this.state.selectedRoleID !== '') && (this.state.selectedBackgroundID !== '');

		return (
			<div>
				<Text>Select one of these <b>species</b> cards:</Text>
				<CardList cards={speciesCards} />
				<Text>Select one of these <b>role</b> cards:</Text>
				<CardList cards={roleCards} />
				<Text>Select one of these <b>background</b> cards:</Text>
				<CardList cards={backgroundCards} />
				<button disabled={!canSelect} onClick={() => this.select()}>Select these cards</button>
			</div>
		);
	}
}

//#endregion

//#region Equipment

interface EquipmentSelectorProps {
	hero: Hero;
	addItems: (items: Item[]) => void;
}

interface EquipmentSelectorState {
	items: Item[];
}

class EquipmentSelector extends Component<EquipmentSelectorProps, EquipmentSelectorState> {
	constructor(props: EquipmentSelectorProps) {
		super(props);
		this.state = {
			items: []
		};
	}

	private selectItem(id: string) {
		const item = getItem(id);
		if (item) {
			const slotFilled = this.state.items.find(i => i.proficiency === item.proficiency);
			if (!slotFilled) {
				const items = this.state.items;
				items.push(item);
				this.setState({
					items: items
				});
			}
		}
	}

	public render() {
		const role = getRole(this.props.hero.roleID);
		if (!role) {
			return null;
		}

		const slots = role.proficiencies.map((prof, n) => {
			const currentItemIDs = this.state.items
				.filter(item => item.proficiency === prof)
				.map(item => item.id);

			const items = getItems(prof).map(item => (
				<div key={item.id}>
					<PlayingCard
						front={<ItemCard item={item} />}
						back='Item'
						display={(currentItemIDs.length !== 0) && (!currentItemIDs.includes(item.id)) ? PlayingCardSide.Back : PlayingCardSide.Front}
						onClick={() => this.selectItem(item.id)}
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
			<div>
				{slots}
				<button disabled={!canSelect} onClick={() => this.props.addItems(this.state.items)}>Select these items</button>
			</div>
		);
	}
}

//#endregion

import { Component } from 'react';
import { BackgroundHelper } from '../../../models/background';
import { Hero, HeroHelper } from '../../../models/hero';
import { Item, ItemHelper } from '../../../models/item';
import { RoleHelper } from '../../../models/role';
import { SpeciesHelper } from '../../../models/species';
import { shuffle } from '../../../utils/collections';
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
		this.state = {
			hero: HeroHelper.createHero()
		};
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
		} else if (HeroHelper.proficiencies(this.state.hero).length !== this.state.hero.items.length) {
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
				<button onClick={() => this.props.finished(this.state.hero)}>
					OK
				</button>
			);
		}

		let cardInfo = null;
		if ((this.state.hero.speciesID !== '') && (this.state.hero.roleID !== '') && (this.state.hero.backgroundID !== '')) {
			const species = SpeciesHelper.getSpecies(this.state.hero.speciesID);
			const role = RoleHelper.getRole(this.state.hero.roleID);
			const background = BackgroundHelper.getBackground(this.state.hero.backgroundID);
			cardInfo = (
				<Text>
					This hero is a <b>{species?.name} {role?.name} {background?.name}</b>
				</Text>
			);
		}

		let itemInfo = null;
		if (this.state.hero.items.length > 0) {
			itemInfo = (
				<Text>
					Items: <b>{this.state.hero.items.map(i => i.name).join(', ')}</b>
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
			speciesIDs: shuffle(SpeciesHelper.getDeck()).splice(0, 3),
			roleIDs: shuffle(RoleHelper.getDeck()).splice(0, 3),
			backgroundIDs: shuffle(BackgroundHelper.getDeck()).splice(0, 3),
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
			const species = SpeciesHelper.getSpecies(id);
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
			const role = RoleHelper.getRole(id);
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
			const background = BackgroundHelper.getBackground(id);
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
		const item = ItemHelper.getItem(id);
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
		const role = RoleHelper.getRole(this.props.hero.roleID);
		if (!role) {
			return null;
		}

		const slots = role.proficiencies.map((prof, n) => {
			const currentItemIDs = this.state.items
				.filter(item => item.proficiency === prof)
				.map(item => item.id);

			const items = ItemHelper.getItems(prof).map(item => (
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

import { Button, Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import { BackgroundHelper } from '../../models/background';
import { Hero, HeroHelper } from '../../models/hero';
import { Item, ItemHelper } from '../../models/item';
import { RoleHelper } from '../../models/role';
import { SpeciesHelper } from '../../models/species';
import { Utils } from '../../utils/utils';
import { BackgroundCard } from '../cards/background-card';
import { ItemCard } from '../cards/item-card';
import { RoleCard } from '../cards/role-card';
import { SpeciesCard } from '../cards/species-card';
import { Padding } from '../utility/padding';
import { PlayingCard } from '../utility/playing-card';

interface Props {
	finished: (hero: Hero) => void;
}

interface State {
	hero: Hero;
}

export class HeroBuilderPanel extends React.Component<Props, State> {
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
				<Button block={true} type='primary' onClick={() => this.props.finished(this.state.hero)}>
					OK
				</Button>
			);
		}

		let cardInfo = null;
		if ((this.state.hero.speciesID !== '') && (this.state.hero.roleID !== '') && (this.state.hero.backgroundID !== '')) {
			const species = SpeciesHelper.getSpecies(this.state.hero.speciesID);
			const role = RoleHelper.getRole(this.state.hero.roleID);
			const background = BackgroundHelper.getBackground(this.state.hero.backgroundID);
			cardInfo = (
				<Typography.Paragraph>
					This hero is a <b>{species?.name} {role?.name} {background?.name}</b>
				</Typography.Paragraph>
			);
		}

		let itemInfo = null;
		if (this.state.hero.items.length > 0) {
			itemInfo = (
				<Typography.Paragraph>
					Items: <b>{this.state.hero.items.map(i => i.name).join(', ')}</b>
				</Typography.Paragraph>
			);
		}

		return (
			<div className='hero-builder'>
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

class CardSelector extends React.Component<CardSelectorProps, CardSelectorState> {
	constructor(props: CardSelectorProps) {
		super(props);
		this.state = {
			speciesIDs: Utils.shuffle(SpeciesHelper.getDeck()).splice(0, 3),
			roleIDs: Utils.shuffle(RoleHelper.getDeck()).splice(0, 3),
			backgroundIDs: Utils.shuffle(BackgroundHelper.getDeck()).splice(0, 3),
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
					<Col span={8} key={species.id}>
						<PlayingCard
							back='Species'
							display={(this.state.selectedSpeciesID !== '') && (this.state.selectedSpeciesID !== species.id) ? 'back' : 'front'}
							onClick={() => this.selectSpecies(species.id)}
						>
							<SpeciesCard species={species} />
						</PlayingCard>
					</Col>
				);
			}

			return null;
		});

		const roleCards = this.state.roleIDs.map(id => {
			const role = RoleHelper.getRole(id);
			if (role) {
				return (
					<Col span={8} key={role.id}>
						<PlayingCard
							back='Role'
							display={(this.state.selectedRoleID !== '') && (this.state.selectedRoleID !== role.id) ? 'back' : 'front'}
							onClick={() => this.selectRole(role.id)}
						>
							<RoleCard role={role} />
						</PlayingCard>
					</Col>
				);
			}

			return null;
		});

		const backgroundCards = this.state.backgroundIDs.map(id => {
			const background = BackgroundHelper.getBackground(id);
			if (background) {
				return (
					<Col span={8} key={background.id}>
						<PlayingCard
							back='Background'
							display={(this.state.selectedBackgroundID !== '') && (this.state.selectedBackgroundID !== background.id) ? 'back' : 'front'}
							onClick={() => this.selectBackground(background.id)}
						>
							<BackgroundCard background={background} />
						</PlayingCard>
					</Col>
				);
			}

			return null;
		});

		const canSelect = (this.state.selectedSpeciesID !== '') && (this.state.selectedRoleID !== '') && (this.state.selectedBackgroundID !== '');

		return (
			<div>
				<Typography.Paragraph>
					Select one of these <b>species</b> cards:
				</Typography.Paragraph>
				<Row gutter={10}>
					{speciesCards}
				</Row>
				<Divider/>
				<Typography.Paragraph>
					Select one of these <b>role</b> cards:
				</Typography.Paragraph>
				<Row gutter={10}>
					{roleCards}
				</Row>
				<Divider/>
				<Typography.Paragraph>
					Select one of these <b>background</b> cards:
				</Typography.Paragraph>
				<Row gutter={10}>
					{backgroundCards}
				</Row>
				<Divider/>
				<Button block={true} type='primary' disabled={!canSelect} onClick={() => this.select()}>Select these cards</Button>
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

class EquipmentSelector extends React.Component<EquipmentSelectorProps, EquipmentSelectorState> {
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
				<Col span={6} key={item.id}>
					<PlayingCard
						back='Item'
						display={(currentItemIDs.length !== 0) && (!currentItemIDs.includes(item.id)) ? 'back' : 'front'}
						onClick={() => this.selectItem(item.id)}
					>
						<ItemCard item={item} />
					</PlayingCard>
				</Col>
			));

			return (
				<div key={n}>
					<Typography.Paragraph>
						Choose an item for <b>{prof}</b>:
					</Typography.Paragraph>
					<Row gutter={10}>
						{items}
					</Row>
					<Divider/>
				</div>
			);
		});

		const canSelect = (this.state.items.length === role.proficiencies.length);

		return (
			<div>
				{slots}
				<Button block={true} type='primary' disabled={!canSelect} onClick={() => this.props.addItems(this.state.items)}>Select these items</Button>
			</div>
		);
	}
}

//#endregion

import { IconCheck, IconRefresh } from '@tabler/icons-react';
import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { BackgroundModel } from '../../../../models/background';
import type { OptionsModel } from '../../../../models/options';
import type { RoleModel } from '../../../../models/role';
import type { SpeciesModel } from '../../../../models/species';

import { Collections } from '../../../../utils/collections';

import { BackgroundCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, Expander, PlayingCard, Text, TextType } from '../../../controls';

import './card-page.scss';

interface Props {
	options: OptionsModel;
	select: (speciesID: string, roleID: string, backgroundID: string) => void;
}

interface State {
	speciesIDs: string[];
	roleIDs: string[];
	backgroundIDs: string[];
	selectedSpeciesID: string;
	selectedRoleID: string;
	selectedBackgroundID: string;
}

export class CardPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			speciesIDs: Collections.shuffle(GameLogic.getHeroSpeciesDeck(props.options.packIDs).map(s => s.id)).splice(0, 3),
			roleIDs: Collections.shuffle(GameLogic.getRoleDeck(props.options.packIDs).map(r => r.id)).splice(0, 3),
			backgroundIDs: Collections.shuffle(GameLogic.getBackgroundDeck(props.options.packIDs).map(b => b.id)).splice(0, 3),
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
					speciesIDs: Collections.shuffle(GameLogic.getHeroSpeciesDeck(this.props.options.packIDs).map(s => s.id)).splice(0, 3)
				});
				break;
			case CardType.Role:
				this.setState({
					roleIDs: Collections.shuffle(GameLogic.getRoleDeck(this.props.options.packIDs).map(r => r.id)).splice(0, 3)
				});
				break;
			case CardType.Background:
				this.setState({
					backgroundIDs: Collections.shuffle(GameLogic.getBackgroundDeck(this.props.options.packIDs).map(b => b.id)).splice(0, 3)
				});
				break;
		}
	};

	getOverviewSection = () => {
		let speciesCard = (
			<PlayingCard
				type={CardType.Species}
				disabled={true}
				front={<PlaceholderCard text='Species' subtext='Choose one of the Species cards below' />}
			/>
		);

		let roleCard = (
			<PlayingCard
				type={CardType.Role}
				disabled={true}
				front={<PlaceholderCard text='Role' subtext='Choose one of the Role cards below' />}
			/>
		);

		let backgroundCard = (
			<PlayingCard
				type={CardType.Background}
				disabled={true}
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
				{ this.props.options.developer ? <button className='developer' onClick={() => this.redraw(CardType.Species)}>Redraw</button> : null }
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
				{ this.props.options.developer ? <button className='developer' onClick={() => this.redraw(CardType.Role)}>Redraw</button> : null }
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
				{ this.props.options.developer ? <button className='developer' onClick={() => this.redraw(CardType.Background)}>Redraw</button> : null }
			</div>
		);
	};

	render = () => {
		try {
			const canSelect = (this.state.selectedSpeciesID !== '') && (this.state.selectedRoleID !== '') && (this.state.selectedBackgroundID !== '');

			return (
				<div className='card-page'>
					{this.getOverviewSection()}
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>To make a hero choose one Species card, one Role card, and one Background card.</Text>
								}
								content={
									<div>
										<p>Click on a card, or press the <IconCheck size={15} /> button, to select it.</p>
										<p>You can click on the <IconRefresh size={15} /> button to flip a card over and see its details.</p>
										<p>Each card gives the hero a set of <b>features</b> and <b>actions</b>.</p>
										<ul>
											<li>Features are used when the hero gains a level.</li>
											<li>Actions are used in encounters.</li>
										</ul>
									</div>
								}
							/>
							: null
					}
					<hr />
					{this.getSpeciesSection()}
					{this.getRoleSection()}
					{this.getBackgroundSection()}
					{ canSelect ? <button onClick={() => this.select()}>Next</button> : null }
				</div>
			);
		} catch {
			return <div className='card-page render-error' />;
		}
	};
}
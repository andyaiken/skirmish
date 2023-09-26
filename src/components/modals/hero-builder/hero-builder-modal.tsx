import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { NameGenerator } from '../../../generators/name-generator';

import { CombatantLogic } from '../../../logic/combatant-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Random } from '../../../utils/random';

import { Text, TextType } from '../../controls';
import { CardPage } from './card-page/card-page';
import { EquipmentPage } from './equipment-page/equipment-page';
import { FinishPage } from './finish-page/finish-page';

import './hero-builder-modal.scss';

interface Props {
	hero: CombatantModel;
	game: GameModel;
	options: OptionsModel;
	useCharge: (type: StructureType, count: number) => void;
	finished: (hero: CombatantModel) => void;
}

interface State {
	hero: CombatantModel;
}

export class HeroBuilderModal extends Component<Props, State> {
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
					<CardPage
						game={this.props.game}
						options={this.props.options}
						select={this.selectCards}
						useCharge={this.props.useCharge}
					/>
				);
			} else if (CombatantLogic.getProficiencies(this.state.hero).length !== this.state.hero.items.length) {
				// Choose initial equipment
				content = (
					<EquipmentPage
						hero={this.state.hero}
						game={this.props.game}
						options={this.props.options}
						addItems={this.addItems}
						useCharge={this.props.useCharge}
					/>
				);
			} else if (this.state.hero.level === 1) {
				// Finalise character creation
				content = (
					<FinishPage
						hero={this.state.hero}
						options={this.props.options}
						rename={this.rename}
						recolor={this.recolor}
						finished={this.finished}
					/>
				);
			}

			return (
				<div className='hero-builder-modal'>
					<div className='header'>
						<Text type={TextType.Heading}>
							Recruit a Hero
						</Text>
					</div>
					<div className='content'>
						{content}
					</div>
				</div>
			);
		} catch {
			return <div className='hero-builder-modal render-error' />;
		}
	};
}

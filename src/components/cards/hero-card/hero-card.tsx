import { Component, MouseEvent } from 'react';
import { IconCheck, IconId, IconRefresh, IconX } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { TraitType } from '../../../enums/trait-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';

import { Color } from '../../../utils/color';

import { Gauge, PlayingCard, StatValue, Tag, Text, TextType } from '../../controls';
import { ListItemPanel } from '../../panels';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './hero-card.scss';

interface Props {
	hero: CombatantModel;
	onCharacterSheet: ((hero: CombatantModel) => void) | null;
	onRetire: ((hero: CombatantModel) => void) | null;
	onSelect: ((hero: CombatantModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class HeroCard extends Component<Props, State> {
	static defaultProps = {
		onCharacterSheet: null,
		onRetire: null,
		onSelect: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	onFlip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			flipped: !this.state.flipped
		});
	};

	onCharacterSheet = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onCharacterSheet) {
			this.props.onCharacterSheet(this.props.hero);
		}
	};

	onRetire = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onRetire) {
			this.props.onRetire(this.props.hero);
		}
	};

	onSelect = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onSelect) {
			this.props.onSelect(this.props.hero);
		}
	};

	render = () => {
		let colorDark = this.props.hero.color;
		let colorLight = this.props.hero.color;
		const color = Color.parse(this.props.hero.color);
		if (color) {
			colorDark = Color.toString(Color.darken(color));
			colorLight = Color.toString(Color.lighten(color));
		}

		let items = null;
		const magicItems = this.props.hero.items.filter(i => i.magic);
		if (magicItems.length > 0) {
			items = (
				<div className='items'>
					<Text type={TextType.MinorHeading}>Magic Items</Text>
					{magicItems.map(i => (<ListItemPanel key={i.id} item={`${i.name} (${i.baseItem})`} />))}
				</div>
			);
		}

		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' title='Flip' onClick={this.onFlip}><IconRefresh /></button>
		);
		if (this.props.onCharacterSheet) {
			buttons.push(
				<button key='character-sheet' className='icon-btn' title='Character Sheet' onClick={this.onCharacterSheet}><IconId /></button>
			);
		}
		if (this.props.onSelect && (buttons.length > 0)) {
			buttons.push(
				<button key='select' className='icon-btn' title='Select' onClick={this.onSelect}><IconCheck /></button>
			);
		}
		if (this.props.onRetire) {
			buttons.push(
				<button key='retire' className='icon-btn' title='Retire' onClick={this.onRetire}><IconX /></button>
			);
		}

		const species = GameLogic.getSpecies(this.props.hero.speciesID);
		const role = GameLogic.getRole(this.props.hero.roleID);
		const background = GameLogic.getBackground(this.props.hero.backgroundID);

		return (
			<PlayingCard
				type={CardType.Hero}
				front={(
					<PlaceholderCard
						text={this.props.hero.name}
						content={(
							<div className='hero-card-front'>
								<div
									className='color-box'
									style={{
										backgroundImage: `linear-gradient(135deg, ${colorLight}, ${this.props.hero.color})`,
										borderColor: colorDark
									}}
								/>
								<div className='tags'>
									{species ? <Tag>{species.name}</Tag> : null}
									{role ? <Tag>{role.name}</Tag> : null}
									{background ? <Tag>{background.name}</Tag> : null}
									<Tag>Level {this.props.hero.level}</Tag>
									{this.props.hero.quirks.map((q, n) => <Tag key={n}>{q}</Tag>)}
								</div>
							</div>
						)}
					/>
				)}
				back={(
					<div className='hero-card-back'>
						<Text type={TextType.MinorHeading}>Traits</Text>
						<div className='traits'>
							<StatValue orientation='vertical' label='End' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Endurance)} />
							<StatValue orientation='vertical' label='Res' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Resolve)} />
							<StatValue orientation='vertical' label='Spd' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Speed)} />
						</div>
						<Text type={TextType.MinorHeading}>XP</Text>
						<div className='xp'>
							<Gauge
								progress={this.props.hero.xp / this.props.hero.level}
								content={`${this.props.hero.xp} / ${this.props.hero.level}`}
							/>
						</div>
						{items}
					</div>
				)}
				footerText='Hero'
				footerContent={buttons}
				flipped={this.state.flipped}
				onClick={this.props.onSelect ? this.onSelect : null}
			/>
		);
	};
}

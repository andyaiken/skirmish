import { Component, MouseEvent } from 'react';
import { IconId, IconRefresh, IconX } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { TraitType } from '../../../enums/trait-type';

import { CombatantLogic } from '../../../logic/combatant-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';

import { Gauge, PlayingCard, StatValue, Tag, Text, TextType } from '../../controls';
import { ListItemPanel } from '../../panels';
import { MiniToken } from '../../panels/encounter-map/mini-token/mini-token';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './hero-card.scss';

interface Props {
	hero: CombatantModel;
	disabled: boolean;
	onClick: ((hero: CombatantModel) => void) | null;
	onCharacterSheet: ((hero: CombatantModel) => void) | null;
	onRetire: ((hero: CombatantModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class HeroCard extends Component<Props, State> {
	static defaultProps = {
		disabled: false,
		onClick: null,
		onCharacterSheet: null,
		onRetire: null
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

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.hero);
		}
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

	render = () => {
		let items = null;
		const magicItems = this.props.hero.items.filter(i => i.magic);
		if (magicItems.length > 0) {
			items = (
				<div className='items'>
					<hr />
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
								<div className='token-container'>
									<MiniToken
										combatant={this.props.hero}
										encounter={null}
										squareSize={70}
										mapDimensions={{ left: 0, top: 0 }}
										selectable={true}
										selected={false}
										onClick={() => null}
									/>
								</div>
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
						<div className='xp'>
							<Gauge
								progress={this.props.hero.xp / this.props.hero.level}
								content={(
									<div><b>{this.props.hero.xp} XP</b> / {this.props.hero.level}</div>
								)}
							/>
						</div>
						<hr />
						<div className='traits'>
							<StatValue orientation='vertical' label='End' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Endurance)} />
							<StatValue orientation='vertical' label='Res' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Resolve)} />
							<StatValue orientation='vertical' label='Spd' value={CombatantLogic.getTraitRank(this.props.hero, [], TraitType.Speed)} />
						</div>
						{items}
					</div>
				)}
				footerText='Hero'
				footerContent={buttons}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : this.onFlip}
			/>
		);
	};
}

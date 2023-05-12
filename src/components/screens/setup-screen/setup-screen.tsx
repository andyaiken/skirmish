import { Component } from 'react';
import { IconId } from '@tabler/icons-react';

import { CombatantType } from '../../../enums/combatant-type';

import { Factory } from '../../../logic/factory';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { ItemModel } from '../../../models/item';

import { CharacterSheetPanel, HeroBuilderPanel } from '../../panels';
import { Dialog, Tag, Text, TextType } from '../../controls';
import { MiniToken } from '../../panels/encounter-map/mini-token/mini-token';

import './setup-screen.scss';

interface Props {
	game: GameModel;
	addHero: (hero: CombatantModel) => void;
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	beginCampaign: () => void;
}

interface State {
	hero: CombatantModel | null;
}

export class SetupScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hero: null
		};
	}

	createHero = () => {
		this.setState({
			hero: Factory.createCombatant(CombatantType.Hero)
		});
	};

	selectHero = (hero: CombatantModel | null) => {
		this.setState({
			hero: hero
		});
	};

	getDialog = () => {
		if (this.state.hero) {
			if (this.state.hero.name === '') {
				return (
					<Dialog
						content={(
							<HeroBuilderPanel
								hero={this.state.hero}
								game={this.props.game}
								finished={hero => {
									const h = this.state.hero as CombatantModel;
									this.setState({
										hero: null
									}, () => {
										hero.id = h.id;
										this.props.addHero(hero);
									});
								}}
							/>
						)}
					/>
				);
			} else {
				return (
					<Dialog
						content={
							<CharacterSheetPanel
								combatant={this.state.hero}
								game={this.props.game}
								developer={false}
								equipItem={this.props.equipItem}
								unequipItem={this.props.unequipItem}
								pickUpItem={this.props.pickUpItem}
								dropItem={this.props.dropItem}
								levelUp={() => null}
							/>
						}
						onClose={() => this.selectHero(null)}
					/>
				);
			}
		}

		return null;
	};

	render = () => {
		const heroes = this.props.game.heroes
			.map(h => {
				return (
					<div key={h.id} className='hero-panel'>
						<div className='token-container'>
							<MiniToken
								combatant={h}
								encounter={null}
								squareSize={40}
								mapDimensions={{ left: 0, top: 0 }}
								selectable={true}
								selected={false}
								onClick={() => null}
								onDoubleClick={() => null}
							/>
						</div>
						<div className='name'>
							<Text type={TextType.SubHeading}>{h.name}</Text>
						</div>
						<div className='tags'>
							<Tag>{GameLogic.getSpecies(h.speciesID)?.name ?? 'Unknown species'}</Tag>
							<Tag>{GameLogic.getRole(h.roleID)?.name ?? 'Unknown role'}</Tag>
							<Tag>{GameLogic.getBackground(h.backgroundID)?.name ?? 'Unknown background'}</Tag>
						</div>
						<button className='icon-btn' onClick={() => this.selectHero(h)}>
							<IconId />
						</button>
					</div>
				);
			});
		while (heroes.length < 5) {
			heroes.push(
				<div key={heroes.length} className='empty-panel'>
					<button onClick={this.createHero}>Recruit a Hero</button>
				</div>
			);
		}

		return (
			<div className='setup-screen'>
				<div className='setup-top-bar'>
					<div className='logo-text inset-text'>Skirmish</div>
				</div>
				<div className='setup-content'>
					<Text type={TextType.Information}><b>Recruit your team.</b> These heroes will begin the task of conquering the island.</Text>
					{heroes}
				</div>
				<div className='setup-footer'>
					<button disabled={this.props.game.heroes.length < 5} onClick={this.props.beginCampaign}>Begin the Campaign</button>
				</div>
				{this.getDialog()}
			</div>
		);
	};
}

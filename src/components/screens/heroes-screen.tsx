import { Button, Col, Divider, Drawer, Row, Typography } from 'antd';
import React from 'react';
import { Feature } from '../../models/feature';
import { Game } from '../../models/game';
import { Hero, HeroHelper } from '../../models/hero';
import { Skill } from '../../models/skill';
import { Trait } from '../../models/trait';
import { NameGenerator } from '../../utils/name-generator';
import { Align } from '../align';
import { CharacterSheet } from '../character-sheet';
import { HeroBuilderPanel } from '../hero-builder-panel';
import { HeroLevelUpPanel } from '../hero-level-up-panel';
import { Padding } from '../padding';
import { PlayingCard } from '../playing-card';

interface Props {
	game: Game;
	addHero: (hero: Hero) => void;
	levelUp: (hero: Hero, trait: Trait, skill: Skill, feature: Feature) => void;
	incrementXP: (hero: Hero) => void;
	back: () => void;
}

interface State {
	selectedHero: Hero | null;
}

export class HeroesScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedHero: null
		};
	}

	public render() {
		const heroes = this.props.game.heroes.map(hero => {
			let card = null;
			if (hero.name === HeroHelper.PlaceholderName) {
				card = (
					<Align>
						Hero
					</Align>
				);
			} else {
				card = (
					<Padding>
						<CharacterSheet hero={hero} display='mini' />
					</Padding>
				);
			}
			let btn = null;
			if (hero.xp >= hero.level) {
				btn = (
					<Divider>Level Up</Divider>
				);
			}
			return (
				<Col span={4} key={hero.id}>
					<Padding>
						<PlayingCard onClick={() => this.setState({ selectedHero: hero })}>
							{card}
						</PlayingCard>
						{btn}
						<Button block={true} onClick={() => this.props.incrementXP(hero)}>Add XP</Button>
					</Padding>
				</Col>
			);
		});

		let drawerTitle = '';
		let drawerContent = null;
		let drawerClosable = false;
		if (this.state.selectedHero) {
			if (this.state.selectedHero.name === HeroHelper.PlaceholderName) {
				drawerTitle = 'Create a New Hero';
				drawerContent = (
					<HeroBuilderPanel
						finished={hero => {
							this.setState({
								selectedHero: null
							}, () => {
								hero.name = NameGenerator.generateName();
								this.props.addHero(hero);
							});
						}}
					/>
				);
			} else if (this.state.selectedHero.xp >= this.state.selectedHero.level) {
				drawerTitle = 'Level Up';
				drawerContent = (
					<HeroLevelUpPanel
						hero={this.state.selectedHero}
						finished={(trait, skill, feature) => {
							const hero = this.state.selectedHero as Hero;
							this.setState({
								selectedHero: null
							}, () => {
								this.props.levelUp(hero, trait, skill, feature);
							});
						}}
					/>
				);
			} else {
				drawerTitle = 'Character Sheet';
				drawerContent = (
					<CharacterSheet hero={this.state.selectedHero as Hero}/>
				);
				drawerClosable = true;
			}
		}

		let info = null;
		let mapBtn = null;
		if (this.props.game.heroes.every(h => h.name !== HeroHelper.PlaceholderName)) {
			mapBtn = (
				<div>
					<Divider/>
					<Button block={true} onClick={() => this.props.back()}>Campaign Map</Button>
				</div>
			);
		} else {
			info = (
				<Typography.Paragraph>
					Click on a blank hero card to create a new level 1 hero.
				</Typography.Paragraph>
			);
		}

		return (
			<div>
				{info}
				<Row>
					{heroes}
				</Row>
				{mapBtn}
				<Drawer
					title={drawerTitle}
					width='50%'
					visible={drawerContent !== null}
					closable={drawerClosable}
					maskClosable={drawerClosable}
					onClose={() => this.setState({ selectedHero: null })}
				>
					{drawerContent}
				</Drawer>
			</div>
		);
	}
}

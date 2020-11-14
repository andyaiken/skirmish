import { Col, Divider, Progress, Radio, Row, Typography } from 'antd';
import React from 'react';
import { BackgroundHelper } from '../../models/background';
import { Hero, HeroHelper } from '../../models/hero';
import { RoleHelper } from '../../models/role';
import { Skill } from '../../models/skill';
import { SpeciesHelper } from '../../models/species';
import { Trait } from '../../models/trait';
import { Align } from '../utility/align';

interface Props {
	hero: Hero;
	display: 'full' | 'mini';
}

interface State {
	view: 'stats' | 'items' | 'features' | 'actions';
}

export class CharacterSheetPanel extends React.Component<Props, State> {
	public static defaultProps = {
		display: 'full'
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'stats'
		};
	}

	public render() {
		const species = SpeciesHelper.getSpecies(this.props.hero.speciesID)?.name || 'Unknown species';
		const role = RoleHelper.getRole(this.props.hero.roleID)?.name || 'Unknown role';
		const background = BackgroundHelper.getBackground(this.props.hero.backgroundID)?.name || 'Unknown background';

		const info = species + ' | ' + role + ' |  ' + background;
		const level = 'Level ' + this.props.hero.level;

		if (this.props.display === 'mini') {
			return (
				<div className='character-sheet character-sheet-mini' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					<Align style={{ flex: '1 1 auto' }}>
						<Typography.Paragraph>
							{this.props.hero.name || 'unnamed hero'}
						</Typography.Paragraph>
					</Align>
					<Align style={{ flex: '1 1 auto' }}>
						<Typography.Paragraph>
							{info}
						</Typography.Paragraph>
					</Align>
					<Align style={{ flex: '1 1 auto' }}>
						<Typography.Paragraph>
							{level}
						</Typography.Paragraph>
					</Align>
				</div>
			);
		}

		let content = null;
		switch (this.state.view) {
			case 'stats':
				const traits = (
					<div>
						<Typography.Paragraph>
							Endurance {HeroHelper.trait(this.props.hero, Trait.Endurance)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Resolve {HeroHelper.trait(this.props.hero, Trait.Resolve)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Speed {HeroHelper.trait(this.props.hero, Trait.Speed)}
						</Typography.Paragraph>
					</div>
				);

				const skills = (
					<div>
						<Typography.Paragraph>
							Athletics {HeroHelper.skill(this.props.hero, Skill.Athletics)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Brawl {HeroHelper.skill(this.props.hero, Skill.Brawl)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Perception {HeroHelper.skill(this.props.hero, Skill.Perception)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Reactions {HeroHelper.skill(this.props.hero, Skill.Reactions)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Spellcasting {HeroHelper.skill(this.props.hero, Skill.Spellcasting)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Stealth {HeroHelper.skill(this.props.hero, Skill.Stealth)}
						</Typography.Paragraph>
						<Typography.Paragraph>
							Weapon {HeroHelper.skill(this.props.hero, Skill.Weapon)}
						</Typography.Paragraph>
					</div>
				);

				const profs = (
					<div>
						<Typography.Paragraph>
							{HeroHelper.proficiencies(this.props.hero).join(', ') || 'None'}
						</Typography.Paragraph>
					</div>
				);

				content = (
					<div>
						<Row gutter={10}>
							<Col span={12}>
								<Divider>Traits</Divider>
								{traits}
								<Divider>Proficiencies</Divider>
								{profs}
							</Col>
							<Col span={12}>
								<Divider>Skills</Divider>
								{skills}
							</Col>
						</Row>
						<Divider>More</Divider>
						<div>DAMAGE BONUSES</div>
						<div>DAMAGE RESISTANCES</div>
						<Divider>XP</Divider>
						<Progress
							percent={100 * this.props.hero.xp / this.props.hero.level}
							showInfo={false}
						/>
						<Typography.Paragraph>
							{this.props.hero.xp} of {this.props.hero.level} XP required for level {this.props.hero.level + 1}
						</Typography.Paragraph>
					</div>
				);
				break;
			case 'items':
				// TODO
				content = (
					<div>
						<div>ITEM CARDS</div>
						<div>CAMPAIGN ITEM CARDS</div>
					</div>
				);
				break;
			case 'features':
				// TODO
				content = (
					<div>
						<div>FEATURE DECK</div>
					</div>
				);
				break;
			case 'actions':
				// TODO
				content = (
					<div>
						<div>ACTION DECK</div>
					</div>
				);
				break;
		}

		return (
			<div className='character-sheet character-sheet-full'>
				<Typography.Title>
					{this.props.hero.name || 'unnamed hero'}
				</Typography.Title>
				<Typography.Paragraph>
					{info} | Level {this.props.hero.level}
				</Typography.Paragraph>
				<Divider>
					<Radio.Group buttonStyle='solid' value={this.state.view} onChange={e => this.setState({ view: e.target.value })}>
						<Radio.Button value='stats'>Statistics</Radio.Button>
						<Radio.Button value='items'>Equipment</Radio.Button>
						<Radio.Button value='features'>Feature Deck</Radio.Button>
						<Radio.Button value='actions'>Action Deck</Radio.Button>
					</Radio.Group>
				</Divider>
				{content}
			</div>
		);
	}
}

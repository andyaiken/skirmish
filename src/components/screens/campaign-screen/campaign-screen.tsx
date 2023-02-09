import { Component } from 'react';
import { Selector } from '../../../controls';
import { BoonModel } from '../../../models/boon';
import { CampaignMapRegionModel } from '../../../models/campaign-map';
import { FeatureModel } from '../../../models/feature';
import { GameModel } from '../../../models/game';
import { HeroModel } from '../../../models/hero';
import { ItemModel } from '../../../models/item';
import { CampaignMapPage } from './campaign-map-page/campaign-map-page';

import './campaign-screen.scss';
import { HeroesPage } from './heroes-page/heroes-page';
import { OptionsPage } from './options-page/options-page';

interface Props {
	game: GameModel;
	addHero: (hero: HeroModel) => void;
	incrementXP: (hero: HeroModel) => void;
	equipItem: (item: ItemModel, hero: HeroModel) => void;
	unequipItem: (item: ItemModel, hero: HeroModel) => void;
	levelUp: (feature: FeatureModel, hero: HeroModel) => void;
	redeemBoon: (boon: BoonModel, hero: HeroModel | null) => void;
	startEncounter: (region: CampaignMapRegionModel, heroes: HeroModel[]) => void;
	endCampaign: () => void;
}

interface State {
	page: string;
}

export class CampaignScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		let page = 'map';
		if (props.game.heroes.some(h => h.name === '') || props.game.heroes.some(h => h.xp >= h.level)) {
			page = 'heroes';
		}
		this.state = {
			page: page
		};
	}

	setPage = (page: string) => {
		this.setState({
			page: page
		});
	}

	public render() {
		let content = null;
		switch (this.state.page) {
			case 'heroes':
				content = (
					<HeroesPage
						game={this.props.game}
						addHero={this.props.addHero}
						incrementXP={this.props.incrementXP}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						levelUp={this.props.levelUp}
						redeemBoon={this.props.redeemBoon}
					/>
				);
				break;
			case 'map':
				content = (
					<CampaignMapPage
						game={this.props.game}
						startEncounter={this.props.startEncounter}
					/>
				);
				break;
			case 'options':
				content = (
					<OptionsPage
						endCampaign={this.props.endCampaign}
					/>
				);
				break;
		}

		const options = [
			{ id: 'heroes', display: 'Your Team' },
			{ id: 'map', display: 'The Island' },
			{ id: 'options', display: 'Options' }
		];
		return (
			<div className='campaign-screen'>
				<Selector options={options} selectedID={this.state.page} onSelect={this.setPage} />
				{content}
			</div>
		);
	}
}

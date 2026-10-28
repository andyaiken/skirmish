import { IconCards, IconHelpCircle } from '@tabler/icons-react';
import { Component } from 'react';

import { CardType } from '../../../enums/card-type';
import { OrientationLogic } from '../../../logic/orientation/orientation-logic';
import { PackLogic } from '../../../logic/pack/pack-logic';

import type { GameModel } from '../../../models/game';
import type { LayoutModel } from '../../../models/layout';
import type { OptionsModel } from '../../../models/options';

import { Carousel, PlayingCard } from '../../controls';
import { LogoPanel } from '../../panels';
import { PlaceholderCard } from '../../cards';

import { EncounterIllustration, IslandIllustration, MagicItemIllustration, MoneyIllustration } from './landing-illustrations';

import './landing-screen.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	layout: LayoutModel;
	startCampaign: () => void;
	continueCampaign: () => void;
	showPacks: () => void;
	showHelp: (file: string) => void;
}

export class LandingScreen extends Component<Props> {
	// A phone gets one size whichever way up it is held, because it is the same screen either way.
	// The two below are chosen for a tablet, and sideways on a phone 140 takes a third of the 402pt
	// of height before the bar's padding is counted. 50 is close to what LogoPanel's width cap was
	// already reducing it to when the phone was upright, so upright is unchanged to the eye and only
	// sideways gets smaller.
	logoSize = () => {
		if (OrientationLogic.isSmall(this.props.layout.orientation)) {
			return 50;
		}

		return OrientationLogic.isLandscape(this.props.layout.orientation) ? 140 : 100;
	};

	render = () => {
		let mainBtn = null;
		if (this.props.game) {
			mainBtn = (
				<PlayingCard
					type={CardType.Role}
					stack={true}
					front={
						<PlaceholderCard
							text='Continue'
							subtext='Click here to continue your campaign.'
							content={<LogoPanel text={null} size={60} />}
						/>
					}
					onClick={this.props.continueCampaign}
				/>
			);
		} else {
			mainBtn = (
				<PlayingCard
					type={CardType.Role}
					stack={true}
					front={
						<PlaceholderCard
							text='Start'
							subtext='Click here to begin a new campaign.'
							content={<LogoPanel text={null} size={60} />}
						/>
					}
					onClick={this.props.startCampaign}
				/>
			);
		}

		let packsBtn = null;
		const availablePacks = PackLogic.getExpansionPacks().filter(p => !this.props.options.packIDs.includes(p.id)).length;
		if (availablePacks > 0) {
			packsBtn = (
				<button className='packs-btn' onClick={() => this.props.showPacks()}>
					{`${availablePacks} card pack${availablePacks === 1 ? '' : 's'} available`}
					<IconCards />
				</button>
			);
		}

		return (
			<div className={`landing-screen ${OrientationLogic.getClassName(this.props.layout.orientation)}`}>
				<div className='landing-top-bar'>
					<LogoPanel size={this.logoSize()} />
				</div>
				<div className='landing-content'>
					<Carousel
						slides={[
							<div key='intro' className='landing-slide'>
								<p>
									Skirmish is a tactical battle game in which you control a band of heroes, each represented by a stack of cards.
									Your objective is to gain control of an island.
								</p>
								<IslandIllustration options={this.props.options} />
							</div>,
							<div key='enemies' className='landing-slide'>
								<p>
									This island, however, is populated by monstrous enemies which you will have to defeat in a series of encounters.
								</p>
								<EncounterIllustration />
							</div>,
							<div key='regions' className='landing-slide'>
								<p>
									Some parts of the island might be easier to control than others, but each region will provide you with some reward for conquering it.
								</p>
								<MoneyIllustration />
							</div>,
							<div key='progress' className='landing-slide'>
								<p>
									As you gain control over more and more of the island your heroes will become more powerful,
									and you&apos;ll pick up allies and magic items which will help you in your encounters.
								</p>
								<MagicItemIllustration />
							</div>,
							<div key='good-luck' className='landing-slide'>
								<p>
									Good luck!
								</p>
							</div>
						]}
					/>
					<div className='action-buttons'>
						{mainBtn}
						<div>
							{packsBtn}
							<button className='help-btn' title='Help' onClick={() => this.props.showHelp('landing')}>
								<IconHelpCircle />
								Help
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

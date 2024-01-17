import { Component } from 'react';
import { IconCards } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { OrientationType } from '../../../enums/orientation-type';

import { PackLogic } from '../../../logic/pack-logic';

import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';

import { Format } from '../../../utils/format';

import { PlayingCard, Tag, Text } from '../../controls';
import { LogoPanel } from '../../panels';
import { PlaceholderCard } from '../../cards';

import './landing-screen.scss';

import pkg from '../../../../package.json';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	orientation: OrientationType;
	startCampaign: () => void;
	continueCampaign: () => void;
	showPacks: () => void;
}

export class LandingScreen extends Component<Props> {
	render = () => {
		try {
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
								content={<LogoPanel size={60} showText={false} />}
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
								content={<LogoPanel size={60} showText={false} />}
							/>
						}
						onClick={this.props.startCampaign}
					/>
				);
			}

			let packsBtn = null;
			const availablePacks = PackLogic.getPacks().filter(p => !this.props.options.packIDs.includes(p.id)).length;
			if (availablePacks > 0) {
				packsBtn = (
					<button className='packs-btn' onClick={() => this.props.showPacks()}>
						{`${availablePacks} card pack${availablePacks === 1 ? '' : 's'} available`}
						<IconCards />
					</button>
				);
			}

			return (
				<div className={`landing-screen ${this.props.orientation}`}>
					<div className='landing-top-bar'>
						<LogoPanel size={this.props.orientation === OrientationType.Landscape ? 140 : 100} />
					</div>
					<div className='landing-content'>
						<Text>
							<p>
								Skirmish is a tactical battle game in which you control a band of heroes, each represented by a stack of cards.
								Your objective is to gain control of an island.
							</p>
							<p>
								This island, however, is populated by monstrous enemies which you will have to defeat in a series of encounters.
							</p>
							<p>
								Some parts of the island might be easier to control than others, but each region will provide you with some reward for conquering it.
							</p>
							<p>
								As you gain control over more and more of the island your heroes will become more powerful,
								and you&apos;ll pick up allies and magic items which will help you in your encounters.
							</p>
							<p>
								Good luck!
							</p>
						</Text>
						<div className='action-buttons'>
							{mainBtn}
							{packsBtn}
						</div>
					</div>
					<div className='landing-footer'>
						<Tag>Version {pkg.version}</Tag>
						<Tag>© Andy Aiken 2023</Tag>
						{this.props.options.developer ? <Tag>{Format.capitalize(this.props.options.renderer)}</Tag> : null}
					</div>
				</div>
			);
		} catch {
			return <div className='landing-screen render-error' />;
		}
	};
}

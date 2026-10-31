import { Capacitor } from '@capacitor/core';
import { Component } from 'react';

import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';

import { Sound } from '../../../../utils/sound/sound';

import type { GameCenter } from '../../../../platform/game-center';
import { Platform } from '../../../../platform/platform';

import { ConfirmButton, Selector, StatValue, Switch, Text, TextType } from '../../../controls';

import './options-tab.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
	setShowTips: (value: boolean) => void;
	setReduceMotion: (value: boolean) => void;
	setSoundEffectsVolume: (value: number) => void;
	setHaptics: (value: boolean) => void;
	setGameCenterAccessPoint: (value: boolean) => void;
	requestReview: () => Promise<void>;
	gameCenter: GameCenter;
	setRenderer: (value: string) => void;
	restorePurchases: () => Promise<void>;
}

interface State {
	systemReducesMotion: boolean;
	restoring: boolean;
}

export class OptionsTab extends Component<Props, State> {
	// The device's own Reduce Motion setting already switches the decoration off, through
	// the prefers-reduced-motion rules in index.scss. While it is on, this toggle cannot
	// change anything - it can only add reduction, never take it away - so it is hidden
	// rather than left sitting there looking as though it does something.
	motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	constructor(props: Props) {
		super(props);
		this.state = {
			systemReducesMotion: this.motionQuery.matches,
			restoring: false
		};
	}

	componentDidMount = () => {
		this.motionQuery.addEventListener('change', this.motionPreferenceChanged);
	};

	componentWillUnmount = () => {
		this.motionQuery.removeEventListener('change', this.motionPreferenceChanged);
	};

	motionPreferenceChanged = (e: MediaQueryListEvent) => {
		this.setState({
			systemReducesMotion: e.matches
		});
	};

	setSoundEffectsVolume = (value: number) => {
		this.props.setSoundEffectsVolume(value);
		Sound.play(Sound.dong);
	};

	restorePurchases = () => {
		this.setState({ restoring: true });
		this.props.restorePurchases().finally(() => this.setState({ restoring: false }));
	};

	render = () => {
		return (
			<div className='options-tab'>
				<Text type={TextType.SubHeading}>Sound</Text>
				<StatValue label='Sound effects volume' value={`${this.props.options.soundEffectsVolume * 100}%`} />
				<input
					type='range'
					min={0}
					max={1}
					step={0.05}
					value={this.props.options.soundEffectsVolume}
					onChange={e => this.setSoundEffectsVolume(parseFloat(e.target.value))}
				/>
				<hr />
				{Capacitor.isNativePlatform() ? <Switch label='Haptic Feedback' checked={this.props.options.haptics} onChange={this.props.setHaptics} /> : null}
				{
					Platform.canUseDeveloperMode() ?
						<Switch label='Developer Mode' checked={this.props.options.developer} onChange={this.props.setDeveloperMode} />
						: null
				}
				<Switch label='Show Tips' checked={this.props.options.showTips} onChange={this.props.setShowTips} />
				{this.state.systemReducesMotion ? null : <Switch label='Reduce Motion' checked={this.props.options.reduceMotion} onChange={this.props.setReduceMotion} />}
				{
					this.props.options.developer ?
						<>
							<hr />
							<Text type={TextType.SubHeading}>Platform</Text>
							<Selector
								options={[
									{ id: 'chrome', display: 'Chrome' },
									{ id: 'edge', display: 'Edge' },
									{ id: 'firefox', display: 'Firefox' },
									{ id: 'safari', display: 'Safari' }
								]}
								selectedID={this.props.options.renderer}
								onSelect={this.props.setRenderer}
							/>
						</>
						: null
				}
				{
					this.props.gameCenter.isAvailable() ?
						<>
							<hr />
							<Text type={TextType.SubHeading}>Game Center</Text>
							{
								this.props.gameCenter.authenticated ?
									<>
										<Switch label='Show Game Center button' checked={this.props.options.gameCenter.accessPoint} onChange={this.props.setGameCenterAccessPoint} />
										<button className='restore-btn' onClick={() => this.props.gameCenter.showDashboard()}>Achievements and Leaderboards</button>
									</>
									: <Text>Sign in to Game Center in the Settings app to see achievements and leaderboards.</Text>
							}
						</>
						: null
				}
				{
					Capacitor.isNativePlatform() ?
						<>
							<hr />
							<Text type={TextType.SubHeading}>Review</Text>
							<Text>
								Enjoying Skirmish? A rating on the App Store helps others find it.
							</Text>
							<button className='restore-btn' onClick={() => this.props.requestReview().catch(() => null)}>Rate Skirmish</button>
						</>
						: null
				}
				<hr />
				<Text type={TextType.SubHeading}>Store</Text>
				<Text>
					Already bought some packs? Restore them here after reinstalling or on a new device.
				</Text>
				<button className='restore-btn' disabled={this.state.restoring} onClick={this.restorePurchases}>
					{this.state.restoring ? 'Restoring…' : 'Restore Purchases'}
				</button>
				{
					this.props.game ?
						<>
							<hr />
							<Text type={TextType.SubHeading}>Campaign</Text>
							<Text>
								Want to start over?
							</Text>
							<ConfirmButton label='Abandon this campaign' onClick={() => this.props.endCampaign()} />
						</>
						: null
				}
			</div>
		);
	};
}

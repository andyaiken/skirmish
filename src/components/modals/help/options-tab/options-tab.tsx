import { Component } from 'react';

import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';

import { Sound } from '../../../../utils/sound/sound';

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
	setRenderer: (value: string) => void;
}

interface State {
	systemReducesMotion: boolean;
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
			systemReducesMotion: this.motionQuery.matches
		};
	}

	// The setting can be changed while the game is running, and on iPad it is two taps away
	// in Control Centre, so this listens rather than reading once.
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

	render = () => {
		const local = window.location.href.includes('localhost');

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
				{local ? <Switch label='Developer Mode' checked={this.props.options.developer} onChange={this.props.setDeveloperMode} /> : null}
				<Switch label='Show Tips' checked={this.props.options.showTips} onChange={this.props.setShowTips} />
				{this.state.systemReducesMotion ? null : <Switch label='Reduce Motion' checked={this.props.options.reduceMotion} onChange={this.props.setReduceMotion} />}
				{
					local ?
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
				<hr />
				{this.props.game ? <ConfirmButton label='Abandon this campaign' onClick={() => this.props.endCampaign()} /> : null}
			</div>
		);
	};
}

import { Component } from 'react';

import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';

import { Sound } from '../../../../utils/sound';

import { ConfirmButton, StatValue, Switch, Text, TextType } from '../../../controls';

import './options-tab.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
	setShowTips: (value: boolean) => void;
	setSoundEffectsVolume: (value: number) => void;
}

export class OptionsTab extends Component<Props> {
	setSoundEffectsVolume = (value: number) => {
		this.props.setSoundEffectsVolume(value);
		Sound.play(Sound.dong);
	};

	render = () => {
		try {
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
					<hr />
					{this.props.game ? <ConfirmButton label='Abandon this campaign' onClick={() => this.props.endCampaign()} /> : null}
				</div>
			);
		} catch {
			return <div className='options-tab render-error' />;
		}
	};
}

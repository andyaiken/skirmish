import { Component } from 'react';

import { GameLogic } from '../../../../logic/game-logic';

import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';

import { Format } from '../../../../utils/format';
import { Sound } from '../../../../utils/sound';

import { ConfirmButton, StatValue, Switch, Text, TextType } from '../../../controls';

import './options-tab.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	version: string;
	local: boolean;
	removePack: (packID: string) => void;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
	setSoundEffectsVolume: (value: number) => void;
}

export class OptionsTab extends Component<Props> {
	setSoundEffectsVolume = (value: number) => {
		this.props.setSoundEffectsVolume(value);
		Sound.play(Sound.dong);
	};

	render = () => {
		try {
			const packs = this.props.options.packIDs.map((packID, n) => {
				const pack = GameLogic.getPack(packID);
				return (
					<ConfirmButton key={n} label={pack ? pack.name : packID} onClick={() => this.props.removePack(packID)} />
				);
			});

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
					{this.props.local ? <Switch label='Developer Mode' checked={this.props.options.developer} onChange={this.props.setDeveloperMode} /> : null}
					{this.props.local ? <hr /> : null}
					{this.props.options.developer ? <Text type={TextType.SubHeading}>Packs</Text> : null}
					{this.props.options.developer && (packs.length > 0) ? packs : null}
					{this.props.options.developer && (packs.length === 0) ? <Text type={TextType.Small}>None.</Text> : null}
					{this.props.options.developer ? <hr /> : null}
					{this.props.game ? <ConfirmButton label='Abandon this Campaign' onClick={() => this.props.endCampaign()} /> : null}
					{this.props.game ? <hr /> : null}
					{this.props.game ? <StatValue label='Data size' value={Format.toSize(JSON.stringify(this.props.game).length)} /> : null}
					<StatValue label='Version' value={this.props.version} />
				</div>
			);
		} catch {
			return <div className='options-tab render-error' />;
		}
	};
}

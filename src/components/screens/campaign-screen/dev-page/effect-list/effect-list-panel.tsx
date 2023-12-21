import { Component } from 'react';

import { PackData } from '../../../../../data/pack-data';

import { ActionEffects } from '../../../../../logic/action-logic';

import { GameLogic } from '../../../../../logic/game-logic';

import type { ActionEffectModel } from '../../../../../models/action';
import type { OptionsModel } from '../../../../../models/options';

import type { Platform } from '../../../../../platform/platform';

import { StatValue, Text, TextType } from '../../../../controls';

import './effect-list-panel.scss';

interface Props {
	options: OptionsModel
	platform: Platform;
}

export class EffectListPanel extends Component<Props> {
	addToList = (effects: ActionEffectModel[], list: { id: string, effects: { desc: string, count: number }[] }[]) => {
		effects.forEach(e => {
			let existingEffect = list.find(item => item.id === e.id);
			if (!existingEffect) {
				existingEffect = { id: e.id, effects: [] };
				list.push(existingEffect);
			}
			const desc = ActionEffects.getDescription(e, null, null);
			let existingDesc = existingEffect.effects.find(item => item.desc === desc);
			if (!existingDesc) {
				existingDesc = { desc: desc, count: 0 };
				existingEffect.effects.push(existingDesc);
			}
			existingDesc.count += 1;
			this.addToList(e.children, list);
		});
	};

	render = () => {
		try {
			const list: { id: string, effects: { desc: string, count: number }[] }[] = [];

			const actions = GameLogic.getAllActions(PackData.getList().map(p => p.id));
			actions.forEach(a => this.addToList(a.effects, list));
			list.forEach(item => item.effects.sort((a, b) => a.desc.localeCompare(b.desc)));

			return (
				<div className='effect-list-panel'>
					{list.map(item => {
						return (
							<div key={item.id} className='effect-type'>
								<Text type={TextType.MinorHeading}>{item.id}</Text>
								<div className='effect-data'>
									{item.effects.map((effect, n) => <StatValue key={n} label={effect.desc} value={effect.count} />)}
								</div>
							</div>
						);
					})}
				</div>
			);
		} catch {
			return <div className='effect-list-panel render-error' />;
		}
	};
}

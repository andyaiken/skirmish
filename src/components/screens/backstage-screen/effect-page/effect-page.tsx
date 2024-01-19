import { Component } from 'react';

import { PackData } from '../../../../data/pack-data';

import { ActionEffects } from '../../../../logic/action-logic';
import { GameLogic } from '../../../../logic/game-logic';

import type { ActionEffectModel } from '../../../../models/action';
import type { OptionsModel } from '../../../../models/options';

import { Collections } from '../../../../utils/collections';

import { StatValue } from '../../../controls';

import './effect-page.scss';

interface Props {
	options: OptionsModel
}

interface State {
	selectedEffectID: string;
}

export class EffectPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const actions = GameLogic.getAllActions(PackData.getList().map(p => p.id));
		actions.forEach(a => this.addToList(a.effects));
		this.list.forEach(item => item.effects.sort((a, b) => a.desc.localeCompare(b.desc)));
		this.list.sort((a, b) => Collections.sum(b.effects, e => e.count) - Collections.sum(a.effects, e => e.count));

		this.state = {
			selectedEffectID: this.list[0].effectID
		};
	}

	list: { effectID: string, effects: { desc: string, count: number }[] }[] = [];

	addToList = (effects: ActionEffectModel[]) => {
		effects.forEach(e => {
			let existingEffect = this.list.find(item => item.effectID === e.id);
			if (!existingEffect) {
				existingEffect = { effectID: e.id, effects: [] };
				this.list.push(existingEffect);
			}
			const desc = ActionEffects.getDescription(e, null, null);
			let existingDesc = existingEffect.effects.find(item => item.desc === desc);
			if (!existingDesc) {
				existingDesc = { desc: desc, count: 0 };
				existingEffect.effects.push(existingDesc);
			}
			existingDesc.count += 1;
			this.addToList(e.children);
		});
	};

	render = () => {
		try {
			const selected = this.list.find(item => item.effectID === this.state.selectedEffectID);

			return (
				<div className='effect-page'>
					<div className='effect-type-column'>
						{this.list.map(item => {
							return (
								<button
									key={item.effectID}
									className={selected?.effectID === item.effectID ? 'selected' : ''}
									onClick={() => this.setState({ selectedEffectID: item.effectID })}
								>
									<StatValue label={item.effectID} value={Collections.sum(item.effects, e => e.count)} />
								</button>
							);
						})}
					</div>
					<div className='effect-list-column'>
						{selected?.effects.map((effect, n) => <StatValue key={n} label={effect.desc} value={effect.count} />)}
					</div>
				</div>
			);
		} catch {
			return <div className='effect-page render-error' />;
		}
	};
}

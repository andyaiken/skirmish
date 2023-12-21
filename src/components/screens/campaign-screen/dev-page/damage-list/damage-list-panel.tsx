import { Component } from 'react';

import { PackData } from '../../../../../data/pack-data';

import { DamageCategoryType } from '../../../../../enums/damage-category-type';
import { DamageType } from '../../../../../enums/damage-type';

import { GameLogic } from '../../../../../logic/game-logic';

import type { ActionEffectModel } from '../../../../../models/action';
import type { OptionsModel } from '../../../../../models/options';

import type { Platform } from '../../../../../platform/platform';

import { Text, TextType } from '../../../../controls';

import './damage-list-panel.scss';

interface Props {
	options: OptionsModel
	platform: Platform;
}

export class DamageListPanel extends Component<Props> {
	checkDamage: (damage: DamageType, effects: ActionEffectModel[]) => boolean = (damage: DamageType, effects: ActionEffectModel[]) => {
		const found = effects.filter(e => e.id === 'damage').some(e => {
			const data = e.data as { type: DamageType, rank: number };
			return damage === data.type;
		});
		if (found) {
			return true;
		}

		return effects.some(e => this.checkDamage(damage, e.children));
	};

	render = () => {
		try {
			const categories = [
				{
					category: DamageCategoryType.Physical,
					types: [
						DamageType.Edged,
						DamageType.Impact,
						DamageType.Piercing
					]
				},
				{
					category: DamageCategoryType.Energy,
					types: [
						DamageType.Cold,
						DamageType.Electricity,
						DamageType.Fire,
						DamageType.Light,
						DamageType.Sonic
					]
				},
				{
					category: DamageCategoryType.Corruption,
					types: [
						DamageType.Acid,
						DamageType.Decay,
						DamageType.Poison,
						DamageType.Psychic
					]
				}
			];
			const actions = GameLogic.getAllActions(PackData.getList().map(p => p.id));

			return (
				<div className='damage-list-panel'>
					{categories.map(c => {
						return (
							<div key={c.category} className='damage-category'>
								<Text type={TextType.SubHeading}>{c.category}</Text>
								<div>
									{c.types.map(type => {
										return (
											<div key={type} className='damage-type'>
												<Text type={TextType.MinorHeading}>
													{type}
												</Text>
												<div className='damage-actions'>
													{
														actions
															.filter(a => this.checkDamage(type, a.effects))
															.sort((a, b) => a.name.localeCompare(b.name))
															.map(a => <Text key={a.id} type={TextType.Small}>{a.name}</Text>)
													}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			);
		} catch {
			return <div className='damage-list-panel render-error' />;
		}
	};
}

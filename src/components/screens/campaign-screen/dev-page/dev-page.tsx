import { Component } from 'react';

import { PackData } from '../../../../data/pack-data';

import { DamageCategoryType } from '../../../../enums/damage-category-type';
import { DamageType } from '../../../../enums/damage-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { ActionEffectModel } from '../../../../models/action';
import type { OptionsModel } from '../../../../models/options';

import { Platform } from '../../../../platform/platform';

import { Selector, Text, TextType } from '../../../controls';
import { CardGridPanel } from '../../../panels';

import './dev-page.scss';

interface Props {
	options: OptionsModel;
	platform: Platform;
}

interface State {
	view: string;
}

export class DevPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'cards'
		};
	}

	getDamage = () => {
		const checkEffects: (damage: DamageType, effects: ActionEffectModel[]) => boolean = (damage: DamageType, effects: ActionEffectModel[]) => {
			const found = effects.filter(e => e.id === 'damage').some(e => {
				const data = e.data as { type: DamageType, rank: number };
				return damage === data.type;
			});
			if (found) {
				return true;
			}

			return effects.some(e => checkEffects(damage, e.children));
		};

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
			<div className='damage-container'>
				{categories.map(c => {
					return (
						<div key={c.category} className='damage-category'>
							<Text type={TextType.SubHeading}>{c.category}</Text>
							<div>
								{c.types.map(type => {
									return (
										<div key={type} className='damage-type'>
											<Text type={TextType.MinorHeading}>{type}</Text>
											<div className='damage-actions'>
												{
													actions
														.filter(a => checkEffects(type, a.effects))
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
	};

	getEffects = () => {
		//
	};

	render = () => {
		try {
			const options = [
				{ id: 'cards', display: 'Cards' },
				{ id: 'damage', display: 'Damage' },
				{ id: 'effects', display: 'Effects' }
			];

			let content = null;
			switch (this.state.view) {
				case 'cards':
					content = <CardGridPanel options={this.props.options} platform={this.props.platform} />;
					break;
				case 'damage':
					content = this.getDamage();
					break;
				case 'effects':
					content = null;
					break;
			}

			return (
				<div className='dev-page'>
					<Selector options={options} selectedID={this.state.view} onSelect={id => this.setState({ view: id })} />
					<div className='dev-page-content'>
						{content}
					</div>
				</div>
			);
		} catch {
			return <div className='dev-page render-error' />;
		}
	};
}
